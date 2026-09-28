const fs = require('fs');
const path = require('path');
const SETTINGS_PATH = path.join(__dirname, 'setting.json');

let settings = {};
try {
  if (fs.existsSync(SETTINGS_PATH)) {
    settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf8') || '{}');
  } else {
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify({}, null, 2));
    settings = {};
  }
} catch (e) {
  console.error('Failed to load settings.json', e);
  settings = {};
}

let saveTimeout = null;
let saving = false;
let pending = false;

function saveSettings() {
  if (saveTimeout) { pending = true; return; }
  saveTimeout = setTimeout(flush, 1500);
}

function flush() {
  saveTimeout = null;
  if (saving) { pending = true; return; }
  saving = true;
  fs.writeFile(SETTINGS_PATH, JSON.stringify(settings), (err) => {
    saving = false;
    if (err) console.error('Failed to save settings.json', err);
    if (pending) { pending = false; saveTimeout = setTimeout(flush, 1500); }
  });
}

/**
 * Get a setting for a user, group, or bot.
 * @param {string} jid - User JID, group JID, or 'bot' for global bot settings
 * @param {string} key - Setting key
 * @param {*} defaultValue - Default value if key doesn't exist
 */
function getSetting(jid, key, defaultValue = false) {
  if (!settings[jid]) return defaultValue;
  return settings[jid][key] !== undefined ? settings[jid][key] : defaultValue;
}

/**
 * Set a setting for a user, group, or bot.
 * @param {string} jid - User JID, group JID, or 'bot' for global bot settings
 * @param {string} key - Setting key
 * @param {*} value - Value to save
 */
function setSetting(jid, key, value) {
  if (!settings[jid]) settings[jid] = {};
  if (value === false || value === null || value === undefined) {
    delete settings[jid][key];
    if (Object.keys(settings[jid]).length === 0) delete settings[jid];
  } else {
    settings[jid][key] = value;
  }
  saveSettings();
}

function hasAnySetting(jid) {
  return !!settings[jid] && Object.keys(settings[jid]).length > 0;
}

module.exports = { getSetting, setSetting, hasAnySetting };

