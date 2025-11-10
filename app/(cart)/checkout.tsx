import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "@/contexts/cart-context";
import { useUser } from "@/contexts/user-context";
import { storageService } from "@/services/storage";

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const { user, logout } = useUser();
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
      const response = await fetch(
        "https://santafe-dashboard.vercel.app/api/pedidos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clienteId: user.id,
            itens: items.map((item) => ({
              produtoId: item.productId, // Usa UUID original do produto
              quantidade: item.quantity,
            })),
          }),
        }
      );

      const data = await response.json();

      // Se o cliente não foi encontrado (404), significa que os dados estão desatualizados
      if (
        response.status === 404 &&
        data.message?.includes("Cliente não encontrado")
      ) {
        await storageService.removeCliente();
        await logout();
        Alert.alert(
          "Sessão Inválida",
          "Seus dados de login estão desatualizados. Por favor, faça login novamente."
        );
        router.replace("/(auth)/login");
        return;
      }

      if (data.success) {
        clearCart();
        // Navega para a página de sucesso com dados do pedido
        router.push(
          `/(account)/order-success?orderId=${
            data.pedido.id
          }&total=${totalComTaxa.toFixed(2)}`
        );
      } else {
        Alert.alert("Erro", data.message || "Erro ao finalizar pedido");
      }
    } catch (error: any) {
      console.error("Erro ao finalizar pedido:", error);
      Alert.alert("Erro", "Erro ao processar pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />
        <Text style={styles.emptyTitle}>Faça login para continuar</Text>
        <Text style={styles.emptySubtitle}>
          Você precisa estar logado para finalizar seu pedido
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Finalizar Pedido</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Dados do Cliente */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dados de Entrega</Text>

          <Text style={styles.label}>Nome</Text>
          <View style={styles.inputDisabled}>
            <Text style={styles.inputDisabledText}>{user.nome}</Text>
          </View>

          <Text style={styles.label}>Email</Text>
          <View style={styles.inputDisabled}>
            <Text style={styles.inputDisabledText}>{user.email}</Text>
          </View>

          <Text style={styles.label}>Telefone *</Text>
          <TextInput
            value={telefone}
            onChangeText={setTelefone}
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
            style={styles.input}
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.label}>Endereço de Entrega *</Text>
          <TextInput
            value={endereco}
            onChangeText={setEndereco}
            placeholder="Rua, número, bairro, cidade"
            multiline
            numberOfLines={3}
            style={[styles.input, styles.textArea]}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Resumo do Pedido */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resumo do Pedido</Text>

          {items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemText}>
                {item.quantity}x {item.name}
              </Text>
              <Text style={styles.itemPrice}>
                R$ {(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>R$ {total.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Taxa de Entrega</Text>
            <Text style={styles.summaryValue}>R$ {taxaEntrega.toFixed(2)}</Text>
          </View>

          <View style={[styles.divider, { marginTop: 8 }]} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>R$ {totalComTaxa.toFixed(2)}</Text>
          </View>
        </View>

        {/* Método de Pagamento */}
        <View style={[styles.card, { marginBottom: 100 }]}>
          <Text style={styles.cardTitle}>Método de Pagamento</Text>
          <View style={styles.paymentMethod}>
            <Text style={styles.paymentMethodTitle}>
              💵 Pagamento na Entrega
            </Text>
            <Text style={styles.paymentMethodSubtitle}>
              Pague em dinheiro ou cartão no momento da entrega
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Botão Finalizar */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={finalizarPedido}
          disabled={loading}
          style={[styles.finishButton, loading && styles.finishButtonDisabled]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.finishButtonText}>
              Finalizar Pedido - R$ {totalComTaxa.toFixed(2)}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#7C3AED",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    color: "#111827",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  inputDisabled: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 12,
  },
  inputDisabledText: {
    fontSize: 16,
    color: "#111827",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  itemText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#7C3AED",
  },
  paymentMethod: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 12,
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  paymentMethodSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    padding: 20,
  },
  finishButton: {
    backgroundColor: "#7C3AED",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  finishButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  finishButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
  },
  loginButton: {
    backgroundColor: "#7C3AED",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
