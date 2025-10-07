import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Image, Pressable, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { searchProducts } from "../../../utils/produit";
import { searchUsers } from "../../../utils/users";
import { Product } from "../../../utils/produit";
import { User } from "../../../utils/users";








export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [productResults, setProductResults] = useState<Product[]>([]);
  const [vendorResults, setVendorResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    const q = searchQuery.trim();
    if (!q) {
      setProductResults([]);
      setVendorResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      // Recherche en parallèle
      const [products, vendors] = await Promise.all([
        searchProducts(q).catch(err => {
          console.warn('Erreur recherche produits:', err);
          return [];
        }),
        searchUsers(q).catch(err => {
          console.warn('Erreur recherche vendeurs:', err);
          return [];
        })
      ]);

      setProductResults(products);
      setVendorResults(vendors);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setProductResults([]);
      setVendorResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce pour la recherche
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSubmitSearch = () => {
    handleSearch(query);
  };

  const showResults = hasSearched;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "flex-start",
        
      }}
    >
      {/* Barre de recherche */}
      <View
      className="ml-6"
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 12,
          paddingHorizontal: 10,
          marginTop: 50,
          width: "90%",
          

        }}
      >
        {/* Icône de recherche */}
        <Ionicons name="search" size={22} color="#888" />

        {/* Input */}
        <TextInput
          style={{
            flex: 1,
            paddingVertical: 8,
            paddingHorizontal: 8,
          }}
          placeholder="Rechercher produit ou vendeur..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />

        {/* Bouton clear (croix) */}
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Ionicons name="close-circle" size={22} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {!showResults && (
        <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
          <Text style={{ color: '#666' }}>Commencez à taper pour lancer une recherche…</Text>
        </View>
      )}

      {/* Section Produits */}
      {showResults && (
        <FlatList
          data={productResults}
          keyExtractor={(item) => `p-${item.id}`}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20 }}
          ListHeaderComponent={() => (
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 16 }}>Produits</Text>
          )}
          ListEmptyComponent={() => (
            <View style={{ paddingVertical: 12 }}>
              <Text>Aucun produit trouvé</Text>
            </View>
          )}
          renderItem={({ item }) => {
            const mainImage = item.productImages && item.productImages.length > 0
              ? item.productImages[0].url
              : null;

            return (
              <Link href={{ pathname: "/pages/view", params: { id: String(item.id), productData: JSON.stringify(item) } }} asChild>
                <Pressable style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10 }}>
                  {mainImage ? (
                    <Image source={{ uri: mainImage }} style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }} />
                  ) : (
                    <View style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12, backgroundColor: '#eee' }} />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: "600" }}>{item.nom}</Text>
                    <Text style={{ color: '#606FEF', marginTop: 2 }}>{item.prix} FCFA</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#888" />
                </Pressable>
              </Link>
            );
          }}
        />
      )}

      {/* Section Vendeurs */}
      {showResults && (
        <FlatList
          data={vendorResults}
          keyExtractor={(item) => `v-${item.id}`}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          ListHeaderComponent={() => (
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 16 }}>Vendeurs</Text>
          )}
          ListEmptyComponent={() => (
            <View style={{ paddingVertical: 12 }}>
              <Text>Aucun vendeur trouvé</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <Link href={{ pathname: "/pages/vendeur/profil", params: { vendeurId: item.id.toString(), vendeurData: JSON.stringify(item) } }} asChild>
              <Pressable style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10 }}>
                {item.photoProfil ? (
                  <Image source={{ uri: item.photoProfil }} style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12 }} />
                ) : (
                  <View style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12, backgroundColor: '#ddd' }} />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.nom}</Text>
                  <Text style={{ color: '#666' }}>{item.email}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#888" />
              </Pressable>
            </Link>
          )}
        />
      )}
      
      <View className="absolute bottom-0 w-full">
      </View>
    </View>
  );
}
