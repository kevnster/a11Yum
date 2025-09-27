const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Enable CSS support
config.resolver.assetExts.push('css');

module.exports = withNativeWind(config, { input: './src/global.css' });
