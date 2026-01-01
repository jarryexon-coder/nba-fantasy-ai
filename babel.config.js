module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // This is the correct plugin for Reanimated 3.x
      'react-native-reanimated/plugin',
    ],
  };
};
