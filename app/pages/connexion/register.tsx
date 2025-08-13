import { Text, View, TextInput } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { Ionicons } from '@expo/vector-icons';



export default function Login() {   
  return (
    <View className="flex-1 bg-white">
      <View className="h-full flex items-center justify-center">
        <View className="-mt-20">
            <Text className="text-center font-bold text-3xl ">Connexion</Text>
            <Text className="text-center text-lg">Bienvenue !</Text>

        </View>
        <View
        className="mt-8"
        >
            <TextInput
                placeholder="Nom"
                style={{ width: 300, height: 50, borderColor: "black", borderWidth: 1, borderRadius: 10, paddingLeft: 10 }}
                keyboardType="default"
            />
            <TextInput
                placeholder="Email"
                style={{ width: 300, height: 50, borderColor: "black", borderWidth: 1, borderRadius: 10, paddingLeft: 10, marginTop: 16 }}
                keyboardType="email-address"
            />
            <TextInput
                placeholder="Mot de passe"
                style={{ width: 300, height: 50, borderColor: "black", borderWidth: 1, borderRadius: 10, paddingLeft: 10, marginTop: 16 }}
                secureTextEntry={true}
            />
          <Link href='/pages/connexion/login' className="text-blue-500 mt-2 font-semibold ">Se connecter</Link>
        </View>
        <View className="mt-8">
            <Link 
                href="/pages/connexion/register" 
                className="text-white text-xl p-3 w-52 text-center bg-blue-500 font-semibold rounded-lg">
                S'inscrire
            </Link>
        </View>
      </View>
      <View className="flex flex-row  -mt-60 p-4 gap-10">
        <View className="bg-black h-[0.8px] w-32 "></View>
        <Text className="mx-2 -mt-2 font-bold">ou</Text>
        <View className="bg-black h-[0.8px] w-32 "></View>
      </View>

        <View className="flex flex-row justify-center gap-16 mt-4">
            <View className="apple bg-white w-12 shadow-slate-400 shadow-md rounded-lg p-3 flex items-center justify-center">
            <Ionicons name="logo-google" size={24} color="black" />
            </View>
            <View className="apple bg-white w-12 shadow-slate-400 shadow-md rounded-lg p-3 flex items-center justify-center">
            <Ionicons name="logo-facebook" size={24} color="black" />
            </View>
          <View className="apple bg-white w-12 shadow-slate-400 shadow-md rounded-lg p-3 flex items-center justify-center">
            <Ionicons name="logo-apple" size={24} color="black" />
          </View>
        </View>

    </View>
  );
}