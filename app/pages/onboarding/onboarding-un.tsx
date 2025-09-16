import React from "react";
import { Text, View, Image } from "react-native";
import { Link } from "expo-router";


export default function OnboardingUn() {
  return (
    <View className="flex-1 bg-white p-6">
      <View className="h-full flex items-center justify-center">
        <Image
          source={require("../../../assets/images/1.png")}
          className="w-62 -mt-20 object-contain"
          resizeMode="contain"
        />
        <View className="mt-24">
        <Text className="text-center font-bold text-md">Pacourez des vêtements sur</Text>
        <Text className="text-center font-bold text-md"> mesure, prêt a porter selon </Text>
        <Text className="text-center font-bold text-md">vos goûts</Text>
        </View>
      </View>
      <Link 
       href="/pages/onboarding/onboarding-deux" 
       className="bg-[#606FEF] -mt-20 w-full p-2  flex items-center justify-center rounded-lg ">
        <Text className=" text-center text-lg font-semibold text-white">Next</Text>
      </Link>
    </View>
  );
}