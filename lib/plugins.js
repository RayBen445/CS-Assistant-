// Plugin loader and handler for CS-Assistant
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { config } = require('../config');

class PluginHandler {
  constructor() {
    this.plugins = new Map();
    this.commands = new Map();
  }

  async loadPlugins() {
    console.log(chalk.cyan('🔌 Loading plugins...'));
    
    const pluginsDir = path.join(__dirname, '../plugins');
    
    if (!fs.existsSync(pluginsDir)) {
      fs.mkdirSync(pluginsDir, { recursive: true });
    }

    const pluginFiles = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js'));
    
    for (const file of pluginFiles) {
      try {
        const pluginPath = path.join(pluginsDir, file);
        delete require.cache[require.resolve(pluginPath)];
        const plugin = require(pluginPath);
        
        if (plugin && plugin.command) {
          this.plugins.set(plugin.command, plugin);
          console.log(chalk.green(`  ✓ Loaded: ${plugin.command} (${file})`));
        }
      } catch (error) {
        console.log(chalk.red(`  ✗ Failed to load ${file}: ${error.message}`));
      }
    }
    
    console.log(chalk.cyan(`📦 Total plugins loaded: ${this.plugins.size}\n`));
  }

  async handleMessage(socket, message) {
    try {
      if (!message.message) return;

      const messageText = this.extractMessageText(message);
      if (!messageText || !messageText.startsWith(config.PREFIX)) return;

      const args = messageText.slice(config.PREFIX.length).trim().split(' ');
      const commandName = args.shift().toLowerCase();
      
      const plugin = this.plugins.get(commandName);
      if (!plugin) return;

      // Security checks
      if (plugin.owner && !this.isOwner(message)) {
        await this.sendReply(socket, message, '❌ This command is only for the bot owner!');
        return;
      }

      if (plugin.group && !message.key.remoteJid.endsWith('@g.us')) {
        await this.sendReply(socket, message, '❌ This command can only be used in groups!');
        return;
      }

      if (plugin.admin && message.key.remoteJid.endsWith('@g.us')) {
        const isAdmin = await this.isGroupAdmin(socket, message);
        if (!isAdmin) {
          await this.sendReply(socket, message, '❌ This command is only for group admins!');
          return;
        }
      }

      // Execute plugin
      await plugin.execute(socket, message, args);
      
    } catch (error) {
      console.error('Plugin handler error:', error);
      await this.sendReply(socket, message, '❌ An error occurred while executing the command.');
    }
  }

  extractMessageText(message) {
    const messageType = Object.keys(message.message)[0];
    
    switch (messageType) {
      case 'conversation':
        return message.message.conversation;
      case 'extendedTextMessage':
        return message.message.extendedTextMessage.text;
      case 'imageMessage':
        return message.message.imageMessage.caption || '';
      case 'videoMessage':
        return message.message.videoMessage.caption || '';
      default:
        return '';
    }
  }

  isOwner(message) {
    const sender = message.key.participant || message.key.remoteJid;
    return sender.includes(config.OWNER_NUMBER);
  }

  async isGroupAdmin(socket, message) {
    try {
      if (!message.key.remoteJid.endsWith('@g.us')) return false;
      
      const groupMetadata = await socket.groupMetadata(message.key.remoteJid);
      const participant = message.key.participant || message.key.remoteJid;
      const adminList = groupMetadata.participants
        .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
        .map(p => p.id);
      
      return adminList.includes(participant);
    } catch {
      return false;
    }
  }

  async sendReply(socket, message, text, options = {}) {
    return await socket.sendMessage(message.key.remoteJid, {
      text: text,
      ...options
    }, { quoted: message });
  }

  getPlugins() {
    return Array.from(this.plugins.values());
  }

  getPlugin(command) {
    return this.plugins.get(command);
  }

  async reloadPlugins() {
    this.plugins.clear();
    await this.loadPlugins();
  }
}

const pluginHandler = new PluginHandler();

// Load plugins on startup
pluginHandler.loadPlugins();

module.exports = pluginHandler;