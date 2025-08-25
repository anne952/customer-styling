import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { useUser } from './user-context';



export default function SideMenu() {
  const { user } = useUser();
  return (
    <View
      className={`fixed mt-20   p-4`}
    >
  

      {/* Infos utilisateur */}
      <View className="mt-4">
        <Text className="text-center font-bold text-lg">{user.name}</Text>
        <Text className="text-center font-semibold text-sm">{user.email}</Text>
      </View>

      {/* Liens du menu */}
      <View className="flex mt-20 gap-10 p-6">
        <Link href="/pages/menu/edit">
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="pencil" size={20} color="black" />
            <Text className="text-lg">Modifier Profil</Text>
          </View>
        </Link>


        <Link href="/pages/transaction/historique">
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="reload-outline" size={20} color="black" />
            <Text className="text-lg">Historique</Text>
          </View>
        </Link>


        <Link href="/pages/transaction/suvre-commande">
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="cube-outline" size={20} color="black" />
            <Text className="text-lg">Suivre la commande</Text>
          </View>
        </Link>


        <Link href="/pages/menu/help">
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="help" size={20} color="black" />
            <Text className="text-lg">Aide</Text>
          </View>
        </Link>

        <Link href="/pages/menu/parametre">
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="settings" size={20} color="black" />
            <Text className="text-lg">Paramètre</Text>
          </View>
        </Link>

        <Link href="/pages/connexion/login">
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="arrow-back" size={20} color="black" />
            <Text className="text-lg">Déconnecté</Text>
          </View>
        </Link>
      </View>
    </View>
  );
}
