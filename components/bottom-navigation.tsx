import { useCart } from "@/contexts/cart-context";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";

type TabKey = "home" | "explore" | "credit" | "chat" | "favorites";

interface BottomNavigationProps {
  active: TabKey;
  onFabPress?: () => void;
}

export const BOTTOM_NAV_HEIGHT = 50;

export function BottomNavigation({
  active,
  onFabPress,
}: BottomNavigationProps) {
  const router = useRouter();
  const { getTotalItems } = useCart();
  const itemCount = getTotalItems();

  const handleCartPress = () => {
    router.push("/cart" as any);
  };

  const handleProfilePress = () => {
    router.push("/(account)/profile" as any);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.nav}>
        <Link href="/(tabs)" asChild>
          <Pressable style={styles.navItem}>
            <Ionicons
              name="home"
              size={24}
              color={active === "home" ? "#FFF" : "#E0D4FF"}
            />
            <Text
              style={
                active === "home" ? styles.navLabelActive : styles.navLabel
              }
            >
              Home
            </Text>
          </Pressable>
        </Link>

        <Link href="/(tabs)/explore" asChild>
          <Pressable style={styles.navItem}>
            <Ionicons
              name="pricetag-outline"
              size={24}
              color={active === "explore" ? "#FFF" : "#E0D4FF"}
            />
            <Text
              style={
                active === "explore" ? styles.navLabelActive : styles.navLabel
              }
            >
              Ofertas
            </Text>
          </Pressable>
        </Link>

        {/* Carrinho */}
        <Pressable style={styles.navItem} onPress={handleCartPress}>
          <View>
            <Ionicons name="cart" size={24} color="#E0D4FF" />
            {itemCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{itemCount}</Text>
              </View>
            )}
          </View>
          <Text style={styles.navLabel}>Carrinho</Text>
        </Pressable>

        <Pressable style={styles.navItem} onPress={handleProfilePress}>
          <Ionicons
            name="person-outline"
            size={24}
            color={active === "favorites" ? "#FFF" : "#E0D4FF"}
          />
          <Text
            style={
              active === "favorites" ? styles.navLabelActive : styles.navLabel
            }
          >
            Conta
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "transparent",
    paddingTop: 0,
    paddingBottom: 0,
  },
  nav: {
    flexDirection: "row",
    backgroundColor: "#7C3AED",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 12,
    overflow: "hidden",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  navLabel: {
    fontSize: 11,
    color: "#E0D4FF",
    fontWeight: "500",
  },
  navLabelActive: {
    fontSize: 11,
    color: "#FFF",
    fontWeight: "600",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: "#E63946",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "700",
  },
});
