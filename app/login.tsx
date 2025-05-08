// LoginScreen.tsx
import React, { useEffect } from "react";
import { View, TouchableOpacity, Text, Alert } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { loginWithGoogle } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();

  const REDIRECT_URI = "https://auth.expo.io/@niambe7/mobile-supmap"; // hard-codé
  const CLIENT_ID = Constants.expoConfig?.extra?.googleClientId;
  
  if (!CLIENT_ID) {
    console.error("Google Client ID is not defined in Expo configuration.");
    Alert.alert("Configuration Error", "Google Client ID is missing. Please check your app configuration.");
  }

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI,
    scopes: ["openid", "profile", "email"],
  });

  useEffect(() => {
    if (response?.type === "success" && response.params.id_token) {
      loginWithGoogle(response.params.id_token).then(data => {
        if (data.token) {
          login(data.user, data.token);
          router.replace("/map");
        } else {
          Alert.alert("Erreur", data.message ?? "Connexion Google refusée");
        }
      });
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      {request && (
        <TouchableOpacity
          style={{
            marginTop: 20,
            padding: 12,
            backgroundColor: "#4285F4",
            borderRadius: 5,
            alignItems: "center",
          }}
          disabled={!request}
          onPress={() => promptAsync()}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Se connecter avec Google
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}