import React, { useState } from "react";
import { View, Text, Pressable, LayoutAnimation, Platform, UIManager } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";



if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
type AccordionItemProps = {
  title: string;
  content: string;
}; 

const AccordionItem = ({ title, content }:AccordionItemProps) => {
  const [open, setOpen] = useState(false);

  const toggleAccordion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(!open);
  };

  return (
    <View
      style={{
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <Pressable
        onPress={toggleAccordion}
        style={({ pressed }) => [
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
            backgroundColor: pressed ? "#e0f2fe" : "white", // hover/press effect
          },
        ]}
      >
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#374151", padding:4 }}>{title}</Text>
        <Feather
          name={open ? "chevron-up" : "chevron-down"}
          size={20}
          color="#374151"
        />
      </Pressable>

      {open && (
        <View style={{ padding: 16, backgroundColor: "#f9fafb" }}>
          <Text style={{ fontSize: 14, color: "#4b5563" }}>{content}</Text>
        </View>
      )}
    </View>
  );
};

export default function AideScreen() {
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
        <View className=" mt-20">
            <View className="entete p-2 flex flex-row gap-24">
           <Link href="/pages/menu/profil" className="bg-blue-500 w-10 p-2 rounded-lg">
            <Ionicons name="chevron-back-outline" size={24} color="black"/>
           </Link>
           <Text className="text-xl font-bold mt-2">Aide</Text>              
           </View>
            <View className=" accordion mt-20 gap-4">
                <AccordionItem
                    title="Comment créer un compte ?"
                    content="Cliquez sur S’inscrire, choisissez votre rôle (Client ou Vendeur), remplissez vos informations puis validez."
                />
                <AccordionItem
                    title="J’ai oublié mon mot de passe, que faire ?"
                    content="Allez dans parametre puis sur changer le mot de passe."
                />
                <AccordionItem
                    title="Puis-je changer mon adresse email ou mon mot de passe ?"
                    content="Non, vous pouvez vous déconnecter puis se reconnecter avec votre nouvelle email."
                />
                 <AccordionItem
                    title="Comment acheter un produit ?"
                    content="Naviguez dans le catalogue, choisissez un produit et cliquez sur Acheter. Sélectionnez le mode de paiement et confirmez."
                /> 
                 <AccordionItem
                    title="Comment suivre ma commande ?"
                    content="Allez dans Cart > Suivre la commande. Chaque commande affiche son statut (en attente, expédiée, livrée)."
                /> 
                 <AccordionItem
                    title="Puis-je annuler une commande ?"
                    content="Oui, uniquement si elle n’a pas encore été expédiée. Rendez-vous dans Mes commandes et cliquez sur Annuler."
                />             
            </View>
        </View>
    </View>
  );
}
