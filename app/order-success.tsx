import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function OrderSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const orderId = params.orderId as string;
  const total = params.total as string;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />

      {/* Success Icon */}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={120} color="#4CAF50" />
        </View>

        <Text style={styles.title}>Pedido Realizado com Sucesso!</Text>
        <Text style={styles.subtitle}>
          Seu pedido foi confirmado e será entregue em breve
        </Text>

        <View style={styles.orderInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Número do Pedido</Text>
            <Text style={styles.infoValue}>#{orderId}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Valor Total</Text>
            <Text style={styles.infoValueHighlight}>R$ {total}</Text>
          </View>
        </View>

        <View style={styles.messageContainer}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color="#7C3AED"
          />
          <Text style={styles.messageText}>
            Você pode acompanhar o status do seu pedido na página de pedidos
          </Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            router.push(`/order-tracking?orderId=${orderId}` as any)
          }
        >
          <Ionicons name="eye-outline" size={24} color="#FFF" />
          <Text style={styles.primaryButtonText}>Acompanhar Pedido</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/orders" as any)}
        >
          <Ionicons name="receipt-outline" size={24} color="#7C3AED" />
          <Text style={styles.secondaryButtonText}>Ver Meus Pedidos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tertiaryButton}
          onPress={() => router.replace("/(tabs)" as any)}
        >
          <Text style={styles.tertiaryButtonText}>Voltar ao Início</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },
  orderInfo: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  infoValueHighlight: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4CAF50",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 16,
  },
  messageContainer: {
    flexDirection: "row",
    backgroundColor: "#F0E7FF",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: "#7C3AED",
  },
  messageText: {
    flex: 1,
    fontSize: 14,
    color: "#7C3AED",
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    gap: 12,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  primaryButton: {
    flexDirection: "row",
    backgroundColor: "#7C3AED",
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  secondaryButton: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "#7C3AED",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7C3AED",
    letterSpacing: 0.5,
  },
  tertiaryButton: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  tertiaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
});
