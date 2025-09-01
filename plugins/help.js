// Help command plugin for CS-Assistant
const { config } = require('../config');

module.exports = {
  command: 'help',
  description: 'Display all available commands and their usage',
  usage: '.help [command]',
  category: 'General',
  
  async execute(socket, message, args) {
    const pluginHandler = require('../lib/plugins');
    
    // If specific command requested
    if (args.length > 0) {
      const commandName = args[0].toLowerCase();
      const plugin = pluginHandler.getPlugin(commandName);
      
      if (!plugin) {
        await socket.sendMessage(message.key.remoteJid, {
          text: `❌ Command "${commandName}" not found!\n\nUse *${config.PREFIX}help* to see all available commands.`
        }, { quoted: message });
        return;
      }
      
      const commandHelp = `📖 *Command Help*\n\n` +
                         `🔸 *Command:* ${plugin.command}\n` +
                         `🔸 *Description:* ${plugin.description}\n` +
                         `🔸 *Usage:* ${plugin.usage}\n` +
                         `🔸 *Category:* ${plugin.category}\n` +
                         `🔸 *Owner Only:* ${plugin.owner ? 'Yes' : 'No'}\n` +
                         `🔸 *Group Only:* ${plugin.group ? 'Yes' : 'No'}\n` +
                         `🔸 *Admin Only:* ${plugin.admin ? 'Yes' : 'No'}`;
      
      await socket.sendMessage(message.key.remoteJid, {
        text: commandHelp
      }, { quoted: message });
      
      return;
    }
    
    // Display all commands
    const plugins = pluginHandler.getPlugins();
    const categories = {};
    
    // Group commands by category
    plugins.forEach(plugin => {
      const category = plugin.category || 'Miscellaneous';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(plugin);
    });
    
    let helpText = `🤖 *CS-Assistant Help Menu*\n\n` +
                   `📝 *Total Commands:* ${plugins.length}\n` +
                   `🔧 *Prefix:* ${config.PREFIX}\n` +
                   `📚 *Usage:* ${config.PREFIX}help [command] for detailed info\n\n`;
    
    // Display commands by category
    Object.keys(categories).forEach(category => {
      helpText += `📂 *${category}*\n`;
      categories[category].forEach(plugin => {
        const restrictions = [];
        if (plugin.owner) restrictions.push('👑');
        if (plugin.admin) restrictions.push('👮');
        if (plugin.group) restrictions.push('👥');
        
        helpText += `  • ${config.PREFIX}${plugin.command} ${restrictions.join('')}\n`;
      });
      helpText += '\n';
    });
    
    helpText += `🔰 *Legend:*\n` +
                `👑 Owner Only\n` +
                `👮 Admin Only\n` +
                `👥 Group Only\n\n` +
                `💡 *Tip:* Use ${config.PREFIX}help [command] for detailed usage\n\n` +
                `🌟 *CS-Assistant v${config.VERSION}*\n` +
                `Advanced Multi-Device WhatsApp Bot`;
    
    await socket.sendMessage(message.key.remoteJid, {
      text: helpText,
      contextInfo: {
        externalAdReply: {
          title: 'CS-Assistant Help Menu',
          body: `${plugins.length} commands available`,
          thumbnailUrl: config.IMAGE_LOGO,
          sourceUrl: 'https://github.com/RayBen445/CS-Assistant-'
        }
      }
    }, { quoted: message });
  }
};