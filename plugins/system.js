// System information plugin for CS-Assistant
const { config } = require('../config');
const os = require('os');
const fs = require('fs');

module.exports = {
  command: 'system',
  description: 'Display system information and bot statistics',
  usage: '.system',
  category: 'Owner',
  owner: true,
  
  async execute(socket, message, args) {
    const uptime = process.uptime();
    const memUsage = process.memoryUsage();
    
    const systemInfo = `🖥️ *System Information*\n\n` +
                      `🤖 *Bot Version:* ${config.VERSION}\n` +
                      `📱 *Node.js:* ${process.version}\n` +
                      `💻 *Platform:* ${os.platform()} ${os.arch()}\n` +
                      `🆔 *OS:* ${os.type()} ${os.release()}\n` +
                      `⏱️ *Uptime:* ${this.formatUptime(uptime)}\n` +
                      `📊 *CPU Usage:* ${os.loadavg()[0].toFixed(2)}%\n` +
                      `💾 *RAM Usage:* ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB\n` +
                      `💿 *Total RAM:* ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB\n` +
                      `🔧 *Free RAM:* ${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB\n` +
                      `📂 *CPU Cores:* ${os.cpus().length}\n` +
                      `🌐 *Network:* ${Object.keys(os.networkInterfaces()).join(', ')}\n` +
                      `📅 *Date:* ${new Date().toLocaleDateString()}\n` +
                      `⏰ *Time:* ${new Date().toLocaleTimeString()}`;

    await socket.sendMessage(message.key.remoteJid, {
      text: systemInfo,
      contextInfo: {
        externalAdReply: {
          title: 'CS-Assistant System Info',
          body: 'Bot system statistics',
          thumbnailUrl: config.IMAGE_LOGO,
          sourceUrl: 'https://github.com/RayBen445/CS-Assistant-'
        }
      }
    }, { quoted: message });
  },
  
  formatUptime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m ${secs}s`;
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  }
};