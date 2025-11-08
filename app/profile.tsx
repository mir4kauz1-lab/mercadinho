import { BottomNavigation } from "@/components/bottom-navigation";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    console.log("Logout");
    router.replace("/login" as any);
  };

  const handleEditProfile = () => {
    console.log("Editar perfil");
  };

  const menuItems = [
    {
      icon: "person-outline",
      title: "Meus Dados",
      subtitle: "Editar informações pessoais",
      onPress: handleEditProfile,
    },
    {
      icon: "location-outline",
      title: "Endereços",
      subtitle: "Gerenciar endereços de entrega",
      onPress: () => console.log("Endereços"),
    },
    {
      icon: "card-outline",
      title: "Pagamentos",
      subtitle: "Gerenciar formas de pagamento",
      onPress: () => router.push("/payment" as any),
    },
    {
      icon: "receipt-outline",
      title: "Pedidos",
      subtitle: "Ver histórico de pedidos",
      onPress: () => router.push("/orders" as any),
    },
    {
      icon: "heart-outline",
      title: "Favoritos",
      subtitle: "Produtos salvos",
      onPress: () => console.log("Favoritos"),
    },
    {
      icon: "notifications-outline",
      title: "Notificações",
      subtitle: "Configurar alertas e promoções",
      onPress: () => console.log("Notificações"),
    },
    {
      icon: "help-circle-outline",
      title: "Ajuda",
      subtitle: "Central de ajuda e suporte",
      onPress: () => console.log("Ajuda"),
    },
    {
      icon: "information-circle-outline",
      title: "Sobre",
      subtitle: "Informações do aplicativo",
      onPress: () => console.log("Sobre"),
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minha Conta</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutButton}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={40} color="#FFF" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Luis Almeida</Text>
          <Text style={styles.profileEmail}>luimalameida@email.com</Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Ionicons name="create-outline" size={20} color="#7C3AED" />
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon as any} size={24} color="#7C3AED" />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.logoutButtonLarge}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#E63946" />
          <Text style={styles.logoutButtonText}>Sair da conta</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Versão 1.0.0</Text>
        <View style={styles.bottomSpacer} />
      </ScrollView>

      <BottomNavigation active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
    backgroundColor: "#7C3AED",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
  },
  logoutButton: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginTop: 0,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  menuContainer: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0E7FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: "#999",
  },
  logoutButtonLarge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E63946",
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E63946",
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: "#999",
    marginTop: 20,
  },
  bottomSpacer: {
    height: 20,
  },
});
