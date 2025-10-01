import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Alert, BackHandler, Image, Platform, Pressable, Text, View } from 'react-native';
import { useUser } from './user-context';



export default function SideMenu() {
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Se déconnecter',
      "Voulez-vous vous déconnecter ?",
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'OK',
          style: 'destructive',
          onPress: () => {
            router.replace('/pages/connexion/login');
            if (Platform.OS === 'android') {
              setTimeout(() => BackHandler.exitApp(), 200);
            }
          },
        },
      ]
    );
  };

  return (
    <View
      className={`fixed mt-20   p-4`}
    >
      <View className='flex items-center '>
      <View className="relative">
        <Pressable accessibilityRole="imagebutton" onPress={() => { /* navigation handled by Link below */ }}>
          <Image source={user.photoUri ? { uri: user.photoUri } : { uri: "https://via.placeholder.com/150" }} className="photo de profil w-16 h-16 rounded-full border-2 border-blue-500 mt-2 ml-2" />
        </Pressable>
        <Link href="/pages/menu/edit" asChild>
          <Pressable className="absolute right-0 -bottom-1 bg-blue-500 w-6 h-6 rounded-full items-center justify-center">
            <Ionicons name="pencil" size={12} color="white" />
          </Pressable>
        </Link>
      </View>

      {/* Infos utilisateur */}
      <View className="mt-4">
        <Text className="text-center font-bold text-lg">{user.name}</Text>
        <Text className="text-center font-semibold text-sm">{user.email}</Text>
      </View>
      </View>

      
      {/* Liens du menu */}
      <View className="flex mt-20 gap-10 p-6">
        <Link href="/pages/menu/edit">
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="pencil" size={20} color="black" />
            <Text className="text-lg">Modifier Profil</Text>
          </View>
        </Link>


        <Link href="/pages/menu/historique">
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

        <Pressable onPress={handleLogout}>
          <View className="flex flex-row items-center gap-2">
            <Ionicons name="arrow-back" size={20} color="black" />
            <Text className="text-lg">Se déconnecter</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
