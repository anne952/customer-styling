import React from "react";
import { Text, View, Image } from "react-native";
import { Link } from "expo-router";


export default function OnboardingUn() {
  return (
    <View className="flex-1 bg-white">
      <View className="h-full flex items-center justify-center">
        <Image
          source={require("../../../assets/images/3.png")}
          className="w-62 -mt-20 object-contain"
        />
        <View className="mt-24">
        <Text className="text-center font-bold text-md">Choisissez un mode de</Text>
        <Text className="text-center font-bold text-md"> payement(Tmoney, Flooz) </Text>
        <Text className="text-center font-bold text-md">et valider la commande</Text>
        </View>
      
      </View>
       <Link 
            href="/pages/connexion/login" 
            className="bg-[#606FEF] -mt-32 w-28 p-2 flex items-center justify-center rounded-lg ml-52">
             <Text className=" text-center text-lg font-semibold text-white">Next</Text>
           </Link>          
   
    </View>     
    );
}