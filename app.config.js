// app.config.js
require('dotenv').config();  // charge ton .env et expose process.env.GOOGLE_CLIENT_ID

module.exports = {
  expo: {
    name: "mobile-supmap",
    slug: "mobile-supmap",
    version: "1.0.0",
    sdkVersion: "53.0.0",
    platforms: ["ios","android","web"],
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "mobilesupmap",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    // ⬇️ ajoute ici ta clé Google
    extra: {
      googleClientId: process.env.GOOGLE_CLIENT_ID
    },

    assetBundlePatterns: ["**/*"],
    updates: { fallbackToCacheTimeout: 0 },

    ios: { supportsTablet: true },
    android: {
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
    experiments: { typedRoutes: true }
  }
};
