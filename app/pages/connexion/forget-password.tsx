import { Link } from "expo-router";
import React from "react";
import { Dimensions, Text, TextInput, View } from "react-native";

export default function ForgetPassword() {
  return (
    <View className="flex-1 bg-white" style={{ height: Dimensions.get('window').height }}>
         <View className="h-full flex items-center justify-center">
           <View className="-mt-20">
               <Text className="text-center font-bold text-xl ">Mot de passe oublié</Text>   
           </View>
           <View
           className="mt-8"
           >
               <TextInput
                   placeholder="Entrez votre adresse e-mail"
                   placeholderTextColor="#999"
                   style={{ width: 300, height: 50,  backgroundColor:"#CECECE", borderWidth: 1, borderRadius: 10, paddingLeft: 10, marginTop: 16 }}
                   keyboardType="email-address"
               />
               <TextInput
                   placeholder="Entrer votre nouveau mot de passe"
                   placeholderTextColor="#999"
                   style={{ width: 300, height: 50,  backgroundColor:"#CECECE", borderWidth: 1, borderRadius: 10, paddingLeft: 10, marginTop: 16 }}
                   secureTextEntry={true}
               />
               <TextInput
                   placeholder="Confirmer le mot de passe"
                   placeholderTextColor="#999"
                   style={{ width: 300, height: 50,  backgroundColor:"#CECECE", borderWidth: 1, borderRadius: 10, paddingLeft: 10, marginTop: 16 }}
                   secureTextEntry={true}
               />
           </View>
           <View className="mt-8">
               <Link 
                   href="/pages/connexion/login" 
                   className="text-white text-xl p-3 w-80 text-center bg-blue-500 font-semibold rounded-lg">
                   Continuer
               </Link>
           </View>
         </View>
    </View>
  );
}
