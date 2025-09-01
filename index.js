// Main entry point for CS-Assistant WhatsApp Bot
// Integrated features from multiple bot systems
const { config, validateConfig } = require('./config');
const banner = require('./lib/banner');
const whatsappHandler = require('./lib/whatsapp');

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Main bot initialization function
async function startBot() {
  try {
    // Show banner if enabled
    if (config.SHOW_BANNER) {
      banner.display();
    }

    // Validate configuration
    validateConfig();
    
    // Initialize WhatsApp connection
    await whatsappHandler.initialize();
    
    banner.info('CS-Assistant Bot initialization completed successfully!');
    
  } catch (error) {
    banner.error(`Failed to start bot: ${error.message}`);
    process.exit(1);
  }
}

// Graceful shutdown handling
process.on('SIGTERM', () => {
  banner.info('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  banner.info('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start the bot
startBot();