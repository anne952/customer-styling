import { useCart } from "@/components/cart-context";
import { useOrder } from "@/components/order-context";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";

type PaymentMethod = {
  id: "Tmoney" | "Flooz";
  name: string;
  image: string;
};

export default function ChoosePaymentScreen() {
  const { selectedPaymentMethodId, setSelectedPaymentMethod } = useOrder();
  const { totalCount, totalPrice } = useCart();

  const paymentMethods: PaymentMethod[] = [
    { id: "Tmoney", name: "Tmoney", image: "https://via.placeholder.com/60" },
    { id: "Flooz", name: "Flooz", image: "https://via.placeholder.com/60" },
  ];

  const handlePaymentSelection = (paymentMethod: "Tmoney" | "Flooz") => {
    setSelectedPaymentMethod(paymentMethod);
    // On peut stocker le choix dans AsyncStorage ou contexte si nécessaire
  };

  if (totalCount === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]} className="mt-16">
        <Link href="/pages/(tabs)/cart" style={styles.backLink}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </Link>
        <Text style={[styles.title, { marginBottom: 10 }]}>Votre panier est vide</Text>
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>Ajoutez des articles au panier avant de procéder au paiement.</Text>
        <Link href="/pages/(tabs)/cart" style={styles.button}>
          <Text style={styles.buttonText}>Aller au panier</Text>
        </Link>
      </View>
    );
  }

  return (
    <View style={styles.container} className="mt-16">
      {/* Bouton retour */}
      <Link href="/pages/(tabs)/cart" style={styles.backLink}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </Link>

      {/* Titre */}
      <Text style={styles.title}>Choisir un moyen de paiement</Text>

      {/* Liste des moyens de paiement */}
      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={styles.paymentRow}
          onPress={() => handlePaymentSelection(method.id)}
        >
          <Image source={{ uri: method.image }} style={styles.paymentImage} />
          <Text style={styles.paymentName}>{method.name}</Text>
          <View style={styles.radioOuter}>
            {selectedPaymentMethodId === method.id && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>
      ))}

      {/* Bouton continuer (link vers la page suivante) */}
      {selectedPaymentMethodId ? (
        <Link href="/pages/transaction/code-payement" style={styles.button}>
          <Text style={styles.buttonText}>Continuer</Text>
        </Link>
      ) : (
        <View style={[styles.button, { backgroundColor: "#ccc" }]}>
          <Text style={styles.buttonText}>Sélectionnez un moyen de paiement</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, },
  backLink: { marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 30, textAlign: "center" },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
  },
  paymentImage: { width: 60, height: 60, borderRadius: 8, marginRight: 15 },
  paymentName: { flex: 1, fontSize: 16, fontWeight: "600" },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#606FEF",
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#606FEF",
  },
  button: {
    backgroundColor: "#606FEF",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
    textAlign: "center"
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" , textAlign:"center"},
})
