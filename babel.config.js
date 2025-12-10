/**
 * Babel Configuration
 * 
 * Configures Babel transpiler for React Native with Expo
 */

module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};