const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    if (moduleName === 'react-native-maps') {
      return context.resolveRequest(
        context,
        '@teovilla/react-native-web-maps',
        platform
      );
    }

    // 👇 MUITO IMPORTANTE
    if (moduleName === 'react-native-maps-directions') {
      return context.resolveRequest(
        context,
        require.resolve('./src/components/mapsDirections/MapDirections.web.tsx'),
        platform
      );
    }
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;