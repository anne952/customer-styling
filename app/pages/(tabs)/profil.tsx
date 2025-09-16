import SideMenu from "@/components/menu";
import { useUser } from "@/components/user-context";
import React from "react";
import { Image, View } from "react-native";


export default function Profil(){
    const { user } = useUser();
    return (
        <View className="flex-1">
          <SideMenu/>  
          <View className="bottom-0 absolute w-full">
          </View>
        </View>
    )
}