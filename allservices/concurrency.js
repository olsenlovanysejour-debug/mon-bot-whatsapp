// Simple semaphore-based concurrency limiter.
// Used to cap how many ffmpeg (or other CPU/RAM heavy) jobs can run at once,
// instead of letting every user request spawn its own process in parallel.

function createLimiter(maxConcurrent) {
    let active = 0;
    const queue = [];

    function next() {
        if (active >= maxConcurrent || queue.length === 0) return;
        active++;
        const { fn, resolve, reject } = queue.shift();
        Promise.resolve()
            .then(fn)
            .then((val) => {
                active--;
                resolve(val);
                next();
            })
            .catch((err) => {
                active--;
                reject(err);
                next();
            });
    }

    function run(fn) {
        return new Promise((resolve, reject) => {
            queue.push({ fn, resolve, reject });
            next();
        });
    }

    return { run, get active() { return active; }, get pending() { return queue.length; } };
}

// One shared limiter for every ffmpeg-based conversion (stickers, audio effects, etc).
// Tune this number to your CPU count: 2 is a safe default for a 4 vCPU container
// once you also account for Node itself + up to hundreds of WA sockets idling.
const ffmpegLimiter = createLimiter(Number(process.env.FFMPEG_CONCURRENCY || 2));

const { exec } = require('child_process');

// Drop-in replacement for child_process.exec(cmd, callback) that queues the
// actual process spawn behind ffmpegLimiter, so N users triggering effects/stickers
// at once don't spawn N ffmpeg processes simultaneously.
function execLimited(cmd, callback) {
    ffmpegLimiter.run(() => new Promise((resolve) => {
        exec(cmd, (err, stdout, stderr) => {
            try {
                if (callback) {
                    const maybePromise = callback(err, stdout, stderr);
                    if (maybePromise && typeof maybePromise.then === 'function') {
                        maybePromise.finally(resolve);
                        return;
                    }
                }
            } catch (e) {
                // swallow - matches original exec() fire-and-forget behavior
            }
            resolve();
        });
    }));
}

module.exports = { createLimiter, ffmpegLimiter, execLimited };
