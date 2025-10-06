import { useUser } from "@/components/user-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Pressable, Text, TextInput, View, ActivityIndicator } from "react-native";
import { updateUser as updateUserAPI, uploadImage } from '../../../utils/users';

export default function edit(){
 const { user, updateUser: updateUserContext } = useUser();
 const [name, setName] = useState<string>(user.name);
 const [email, setEmail] = useState<string>(user.email);
 const [telephone, setTelephone] = useState<string>(user.telephone || '');
 const [localisation, setLocalisation] = useState<string>(user.localisation || '');
 const [photoUri, setPhotoUri] = useState<string | undefined>(user.photoUri);
 const [loading, setLoading] = useState<boolean>(false);
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
    updateUserContext({ photoUri: uri });
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

            <TextInput placeholder="Téléphone"
            value={telephone}
            onChangeText={setTelephone}
            autoCapitalize="none"
            autoCorrect={false}
            style={{ width: 300, height: 50, borderColor: "black", borderWidth: 1, borderRadius: 10, paddingLeft: 10 }}
            keyboardType="phone-pad"
            />

            <TextInput placeholder="Localisation"
            value={localisation}
            onChangeText={setLocalisation}
            autoCapitalize="words"
            style={{ width: 300, height: 50, borderColor: "black", borderWidth: 1, borderRadius: 10, paddingLeft: 10 }}
            keyboardType="default"
            />
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={async () => {
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

            setLoading(true);
            try {
              let imageUrl = photoUri; // Use photoUri directly if not changed, otherwise upload

              // Upload image to Cloudinary if changed and it's a local file URI
              if (photoUri && photoUri !== user.photoUri && photoUri.startsWith('file://')) {
                try {
                  imageUrl = await uploadImage(photoUri);
                } catch (uploadError) {
                  console.error('Erreur upload Cloudinary:', uploadError);
                  Alert.alert('Erreur', 'Impossible d\'uploader l\'image. Les autres modifications ont été sauvegardées.');
                  // Continue with local URI if upload fails
                }
              }

              // Try to update user on backend - endpoint may not support clients yet
              try {
                await updateUserAPI({
                  nom: trimmedName,
                  email: trimmedEmail,
                  telephone: telephone.trim() || undefined,
                  localisation: localisation.trim() || undefined,
                  photoProfil: imageUrl
                });
                console.log('Profil mis à jour sur le backend');
              } catch (apiError) {
                console.warn('Backend update failed:', apiError);
                console.warn('Le backend n\'accepte peut-être pas encore les mises à jour de profil pour les clients');
                // Continue anyway - at least update local context
              }

              // Update local context
              updateUserContext({
                name: trimmedName,
                email: trimmedEmail,
                telephone: telephone.trim() || undefined,
                localisation: localisation.trim() || undefined,
                photoUri: imageUrl
              });

              router.back();
            } catch (error) {
              console.error('Erreur lors de la sauvegarde:', error);
              Alert.alert('Erreur', 'Impossible de sauvegarder les modifications.');
            } finally {
              setLoading(false);
            }
          }}
          className=" bg-blue-500 w-full rounded-lg mt-10"
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="p-4 text-center text-white text-lg">Enregistrer</Text>
          )}
        </Pressable>
    </View>
 )
}
