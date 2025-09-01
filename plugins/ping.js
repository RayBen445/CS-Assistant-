// Ping command plugin for CS-Assistant
module.exports = {
  command: 'ping',
  description: 'Check bot response time and status',
  usage: '.ping',
  category: 'General',
  
  async execute(socket, message, args) {
    const start = Date.now();
    
    const pingMessage = await socket.sendMessage(message.key.remoteJid, {
      text: '🏓 *Pinging...*'
    }, { quoted: message });
    
    const latency = Date.now() - start;
    
    const responseText = `🏓 *Pong!*\n\n` +
                        `📊 *Response Time:* ${latency}ms\n` +
                        `🤖 *Bot Status:* Online ✅\n` +
                        `📱 *WhatsApp:* Connected\n` +
                        `⚡ *Uptime:* ${this.formatUptime(process.uptime())}\n` +
                        `📅 *Date:* ${new Date().toLocaleDateString()}\n` +
                        `⏰ *Time:* ${new Date().toLocaleTimeString()}`;
    
    // Edit the ping message with results
    await socket.sendMessage(message.key.remoteJid, {
      text: responseText,
      edit: pingMessage.key
    });
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