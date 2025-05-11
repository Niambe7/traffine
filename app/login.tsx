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
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";
import { loginUser, loginWithGoogle } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";
import { MaterialCommunityIcons } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession(); // nécessaire pour Expo Go

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, user } = useAuth();
  const router = useRouter();

  const GOOGLE_CLIENT_ID = Constants.expoConfig?.extra?.googleClientId as string;
  const REDIRECT_URI = "https://auth.expo.io/@niambe7/mobile-supmap";

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      redirectUri: REDIRECT_URI,
      scopes: ["openid", "profile", "email"],
    },
    {
      authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    }
  );

  useEffect(() => {
    if (response?.type === "success" && response.params.id_token) {
      handleGoogleResponse(response.params.id_token as string);
    }
  }, [response]);

  useEffect(() => {
    if (user) {
      router.replace("/map");
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      const data = await loginUser(email, password);
      if (data.token) {
        // on recrée un objet User conforme à votre type { id, email, name }
      const me = {
        id:    data.user.id,
        email: data.user.email,
        name:  data.user.username,    // <-- mappe le username ici
      };
      login(me, data.token);
      router.replace("/map");
      } else {
        Alert.alert("Erreur", data.message || "Connexion refusée");
      }
    } catch (err) {
      Alert.alert("Erreur API", (err as Error).message);
    }
  };

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
          {/* Logo centré en haut */}
     <Image
       source={require("../assets/images/logo.webp")} 
       style={styles.logo}
       resizeMode="contain"
       
    />
    

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
      <TouchableOpacity
  style={styles.loginButton}
  onPress={handleLogin}
  activeOpacity={0.8}
>
  <Text style={styles.loginButtonText}>Se connecter</Text>
</TouchableOpacity>


      {/* -- login Google -- */}
      <TouchableOpacity
        style={styles.googleButton}
        disabled={!request}
        onPress={() => promptAsync()}
      >

        {/* Icône Gmail à gauche */}
        <MaterialCommunityIcons
          name="gmail"
          size={24}
          color="white"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.googleText}>
          Se connecter avec Google
        </Text>
      </TouchableOpacity>

      {/* -- bouton S'inscrire -- */}
      <View style={styles.registerContainer}>
         <Text style={styles.registerPrompt}>
    Vous n’avez pas de compte ?{" "}
    <Text
      style={styles.registerLink}
      onPress={() => router.push("/register")}
    >
      S’inscrire
    </Text>
  </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  registerContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  registerPrompt: {
    fontSize: 14,
    color: "#333",
  },
  registerLink: {
    color: "#a96fea",
    fontWeight: "600",
  },
    loginButton: {
    backgroundColor: "#a96fea",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logo: {
   width: 120,
   height: 120,
   alignSelf: "center",
   marginBottom: 5,
  },
   logoText: {
   textAlign: "center",
   fontSize: 16,
   color: "#666",
   marginBottom: 16,      // espace avant le titre “Connexion”
 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  googleButton: {
     flexDirection: 'row',
    alignItems: 'center',       
    justifyContent: 'center',   
    marginTop: 20,
    padding: 12,
    backgroundColor: "#a96fea",
    borderRadius: 5,    width: "75%",
    marginLeft: 45,
  },
  googleText: { color: "white", fontWeight: "bold" },

  registerButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    backgroundColor: "#a96fea",
    borderRadius: 4,
    elevation: 2,
  },
  registerButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
