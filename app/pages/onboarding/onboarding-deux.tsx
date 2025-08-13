import React from "react";
import { Text, View, Image } from "react-native";
import { Link } from "expo-router";


export default function OnboardingUn() {
  return (
    <View className="flex-1 bg-white">
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
            className="bg-[#606FEF] -mt-32 w-28 p-2 flex items-center justify-center rounded-lg ml-52">
             <Text className=" text-center text-lg font-semibold text-white">Next</Text>
           </Link>          
   
    </View>     
    );
}