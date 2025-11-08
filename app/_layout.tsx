import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { CartProvider } from "@/contexts/cart-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  initialRouteName: "splash",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <CartProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="splash" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="payment" options={{ headerShown: false }} />
          <Stack.Screen name="checkout" options={{ headerShown: false }} />
          <Stack.Screen name="order-success" options={{ headerShown: false }} />
          <Stack.Screen name="orders" options={{ headerShown: false }} />
          <Stack.Screen
            name="order-tracking"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="cart" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        <StatusBar style="light" backgroundColor="#7C3AED" />
      </ThemeProvider>
    </CartProvider>
  );
}
