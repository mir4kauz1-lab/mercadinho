// Orders movido para (account)
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
type OrderStatus = "preparing" | "on-way" | "delivered" | "cancelled";
interface Order {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: number;
  paymentMethod: string;
}
export default function OrdersScreen() {
  const router = useRouter();
  const orders: Order[] = [
    {
      id: "847291",
      date: "08/11/2025 - 14:30",
      total: 157.89,
      status: "on-way",
      items: 5,
      paymentMethod: "Cartão de Crédito",
    },
    {
      id: "836452",
      date: "06/11/2025 - 10:15",
      total: 89.5,
      status: "delivered",
      items: 3,
      paymentMethod: "Dinheiro",
    },
    {
      id: "825103",
      date: "04/11/2025 - 16:45",
      total: 234.7,
      status: "delivered",
      items: 8,
      paymentMethod: "Crediário",
    },
    {
      id: "814687",
      date: "02/11/2025 - 09:20",
      total: 67.3,
      status: "cancelled",
      items: 2,
      paymentMethod: "Cartão de Crédito",
    },
  ];
  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case "preparing":
        return {
          label: "Sendo Preparado",
          color: "#FF9800",
          icon: "cube-outline" as const,
          bgColor: "#FFF3E0",
        };
      case "on-way":
        return {
          label: "A Caminho",
          color: "#2196F3",
          icon: "car-outline" as const,
          bgColor: "#E3F2FD",
        };
      case "delivered":
        return {
          label: "Entregue",
          color: "#4CAF50",
          icon: "checkmark-circle-outline" as const,
          bgColor: "#E8F5E9",
        };
      case "cancelled":
        return {
          label: "Cancelado",
          color: "#F44336",
          icon: "close-circle-outline" as const,
          bgColor: "#FFEBEE",
        };
    }
  };
  return (
    <View style={styles.container}>
      {" "}
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />{" "}
      <View style={styles.header}>
        {" "}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>{" "}
        <Text style={styles.headerTitle}>Meus Pedidos</Text>{" "}
        <View style={styles.placeholder} />{" "}
      </View>{" "}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {" "}
        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={80} color="#CCC" />
            <Text style={styles.emptyText}>Nenhum pedido realizado</Text>
            <Text style={styles.emptySubtext}>
              Seus pedidos aparecerão aqui
            </Text>
          </View>
        ) : (
          orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            return (
              <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                onPress={() =>
                  router.push(`/order-tracking?orderId=${order.id}` as any)
                }
              >
                {" "}
                <View style={styles.orderHeader}>
                  {" "}
                  <View style={styles.orderIdContainer}>
                    <Text style={styles.orderIdLabel}>Pedido</Text>
                    <Text style={styles.orderIdValue}>#{order.id}</Text>
                  </View>{" "}
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusInfo.bgColor },
                    ]}
                  >
                    <Ionicons
                      name={statusInfo.icon}
                      size={16}
                      color={statusInfo.color}
                    />
                    <Text
                      style={[styles.statusText, { color: statusInfo.color }]}
                    >
                      {statusInfo.label}
                    </Text>
                  </View>{" "}
                </View>{" "}
                <View style={styles.orderDivider} />{" "}
                <View style={styles.orderDetails}>
                  {" "}
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={18} color="#666" />
                    <Text style={styles.detailText}>{order.date}</Text>
                  </View>{" "}
                  <View style={styles.detailRow}>
                    <Ionicons name="cart-outline" size={18} color="#666" />
                    <Text style={styles.detailText}>
                      {order.items} {order.items === 1 ? "item" : "itens"}
                    </Text>
                  </View>{" "}
                  <View style={styles.detailRow}>
                    <Ionicons name="card-outline" size={18} color="#666" />
                    <Text style={styles.detailText}>{order.paymentMethod}</Text>
                  </View>{" "}
                </View>{" "}
                <View style={styles.orderFooter}>
                  {" "}
                  <View>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>
                      R$ {order.total.toFixed(2)}
                    </Text>
                  </View>{" "}
                  <TouchableOpacity style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>Ver Detalhes</Text>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#7C3AED"
                    />
                  </TouchableOpacity>{" "}
                </View>{" "}
              </TouchableOpacity>
            );
          })
        )}{" "}
      </ScrollView>{" "}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#7C3AED",
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#FFF" },
  placeholder: { width: 32 },
  content: { flex: 1 },
  contentContainer: { padding: 16 },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyText: { fontSize: 20, fontWeight: "700", color: "#999", marginTop: 20 },
  emptySubtext: { fontSize: 14, color: "#CCC", marginTop: 8 },
  orderCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  orderIdContainer: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  orderIdLabel: { fontSize: 14, color: "#666" },
  orderIdValue: { fontSize: 18, fontWeight: "700", color: "#333" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: { fontSize: 12, fontWeight: "700" },
  orderDivider: { height: 1, backgroundColor: "#E0E0E0", marginBottom: 16 },
  orderDetails: { gap: 12, marginBottom: 16 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  detailText: { fontSize: 14, color: "#666" },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  totalLabel: { fontSize: 12, color: "#666", marginBottom: 4 },
  totalValue: { fontSize: 20, fontWeight: "700", color: "#7C3AED" },
  viewButton: { flexDirection: "row", alignItems: "center", gap: 4 },
  viewButtonText: { fontSize: 14, fontWeight: "600", color: "#7C3AED" },
});
