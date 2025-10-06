import { useCart } from "@/components/cart-context";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { createOrder, CreateOrderData, CreateOrderResult } from "../../../utils/orders";

export default function PaymentCodeScreen() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { items, clearCart, totalCount, totalPrice } = useCart();

  const handleContinue = async () => {
    console.log('[PAYMENT] Submit pressed');
    // Validation simple du PIN (au moins 1 caractère)
    if (!pin || pin.length === 0) {
      console.log('[PAYMENT] PIN missing');
      Alert.alert("Erreur", "Veuillez entrer votre code PIN");
      return;
    }

    if (totalCount === 0) {
      console.log('[PAYMENT] Cart empty');
      Alert.alert("Erreur", "Votre panier est vide");
      return;
    }

    // Empêcher les clics multiples
    if (loading) return;

    setLoading(true);

    try {
      console.log('[PAYMENT] Building order payload...');
      // Convertir les items du panier au format attendu par l'API
      const orderItems = items.map(item => ({
        produitId: item.produitId,
        quantite: item.quantity,
        prixUnitaire: item.price.toString()
      }));

      const orderData: CreateOrderData = {
        items: orderItems,
        payement: {
          montant: totalPrice.toString(),
          moyenDePayement: "Tmoney"  // ou "Flooz" selon ce qui a été sélectionné
        }
      };

      console.log('[PAYMENT] Creating order with data:', orderData);
      const result: CreateOrderResult = await createOrder(orderData);
      console.log('[PAYMENT] Order created result:', result);

      // Vérifier le statut de la réponse
      if (result.status === 201) {
        console.log('[PAYMENT] Order created successfully with status 201');
      } else {
        console.log('[PAYMENT] Invalid status:', result.status);
        Alert.alert("Erreur", "Échec création commande");
        return;
      }

      // Vérifier si la commande a été créée (présence d'id)
      if (!result.order || !result.order.id) {
        console.log('[PAYMENT] Invalid result, no id found:', result);
        Alert.alert("Erreur", "Échec création commande");
        return;
      }

      console.log('[PAYMENT] Order created OK. Order id:', result.order.id);

      // Maintenant naviguer vers le succès
      console.log('[PAYMENT] Clearing cart and navigating to success...');
      clearCart();
      try {
        router.push("/pages/transaction/payement-succes");
        console.log('[PAYMENT] Navigation to success triggered');
      } catch (navErr) {
        console.log('[PAYMENT] Navigation error:', navErr);
      }

    } catch (error: any) {
      console.error('[PAYMENT] Order creation error:', error);
      Alert.alert(
        "Erreur",
        error.message || "Impossible de créer la commande. Veuillez réessayer."
      );

      // Même en cas d'erreur, essayer de naviguer si on pense que ça a marché côté serveur
      // Mais pour l'instant, on reste sur la page en cas d'erreur
    } finally {
      console.log('[PAYMENT] Finalizing (setLoading false)');
      setLoading(false);
    }
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
      <TouchableOpacity
        style={[styles.button, (totalCount === 0 || loading) && { backgroundColor: '#ccc' }]}
        onPress={handleContinue}
        disabled={totalCount === 0 || loading}
      >
        {loading ? (
          <>
            <ActivityIndicator color="#fff" size="small" />
            <Text style={[styles.buttonText, { marginLeft: 10 }]}>Traitement...</Text>
          </>
        ) : (
          <Text style={styles.buttonText} className="text-center">Continuer</Text>
        )}
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
