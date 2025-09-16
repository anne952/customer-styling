import { useCart } from "@/components/cart-context";
import { useOrder } from "@/components/order-context";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function PaymentCodeScreen() {
  const [pin, setPin] = useState("");
  const router = useRouter();
  const { items, clearCart, totalCount } = useCart();
  const { placeOrder } = useOrder();

  const handleContinue = () => {
    if (totalCount === 0) {
      return; // Ne rien faire si panier vide
    }
    placeOrder({ items, discount: 0 });
    clearCart();
    router.push("/pages/transaction/payement-succes");
  };

  return (
    <View style={styles.container} className="mt-10">
      {/* Bouton retour */}
      
        <Link href="/pages/transaction/payement" style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
         </Link>
            
      
     

      {/* Texte instruction */}
      <Text style={styles.title}>Entrez votre code PIN</Text>

      {totalCount === 0 && (
        <Text style={{ textAlign: 'center', color: '#c00', marginBottom: 10 }}>Panier vide: retournez au panier pour ajouter des articles.</Text>
      )}

      {/* Input PIN */}
      <TextInput
        style={styles.input}
        value={pin}
        onChangeText={setPin}
        placeholder="****"
        keyboardType="numeric"
        secureTextEntry
        maxLength={6} // Exemple code PIN sur 6 chiffres
      />

      {/* Bouton continuer */}
      <TouchableOpacity style={[styles.button, totalCount === 0 && { backgroundColor: '#ccc' }]} onPress={handleContinue} disabled={totalCount === 0}>
        <Text style={styles.buttonText} className="text-center">Continuer</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    padding: 20,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    fontSize: 20,
    textAlign: "center",
    letterSpacing: 10,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#606FEF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    textAlign:'center'
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign:'center'
    
  },
});
