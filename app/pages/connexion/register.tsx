import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { register, RegisterData } from "../../../utils/users";

export default function Register() {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localisation, setLocalisation] = useState('');
  const [telephone, setTelephone] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    // Validation des champs
    if (!nom.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir votre nom');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir votre email');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Erreur', 'Format d\'email invalide');
      return;
    }

    if (!password || password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (!localisation.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir votre localisation');
      return;
    }

    if (!telephone.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir votre numéro de téléphone');
      return;
    }

    setLoading(true);

    try {
      const registerData: RegisterData = {
        nom: nom.trim(),
        email: email.trim().toLowerCase(),
        password,
        localisation: localisation.trim(),
        telephone: telephone.trim()
      };

      const response = await register(registerData);

      Alert.alert(
        'Inscription réussie',
        'Votre compte a été créé avec succès !',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/pages/(tabs)')
          }
        ]
      );

    } catch (error: any) {
      const errorMessage = error.errors
        ? Object.values(error.errors).flat().join('\n')
        : error.message || 'Erreur lors de l\'inscription';

      Alert.alert('Erreur d\'inscription', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="h-full flex items-center justify-center">
        <View className="-mt-20">
          <Text className="text-center font-bold text-3xl">Inscription</Text>
          <Text className="text-center text-lg">Créez votre compte</Text>
        </View>

        <View className="mt-8">
          <TextInput
            placeholder="Nom"
            value={nom}
            onChangeText={setNom}
            style={{ width: 300, height: 50, color:"#FFFFFFF",borderWidth: 1, borderRadius: 10, paddingLeft: 10 , backgroundColor:"#CECECE"}}
            keyboardType="default"
          />

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={{ width: 300, height: 50,color:"#FFFFFFF", borderWidth: 1, borderRadius: 10, paddingLeft: 10, marginTop: 16, backgroundColor:"#CECECE" }}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Mot de passe (min 6 caractères)"
            value={password}
            onChangeText={setPassword}
            style={{ width: 300, height: 50, color:"#FFFFFFF", backgroundColor:"#CECECE", borderWidth: 1, borderRadius: 10, paddingLeft: 10, marginTop: 16 }}
            secureTextEntry={true}
          />

          <TextInput
            placeholder="Localisation"
            value={localisation}
            onChangeText={setLocalisation}
            style={{ width: 300, height: 50,color:"#FFFFFFF",  backgroundColor:"#CECECE", borderWidth: 1, borderRadius: 10, paddingLeft: 10, marginTop: 16 }}
            keyboardType="default"
          />

          <TextInput
            placeholder="Numéro de téléphone (ex: +228XXXXXXXX ou 9XXXXXXXX)"
            value={telephone}
            onChangeText={setTelephone}
            style={{ width: 300, height: 50,color:"#FFFFFFF",  backgroundColor:"#CECECE", borderWidth: 1, borderRadius: 10, paddingLeft: 10, marginTop: 16 }}
            keyboardType="phone-pad"
          />

          <View className='flex-row justify-center mt-4 gap-10'>
            <Text>Vous avez déjà un compte ?</Text>
            <Link href='/pages/connexion/login' className="text-blue-500 font-semibold">
              Se connecter
            </Link>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          className="mt-8 bg-blue-500 px-8 py-3 rounded-lg"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-xl font-semibold w-24 text-center">S'inscrire</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
