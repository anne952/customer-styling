import CartProduits from "@/constant/cartProduit";
import React, { useMemo, useState } from "react";
import { Alert, Image, Pressable, SectionList, Text, View } from "react-native";

type OrderItem = {
  id: string;
  productId: number;
  quantity: number;
  date: string; // ISO date
};

// Temp data to demonstrate UI; replace with real persisted history later
const SAMPLE_HISTORY: OrderItem[] = [
  { id: "o1", productId: 1, quantity: 2, date: new Date().toISOString() },
  { id: "o2", productId: 2, quantity: 1, date: new Date().toISOString() },
  { id: "o3", productId: 3, quantity: 3, date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString() },
  { id: "o4", productId: 1, quantity: 1, date: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString() },
];

const monthKey = (iso: string) => {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(d);
};

export default function Historique() {
  const produitsArray = (CartProduits as unknown) as any[];
  const [history, setHistory] = useState<OrderItem[]>(SAMPLE_HISTORY);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const sections = useMemo(() => {
    const groups = new Map<string, OrderItem[]>();
    for (const it of history) {
      const key = monthKey(it.date);
      const arr = groups.get(key) ?? [];
      arr.push(it);
      groups.set(key, arr);
    }
    // Sort months desc by date
    const sortedKeys = Array.from(groups.keys()).sort((a, b) => {
      // parse year and month using Date from first item in each group
      const aFirst = groups.get(a)![0];
      const bFirst = groups.get(b)![0];
      return new Date(bFirst.date).getTime() - new Date(aFirst.date).getTime();
    });
    return sortedKeys.map((title) => ({ title, data: groups.get(title)! }));
  }, [history]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const clearAll = () => {
    Alert.alert("Supprimer tout", "Voulez-vous supprimer tout l'historique ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: () => {
        setHistory([]);
        setSelectedIds(new Set());
      }},
    ]);
  };

  const deleteSelected = () => {
    if (selectedIds.size === 0) return;
    Alert.alert("Supprimer sélection", `Supprimer ${selectedIds.size} élément(s) ?`, [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: () => {
        setHistory((prev) => prev.filter((it) => !selectedIds.has(it.id)));
        setSelectedIds(new Set());
      }},
    ]);
  };

  const renderItem = ({ item }: { item: OrderItem }) => {
    const produit = produitsArray.find((p) => p?.id === item.productId);
    if (!produit) return null;
    const prix: number = produit?.Prix ?? 0;
    const prixPromo: number | undefined = produit?.prixPromo;
    const image: any = produit?.image;
    const isSelected = selectedIds.has(item.id);
    return (
      <Pressable onPress={() => toggleSelect(item.id)} className={`flex flex-row bg-white rounded-xl p-3 mb-3 items-center ${isSelected ? 'border-2 border-blue-500' : ''}`}>
        {image && (
          <Image source={image} style={{ width: 64, height: 64, borderRadius: 8 }} resizeMode="cover" />
        )}
        <View className="ml-4 flex-1">
          <Text className="font-bold text-base">{produit?.name}</Text>
          {typeof prixPromo !== "undefined" && (
            <Text className="line-through text-gray-400">{prixPromo} F</Text>
          )}
          <Text className="font-semibold">{prix} F</Text>
        </View>
        <View className="items-end">
          <Text className="text-sm text-gray-600">Qté</Text>
          <Text className="text-center font-semibold text-lg">{item.quantity}</Text>
          <View style={{ width: 18, height: 18, borderRadius: 4, borderWidth: 2, borderColor: isSelected ? '#2563eb' : '#cbd5e1', marginTop: 6, backgroundColor: isSelected ? '#2563eb' : 'transparent' }} />
        </View>
      </Pressable>
    );
  };

  const renderSectionHeader = ({ section }: any) => (
    <Text className="mt-6 mb-2 mx-2 font-bold text-lg capitalize">{section.title}</Text>
  );

  return (
    <View className="flex-1 bg-gray-100 p-4 mt-20">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-2xl font-extrabold">Historique</Text>
       <View className="flex-row gap-2">
          <Pressable onPress={deleteSelected} disabled={selectedIds.size === 0} className={`${selectedIds.size === 0 ? 'bg-gray-300' : 'bg-red-500'} px-3 py-2 rounded-lg`}>
            <Text className="text-white font-semibold">Supprimer </Text>
          </Pressable>
          <Pressable onPress={clearAll} className="px-3 py-2 rounded-lg bg-red-600">
            <Text className="text-white font-semibold">Tout supprimer</Text>
          </Pressable>
        </View>

      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}


