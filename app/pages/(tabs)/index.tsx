import CartProduit from "@/components/cart-produit";
import CartProduits from "@/constant/cartProduit";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Image, ScrollView, Text, TextInput, View } from "react-native";
import Nav from "@/components/nav";

export default function HomeScreen() {
  const router = useRouter();

  const [menuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <View className="flex-1 bg-gray-100">
       <View className="flex-row justify-center items-center -mt-10">
        <Image source={require("../../../assets/images/Stylings.png")} style={{width: 80 ,marginTop: 90, height: 40, resizeMode: "contain"}} />
      </View>
      <ScrollView>


      <Text className=" mt-1p-2 underline  rounded-lg m-5  font-bold">Pour tous</Text>
   
      <View className="">
        
        <FlatList 
        data={CartProduits}
        scrollEnabled={false}
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          marginHorizontal: -8, 
          marginLeft: 8
        }}
         keyExtractor={(item)=>
          item.id.toString()}
          renderItem={({item})=>(
          <CartProduit
          key={item.id}
          id={item.id}
          name={item.name}
          prixPromo={item.prixPromo?? 0}
          image={item.image}
          prix={item.Prix}
          onPress={() => router.push({ pathname: "/pages/view", params: { id: String(item.id) }})}
          onOpen={() => router.push({ pathname: "/pages/view", params: { id: String(item.id) }})}
          />
        )}        
        />
  
      </View>
      </ScrollView>
  
    </View>
  );
}
