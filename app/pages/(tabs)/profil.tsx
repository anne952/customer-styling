import React from "react";
import SideMenu from "@/components/menu";
import { View } from "react-native";
import Nav from "@/components/nav";


export default function Profil(){
    return (
        <View className="flex-1">
          <SideMenu/>  
          <View className="bottom-0 absolute w-full">
          </View>
        </View>
    )
}