module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Reanimated 2 requires this plugin
      'react-native-reanimated/plugin',
    ],
  };
};
