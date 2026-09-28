const fs = require('fs')

global.owner = ['62']
global.status = false
global.gambar = "https://files.catbox.moe/j1kqod.jpg"
global.location = "Haïti, Port-de-Paix"
global.footer = "𝚂𝚀𝚄𝙸𝙲𝙷𝚈 𝙼𝙳"
global.link = "https://whatsapp.com/channel/0029Vb6UbVy4dTnT2N7T6E2z"
global.autobio = true
global.botName = "𝚂𝚀𝚄𝙸𝙲𝙷𝚈 𝙼𝙳"
global.version = "1.0.0"
global.themeemoji = "🥷"
global.thumbnail = 'https://files.catbox.moe/j1kqod.jpg'
global.packname = "𝚂𝚀𝚄𝙸𝙲𝙷𝚈 𝙼𝙳"
global.author = "𝙳𝚂 𝙿𝚁𝙸𝙼𝙸𝚂"
global.creator = "50956880231@s.whatsapp.net"
global.database = `*To Exist In The Database Contact The Owner of this bot*`


global.autoviewstatus = false

let file = require.resolve(__filename)
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file)
  console.log('\x1b[0;32m'+__filename+' \x1b[1;32mupdated!\x1b[0m')
  delete require.cache[file]
  require(file)
})
  
