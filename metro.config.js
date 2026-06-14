const { getDefaultConfig } = require('expo/metro-config');
const { withOptiCoreMetroConfig } = require('opticore-react-native/metro');

const config = getDefaultConfig(__dirname);
module.exports = withOptiCoreMetroConfig(config, __dirname);
