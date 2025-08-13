import { Stack } from "expo-router";
import { StatusBar, View } from "react-native";


export default function RootLayout() {
  return (
    <View className="flex-1 ">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent"  />
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
