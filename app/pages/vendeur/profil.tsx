import CartProduit from '@/components/cart-produit'
import { Ionicons } from '@expo/vector-icons'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import { FlatList, Text, View, ActivityIndicator, Pressable, Alert, Platform, Image } from 'react-native'
import { Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getProductsByVendeurPublic } from '../../../utils/produit'
import { Product } from '../../../utils/produit'

export default function Profil() {
  const params = useLocalSearchParams();
  const router = useRouter();

  // Helper functions for email and phone actions
  const handleEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert('Erreur', 'Impossible d\'ouvrir l\'application email');
    });
  };

  const handlePhonePress = async (phoneNumber: string) => {
    Alert.alert(
      'Contacter par téléphone',
      phoneNumber,
      [
        {
          text: 'Appeler',
          onPress: () => {
            Linking.openURL(`tel:${phoneNumber}`).catch(() => {
              Alert.alert('Erreur', 'Impossible de passer l\'appel');
            });
          },
        },
        {
          text: 'WhatsApp',
          onPress: () => {
            Linking.openURL(`whatsapp://send?phone=${phoneNumber}`).catch(() => {
              Alert.alert('Erreur', 'WhatsApp n\'est pas installé ou numéro invalide');
            });
          },
        },
        {
          text: 'Annuler',
          style: 'cancel',
        },
      ]
    );
  };

  const vendeurId = params.vendeurId ? parseInt(params.vendeurId as string) : null;
  const vendeurDataParam = params.vendeurData ? (params.vendeurData as string) : null;

  const [vendeur, setVendeur] = useState<any>(null);
  const [vendeurLoading, setVendeurLoading] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    // First, try to use vendeurData passed from navigation
    if (vendeurDataParam) {
      try {
        const vendeurData = JSON.parse(vendeurDataParam);
        setVendeur(vendeurData);
        setVendeurLoading(false);
      } catch (error) {
        console.error('Erreur parsing vendeurData:', error);
        setVendeurLoading(false);
      }
    } else {
      setVendeurLoading(false);
    }

    // Load products if vendeurId is available
    if (vendeurId) {
      const loadProducts = async () => {
        try {
          const productsData = await getProductsByVendeurPublic(vendeurId);
          setProducts(productsData);
        } catch (error) {
          console.error('Erreur chargement produits vendeur:', error);
        } finally {
          setProductsLoading(false);
        }
      };
      loadProducts();
    } else {
      setProductsLoading(false);
    }
  }, [vendeurId, vendeurDataParam]);

  if (vendeurLoading || productsLoading) {
    return (
      <View className='flex-1 bg-white justify-center items-center'>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Chargement du profil...</Text>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-white'>
      <FlatList
        data={products}
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
            <View className='mt-10 px-4'>
              {/* Photo de profil */}
              <View className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 items-center justify-center overflow-hidden border-2 border-blue-200">
                {vendeur?.photoProfil ? (
                  <Image
                    source={{ uri: vendeur.photoProfil }}
                    className="w-24 h-24 rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="person" size={32} color="#666" />
                )}
              </View>

              <Text className="text-center font-bold text-xl text-gray-800">{vendeur?.nom || "Vendeur"}</Text>

              {/* Informations de contact */}
              <View className="mt-4 space-y-1">
                {vendeur?.email && (
                  <Pressable
                    onPress={() => handleEmailPress(vendeur.email)}
                    className="items-center"
                  >
                    <View className="flex-row items-center">
                      <Ionicons name="mail" size={16} color="#2563eb" />
                      <Text className="ml-1 text-blue-600 font-medium underline">
                        {vendeur.email}
                      </Text>
                    </View>
                  </Pressable>
                )}
                {vendeur?.telephone && (
                  <Pressable
                    onPress={() => handlePhonePress(vendeur.telephone)}
                    className="items-center mt-2"
                  >
                    <View className="flex-row items-center">
                      <Ionicons name="call" size={16} color="#16a34a" />
                      <Text className="ml-1 text-green-600 font-medium underline">
                        {vendeur.telephone}
                      </Text>
                    </View>
                  </Pressable>
                )}
                {vendeur?.specialite && vendeur.specialite.length > 0 && (
                  <Text className="text-center text-gray-600 mt-2">
                    Spécialité(s): {vendeur.specialite.join(', ')}
                  </Text>
                )}
                {vendeur?.typeCouture && vendeur.typeCouture.length > 0 && (
                  <Text className="text-center text-gray-600">
                    Type(s) de couture: {vendeur.typeCouture.join(', ')}
                  </Text>
                )}
                {vendeur?.localisation && (
                  <Text className="text-center text-gray-600">
                    📍 {vendeur.localisation}
                  </Text>
                )}
                {vendeur?.commentaire && (
                  <Text className="text-center text-gray-600 italic mt-2">
                    "{vendeur.commentaire}"
                  </Text>
                )}
              </View>

              {/* Statistiques */}
              <View className='flex-row justify-between mt-6 w-64 mx-auto'>
                <View className="items-center">
                  <Text className='font-bold text-blue-500 text-center'>0</Text>
                  <Text className='text-md text-gray-600'>Like</Text>
                </View>
                <View className="items-center">
                  <Text className='font-bold text-blue-500 text-center'>{products.length}</Text>
                  <Text className='text-md text-gray-600'>Publication</Text>
                </View>
              </View>

              {/* Section Publications */}
              <Text className='text-lg font-bold mt-6 mb-2 text-center text-gray-800'>Publications</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center py-16">
            <Text className="text-gray-500 text-center">Aucun produit disponible</Text>
          </View>
        )}
        renderItem={({ item }) => {
          const mainImage = item.productImages && item.productImages.length > 0
            ? { uri: item.productImages[0].url }
            : undefined;

          return (
            <View className="w-[48%] mb-4">
              <CartProduit
                key={item.id}
                id={item.id}
                name={item.nom}
                prixPromo={0} // Pas de promotion dans l'API actuelle
                image={mainImage}
                prix={parseFloat(item.prix)}
                onPress={() => router.push({
                  pathname: "/pages/view",
                  params: {
                    id: String(item.id),
                    productData: JSON.stringify(item)
                  }
                })}
                onOpen={() => router.push({
                  pathname: "/pages/view",
                  params: {
                    id: String(item.id),
                    productData: JSON.stringify(item)
                  }
                })}
              />
            </View>
          );
        }}
      />
    </View>
  )
}
