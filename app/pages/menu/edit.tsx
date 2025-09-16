import { useUser } from "@/components/user-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Pressable, Text, TextInput, View } from "react-native";

export default function edit(){
 const { user, updateUser } = useUser();
 const [name, setName] = useState<string>(user.name);
 const [email, setEmail] = useState<string>(user.email);
 const [photoUri, setPhotoUri] = useState<string | undefined>(user.photoUri);
 const router = useRouter();

 async function pickImageFromLibrary() {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission requise', "L'accès à la galerie est nécessaire pour choisir une photo.");
    return;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
    allowsEditing: true,
    aspect: [1,1],
  });
  if (!result.canceled) {
    const uri = result.assets[0].uri;
    setPhotoUri(uri);
    updateUser({ photoUri: uri });
  }
 }

 return(
    <View className="mt-20 p-6">
         <View className="flex flex-row gap-20">
            <Link href="/pages/(tabs)/profil" className="bg-blue-500 w-10 p-2 rounded-lg">
            <Ionicons name="chevron-back-outline" size={24} color="black"/>
            </Link>
            <Text className="text-xl font-bold mt-2">Modifier Profil</Text>            
         </View>
        <View className="mt-10 items-center gap-6">
          <View className="flex flex-row items-center gap-4">
            <Pressable accessibilityRole="imagebutton" onPress={pickImageFromLibrary}>
              <Image
                source={photoUri ? { uri: photoUri } : { uri: "https://via.placeholder.com/150" }}
                className="w-24 h-24 rounded-full border-2 border-blue-500"
              />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={pickImageFromLibrary}
              className="bg-blue-500 w-10 h-10 rounded-full items-center justify-center"
            >
              <Ionicons name="pencil" size={20} color="white" />
            </Pressable>
          </View>
        </View>
        <View className="mt-10 gap-10">
            <TextInput placeholder="Nom"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            style={{ width: 300, height: 50, borderColor: "black", borderWidth: 1, borderRadius: 10, paddingLeft: 10 }}
            keyboardType="default"
            />
            <TextInput placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            style={{ width: 300, height: 50, borderColor: "black", borderWidth: 1, borderRadius: 10, paddingLeft: 10 }}
            keyboardType="email-address"
            />
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            const trimmedName = name.trim();
            const trimmedEmail = email.trim();
            if (!trimmedName) {
              Alert.alert("Nom requis", "Veuillez saisir votre nom.");
              return;
            }
            if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
              Alert.alert("Email invalide", "Veuillez saisir un email valide.");
              return;
            }
            updateUser({ name: trimmedName, email: trimmedEmail, photoUri });
            router.back();
          }}
          className=" bg-blue-500 w-full rounded-lg mt-10"
        >
          <Text className="p-4 text-center text-white text-lg">Enregistrer</Text>
        </Pressable>
    </View>
 )
}