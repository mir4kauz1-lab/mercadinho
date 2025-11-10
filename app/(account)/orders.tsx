import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@/contexts/user-context";
import { Ionicons } from "@expo/vector-icons";
import { storageService } from "@/services/storage";

interface ItemPedido {
  id: string;
  quantidade: number;
  precoUnit: number;
  produto: {
    nome: string;
    imagem: string | null;
  };
}

interface Pedido {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  itens: ItemPedido[];
}

export default function OrdersScreen() {
  const router = useRouter();
  const { user, logout } = useUser();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPedidos = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `https://santafe-dashboard.vercel.app/api/pedidos?clienteId=${user.id}`
      );
      const data = await response.json();

      // Se o cliente não foi encontrado (404), redireciona para login
      if (
        response.status === 404 ||
        (data.pedidos &&
          data.pedidos.length === 0 &&
          data.message?.includes("não encontrado"))
      ) {
        await storageService.removeCliente();
        await logout();
        Alert.alert(
          "Sessão expirada",
          "Faça login novamente para visualizar seus pedidos."
        );
        router.replace("/(auth)/login");
        return;
      }

      if (data.success) {
        setPedidos(data.pedidos);
      }
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, logout, router]);

  useEffect(() => {
    loadPedidos();
  }, [loadPedidos]);
  const onRefresh = () => {
    setRefreshing(true);
    loadPedidos();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return { bg: "#FEF3C7", text: "#92400E" };
      case "EM_ANDAMENTO":
        return { bg: "#E9D5FF", text: "#6B21A8" };
      case "ENTREGUE":
        return { bg: "#D1FAE5", text: "#065F46" };
      case "CANCELADO":
        return { bg: "#FEE2E2", text: "#991B1B" };
      default:
        return { bg: "#F3F4F6", text: "#374151" };
    }
  };

  const getStatusTexto = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return "Pendente";
      case "EM_ANDAMENTO":
        return "Em Separação";
      case "ENTREGUE":
        return "Entregue";
      case "CANCELADO":
        return "Cancelado";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return "time-outline";
      case "EM_ANDAMENTO":
        return "cube-outline";
      case "ENTREGUE":
        return "checkmark-circle";
      case "CANCELADO":
        return "close-circle";
      default:
        return "receipt-outline";
    }
  };

  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Faça login para ver seus pedidos</Text>
        <Text style={styles.emptySubtitle}>
          Acompanhe todos os seus pedidos em um só lugar
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          style={styles.loginButton}
        >
          <Text style={styles.loginButtonText}>Fazer Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={styles.loadingText}>Carregando pedidos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meus Pedidos</Text>
          <Text style={styles.headerSubtitle}>
            {pedidos.length} {pedidos.length === 1 ? "pedido" : "pedidos"}
          </Text>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#7C3AED"
              colors={["#7C3AED"]}
            />
          }
        >
          {pedidos.length === 0 ? (
            <View style={styles.emptyStateCard}>
              <Text style={styles.emptyStateIcon}>🛒</Text>
              <Text style={styles.emptyStateTitle}>Nenhum pedido ainda</Text>
              <Text style={styles.emptyStateSubtitle}>
                Comece fazendo seu primeiro pedido!
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(tabs)")}
                style={styles.shopButton}
              >
                <Text style={styles.shopButtonText}>Começar a Comprar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.pedidosList}>
              {pedidos.map((pedido: Pedido) => {
                const statusColor = getStatusColor(pedido.status);
                return (
                  <TouchableOpacity
                    key={pedido.id}
                    onPress={() =>
                      router.push(`/(account)/order-tracking?id=${pedido.id}`)
                    }
                    style={styles.pedidoCard}
                    activeOpacity={0.7}
                  >
                    <View style={styles.pedidoHeader}>
                      <View style={styles.pedidoHeaderLeft}>
                        <Ionicons
                          name={getStatusIcon(pedido.status) as any}
                          size={32}
                          color={statusColor.text}
                        />
                        <View style={styles.pedidoInfo}>
                          <Text style={styles.pedidoId}>
                            Pedido #{pedido.id.substring(0, 8)}
                          </Text>
                          <Text style={styles.pedidoDate}>
                            {new Date(pedido.createdAt).toLocaleDateString(
                              "pt-BR",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: statusColor.bg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            { color: statusColor.text },
                          ]}
                        >
                          {getStatusTexto(pedido.status)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.pedidoBody}>
                      <View style={styles.itensContainer}>
                        {pedido.itens.slice(0, 2).map((item: ItemPedido) => (
                          <View key={item.id} style={styles.itemRow}>
                            <Text style={styles.itemQuantity}>
                              {item.quantidade}x
                            </Text>
                            <Text style={styles.itemName} numberOfLines={1}>
                              {item.produto.nome}
                            </Text>
                          </View>
                        ))}
                        {pedido.itens.length > 2 && (
                          <Text style={styles.moreItems}>
                            +{pedido.itens.length - 2}{" "}
                            {pedido.itens.length - 2 === 1 ? "item" : "itens"}
                          </Text>
                        )}
                      </View>

                      <View style={styles.pedidoFooter}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>
                          R$ {pedido.total.toFixed(2)}
                        </Text>
                      </View>

                      <View style={styles.viewDetails}>
                        <Text style={styles.viewDetailsText}>Ver detalhes</Text>
                        <Ionicons
                          name="chevron-forward"
                          size={20}
                          color="#7C3AED"
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#7C3AED",
  },
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 24,
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#7C3AED",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    color: "#6B7280",
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    backgroundColor: "#7C3AED",
    paddingTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  backButton: {
    marginBottom: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 8,
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  emptyStateCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 48,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
    fontSize: 16,
  },
  shopButton: {
    backgroundColor: "#7C3AED",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  shopButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  pedidosList: {
    gap: 16,
    paddingBottom: 24,
  },
  pedidoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  pedidoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  pedidoHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pedidoInfo: {
    gap: 4,
  },
  pedidoId: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  pedidoDate: {
    color: "#6B7280",
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginBottom: 16,
  },
  pedidoBody: {
    gap: 16,
  },
  itensContainer: {
    gap: 8,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemQuantity: {
    color: "#7C3AED",
    fontWeight: "600",
    fontSize: 14,
  },
  itemName: {
    color: "#374151",
    fontSize: 14,
    flex: 1,
  },
  moreItems: {
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 4,
  },
  pedidoFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    color: "#6B7280",
    fontSize: 14,
  },
  totalValue: {
    color: "#7C3AED",
    fontWeight: "bold",
    fontSize: 24,
  },
  viewDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },
  viewDetailsText: {
    color: "#7C3AED",
    fontSize: 14,
    fontWeight: "600",
  },
});
