import CartProduits from "@/constant/cartProduit";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, Image, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";








export default function SearchScreen() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CartProduits;
    return CartProduits.filter((p) => p.name?.toLowerCase().includes(q));
  }, [query]);

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
          placeholder="Rechercher..."
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          autoCapitalize="none"
        />

        {/* Bouton clear (croix) */}
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Ionicons name="close-circle" size={22} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {/* Résultats */}
      <FlatList
        data={results}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 }}
        ListEmptyComponent={() => (
          <View style={{ padding: 24 }}>
            <Text>Aucun résultat</Text>
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
      
      <View className="absolute bottom-0 w-full">
      </View>
    </View>
  );
}
