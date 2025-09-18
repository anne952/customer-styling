import CartProduit from '@/components/cart-produit'
import CartProduits from '@/constant/cartProduit'
import { Ionicons } from '@expo/vector-icons'
import { Link, router } from 'expo-router'
import { FlatList, Text, View } from 'react-native'

export default function Profil() {
  return (
    <View className='flex-1 bg-white'>
      <FlatList
        data={CartProduits}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingBottom: 24, paddingTop: 16 }}
        ListHeaderComponent={() => (
          <View className='p-4'>
            {/* Bouton retour */}
            <View className="absolute left-4 top-4 z-10">
              <Link href="/pages/(tabs)" className="bg-black/60 w-10 h-10 p-2 rounded-full items-center justify-center">
                <Ionicons name="chevron-back-outline" size={22} color="white"/>
              </Link>
            </View>

            {/* Informations du profil */}
            <View className='mt-10'>
              <Text className="text-center font-bold text-lg">Shooda fashion</Text>
              <Text className="text-center text-blue-500">ShoodaFashion@gmail.com</Text>

              {/* Statistiques */}
              <View className='flex-row justify-between mt-6 w-64 mx-auto'>
                <View className="items-center">
                  <Text className='font-bold text-blue-500 text-center'>0</Text>
                  <Text className='text-md'>Like</Text>
                </View>
                <View className="items-center">
                  <Text className='font-bold text-blue-500 text-center'>0</Text>
                  <Text className='text-md'>Publication</Text>
                </View>
              </View>

              {/* Section Publications */}
              <Text className='text-lg font-bold mt-6 mb-2 text-center'>Publications</Text>
            </View>
          </View>
        )}
        renderItem={({ item }) => (
          <View className="w-[48%] mb-4">
            <CartProduit
              key={item.id}
              id={item.id}
              name={item.name}
              prixPromo={item.prixPromo ?? 0}
              image={item.image}
              prix={item.Prix}
              onPress={() => router.push({ pathname: "/pages/view", params: { id: String(item.id) }})}
              onOpen={() => router.push({ pathname: "/pages/view", params: { id: String(item.id) }})}
            />
          </View>
        )}
      />
    </View>
  )
}