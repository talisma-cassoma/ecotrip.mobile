export default ({ config }) => ({
  ...config,
  expo: {
    ...config.expo,
    name: "ecotrip",
    slug: "ecotrip",
    version: "1.0.0",
    orientation: "default",
    icon: "./assets/images/icon.png",
    scheme: "ecotrip", // Caso queira usar deep linking com development build
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    splash: {
      image: "./assets/images/icon.png",
      resizeMode: "center",
      backgroundColor: "#257F49"
    },

    ios: {
      supportsTablet: true,
      requireFullScreen: true,
      bundleIdentifier: "com.talismadev.ecotrip" // Adicionado para consistência
    },

    android: {
      //...config.expo?.android,
      package: "com.talismadev.ecotrip",
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#257F49"
      },
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION"
      ],
      config: {
        googleMaps: {
          // O EAS vai buscar isso das "Environment Variables" que você configurou no dashboard
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_APIKEY
        }
      }
    },

    web: {
      bundler: "metro",
      output: "static",
      favicon: ""
    },

    plugins: [
      "expo-router",
      "expo-font",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Allow $(PRODUCT_NAME) to use your location."
        }
      ],
      [
        "expo-screen-orientation",
        {
          "initialOrientation": "DEFAULT"
        }
      ]
    ],

    experiments: {
      typedRoutes: true
    },

    // Configuração de Updates centralizada (Apenas uma vez)
    updates: process.env.NODE_ENV === "development"
      ? { fallbackToCacheTimeout: 0 } :
      { url: "https://u.expo.dev/4f078bc7-ebc6-44f5-bdcc-43249fcd0a01" },

    // Runtime Version baseada na versão do App (Importante para OTA)
    runtimeVersion: {
      policy: "appVersion"
    },

    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: "4f078bc7-ebc6-44f5-bdcc-43249fcd0a01"
      },
      // Variáveis de ambiente para o seu código JS
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
      NODE_ENV: process.env.NODE_ENV,
    }
  }
});