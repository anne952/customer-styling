import "../global.css";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, View } from "react-native";

export default function SplashScreen() {
    const router = useRouter();

    useEffect(() => {
      const timeout = setTimeout(() => {
       router.replace("/pages/onboarding/onboarding-un");
     }, 2500);
    return () => clearTimeout(timeout);
    }, [router]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#606FEF" }}>
      <Image
        source={require("../assets/images/STYLING.png")}
       style={{width: 180 , height: 260, resizeMode: "contain"}}
      />
    </View>
  );
}