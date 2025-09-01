// WhatsApp connection handler for CS-Assistant
const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  jidNormalizedUser,
  getContentType,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const fs = require('fs');
const chalk = require('chalk');
const { config } = require('../config');
const banner = require('./banner');

class WhatsAppHandler {
  constructor() {
    this.socket = null;
    this.authState = null;
    this.saveCreds = null;
    this.isConnected = false;
  }

  async initialize() {
    try {
      banner.info('Initializing WhatsApp connection...');
      
      // Setup authentication
      const { state, saveCreds } = await useMultiFileAuthState('./session');
      this.authState = state;
      this.saveCreds = saveCreds;

      await this.connect();
    } catch (error) {
      banner.error(`Failed to initialize WhatsApp: ${error.message}`);
      throw error;
    }
  }

  async connect() {
    try {
      const { version } = await fetchLatestBaileysVersion();
      
      this.socket = makeWASocket({
        version,
        auth: this.authState,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        browser: Browsers.ubuntu('CS-Assistant'),
        defaultQueryTimeoutMs: 60000,
        connectTimeoutMs: 60000,
        emitOwnEvents: true,
        generateHighQualityLinkPreview: true,
        syncFullHistory: false,
        markOnlineOnConnect: config.ALWAYS_ONLINE,
        getUserOnlinePresence: true
      });

      this.setupEventListeners();
      
    } catch (error) {
      banner.error(`Connection failed: ${error.message}`);
      setTimeout(() => this.connect(), 5000);
    }
  }

  setupEventListeners() {
    // Connection state handler
    this.socket.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        banner.info('QR Code generated! Scan it with your WhatsApp.');
      }

      if (connection === 'close') {
        this.isConnected = false;
        const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
        
        if (shouldReconnect) {
          banner.warn('Connection closed, reconnecting...');
          setTimeout(() => this.connect(), 3000);
        } else {
          banner.error('Device logged out. Please scan QR code again.');
          this.connect();
        }
      } else if (connection === 'open') {
        this.isConnected = true;
        banner.connected();
        
        // Send startup message to owner
        if (config.OWNER_NUMBER && !config.DISABLE_START_MESSAGE) {
          await this.sendStartupMessage();
        }
      }
    });

    // Credentials update handler
    this.socket.ev.on('creds.update', this.saveCreds);

    // Message handler
    this.socket.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type === 'notify') {
        for (const message of messages) {
          await this.handleMessage(message);
        }
      }
    });

    // Group participants update handler
    this.socket.ev.on('group-participants.update', async (update) => {
      await this.handleGroupUpdate(update);
    });

    // Auto-read status
    if (config.AUTO_READ_STATUS) {
      this.socket.ev.on('messages.upsert', async ({ messages }) => {
        for (const message of messages) {
          if (message.key && message.key.remoteJid === 'status@broadcast') {
            await this.socket.readMessages([message.key]);
          }
        }
      });
    }
  }

  async handleMessage(message) {
    try {
      if (!message.message || message.key.fromMe) return;
      
      const messageType = getContentType(message.message);
      const messageContent = message.message[messageType];
      const from = message.key.remoteJid;
      const sender = jidNormalizedUser(message.key.participant || from);

      // Auto-read messages
      if (config.READ_MESSAGE) {
        await this.socket.readMessages([message.key]);
      }

      // Load and execute plugins
      const pluginHandler = require('./plugins');
      await pluginHandler.handleMessage(this.socket, message);
      
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  async handleGroupUpdate(update) {
    try {
      const { id, participants, action } = update;
      
      if (action === 'add' && config.WELCOME_MESSAGE) {
        const groupMetadata = await this.socket.groupMetadata(id);
        const welcomeText = `🎉 Welcome to ${groupMetadata.subject}!\n\nEnjoy your stay and follow the group rules.`;
        
        await this.socket.sendMessage(id, { text: welcomeText });
      }
      
      if (action === 'remove' && config.GOODBYE_MESSAGE) {
        const goodbyeText = `👋 Goodbye! Thanks for being part of our community.`;
        await this.socket.sendMessage(id, { text: goodbyeText });
      }
    } catch (error) {
      console.error('Error handling group update:', error);
    }
  }

  async sendStartupMessage() {
    try {
      const ownerJid = config.OWNER_NUMBER + '@s.whatsapp.net';
      const startupMessage = `🤖 *CS-Assistant Bot Started Successfully!*\n\n` +
                           `✅ Multi-device connection active\n` +
                           `🔧 All plugins loaded\n` +
                           `📱 Bot is online and ready\n\n` +
                           `Version: ${config.VERSION}\n` +
                           `Time: ${new Date().toLocaleString()}`;

      await this.socket.sendMessage(ownerJid, { 
        text: startupMessage,
        contextInfo: {
          externalAdReply: {
            title: 'CS-Assistant Bot',
            body: 'Bot started successfully!',
            thumbnailUrl: config.IMAGE_LOGO,
            sourceUrl: 'https://github.com/RayBen445/CS-Assistant-'
          }
        }
      });
    } catch (error) {
      console.error('Failed to send startup message:', error);
    }
  }

  // Utility methods
  async sendMessage(jid, content, options = {}) {
    return await this.socket.sendMessage(jid, content, options);
  }

  async downloadMediaMessage(message) {
    return await this.socket.downloadMediaMessage(message);
  }

  async groupMetadata(jid) {
    return await this.socket.groupMetadata(jid);
  }

  async onWhatsApp(jid) {
    return await this.socket.onWhatsApp(jid);
  }

  getSocket() {
    return this.socket;
  }

  isSocketConnected() {
    return this.isConnected;
  }
}

module.exports = new WhatsAppHandler();