import React from "react";
import { Text, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";


interface addProps{
    image: any,
    name: string;
    prixPromo: number,
    prix: number,
    onPress?: ()=> void,
    id?: number
}

export default function Add({image,name,prixPromo,prix,id}:addProps){
 return(
    <View className="mt-28">
        <View className="flex flex-row">
            {image &&
            <Image 
            source={image} 
            style={{width:80, height:60, borderRadius:10, padding:10, margin:20}} 
            resizeMode="cover"
            />            
            }

            <View className="mt-5">
                <Text className="font-bold text-xl">{name}</Text>
                <Text className="line-through text-gray-400">{prixPromo}</Text>
                <Text className="font-semibold">{prix}</Text>
            </View>
            <View className="ml-10  flex flex-row gap-4 bg-slate-400 w-28 h-8 mt-10 rounded-lg">
            <Ionicons name="add-circle-outline" size={24} color="black" style={{backgroundColor:'transparent'}}/>
            <Text className="font-semibold">1</Text>
            <Ionicons name="remove-circle-outline" size={24} color="black"/>
            </View>
        </View>
        <View className="border border-gray-400"></View>
    </View>
 )
}