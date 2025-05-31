import { useEffect } from "react";
// import GlobalProvider from "../context/GlobalProvider";
import { useFonts } from "expo-font";
import { View } from "react-native";
import { SplashScreen, Stack } from "expo-router";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import { AddressProvider } from "../context/AddressContext";
import {PaymentProvider} from "../context/PaymentContext";
import {OrderProvider} from "../context/OrderContext"
import DeeplinkHandler from "../app/deeplink/DeeplinkHandler";
import {RatedBooksProvider} from "../context/RateBookContext";

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }
  return (
    <AuthProvider>
      <CartProvider>
        <AddressProvider>
          <PaymentProvider>
            <OrderProvider>
              <RatedBooksProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(admin)" options={{ headerShown: false }} />
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="search/[query]" options={{ headerShown: false }} />
              <Stack.Screen name="book" options={{ headerShown: false }} />
              <Stack.Screen name="checkout" options={{ headerShown: false }} />
              <Stack.Screen name="category" options={{ headerShown: false }} />
              <Stack.Screen name="address" options={{ headerShown: false }} />
              <Stack.Screen name="order" options={{headerShown: false}} />
              <Stack.Screen name="wishlist" options={{headerShown: false}} />
              <Stack.Screen name="settings" options={{ headerShown: false }} />
              <Stack.Screen name="rating" options={{ headerShown: false }} />
              <Stack.Screen name="chat" options={{headerShown:false}} />
            </Stack>
            </RatedBooksProvider>
            </OrderProvider>
          </PaymentProvider>
        </AddressProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default RootLayout;
