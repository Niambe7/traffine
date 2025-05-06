// Login.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";
import { loginUser, loginWithGoogle } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as GoogleProvider from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession(); // nécessaire pour Expo Go

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, user } = useAuth();
  const router = useRouter();

  // Récupère le clientId depuis app.config.js → expo.extra.googleClientId
  const GOOGLE_CLIENT_ID = Constants.expoConfig?.extra?.googleClientId as string;

  // 1) Setup de la requête Google

  const redirectUri = makeRedirectUri();
  
  // si tu utilises le provider Google :
  const [request, response, promptAsync] = GoogleProvider.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,  // ton Web Client ID
      redirectUri,
      scopes: ["openid", "profile", "email"],
    }
  );

  useEffect(() => {
    // 2) Si Google renvoie un id_token
    if (response?.type === "success" && response.params.id_token) {
      handleGoogleResponse(response.params.id_token as string);
    }
  }, [response]);

  useEffect(() => {
    // Si déjà loggé, envoie vers la map
    if (user) {
      router.replace("/map");
    }
  }, [user]);

  // 3) Login standard
  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);
      if (data.token) {
        login(data.user, data.token);
        router.replace("/map");
      } else {
        Alert.alert("Erreur", data.message || "Connexion refusée");
      }
    } catch (err) {
      Alert.alert("Erreur API", (err as Error).message);
    }
  };

  // 4) Login Google → back
  const handleGoogleResponse = async (idToken: string) => {
    try {
      const data = await loginWithGoogle(idToken);
      if (data.token) {
        login(data.user, data.token);
        router.replace("/map");
      } else {
        Alert.alert("Erreur", data.message || "Connexion Google refusée");
      }
    } catch (err) {
      Alert.alert("Erreur Google API", (err as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      {/* -- login standard -- */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        autoCapitalize="none"
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <Button title="Se connecter" onPress={handleLogin} />

      {/* -- login Google -- */}
      <TouchableOpacity
        style={styles.googleButton}
        disabled={!request}
        onPress={() => promptAsync()}
      >
        <Text style={styles.googleText}>
          Se connecter avec un compte Google
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  googleButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#4285F4",
    borderRadius: 5,
    alignItems: "center",
  },
  googleText: { color: "white", fontWeight: "bold" },
});
