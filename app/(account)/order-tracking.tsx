import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useUser } from "@/contexts/user-context";
import api from "@/services/api";

interface ItemPedido {
  id: string;
  quantidade: number;
  precoUnitario: number;
  produto: {
    nome: string;
    imagem: string | null;
    preco: number;
  };
}

interface Pedido {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  updatedAt: string;
  cliente: {
    nome: string;
    endereco: string | null;
    telefone: string | null;
  };
  itens: ItemPedido[];
}

export default function OrderTrackingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useUser();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPedido();
  }, [id]);

  const loadPedido = async () => {
    if (!id || !user) return;

    try {
      const response = await api.get(`/pedidos/${id}`);
      if (response.data.success) {
        setPedido(response.data.pedido);
      }
    } catch (error) {
      console.error("Erro ao buscar pedido:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return {
          titulo: "Pedido Recebido",
          descricao: "Seu pedido foi recebido e está aguardando separação",
          icone: "⏳",
          cor: "bg-yellow-100 text-yellow-700",
        };
      case "EM_ANDAMENTO":
        return {
          titulo: "Em Separação",
          descricao: "Estamos separando os produtos do seu pedido",
          icone: "📦",
          cor: "bg-purple-100 text-purple-700",
        };
      case "ENTREGUE":
        return {
          titulo: "Pedido Entregue",
          descricao: "Seu pedido foi entregue com sucesso!",
          icone: "✅",
          cor: "bg-green-100 text-green-700",
        };
      case "CANCELADO":
        return {
          titulo: "Pedido Cancelado",
          descricao: "Este pedido foi cancelado",
          icone: "❌",
          cor: "bg-red-100 text-red-700",
        };
      default:
        return {
          titulo: "Status Desconhecido",
          descricao: "",
          icone: "📋",
          cor: "bg-gray-100 text-gray-700",
        };
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text className="text-gray-600 mt-4">Carregando pedido...</Text>
      </View>
    );
  }

  if (!pedido) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-6">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          Pedido não encontrado
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-violet-600 px-8 py-4 rounded-xl"
        >
          <Text className="text-white font-semibold text-lg">Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusInfo = getStatusInfo(pedido.status);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-violet-600 pt-16 pb-8 px-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-white text-3xl">←</Text>
        </TouchableOpacity>
        <Text className="text-white text-3xl font-bold">
          Pedido #{id?.toString().substring(0, 8)}
        </Text>
        <Text className="text-white/80 mt-2">
          {new Date(pedido.createdAt).toLocaleDateString("pt-BR")}
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6 py-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Status Atual */}
        <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm items-center">
          <Text className="text-6xl mb-4">{statusInfo.icone}</Text>
          <View className={`px-6 py-3 rounded-full ${statusInfo.cor} mb-3`}>
            <Text className="font-bold">{statusInfo.titulo}</Text>
          </View>
          <Text className="text-gray-600 text-center">
            {statusInfo.descricao}
          </Text>
        </View>

        {/* Timeline */}
        <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
          <Text className="text-xl font-bold text-gray-900 mb-6">Timeline</Text>

          {/* Pedido Criado */}
          <View className="flex-row gap-4 mb-6">
            <View className="items-center">
              <View className="w-4 h-4 rounded-full bg-green-500" />
              {pedido.status !== "PENDENTE" && (
                <View className="w-0.5 flex-1 bg-gray-300 mt-2" />
              )}
            </View>
            <View className="flex-1 pb-2">
              <Text className="font-bold text-gray-900">Pedido Recebido</Text>
              <Text className="text-gray-600 text-sm">
                {new Date(pedido.createdAt).toLocaleString("pt-BR")}
              </Text>
            </View>
          </View>

          {/* Em Separação */}
          <View className="flex-row gap-4 mb-6">
            <View className="items-center">
              <View
                className={`w-4 h-4 rounded-full ${
                  pedido.status === "EM_ANDAMENTO" ||
                  pedido.status === "ENTREGUE"
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
              {(pedido.status === "EM_ANDAMENTO" ||
                pedido.status === "ENTREGUE") && (
                <View className="w-0.5 flex-1 bg-gray-300 mt-2" />
              )}
            </View>
            <View className="flex-1 pb-2">
              <Text className="font-bold text-gray-900">Em Separação</Text>
              <Text className="text-gray-600 text-sm">
                {pedido.status === "EM_ANDAMENTO" ||
                pedido.status === "ENTREGUE"
                  ? new Date(pedido.updatedAt).toLocaleString("pt-BR")
                  : "Aguardando"}
              </Text>
            </View>
          </View>

          {/* Entregue */}
          <View className="flex-row gap-4">
            <View className="items-center">
              <View
                className={`w-4 h-4 rounded-full ${
                  pedido.status === "ENTREGUE" ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-gray-900">Entregue</Text>
              <Text className="text-gray-600 text-sm">
                {pedido.status === "ENTREGUE"
                  ? new Date(pedido.updatedAt).toLocaleString("pt-BR")
                  : "Aguardando"}
              </Text>
            </View>
          </View>
        </View>

        {/* Endereço de Entrega */}
        {pedido.cliente.endereco && (
          <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
            <Text className="text-xl font-bold text-gray-900 mb-3">
              Endereço de Entrega
            </Text>
            <Text className="text-gray-700">{pedido.cliente.endereco}</Text>
          </View>
        )}

        {/* Itens do Pedido */}
        <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Itens do Pedido
          </Text>
          {pedido.itens.map((item: ItemPedido) => (
            <View
              key={item.id}
              className="flex-row items-center gap-4 mb-4 pb-4 border-b border-gray-100 last:border-0"
            >
              <Text className="text-4xl">{item.produto.imagem || "📦"}</Text>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">
                  {item.produto.nome}
                </Text>
                <Text className="text-gray-600 text-sm">
                  {item.quantidade}x R$ {item.precoUnitario.toFixed(2)}
                </Text>
              </View>
              <Text className="text-violet-600 font-bold">
                R$ {(item.quantidade * item.precoUnitario).toFixed(2)}
              </Text>
            </View>
          ))}
          <View className="border-t border-gray-200 pt-4 mt-2">
            <View className="flex-row justify-between">
              <Text className="text-lg font-bold text-gray-900">Total</Text>
              <Text className="text-lg font-bold text-violet-600">
                R$ {pedido.total.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Ajuda */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <Text className="text-xl font-bold text-gray-900 mb-3">
            Precisa de ajuda?
          </Text>
          <Text className="text-gray-600 mb-4">
            Entre em contato conosco para qualquer dúvida sobre seu pedido
          </Text>
          {pedido.cliente.telefone && (
            <TouchableOpacity className="bg-violet-100 p-4 rounded-xl">
              <Text className="text-violet-700 font-medium text-center">
                📞 {pedido.cliente.telefone}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {pedido.status === "ENTREGUE" && (
        <View className="bg-white border-t border-gray-200 p-6">
          <TouchableOpacity
            onPress={() => router.push("/(tabs)")}
            className="bg-violet-600 py-4 rounded-xl"
          >
            <Text className="text-white text-center font-bold text-lg">
              Fazer Novo Pedido
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
