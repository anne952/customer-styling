import { CartProvider } from "@/components/cart-context";
import { LikesProvider } from "@/components/likes-context";
import { OrderProvider } from "@/components/order-context";
import { UserProvider } from "@/components/user-context";
import { Stack } from "expo-router";
import { StatusBar, View } from "react-native";


export default function RootLayout() {
  return (
    <LikesProvider>
      <CartProvider>
        <OrderProvider>
          <UserProvider>
            <View className="flex-1 ">
              <StatusBar barStyle="dark-content" translucent backgroundColor="transparent"  />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="pages/onboarding/onboarding-un" />
                <Stack.Screen name="pages/onboarding/onboarding-deux" />
                <Stack.Screen name="pages/onboarding/onboarding-trois" />

                <Stack.Screen name="pages/connexion/login" />
                <Stack.Screen name="pages/connexion/register" />
                <Stack.Screen name="pages/connexion/forget-password" />

                <Stack.Screen name="pages/view" options={{ title: "index" }} />

                <Stack.Screen name="pages/menu/cart" />
                <Stack.Screen name="pages/menu/edit" />
                <Stack.Screen name="pages/menu/help" />
                <Stack.Screen name="pages/menu/parametre" />
                <Stack.Screen name="pages/menu/search" />

                <Stack.Screen name="pages/transaction/payement" />
                <Stack.Screen name="pages/transaction/code-payement" />
                <Stack.Screen name="pages/transaction/payement-succes" options={{ presentation: 'modal' }} />
                <Stack.Screen name="pages/transaction/reçu" />
                <Stack.Screen name="pages/transaction/suvre-commande" />
              </Stack>
            </View>
          </UserProvider>
        </OrderProvider>
      </CartProvider>
    </LikesProvider>
  );
}
