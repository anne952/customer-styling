import React from "react";
import { Text, View, Pressable} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function Parametre(){
 return(
    <View className=" flex-1 bg-white p-6">
        <View className="mt-20">
            <View className="flex flex-row gap-20">
           <Link href="/pages/menu/profil" className="bg-blue-500 w-10 p-2 rounded-lg">
            <Ionicons name="chevron-back-outline" size={24} color="black"/>
           </Link>
           <Text className="text-xl font-bold mt-2">Paramétre</Text>            
           </View>

           <View className="mt-24 shadow-slate-500 w-80 bg-white h-20 shadow rounded-lg ml-5 flex flex-row gap-14">
            <Text className="p-6">Changer le mot de passe</Text>
            <Pressable
            style={({ pressed})=>[
                {
                    backgroundColor:pressed? 'blue': 'transparent',
                    padding: 10,
                    borderRadius: 5
                }
            ]}
            >
            <Feather name="chevron-right" size={24} color="black"  className=" p-6 -ml-4"/>           
            </Pressable>
            </View>
        </View>
    </View>
 )
}