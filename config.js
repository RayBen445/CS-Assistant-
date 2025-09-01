// Environment configuration
require('dotenv').config();
const fs = require('fs');

// Core configuration
const config = {
  // Basic Bot Settings
  BOT_NAME: process.env.BOT_NAME || "CS-Assistant",
  PREFIX: process.env.PREFIX || ".",
  SESSION_ID: process.env.SESSION_ID || "",
  
  // Owner Information
  OWNER_NUMBER: process.env.OWNER_NUMBER || "27640498397",
  OWNER_NAME: process.env.OWNER_NAME || "CS-Assistant Team",
  
  // Database Configuration
  DATABASE_URL: process.env.DATABASE_URL || "./database.db",
  
  // API Keys
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "",
  WEATHER_API_KEY: process.env.WEATHER_API_KEY || "",
  
  // Bot Behavior
  AUTO_READ_STATUS: process.env.AUTO_READ_STATUS === 'true',
  AUTO_SAVE_STATUS: process.env.AUTO_SAVE_STATUS === 'true',
  AUTO_REACT: process.env.AUTO_REACT === 'true',
  
  // Security Settings
  ANTI_LINK: process.env.ANTI_LINK === 'true',
  ANTI_BAD_WORD: process.env.ANTI_BAD_WORD === 'true',
  WELCOME_MESSAGE: process.env.WELCOME_MESSAGE === 'true',
  GOODBYE_MESSAGE: process.env.GOODBYE_MESSAGE === 'true',
  
  // Media Settings
  IMAGE_LOGO: process.env.IMAGE_LOGO || "https://telegra.ph/file/b065f0f673cae5452c358.jpg",
  PACK_NAME: process.env.PACK_NAME || "CS-Assistant",
  AUTHOR_NAME: process.env.AUTHOR_NAME || "CS-Assistant Team",
  
  // Advanced Settings
  MAX_SIZE: parseInt(process.env.MAX_SIZE) || 500, // MB
  TIME_ZONE: process.env.TIME_ZONE || "Africa/Johannesburg",
  
  // Deployment Settings
  HEROKU_API_KEY: process.env.HEROKU_API_KEY || "",
  HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || "",
  
  // Plugin Settings
  DISABLE_PM: process.env.DISABLE_PM === 'true',
  ANTI_DELETE: process.env.ANTI_DELETE === 'true',
  ALWAYS_ONLINE: process.env.ALWAYS_ONLINE === 'true',
  
  // Group Settings
  ONLY_GROUP: process.env.ONLY_GROUP === 'true',
  ONLY_ADMIN: process.env.ONLY_ADMIN === 'true',
  
  // Feature Toggles
  CHATBOT: process.env.CHATBOT === 'true',
  AUTO_STATUS_READ: process.env.AUTO_STATUS_READ === 'true',
  AUTO_STATUS_SAVE: process.env.AUTO_STATUS_SAVE === 'true',
  
  // Command Settings
  READ_MESSAGE: process.env.READ_MESSAGE === 'true',
  DISABLE_START_MESSAGE: process.env.DISABLE_START_MESSAGE === 'true',
  
  // Version Info
  VERSION: "2.0.0",
  
  // Banner Configuration
  SHOW_BANNER: process.env.SHOW_BANNER !== 'false'
};

// Validation function
const validateConfig = () => {
  if (!config.SESSION_ID) {
    console.error('❌ SESSION_ID is required! Please add SESSION_ID to your environment variables.');
    process.exit(1);
  }
  
  if (!config.OWNER_NUMBER) {
    console.warn('⚠️  OWNER_NUMBER not set. Using default value.');
  }
  
  console.log('✅ Configuration validated successfully!');
};

module.exports = { config, validateConfig };