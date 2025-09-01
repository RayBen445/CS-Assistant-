// Owner command plugin for CS-Assistant
const { config } = require('../config');

module.exports = {
  command: 'owner',
  description: 'Display owner information and contact details',
  usage: '.owner',
  category: 'General',
  
  async execute(socket, message, args) {
    const ownerText = `👑 *CS-Assistant Owner*\n\n` +
                     `📱 *Contact:* wa.me/${config.OWNER_NUMBER}\n` +
                     `🤖 *Bot Name:* ${config.BOT_NAME}\n` +
                     `⚡ *Version:* ${config.VERSION}\n` +
                     `🌐 *GitHub:* https://github.com/RayBen445/CS-Assistant-\n\n` +
                     `📞 *Need Help?*\n` +
                     `Click the button below to contact the owner directly.\n\n` +
                     `🚀 *CS-Assistant* - Advanced WhatsApp Bot\n` +
                     `Integrated features from multiple bot systems`;

    await socket.sendMessage(message.key.remoteJid, {
      text: ownerText,
      contextInfo: {
        externalAdReply: {
          title: 'CS-Assistant Owner',
          body: 'Contact for support and queries',
          thumbnailUrl: config.IMAGE_LOGO,
          sourceUrl: `https://wa.me/${config.OWNER_NUMBER}`,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: message });

    // Send owner contact card
    const vcard = `BEGIN:VCARD\n` +
                  `VERSION:3.0\n` +
                  `FN:${config.OWNER_NAME}\n` +
                  `ORG:CS-Assistant Team\n` +
                  `TEL;type=CELL;type=VOICE;waid=${config.OWNER_NUMBER}:+${config.OWNER_NUMBER}\n` +
                  `END:VCARD`;

    await socket.sendMessage(message.key.remoteJid, {
      contacts: {
        displayName: config.OWNER_NAME,
        contacts: [{ vcard }]
      }
    }, { quoted: message });
  }
};