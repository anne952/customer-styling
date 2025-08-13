import {View, Text, Image, TextInput, Pressable} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";

export default function HomeScreen() {

  const [menuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const [isActive, setIsActive]= useState(false)

  return (
    <View className="flex-1 bg-gray-100">
      <View className="flex-row justify-between items-center m-5">
        <Ionicons name="notifications" size={24} color="black" className="mt-24 p-4" onPress={toggleMenu}/>
        <Image source={require("../../../assets/images/Stylings.png")} style={{width: 80 ,marginTop: 90, height: 40, resizeMode: "contain"}} />
        <Ionicons name="menu" size={24} color="black" className="mt-24 p-4" onPress={toggleMenu}/>
      </View>

      <View className="flex ml-2">
      <TextInput 
      placeholder="Recherche ..."
      className="bg-gray-200 rounded-lg p-4 mx-10 mt-2 w-80 h-14 px-10 "
      />
      <Ionicons name="search" size={24} color="black" className=" absolute mt-5 ml-12 z-10  " onPress={toggleMenu}/>
      </View>
      <Text className=" mt-10 text-blue-500 p-2 border-blue-500 border w-20 rounded-lg m-5 text-center font-bold">ALL</Text>
      <View className={`fixed w-52 h-full shadow-slate-500 bg-white -mt-32 z-50 rounded-lg shadow-md p-4 ${menuVisible ? '' : 'invisible'}`}>
        <View className="flex-row justify-end mt-2">
          <Ionicons name="close" size={24} color="black"  onPress={toggleMenu}/>
        </View>

        <View className="mt-4">
          <Text className="text-center font-bold text-lg">Amaka</Text>
          <Text className="text-center font-semibold text-sm">Amaka@gmail.com</Text>
        </View>

        <View className="flex mt-10 gap-10">
          <Link href="/menu/edit">
          <View className="flex flex-row items-center gap-2">
          <Ionicons name="pencil" size={20} color="black" />
          <Text className="text-lg">Modifier Profil</Text>
          </View>
        </Link>

         <Link href="/menu/cart">
         <View className="flex flex-row items-center gap-2">
           <Ionicons name="cart" size={20} color="black" />
           <Text className="text-lg">Cart</Text>
         </View>
        </Link>

         <Link href="/menu/card">
         <View className="flex flex-row items-center gap-2">
          <Ionicons name="card" size={20} color="black" />
          <Text className="text-lg">Carte</Text>
        </View>
        </Link>

         <Link href="/menu/help">
         <View className="flex flex-row items-center gap-2">
          <Ionicons name="help" size={20} color="black" />
          <Text className="text-lg">Aide</Text>
        </View>
        </Link>

         <Link href="/menu/parametre">
          <View className="flex flex-row items-center gap-2">
          <Ionicons name="settings" size={20} color="black " />
          <Text className="text-lg">parametre</Text>
        </View>
        </Link>

         <Link href="/pages/connexion/login">
          <View className="flex flex-row items-center gap-2">
          <Ionicons name="arrow-back" size={20} color="black" />
          <Text className="text-lg">Déconnecté</Text>
        </View>
        </Link>

        </View>
      </View>

      <View className="-mt-[650px]">
        
        <View className="flex flex-col m-4">
          <Link href='#'>
          <Image source={require("../../../assets/images/0.jpeg")} style={{width: 150, height:200}} />
          </Link>
          <View className="py-6 absolute top-56">
          <View>
          <View className="">
            <Text className="">Chemise</Text>
            <Text className="">Chemise</Text>
          </View>
          <Pressable onPress={() => setIsActive(!isActive)}>
          <Ionicons name="heart" size={20} color={isActive ? 'red' : 'white'}   className="-mt-10 ml-32 bg-blue-500 p-1 rounded-full"/>          
          </Pressable>
          </View>
          </View>
          
        </View>

      </View>
    </View>
  );
}
