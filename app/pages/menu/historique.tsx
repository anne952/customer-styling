import React, { useMemo, useState, useEffect } from "react";
import { Alert, Image, Pressable, SectionList, Text, View, ActivityIndicator, RefreshControl } from "react-native";
import { getMyOrders, Order } from "../../../utils/orders";
import { Link } from "expo-router";

const monthKey = (iso: string) => {
  const d = new Date(iso);
    return new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(d);
  };

  // Helper to get date safely
  const getDate = (order: Order) => {
    return new Date(order.updatedAt || (order as any).date || order.createdAt);
  };

export default function Historique() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

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

  const sections = useMemo(() => {
    const groups = new Map<string, Order[]>();
    for (const order of orders) {
      const key = monthKey((order as any).date || order.updatedAt);
      const arr = groups.get(key) ?? [];
      arr.push(order);
      groups.set(key, arr);
    }
    // Sort months desc by date
    const sortedKeys = Array.from(groups.keys()).sort((a, b) => {
      // parse year and month using Date from first item in each group
      const aFirst = groups.get(a)![0];
      const bFirst = groups.get(b)![0];
      const aDate = getDate(aFirst);
      const bDate = getDate(bFirst);
      return bDate.getTime() - aDate.getTime();
    });
    return sortedKeys.map((title) => ({ title, data: groups.get(title)! }));
  }, [orders]);


  if (loading) {
    return (
      <View className="flex-1 bg-gray-100 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-2 text-gray-600">Chargement de vos commandes...</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Order }) => {
    const totalAmount = parseFloat(item.montant);
    const statusTranslations: { [key: string]: string } = {
      'en_attente': 'En attente',
      'en_cours_pour_la_livraison': 'En cours de livraison',
      'livree': 'Livrée',
      'annulee': 'Annulée'
    };

    const statusText = statusTranslations[item.status] || item.status;

    return (
      <View className="bg-white rounded-xl p-4 mb-3">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="font-bold text-lg">Commande #{item.id}</Text>
          <Text className={`px-3 py-1 rounded-full text-sm font-semibold ${
            item.status === 'livree' ? 'bg-green-100 text-green-800' :
            item.status === 'annulee' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {statusText}
          </Text>
        </View>

        <View className="mb-2">
          <Text className="text-gray-600 text-sm">
            {getDate(item).toLocaleDateString('fr-FR')}
          </Text>
          {item.localisation && (
            <Text className="text-gray-600 text-sm">{item.localisation}</Text>
          )}
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="font-semibold text-lg">{totalAmount} F</Text>
          <Text className="text-gray-600">
            {item.ligneCommande.reduce((total, ligne) => total + ligne.quantite, 0)} article(s)
          </Text>
        </View>

        <View className="mt-2">
          <Text className="font-medium mb-1">Articles :</Text>
          {item.ligneCommande.map((ligne, index) => (
            <Text key={index} className="text-sm text-gray-600 ml-2">
              • Quantité: {ligne.quantite} - Prix: {parseFloat(ligne.prixUnitaire)} F
            </Text>
          ))}
        </View>

        {/* Bouton Voir le reçu */}
        <View className="mt-3 flex-row justify-center">
          <Link
            href={{
              pathname: '/pages/transaction/recu',
              params: { orderData: JSON.stringify(item) }
            }}
            asChild
          >
            <Pressable className="bg-blue-600 px-4 py-2 rounded-lg">
              <Text className="text-white text-sm font-semibold">Voir le reçu</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    );
  };

  const renderSectionHeader = ({ section }: any) => (
    <Text className="mt-6 mb-2 mx-2 font-bold text-lg capitalize">{section.title}</Text>
  );

  return (
    <View className="flex-1 bg-gray-100 p-4 mt-20">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-2xl font-extrabold">Historique des commandes</Text>
      </View>

      {orders.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 text-lg">Aucune commande trouvée</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3b82f6']}
            />
          }
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}
