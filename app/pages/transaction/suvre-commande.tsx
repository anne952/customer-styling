import React, { useState, useEffect } from 'react';
import { Alert, FlatList, Text, View, ActivityIndicator, RefreshControl, StyleSheet, Pressable } from 'react-native';
import { getMyOrders, Order } from '../../../utils/orders';
import { Link } from 'expo-router';

const etapes = [
  'Validation',
  'En cours',
  'Livrée',
];

export default function SuivreCommande() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const fetchedOrders = await getMyOrders();
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      Alert.alert('Erreur', 'Impossible de charger vos commandes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  // Filter orders that are not delivered
  const activeOrders = orders.filter(order => order.status !== 'livree' && order.status !== 'annulee');

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.titre}>Suivi de la commande</Text>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={{ marginTop: 10 }}>Chargement de vos commandes...</Text>
        </View>
      </View>
    );
  }

  if (activeOrders.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.titre}>Suivi de la commande</Text>
        <Text style={{ textAlign: 'center', fontSize: 16, marginTop: 20 }}>Aucune commande en cours.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Suivi de la commande</Text>
      <FlatList
        data={activeOrders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const totalAmount = parseFloat(item.montant);
          const statusTranslations: { [key: string]: string } = {
            'en_attente': 'En attente',
            'en_cours_pour_la_livraison': 'En cours de livraison',
            'livree': 'Livrée',
            'annulee': 'Annulée'
          };
          const statusText = statusTranslations[item.status] || item.status;

          // Map API status to step index
          let currentStep = 0;
          if (item.status === 'en_cours_pour_la_livraison') {
            currentStep = 1;
          } else if (item.status === 'livree') {
            currentStep = 2;
          }

          const totalQty = item.ligneCommande.reduce((total, ligne) => total + ligne.quantite, 0);

          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.nom}>Commande #{item.id}</Text>
                <Text style={[styles.status, getStatusStyle(item.status)]}>{statusText}</Text>
              </View>

              <View style={styles.cardInfo}>
                <Text style={styles.date}>Date: {new Date(item.createdAt || (item as any).date).toLocaleDateString('fr-FR')}</Text>
                <Text style={styles.montant}>{totalAmount} F</Text>
                <Text style={styles.quantite}>Quantité totale : {totalQty} article(s)</Text>
              </View>

              <View style={styles.etapesContainer}>
                {etapes.map((etape, index) => (
                  <View key={`${item.id}-${index}`} style={styles.etapeItem}>
                    <View
                      style={[styles.circle, index <= currentStep ? styles.active : styles.inactive]}
                    />
                    <Text style={index <= currentStep ? styles.activeText : styles.inactiveText}>{etape}</Text>
                    {index < etapes.length - 1 && <View style={styles.line} />}
                  </View>
                ))}
              </View>

              {/* Bouton Voir le reçu */}
              <View style={styles.receiptButtonContainer}>
                <Link
                  href={{
                    pathname: '/pages/transaction/recu',
                    params: { orderData: JSON.stringify(item) }
                  }}
                  asChild
                >
                  <Pressable style={[styles.btn, styles.btnPrimary]}>
                    <Text style={styles.btnText}>Voir le reçu</Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          );
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3b82f6']}
          />
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

// Helper function for status styling
const getStatusStyle = (status: string) => {
  switch (status) {
    case 'en_attente':
      return styles.statusPending;
    case 'en_cours_pour_la_livraison':
      return styles.statusInProgress;
    case 'livree':
      return styles.statusDelivered;
    case 'annulee':
      return styles.statusCancelled;
    default:
      return styles.statusPending;
  }
};

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
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  statusInProgress: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
  },
  statusDelivered: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  statusCancelled: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  cardInfo: {
    marginBottom: 12,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  montant: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
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
    marginTop: 12,
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
  receiptButtonContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnPrimary: { backgroundColor: '#4F46E5' },
  btnDanger: { backgroundColor: '#b91c1c' },
  btnLink: { marginTop: 8, backgroundColor: 'transparent' },
  btnText: { color: '#fff', fontWeight: '600' },
});
