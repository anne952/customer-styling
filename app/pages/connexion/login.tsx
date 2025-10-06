import { Ionicons } from '@expo/vector-icons';
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { login, LoginCredentials } from "../../../utils/users";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir votre email');
      return;
    }

    if (!password) {
      Alert.alert('Erreur', 'Veuillez saisir votre mot de passe');
      return;
    }

    setLoading(true);

    try {
      const credentials: LoginCredentials = {
        email: email.trim().toLowerCase(),
        password
      };

      const response = await login(credentials);

      // Redirection vers la page principale après connexion réussie
      router.replace('/pages/(tabs)');

    } catch (error: any) {
      const errorMessage = error.status === 401
        ? 'Identifiants incorrects'
        : error.message || 'Erreur lors de la connexion';
      Alert.alert('Erreur de connexion', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className='flex-1 bg-white'>
      <Link href="/pages/(tabs)" className="text-blue-500 font-semibold mt-9 p-4 text-right">Ignorer</Link>
      <View className="h-full flex items-center justify-center">
        <View className="-mt-52">
          <Text className="text-center font-bold text-3xl">Connexion</Text>
          <Text className="text-center text-lg">Bienvenue !</Text>
        </View>


        <View className="mb-8">
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={{ width: 300, height: 50, borderColor: "black", borderWidth: 1, borderRadius: 10, paddingLeft: 10 }}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            style={{ width: 300, height: 50, borderColor: "black", borderWidth: 1, borderRadius: 10, paddingLeft: 10, marginTop: 16 }}
            secureTextEntry={true}
          />

          <View className='flex-row justify-center mt-4 gap-10'>
            <Text>Vous n'avez pas de compte ?</Text>
            <Link href='/pages/connexion/register' className="text-blue-500 font-semibold">
              S'inscrire
            </Link>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className="mt-8 bg-blue-500 px-8 py-3 rounded-lg"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-xl font-semibold">Connecter</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 20, paddingHorizontal: 24, paddingTop: 16 }}>
        <Link href="/pages/connexion/forget-password" className="text-center w-full mt-4 text-blue-500 font-semibold">
          Mot de passe oublié ?
        </Link>
      </View>
    </View>
  );
}
