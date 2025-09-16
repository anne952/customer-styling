import { useOrder } from '@/components/order-context';
import { Link } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const etapes = [
  'Validation',
  'En cours',
  'Livrée',
];

export default function SuivreCommande() {
  const { lastOrder } = useOrder();

  if (!lastOrder) {
    return (
      <View style={styles.container}>
        <Text style={styles.titre}>Suivi de la commande</Text>
        <Text>Aucune commande en cours.</Text>
      </View>
    );
  }

  const first = lastOrder.items[0];
  const totalQty = lastOrder.items.reduce((s, it) => s + it.quantity, 0);
  const currentStep = 1; // Exemple: après paiement, "En cours"

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Suivi de la commande</Text>
      <Link href="/pages/transaction/recu" style={styles.card}>
        {first?.image ? (
          typeof first.image === 'string' ? (
            <Image source={{ uri: first.image }} style={styles.image} />
          ) : (
            <Image source={first.image} style={styles.image} />
          )
        ) : (
          <View style={[styles.image, { backgroundColor: '#eee' }]} />
        )}
        <View style={styles.info}>
          <Text style={styles.nom}>{first?.name ?? 'Commande'}</Text>
          <Text style={styles.quantite}>Quantité totale : {totalQty}</Text>
        </View>
      </Link>
      
      <View style={styles.etapesContainer}>
        {etapes.map((etape, index) => (
          <View key={etape} style={styles.etapeItem}>
            <View
              style={[styles.circle, index <= currentStep ? styles.active : styles.inactive]}
            />
            <Text style={index <= currentStep ? styles.activeText : styles.inactiveText}>{etape}</Text>
            {index < etapes.length - 1 && <View style={styles.line} />}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFF',
    padding: 20,
    marginTop: 50,
  },
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 40,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  nom: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  quantite: {
    fontSize: 16,
    color: '#555',
  },
  etapesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  
  },
  etapeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    marginRight: 6,
  },
  active: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  inactive: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  activeText: {
    color: '#4F46E5',
    fontWeight: 'bold',
    marginRight: 10,
  },
  inactiveText: {
    color: '#aaa',
    marginRight: 10,
  },
  line: {
    width: 30,
    height: 2,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
});
