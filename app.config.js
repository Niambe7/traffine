// app.config.js
require('dotenv').config();  // charge ton .env et expose process.env.*

export default ({ config }) => ({
  ...config,
  expo: {
    ...config.expo,
    name: "mobile-supmap",
    slug: "mobile-supmap",
    version: "1.0.0",
    sdkVersion: "53.0.0",
    platforms: ["ios", "android", "web"],
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "mobilesupmap",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    extra: {
      googleWebClientId: process.env.WEB_GOOGLE_CLIENT_ID,
      googleAndroidClientId: process.env.ANDROID_GOOGLE_CLIENT_ID,
      googleIosClientId: process.env.IOS_GOOGLE_CLIENT_ID,
      eas: {
        projectId: "acb885a3-6b2e-4296-8b64-c8273f8417fa"
      }
    },

    // EAS Update configuration
    updates: {
      url: "https://u.expo.dev/acb885a3-6b2e-4296-8b64-c8273f8417fa",
      fallbackToCacheTimeout: 0
    },
    runtimeVersion: {
      policy: "sdkVersion"
    },

    assetBundlePatterns: ["**/*"],

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.niambe7.mobilesupmap",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      package: "com.niambe7.mobilesupmap",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },

    plugins: [
      "expo-router",
      "expo-dev-client",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ]
    ],

    experiments: {
      typedRoutes: true
    }
  }
});
