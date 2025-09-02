import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Nav from "@/components/nav";









export default function SearchScreen() {
  const [query, setQuery] = useState("");

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
        />

        {/* Bouton clear (croix) */}
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Ionicons name="close-circle" size={22} color="#888" />
          </TouchableOpacity>
        )}
      </View>
      
      <View className="absolute bottom-0 w-full">
      </View>
    </View>
  );
}
