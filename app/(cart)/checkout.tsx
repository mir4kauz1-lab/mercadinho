import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { useCart } from "@/contexts/cart-context";
import { useUser } from "@/contexts/user-context";
import api from "@/services/api";

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [endereco, setEndereco] = useState(user?.endereco || "");
  const [telefone, setTelefone] = useState(user?.telefone || "");

  const total = getTotalPrice();
  const taxaEntrega = 5.0;
  const totalComTaxa = total + taxaEntrega;

  const finalizarPedido = async () => {
    if (!user) {
      Alert.alert("Erro", "Você precisa estar logado para finalizar o pedido");
      router.push("/(auth)/login");
      return;
    }

    if (!endereco.trim()) {
      Alert.alert("Erro", "Por favor, informe o endereço de entrega");
      return;
    }

    if (!telefone.trim()) {
      Alert.alert("Erro", "Por favor, informe um telefone para contato");
      return;
    }

    if (items.length === 0) {
      Alert.alert("Erro", "Seu carrinho está vazio");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/pedidos", {
        clienteId: user.id,
        itens: items.map((item: { id: string; quantity: number }) => ({
          produtoId: item.id,
          quantidade: item.quantity,
        })),
      });

      if (response.data.success) {
        clearCart();
        Alert.alert(
          "Sucesso! 🎉",
          `Pedido #${
            response.data.pedido.id
          } realizado com sucesso!\n\nTotal: R$ ${totalComTaxa.toFixed(2)}`,
          [
            {
              text: "Ver Meus Pedidos",
              onPress: () => router.push("/(account)/orders"),
            },
            {
              text: "OK",
              onPress: () => router.push("/(tabs)"),
            },
          ]
        );
      } else {
        Alert.alert(
          "Erro",
          response.data.message || "Erro ao finalizar pedido"
        );
      }
    } catch (error: any) {
      console.error("Erro ao finalizar pedido:", error);
      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          "Erro ao processar pedido. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-6">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          Faça login para continuar
        </Text>
        <Text className="text-gray-600 text-center mb-8">
          Você precisa estar logado para finalizar seu pedido
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

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-violet-600 pt-16 pb-8 px-6">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Text className="text-white text-3xl">←</Text>
          </TouchableOpacity>
          <Text className="text-white text-3xl font-bold">
            Finalizar Pedido
          </Text>
        </View>

        <View className="px-6 py-6">
          {/* Dados do Cliente */}
          <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Dados de Entrega
            </Text>

            <Text className="text-gray-700 font-medium mb-2">Nome</Text>
            <View className="bg-gray-100 p-4 rounded-xl mb-4">
              <Text className="text-gray-900">{user.nome}</Text>
            </View>

            <Text className="text-gray-700 font-medium mb-2">Email</Text>
            <View className="bg-gray-100 p-4 rounded-xl mb-4">
              <Text className="text-gray-900">{user.email}</Text>
            </View>

            <Text className="text-gray-700 font-medium mb-2">Telefone *</Text>
            <TextInput
              value={telefone}
              onChangeText={setTelefone}
              placeholder="(00) 00000-0000"
              keyboardType="phone-pad"
              className="bg-gray-100 p-4 rounded-xl mb-4 text-gray-900"
            />

            <Text className="text-gray-700 font-medium mb-2">
              Endereço de Entrega *
            </Text>
            <TextInput
              value={endereco}
              onChangeText={setEndereco}
              placeholder="Rua, número, bairro, cidade"
              multiline
              numberOfLines={3}
              className="bg-gray-100 p-4 rounded-xl text-gray-900"
              style={{ minHeight: 80 }}
            />
          </View>

          {/* Resumo do Pedido */}
          <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Resumo do Pedido
            </Text>

            {items.map(
              (item: {
                id: string;
                quantity: number;
                nome: string;
                preco: number;
              }) => (
                <View key={item.id} className="flex-row justify-between mb-3">
                  <Text className="text-gray-700 flex-1">
                    {item.quantity}x {item.nome}
                  </Text>
                  <Text className="text-gray-900 font-medium">
                    R$ {(item.preco * item.quantity).toFixed(2)}
                  </Text>
                </View>
              )
            )}

            <View className="border-t border-gray-200 mt-4 pt-4">
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Subtotal</Text>
                <Text className="text-gray-900 font-medium">
                  R$ {total.toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Taxa de Entrega</Text>
                <Text className="text-gray-900 font-medium">
                  R$ {taxaEntrega.toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between mt-2 pt-2 border-t border-gray-200">
                <Text className="text-xl font-bold text-gray-900">Total</Text>
                <Text className="text-xl font-bold text-violet-600">
                  R$ {totalComTaxa.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          {/* Método de Pagamento */}
          <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Método de Pagamento
            </Text>
            <View className="bg-gray-100 p-4 rounded-xl">
              <Text className="text-gray-900 font-medium">
                💵 Pagamento na Entrega
              </Text>
              <Text className="text-gray-600 text-sm mt-1">
                Pague em dinheiro ou cartão no momento da entrega
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botão Finalizar */}
      <View className="bg-white border-t border-gray-200 p-6">
        <TouchableOpacity
          onPress={finalizarPedido}
          disabled={loading}
          className={`py-4 rounded-xl ${
            loading ? "bg-gray-400" : "bg-violet-600"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text className="text-white text-center font-bold text-lg">
              Finalizar Pedido - R$ {totalComTaxa.toFixed(2)}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
