import { useOrder } from '@/components/order-context';
import { Link } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

const etapes = [
  'Validation',
  'En cours',
  'Livrée',
];

export default function SuivreCommande() {
  const { orders, setOrderStatus } = useOrder();

  // Orders that are not fully confirmed by client
  const activeOrders = useMemo(() => orders.filter(o => o.status !== 'delivered_confirmed'), [orders]);

  if (activeOrders.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.titre}>Suivi de la commande</Text>
        <Text>Aucune commande en cours.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Suivi de la commande</Text>
      <FlatList
        data={activeOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const first = item.items[0];
          const totalQty = item.items.reduce((s, it) => s + it.quantity, 0);
          // Map status to step index
          const currentStep = item.status === 'pending' ? 0 : item.status === 'accepted' ? 1 : 2;
          const showConfirmButtons = item.status === 'delivered_vendor' || item.status === 'delivery_disputed';

          return (
            <View style={styles.card}>
              <Link href="/pages/transaction/recu" style={{ flexDirection: 'row', alignItems: 'center' }}>
                {first?.image ? (
                  typeof first.image === 'string' ? (
                    <Image source={{ uri: first.image }} style={styles.image} />
                  ) : (
                    <Image source={first.image} style={styles.image} />
                  )
                ) : (
                  <View style={[styles.image, { backgroundColor: '#eee' }]} />)
                }
                <View style={styles.info}>
                  <Text style={styles.nom}>{first?.name ?? 'Commande'}</Text>
                  <Text style={styles.quantite}>Quantité totale : {totalQty}</Text>
                </View>
              </Link>

              <View style={styles.etapesContainer}>
                {etapes.map((etape, index) => (
                  <View key={`${item.id}-${etape}`} style={styles.etapeItem}>
                    <View
                      style={[styles.circle, index <= currentStep ? styles.active : styles.inactive]}
                    />
                    <Text style={index <= currentStep ? styles.activeText : styles.inactiveText}>{etape}</Text>
                    {index < etapes.length - 1 && <View style={styles.line} />}
                  </View>
                ))}
              </View>

              {showConfirmButtons && (
                <View style={{ marginTop: 12 }}>
                  <Text style={{ marginBottom: 8 }}>Confirmez-vous la livraison ?</Text>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <Pressable onPress={() => setOrderStatus(item.id, 'delivered_confirmed')} style={[styles.btn, styles.btnPrimary]}>
                      <Text style={styles.btnText}>Livré</Text>
                    </Pressable>
                    <Pressable onPress={() => setOrderStatus(item.id, 'delivery_disputed')} style={[styles.btn, styles.btnDanger]}>
                      <Text style={styles.btnText}>Non livré</Text>
                    </Pressable>
                  </View>
                  {item.status === 'delivery_disputed' && (
                    <View style={{ marginTop: 8 }}>
                      <Text style={{ color: '#a00' }}>Nous vous donnerons une explication d'ici trois jours.</Text>
                      <Pressable onPress={() => setOrderStatus(item.id, 'delivered_confirmed')} style={[styles.btn, styles.btnLink]}>
                        <Text style={[styles.btnText, { color: '#4F46E5' }]}>Changer d'avis: Marquer comme livré</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        }}
      />
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
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
