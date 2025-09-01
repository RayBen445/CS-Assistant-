// CSS-styled banner for CS-Assistant
const chalk = require('chalk');

const banner = {
  // Main banner with CSS-like styling
  display() {
    const gradient = chalk.hex('#00d4ff').bold;
    const accent = chalk.hex('#ff6b6b').bold;
    const white = chalk.white.bold;
    const gray = chalk.gray;
    
    console.log('\n');
    console.log(gradient('╔═══════════════════════════════════════════════════════════╗'));
    console.log(gradient('║') + '                                                         ' + gradient('║'));
    console.log(gradient('║') + '    ' + accent('██████╗ ███████╗      ████████╗███████╗ █████╗ ███╗   ███╗') + '   ' + gradient('║'));
    console.log(gradient('║') + '   ' + accent('██╔════╝ ██╔════╝      ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║') + '   ' + gradient('║'));
    console.log(gradient('║') + '   ' + accent('██║      ███████╗  █████╗██║   █████╗  ███████║██╔████╔██║') + '   ' + gradient('║'));
    console.log(gradient('║') + '   ' + accent('██║      ╚════██║  ╚════╝██║   ██╔══╝  ██╔══██║██║╚██╔╝██║') + '   ' + gradient('║'));
    console.log(gradient('║') + '   ' + accent('╚██████╗ ███████║        ██║   ███████╗██║  ██║██║ ╚═╝ ██║') + '   ' + gradient('║'));
    console.log(gradient('║') + '    ' + accent('╚═════╝ ╚══════╝        ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝') + '    ' + gradient('║'));
    console.log(gradient('║') + '                                                         ' + gradient('║'));
    console.log(gradient('║') + '           ' + white('🤖 Advanced Multi-Device WhatsApp Bot 🤖') + '          ' + gradient('║'));
    console.log(gradient('║') + '                                                         ' + gradient('║'));
    console.log(gradient('║') + '        ' + gray('Version: 2.0.0  •  Node.js WhatsApp Bot') + '         ' + gradient('║'));
    console.log(gradient('║') + '        ' + gray('Integrated Features from 5 Bot Systems') + '          ' + gradient('║'));
    console.log(gradient('║') + '                                                         ' + gradient('║'));
    console.log(gradient('╚═══════════════════════════════════════════════════════════╝'));
    console.log('\n');
    
    // Feature highlights
    console.log(chalk.cyan('🌟 Features:'));
    console.log(chalk.green('  ✓ Multi-device support with Baileys'));
    console.log(chalk.green('  ✓ Advanced plugin system'));
    console.log(chalk.green('  ✓ Group management tools'));
    console.log(chalk.green('  ✓ Media processing & downloading'));
    console.log(chalk.green('  ✓ AI integration support'));
    console.log(chalk.green('  ✓ Multiple deployment options'));
    console.log('\n');
    
    // Status indicators
    console.log(chalk.blue('📊 System Status:'));
    console.log(chalk.yellow('  ⚡ Starting up...'));
    console.log(chalk.yellow('  🔄 Loading plugins...'));
    console.log(chalk.yellow('  📱 Connecting to WhatsApp...'));
    console.log('\n');
  },

  // Loading animation
  loading(message = 'Loading') {
    const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;
    
    const interval = setInterval(() => {
      process.stdout.write(`\r${chalk.cyan(spinner[i])} ${chalk.white(message)}...`);
      i = (i + 1) % spinner.length;
    }, 100);
    
    return interval;
  },

  // Success message
  success(message) {
    console.log('\n' + chalk.green('✅ ' + message) + '\n');
  },

  // Error message  
  error(message) {
    console.log('\n' + chalk.red('❌ ' + message) + '\n');
  },

  // Warning message
  warn(message) {
    console.log('\n' + chalk.yellow('⚠️  ' + message) + '\n');
  },

  // Info message
  info(message) {
    console.log('\n' + chalk.blue('ℹ️  ' + message) + '\n');
  },

  // Connection status
  connected() {
    console.log(chalk.green.bold('\n🎉 CS-Assistant Bot Connected Successfully!'));
    console.log(chalk.cyan('📱 WhatsApp Multi-Device Session Active'));
    console.log(chalk.yellow('🔧 All plugins loaded and ready'));
    console.log(chalk.magenta('⚡ Bot is now online and responding to commands\n'));
    
    // Display connection box
    const box = chalk.green('╔════════════════════════════════════╗\n') +
                chalk.green('║  ') + chalk.white.bold('🚀 CS-ASSISTANT IS LIVE! 🚀') + chalk.green('     ║\n') +
                chalk.green('╚════════════════════════════════════╝');
    console.log(box + '\n');
  },

  // Disconnection message
  disconnected() {
    console.log(chalk.red('\n📴 WhatsApp Connection Lost...'));
    console.log(chalk.yellow('🔄 Attempting to reconnect...\n'));
  }
};

module.exports = banner;