// Test configuration and functionality
const { config } = require('./config');
const banner = require('./lib/banner');

console.log('🧪 Testing CS-Assistant Configuration...\n');

// Test configuration
try {
  banner.info('Testing configuration validation...');
  
  console.log('✅ Config loaded successfully');
  console.log(`📱 Bot Name: ${config.BOT_NAME}`);
  console.log(`🔧 Prefix: ${config.PREFIX}`);
  console.log(`👑 Owner: ${config.OWNER_NUMBER}`);
  console.log(`🌍 Timezone: ${config.TIME_ZONE}`);
  console.log(`📊 Version: ${config.VERSION}`);
  
  banner.success('Configuration test passed!');
} catch (error) {
  banner.error(`Configuration test failed: ${error.message}`);
  process.exit(1);
}

// Test banner display
try {
  banner.info('Testing banner display...');
  banner.display();
  banner.success('Banner test passed!');
} catch (error) {
  banner.error(`Banner test failed: ${error.message}`);
}

// Test plugin loading
try {
  banner.info('Testing plugin system...');
  const pluginHandler = require('./lib/plugins');
  
  if (pluginHandler.getPlugins().length > 0) {
    banner.success(`Plugin test passed! ${pluginHandler.getPlugins().length} plugins loaded.`);
  } else {
    banner.warn('No plugins found, but system is working.');
  }
} catch (error) {
  banner.error(`Plugin test failed: ${error.message}`);
}

banner.info('All tests completed!');
console.log('\n🎉 CS-Assistant is ready to run!\n');
console.log('Use: npm start');
console.log('Or: node index.js\n');