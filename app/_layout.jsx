import { useEffect } from "react";
// import GlobalProvider from "../context/GlobalProvider";
import { useFonts } from "expo-font";
import { View } from "react-native";
import { SplashScreen, Stack } from "expo-router";
import { CartProvider } from "../context/CartContext";


const RootLayout = () => {
  // const [fontsLoaded, error] = useFonts({
  //   "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
  //   "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  //   "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
  //   "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
  //   "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
  //   "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
  //   "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  //   "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  // });

  // useEffect(() => {
  //   if (error) throw error;

  //   if (fontsLoaded) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded, error]);

  // if (!fontsLoaded) {
  //   return null;
  // }

  // if (!fontsLoaded && !error) {
  //   return null;
  // }
  return (
    <CartProvider>
    {/* <GlobalProvider> */}
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="search/[query]" options={{ headerShown: false }} />
        <Stack.Screen name="book" options={{ headerShown: false }} />
        <Stack.Screen name="checkout" options={{ headerShown: false }} />
        <Stack.Screen name="category" options={{ headerShown: true }} />
      </Stack>
    {/* </GlobalProvider> */}
    </CartProvider>
  );
};

export default RootLayout;
