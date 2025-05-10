// screens/RegisterScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { registerUser } from '../services/auth.service'; // ajustez le chemin si besoin
import { useRouter } from 'expo-router';
// … dans votre composant RegisterScreen
const router = useRouter();


type NavigationProp = {
  navigate: (screen: string) => void;
};

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [loading, setLoading]   = useState(false);

  const handleRegister = async () => {
  if (password !== confirm) {
    return Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
  }
  setLoading(true);
  try {
    await registerUser(username, email, password);
    Alert.alert('Succès', 'Votre compte a été créé.', [
      {
        text: 'OK',
        onPress: () => {
          router.push('/login');
        },
      },
    ]);
  } catch (err: any) {
    Alert.alert('Erreur', err.message || 'Impossible de créer le compte.');
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>

      <TextInput
        placeholder="Nom d'utilisateur"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="E-mail"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Mot de passe"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        placeholder="Confirmer le mot de passe"
        style={styles.input}
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator />
          : <Text style={styles.buttonText}>S’inscrire</Text>
        }
      </TouchableOpacity>

       <TouchableOpacity
        onPress={() => router.push('/login')} style={styles.link}>
        <Text>Vous avez déjà un compte ? <Text style={styles.linkto}>Se connecter</Text></Text>
    </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f8f8f8'
  },
  linkto: {
    color: '#a96fea',
    fontWeight: 'bold'
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '600'
  },
  input: {
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  button: {
    height: 48,
    backgroundColor: '#a96fea',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12
  },
  buttonDisabled: {
    backgroundColor: '#aac4f6'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500'
  },
  link: {
    marginTop: 16,
    alignSelf: 'center'
  }
});
