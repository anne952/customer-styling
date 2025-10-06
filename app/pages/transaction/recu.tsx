import { useOrder } from "@/components/order-context";
import { Link, useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, Image, StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function ReceiptScreen() {
  const { lastOrder, selectedPaymentMethodId } = useOrder();
  const params = useLocalSearchParams();

  // Check if order data is passed via route params (from suurre-commande or historique)
  const orderDataParam = Array.isArray(params.orderData) ? params.orderData[0] : params.orderData;
  const backendOrder = orderDataParam ? JSON.parse(orderDataParam) : null;

  // Use backend order if available, otherwise fallback to context order
  const currentOrder = backendOrder || lastOrder;

  if (!currentOrder) {
    return (
      <View style={styles.container}>
        {/* Bouton retour */}
        <View style={styles.header}>
          <Link href="/pages/transaction/suvre-commande" style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </Link>
          <Text style={styles.headerTitle}>Reçu</Text>
        </View>

        <View style={styles.emptyContainer}>
          <Text style={styles.sectionTitle}>Aucune commande</Text>
          <Text>Aucune commande n'a été trouvée.</Text>
        </View>
      </View>
    );
  }

  // Handle different order structures (backend vs frontend)
  let products, subtotal, discount, total, paymentLabel;

  if (backendOrder) {
    // Backend order structure
    products = backendOrder.ligneCommande.map((ligne: any) => ({
      id: ligne.produitId,
      name: ligne.produit?.nom || 'Produit',
      quantity: ligne.quantite,
      price: parseFloat(ligne.prixUnitaire),
      image: ligne.produit?.productImages?.[0]?.url
    }));
    subtotal = parseFloat(backendOrder.montant);
    discount = 0; // Backend doesn't track discount separately
    total = parseFloat(backendOrder.montant);

    const statusTranslations: { [key: string]: string } = {
      'tmoney': 'Tmoney',
      'flooz': 'Flooz',
      'mixx': 'Mixx by Yas'
    };
    paymentLabel = backendOrder.payement?.moyenDePayement
      ? statusTranslations[backendOrder.payement.moyenDePayement.toLowerCase()] || backendOrder.payement.moyenDePayement
      : 'Non spécifié';
  } else {
    // Frontend order structure
    products = currentOrder.items;
    subtotal = currentOrder.subtotal;
    discount = currentOrder.discount;
    total = currentOrder.total;
    paymentLabel = currentOrder.paymentMethodId === 'flooz' ? 'Flooz' : currentOrder.paymentMethodId === 'mixx' ? 'Mixx by Yas' : '—';
  }

  return (
    <View style={styles.container}>
      {/* Liste des produits */}
      <Text style={styles.sectionTitle}>Produits achetés</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.productRow}>
            {item.image ? (
              typeof item.image === 'string' ? (
                <Image source={{ uri: item.image }} style={styles.productImage} />
              ) : (
                <Image source={item.image} style={styles.productImage} />
              )
            ) : (
              <View style={[styles.productImage, { backgroundColor: '#eee' }]} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productQty}>Quantité : {item.quantity}</Text>
            </View>
            <Text style={styles.productPrice}>
              {item.price * item.quantity} FCFA
            </Text>
          </View>
        )}
      />

      {/* Compte */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Compte</Text>
        <View style={styles.row}>
          <Text>Sous-total</Text>
          <Text>{subtotal} FCFA</Text>
        </View>
        <View style={styles.row}>
          <Text>Remise</Text>
          <Text>-{discount} FCFA</Text>
        </View>
        <View style={[styles.row, { borderTopWidth: 1, paddingTop: 5 }]}>
          <Text style={{ fontWeight: "bold" }}>Total</Text>
          <Text style={{ fontWeight: "bold" }}>{total} FCFA</Text>
        </View>
      </View>

      {/* Moyen de paiement */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Moyen de paiement</Text>
        <Text style={styles.paymentMethod}>{paymentLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginTop: 0,
    paddingVertical: 60,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 50,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 18,
  },
  productImage: {
    width: 60,
    height: 60,
    marginRight: 12,
    borderRadius: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
  },
  productQty: {
    fontSize: 14,
    color: "#666",
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  paymentMethod: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2a7",
  },
});
