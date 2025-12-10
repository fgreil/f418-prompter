/**
 * Babel Configuration
 * 
 * Configures Babel transpiler for React Native with Expo
 * The reanimated plugin enables animated gestures and transitions
 */

module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
