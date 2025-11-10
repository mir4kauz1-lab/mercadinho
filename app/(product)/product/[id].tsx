// Produto movido para (product)/product
import { BottomNavigation } from "@/components/bottom-navigation";
import { PageTransition } from "@/components/page-transition";
import { useCart } from "@/contexts/cart-context";
import { produtosAPI } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
interface Produto {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  estoque: number;
  imagem: string | null;
  ativo: boolean;
  categoria: { id: string; nome: string };
}
export default function ProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadProduto = useCallback(async () => {
    try {
      setLoading(true);
      const response = await produtosAPI.getAll();
      if (response.success && response.produtos) {
        const found = response.produtos.find(
          (p: Produto) => p.id === params.id
        );
        if (found) {
          setProduto(found);
        } else {
          setError("Produto não encontrado");
        }
      } else {
        setError("Erro ao carregar produto");
      }
    } catch (err) {
      console.error("Erro ao buscar produto:", err);
      setError("Erro ao carregar produto");
    } finally {
      setLoading(false);
    }
  }, [params.id]);
  useEffect(() => {
    loadProduto();
  }, [loadProduto]);
  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };
  const handleAddToCart = () => {
    if (!produto) return;
    const preco =
      typeof produto.preco === "string"
        ? parseFloat(produto.preco)
        : produto.preco;
    const hashStr = produto.id.slice(-10);
    const productId = parseInt(hashStr, 36);
    addItem({
      id: productId,
      productId: produto.id, // UUID original
      name: produto.nome,
      price: preco,
      image: produto.imagem,
      quantity: quantity,
    });
    router.push("/cart" as any);
  };
  if (loading) {
    return (
      <PageTransition type="fade">
        <View style={styles.wrapper}>
          <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />
          <SafeAreaView style={styles.safeArea}>
            <View style={[styles.container, styles.centerContent]}>
              <ActivityIndicator size="large" color="#7C3AED" />
              <Text style={styles.loadingText}>Carregando produto...</Text>
            </View>
          </SafeAreaView>
        </View>
      </PageTransition>
    );
  }
  if (error || !produto) {
    return (
      <PageTransition type="fade">
        <View style={styles.wrapper}>
          <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />
          <SafeAreaView style={styles.safeArea}>
            <View style={[styles.container, styles.centerContent]}>
              <Ionicons name="alert-circle-outline" size={64} color="#999" />
              <Text style={styles.errorText}>
                {error || "Produto não encontrado"}
              </Text>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Text style={styles.backButtonText}>Voltar</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </PageTransition>
    );
  }
  const preco =
    typeof produto.preco === "string"
      ? parseFloat(produto.preco)
      : produto.preco;
  const totalPrice = preco * quantity;
  const isEmoji =
    typeof produto.imagem === "string" && produto.imagem.length <= 2;
  const isUrl =
    typeof produto.imagem === "string" &&
    (produto.imagem.startsWith("http") ||
      produto.imagem.startsWith("https") ||
      produto.imagem.startsWith("/uploads"));
  const imageUrl =
    typeof produto.imagem === "string" && produto.imagem.startsWith("/uploads")
      ? `https://santafe-dashboard.vercel.app${produto.imagem}`
      : produto.imagem;
  return (
    <PageTransition type="scale">
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.wrapper}>
        <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.headerButton}
              >
                <Ionicons name="arrow-back" size={24} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="search" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.content}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                  {isEmoji ? (
                    <Text style={styles.emojiImage}>{produto.imagem}</Text>
                  ) : isUrl ? (
                    <Image
                      source={{ uri: imageUrl as string }}
                      style={styles.image}
                      resizeMode="contain"
                    />
                  ) : (
                    <Ionicons name="image-outline" size={120} color="#DDD" />
                  )}
                </View>
                <View style={styles.detailsContainer}>
                  <Text style={styles.productName}>{produto.nome}</Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={16} color="#FFA500" />
                    <Text style={styles.ratingText}>4.9</Text>
                    <Text style={styles.priceText}>R$ {preco.toFixed(2)}</Text>
                  </View>
                  <Text style={styles.categoryBadge}>
                    {produto.categoria.nome}
                  </Text>
                  {produto.descricao && (
                    <Text style={styles.description}>{produto.descricao}</Text>
                  )}
                  <View style={styles.stockInfo}>
                    <Ionicons
                      name={
                        produto.estoque > 0
                          ? "checkmark-circle"
                          : "close-circle"
                      }
                      size={18}
                      color={produto.estoque > 0 ? "#10B981" : "#EF4444"}
                    />
                    <Text
                      style={[
                        styles.stockText,
                        { color: produto.estoque > 0 ? "#10B981" : "#EF4444" },
                      ]}
                    >
                      {produto.estoque > 0
                        ? `${produto.estoque} unidades disponíveis`
                        : "Produto esgotado"}
                    </Text>
                  </View>
                  <View style={styles.quantitySection}>
                    <Text style={styles.quantityLabel}>Quantidade</Text>
                    <View style={styles.quantityControls}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={handleDecrement}
                        disabled={quantity === 1}
                      >
                        <Ionicons name="remove" size={20} color="#FFF" />
                      </TouchableOpacity>
                      <Text style={styles.quantityValue}>{quantity}</Text>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={handleIncrement}
                        disabled={quantity >= produto.estoque}
                      >
                        <Ionicons name="add" size={20} color="#FFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
            <View style={styles.footer}>
              <View style={styles.totalContainer}>
                <Text style={styles.totalPrice}>
                  R$ {totalPrice.toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.addToCartButton,
                  produto.estoque === 0 && styles.disabledButton,
                ]}
                onPress={handleAddToCart}
                disabled={produto.estoque === 0}
              >
                <Text style={styles.addToCartText}>
                  {produto.estoque > 0 ? "Colocar no Carrinho" : "Esgotado"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
        <BottomNavigation active="home" />
      </View>
    </PageTransition>
  );
}
const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#7C3AED" },
  safeArea: { flex: 1, backgroundColor: "#7C3AED" },
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#7C3AED",
  },
  headerButton: { padding: 8 },
  content: { flex: 1, backgroundColor: "#FFF" },
  imageContainer: {
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  image: { width: "100%", height: 180 },
  detailsContainer: {
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  ratingText: { fontSize: 14, fontWeight: "600", color: "#333" },
  priceText: { fontSize: 14, fontWeight: "400", color: "#666", marginLeft: 8 },
  description: {
    fontSize: 12,
    lineHeight: 17,
    color: "#666",
    marginBottom: 12,
  },
  quantitySection: { marginBottom: 4 },
  quantityLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    minWidth: 32,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  totalContainer: {
    backgroundColor: "#7C3AED",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  totalPrice: { fontSize: 18, fontWeight: "700", color: "#FFF" },
  addToCartButton: {
    flex: 1,
    backgroundColor: "#333",
    borderRadius: 16,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  addToCartText: { fontSize: 16, fontWeight: "600", color: "#FFF" },
  centerContent: { justifyContent: "center", alignItems: "center", gap: 16 },
  loadingText: { fontSize: 16, color: "#666", marginTop: 8 },
  errorText: { fontSize: 16, color: "#666", marginTop: 8, textAlign: "center" },
  backButton: {
    backgroundColor: "#7C3AED",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  backButtonText: { fontSize: 16, fontWeight: "600", color: "#FFF" },
  emojiImage: { fontSize: 120 },
  categoryBadge: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7C3AED",
    backgroundColor: "#EDE9FE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  stockInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  stockText: { fontSize: 14, fontWeight: "600" },
  disabledButton: { backgroundColor: "#999", opacity: 0.5 },
});
