import { MadimiOne_400Regular } from "@expo-google-fonts/madimi-one";
import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { CartProvider } from "@/contexts/cart-context";
import { UserProvider } from "@/contexts/user-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  // Must include route group prefix when using grouped segments
  initialRouteName: "(auth)/splash",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    MadimiOne_400Regular,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <UserProvider>
      <CartProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen
              name="(auth)/splash"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(auth)/login"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(auth)/signup"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(account)/profile"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(account)/payment"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(cart)/checkout"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(account)/order-success"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(account)/orders"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(account)/order-tracking"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="(product)/product/[id]"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="(cart)/cart" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </CartProvider>
    </UserProvider>
  );
}
