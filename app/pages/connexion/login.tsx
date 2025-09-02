import { Ionicons } from '@expo/vector-icons';
import { Link } from "expo-router";
import React from "react";
import { Dimensions, Text, TextInput, View, KeyboardAvoidingView, Platform } from "react-native";

export default function Login() {   
  
  
  return (
    
      <View className='flex-1 bg-white'>
        <Link href="/pages/(tabs)" className="text-blue-500 font-semibold mt-9 p-4 text-right">Ignorer</Link>
        <View className="h-full flex items-center justify-center">
          <View className="-mt-52">
            <Text className="text-center font-bold text-3xl">Connexion</Text>
            <Text className="text-center text-lg">Bienvenue !</Text>
          </View>
          
          <View className="">
            <TextInput
              placeholder="Email"
              style={{ width: 300, height: 50, borderColor: "black", borderWidth: 1, borderRadius: 10, paddingLeft: 10 }}
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Mot de passe"
              style={{ width: 300, height: 50, borderColor: "black", borderWidth: 1, borderRadius: 10, paddingLeft: 10, marginTop: 16 }}
              secureTextEntry={true}
            />
            <View className='flex-row justify-center mt-4 gap-10'>
              <Text>Vous n'avez pas de compte ?</Text>
            <Link href='/pages/connexion/register' className="text-blue-500  font-semibold">
              S'inscrire
            </Link>
            </View>
          </View>
          
          <View className="mt-8">
            <Link 
              href="/pages/(tabs)" 
              className="text-white text-xl p-3 w-52 text-center bg-blue-500 font-semibold rounded-lg"
            >
              Connecter
            </Link>
          </View>
        </View>
      
      
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 20, paddingHorizontal: 24, paddingTop: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
          <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
          <Text style={{ marginHorizontal: 8, fontWeight: 'bold' }}>ou</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
        </View>

        <View className="flex-row justify-center mt-4">
          <View className="bg-white w-12 shadow-slate-400 shadow-md rounded-lg p-3 items-center justify-center mx-4">
            <Ionicons name="logo-google" size={24} color="black" />
          </View>
          <View className="bg-white w-12 shadow-slate-400 shadow-md rounded-lg p-3 items-center justify-center mx-4">
            <Ionicons name="logo-facebook" size={24} color="black" />
          </View>
          <View className="bg-white w-12 shadow-slate-400 shadow-md rounded-lg p-3 items-center justify-center mx-4">
            <Ionicons name="logo-apple" size={24} color="black" />
          </View>
        </View>

        <Link href="/pages/connexion/forget-password" className="text-center w-full mt-4 text-blue-500 font-semibold">
          Mot de passe oublié ?
        </Link>
      </View>
      </View>
   
  );
}