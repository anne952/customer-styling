import CartProduits from "@/constant/cartProduit";
import Vendors from "@/constant/vendors";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, Image, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";








export default function SearchScreen() {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();

  const productResults = useMemo(() => {
    if (!q) return [] as typeof CartProduits;
    return CartProduits.filter((p) => p.name?.toLowerCase().includes(q));
  }, [q]);

  const vendorResults = useMemo(() => {
    if (!q) return [] as typeof Vendors;
    return Vendors.filter((v) => v.name.toLowerCase().includes(q) || v.email.toLowerCase().includes(q));
  }, [q]);

  const showResults = q.length > 0;

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
          renderItem={({ item }) => (
            <Link href={{ pathname: "/pages/view", params: { id: String(item.id) } }} asChild>
              <Pressable style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10 }}>
                {item.image ? (
                  typeof item.image === 'string' ? (
                    <Image source={{ uri: item.image }} style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }} />
                  ) : (
                    <Image source={item.image} style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }} />
                  )
                ) : (
                  <View style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12, backgroundColor: '#eee' }} />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: "600" }}>{item.name}</Text>
                  {typeof item.Prix !== 'undefined' && (
                    <Text style={{ color: '#606FEF', marginTop: 2 }}>{item.Prix} FCFA</Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color="#888" />
              </Pressable>
            </Link>
          )}
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
            <Link href={{ pathname: "/pages/vendeur/profil", params: { id: item.id } }} asChild>
              <Pressable style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10 }}>
                {item.avatar ? (
                  <Image source={{ uri: item.avatar }} style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12 }} />
                ) : (
                  <View style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12, backgroundColor: '#ddd' }} />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
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
