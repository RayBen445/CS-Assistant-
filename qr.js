// QR Code Scanner for getting SESSION_ID
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const banner = require('./lib/banner');

async function generateSession() {
  banner.display();
  banner.info('Starting session generation...');

  try {
    // Clean session directory
    if (fs.existsSync('./session')) {
      fs.rmSync('./session', { recursive: true, force: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();

    const socket = makeWASocket({
      version,
      auth: state,
      logger: pino({ level: 'silent' }),
      printQRInTerminal: false,
      browser: Browsers.ubuntu('CS-Assistant'),
      generateHighQualityLinkPreview: true
    });

    socket.ev.on('creds.update', saveCreds);

    socket.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log('\n📱 Scan this QR code with your WhatsApp:\n');
        qrcode.generate(qr, { small: true });
        console.log('\n🔄 Waiting for QR scan...');
      }

      if (connection === 'open') {
        banner.success('Session created successfully!');
        
        // Read session files and create SESSION_ID
        const sessionFiles = fs.readdirSync('./session');
        console.log('\n📁 Session files created:');
        sessionFiles.forEach(file => {
          console.log(`  ✓ ${file}`);
        });
        
        console.log('\n🔑 Your session has been saved to the "./session" folder');
        console.log('📋 Copy all files from the session folder to your deployment');
        console.log('\n⚠️  Keep your session files secure and private!');
        
        process.exit(0);
      }

      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401;
        
        if (shouldReconnect) {
          banner.warn('Connection lost, retrying...');
          setTimeout(generateSession, 3000);
        } else {
          banner.error('Session generation failed. Please try again.');
          process.exit(1);
        }
      }
    });

  } catch (error) {
    banner.error(`Session generation failed: ${error.message}`);
    process.exit(1);
  }
}

// Start session generation
generateSession();