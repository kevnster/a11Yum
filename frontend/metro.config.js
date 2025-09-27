const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable CSS support
config.resolver.assetExts.push('css');

module.exports = config;
