import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@/contexts/user-context";
import api from "@/services/api";

interface ItemPedido {
  id: string;
  quantidade: number;
  precoUnitario: number;
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
  const { user } = useUser();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPedidos = async () => {
    if (!user) return;

    try {
      // Buscar pedidos do cliente
      const response = await api.get(`/pedidos?clienteId=${user.id}`);
      if (response.data.success) {
        setPedidos(response.data.pedidos);
      }
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPedidos();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    loadPedidos();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return "bg-yellow-100 text-yellow-700";
      case "EM_ANDAMENTO":
        return "bg-purple-100 text-purple-700";
      case "ENTREGUE":
        return "bg-green-100 text-green-700";
      case "CANCELADO":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
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
        return "⏳";
      case "EM_ANDAMENTO":
        return "📦";
      case "ENTREGUE":
        return "✅";
      case "CANCELADO":
        return "❌";
      default:
        return "📋";
    }
  };

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-6">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          Faça login para ver seus pedidos
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          className="bg-violet-600 px-8 py-4 rounded-xl"
        >
          <Text className="text-white font-semibold text-lg">Fazer Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text className="text-gray-600 mt-4">Carregando pedidos...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-violet-600 pt-16 pb-8 px-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-white text-3xl">←</Text>
        </TouchableOpacity>
        <Text className="text-white text-3xl font-bold">Meus Pedidos</Text>
        <Text className="text-white/80 mt-2">
          {pedidos.length} {pedidos.length === 1 ? "pedido" : "pedidos"}
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6 py-6"
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
          <View className="bg-white rounded-2xl p-12 items-center">
            <Text className="text-6xl mb-4">🛒</Text>
            <Text className="text-xl font-bold text-gray-900 mb-2">
              Nenhum pedido ainda
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              Comece fazendo seu primeiro pedido!
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)")}
              className="bg-violet-600 px-8 py-4 rounded-xl"
            >
              <Text className="text-white font-semibold">
                Começar a Comprar
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="space-y-4">
            {pedidos.map((pedido: Pedido) => (
              <TouchableOpacity
                key={pedido.id}
                onPress={() =>
                  router.push(`/(account)/order-tracking?id=${pedido.id}`)
                }
                className="bg-white rounded-2xl p-6 shadow-sm active:opacity-80"
              >
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center gap-3">
                    <Text className="text-3xl">
                      {getStatusIcon(pedido.status)}
                    </Text>
                    <View>
                      <Text className="text-lg font-bold text-gray-900">
                        Pedido #{pedido.id.substring(0, 8)}
                      </Text>
                      <Text className="text-gray-600 text-sm">
                        {new Date(pedido.createdAt).toLocaleDateString("pt-BR")}
                      </Text>
                    </View>
                  </View>
                  <View
                    className={`px-4 py-2 rounded-full ${getStatusColor(
                      pedido.status
                    )}`}
                  >
                    <Text className="text-xs font-medium">
                      {getStatusTexto(pedido.status)}
                    </Text>
                  </View>
                </View>

                <View className="border-t border-gray-100 pt-4">
                  <View className="mb-3">
                    {pedido.itens
                      .slice(0, 2)
                      .map((item: ItemPedido, index: number) => (
                        <Text
                          key={index}
                          className="text-gray-700 text-sm mb-1"
                        >
                          {item.quantidade}x {item.produto.nome}
                        </Text>
                      ))}
                    {pedido.itens.length > 2 && (
                      <Text className="text-gray-500 text-sm">
                        +{pedido.itens.length - 2}{" "}
                        {pedido.itens.length - 2 === 1 ? "item" : "itens"}
                      </Text>
                    )}
                  </View>

                  <View className="flex-row items-center justify-between">
                    <Text className="text-violet-600 font-bold text-lg">
                      R$ {pedido.total.toFixed(2)}
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-gray-600 text-sm">
                        Ver detalhes
                      </Text>
                      <Text className="text-gray-400">→</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
