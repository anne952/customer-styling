import CartProduit from "@/components/cart-produit";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { FlatList, Image, ScrollView, Text, View, ActivityIndicator, RefreshControl } from "react-native";
import { getProducts, Product } from "../../../utils/produit";

export default function HomeScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async () => {
    try {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-100 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-2 text-gray-600">Chargement des produits...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <View className="flex-row justify-center items-center -mt-10">
        <Image source={require("../../../assets/fonts/mini logo.png")} style={{width: 80 ,marginTop: 90, height: 40, resizeMode: "contain"}} />
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3b82f6']}
          />
        }
      >
        <Text className="mt-1 p-2 underline rounded-lg m-5 font-bold">Produits disponibles</Text>

        {products.length === 0 ? (
          <View className="items-center justify-center py-8">
            <Text className="text-gray-500 text-lg">Aucun produit disponible</Text>
          </View>
        ) : (
          <FlatList
            data={products}
            scrollEnabled={false}
            contentContainerStyle={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              marginHorizontal: -8,
              marginLeft: 8
            }}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item}) => {
              // Récupérer la première image du produit
              const mainImage = item.productImages.length > 0 ? { uri: item.productImages[0].url } : undefined;

              return (
                <CartProduit
                  key={item.id}
                  id={item.id}
                  name={item.nom}
                  prixPromo={0} // Pas de prix promo pour l'instant
                  image={mainImage}
                  prix={parseFloat(item.prix)}
                  onPress={() => router.push({
                    pathname: "/pages/view",
                    params: {
                      id: String(item.id),
                      productData: JSON.stringify(item) // Passer le produit complet
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
              );
            }}
          />
        )}
      </ScrollView>
    </View>
  );
}
