import React from "react";
import { Text, View, Image } from "react-native";
import { Link } from "expo-router";


export default function OnboardingUn() {
  return (
    <View className="flex-1 bg-white p-6">
      <View className="h-full flex items-center justify-center">
        <Image
          source={require("../../../assets/images/2.png")}
          className="w-62 -mt-20 object-contain"
        />
        <View className="mt-24">
        <Text className="text-center font-bold text-md">Cliquer sur un produit, puis</Text>
        <Text className="text-center font-bold text-md"> sur acheter </Text>
        </View>
      
      </View>
       <Link 
            href="/pages/onboarding/onboarding-trois" 
            className="bg-[#606FEF] -mt-20 w-full p-2 flex items-center justify-center rounded-lg ">
             <Text className=" text-center text-lg font-semibold text-white">Next</Text>
           </Link>          
   
    </View>     
    );
}