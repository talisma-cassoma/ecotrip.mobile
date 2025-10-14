
export default ({ config }) => ({
  ...config,
  expo: {
    ...config.expo,
    name: "ecotrip",
    slug: "ecotrip",
    version: "1.0.0",
    //orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./src/assets/splash2.png",
      resizeMode: "contain",
      backgroundColor: "#257F49"
    },
    ios: {
      supportsTablet: true,
      requireFullScreen: true
    },
    android: {
      ...config.expo?.android,
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#257F49"
      },
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION"
      ],
      package: "com.talismadev.ecotrip",
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_APIKEY
        }
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.ico"
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
    updates: {  
      url: "https://u.expo.dev/4f078bc7-ebc6-44f5-bdcc-43249fcd0a01"
    },
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
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
      
    }
  }
});
