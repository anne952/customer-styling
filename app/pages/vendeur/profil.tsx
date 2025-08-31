import {View, Text, ScrollView, FlatList} from 'react-native'
import { Link, router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import CartProduit from '@/components/cart-produit'
import CartProduits from '@/constant/cartProduit'






export default function Profil() {
  return (
    <View className='flex-1 bg-white p-6'>
      <View className='mt-4'>
            <Link href="/pages/home" className="bg-blue-500 w-10 h-10 m-5 p-1 rounded-md mt-10">
            <Ionicons name="chevron-back-outline" size={24} color="white"/>
            </Link>        
            <Text className="text-lg  m-4 text-center">Shooda fashion</Text>
            <Text className="text-lg  text-center font-bold">ShoodaFashion@gmail.com</Text>

            <View className='flex-row justify-between mt-10 w-80 text-center mx-auto'>
                <View>
                    <Text className='incrementation text-center text-blue-500'>0</Text>
                    <Text className='text-center '>Like</Text>
                </View>
                <View>
                    <Text className='incrementation text-center text-blue-500'>0</Text>
                    <Text className='text-center'>Publication</Text>
                </View>
                </View>
                <Text className='underline mt-2 p-2'>Publication</Text>


 <ScrollView>   
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

      </View>
    
  )
}
