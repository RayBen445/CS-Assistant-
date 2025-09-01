// Express server for deployment platforms that require HTTP endpoints
const express = require('express');
const { config } = require('./config');

const app = express();
const PORT = process.env.PORT || 8000;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'CS-Assistant Bot is running!',
    version: config.VERSION,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Status endpoint
app.get('/status', (req, res) => {
  const whatsappHandler = require('./lib/whatsapp');
  
  res.json({
    bot: {
      name: config.BOT_NAME,
      version: config.VERSION,
      uptime: process.uptime(),
      connected: whatsappHandler.isSocketConnected()
    },
    system: {
      platform: process.platform,
      node_version: process.version,
      memory_usage: process.memoryUsage(),
      pid: process.pid
    },
    timestamp: new Date().toISOString()
  });
});

// Health endpoint for deployment platforms
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: Date.now() });
});

// Start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🌐 HTTP Server running on port ${PORT}`);
  });
}

module.exports = app;