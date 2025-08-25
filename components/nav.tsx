import React from "react";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";


export default function Nav(){
    return(
        <View className="bg-blue-500 p-6 flex flex-row justify-between gap-8">
                <Link href="/pages/home" >
                <View>
                    <Ionicons name="home" size={30} color="white" />
                </View>
                </Link>
                <Link href="/pages/menu/cart" >
                <View>
                    <Ionicons name="cart-outline" size={30} color="white" />
                </View>
                </Link>
        
                <Link href="/pages/menu/search" >
                <View>
                    <Ionicons name="search-outline" size={30} color="white" />
                </View>
                </Link>
        
                <Link href="/pages/menu/profil" >
                <View>
                    <Ionicons name="person-circle-outline" size={30} color="white" />
                </View>
                </Link>     
                 </View>
                 
    )
}