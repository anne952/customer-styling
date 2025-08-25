import { Ionicons } from '@expo/vector-icons';
import { Link } from "expo-router";
import React from "react";
import { Dimensions, Text, TextInput, View } from "react-native";



export default function Login() {   
  const initialWindowHeight = React.useRef(Dimensions.get('window').height).current;
  const windowHeight = Dimensions.get('window').height;
  const bottomPadding = windowHeight < 700 ? 16 : 24;
  return (
    <View className="flex-1 bg-white" style={{ height: initialWindowHeight }}>
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
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 24, paddingBottom: bottomPadding, paddingTop: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
          <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
          <Text style={{ marginHorizontal: 8, fontWeight: 'bold' }}>ou</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
        </View>

        <View className="flex-row justify-center mt-4">
          <View className="apple bg-white w-12 shadow-slate-400 shadow-md rounded-lg p-3 items-center justify-center mx-4">
            <Ionicons name="logo-google" size={24} color="black" />
          </View>
          <View className="apple bg-white w-12 shadow-slate-400 shadow-md rounded-lg p-3 items-center justify-center mx-4">
            <Ionicons name="logo-facebook" size={24} color="black" />
          </View>
          <View className="apple bg-white w-12 shadow-slate-400 shadow-md rounded-lg p-3 items-center justify-center mx-4">
            <Ionicons name="logo-apple" size={24} color="black" />
          </View>
        </View>
      </View>

    </View>
  );
}