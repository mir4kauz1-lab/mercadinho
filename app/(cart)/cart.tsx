// Carrinho movido para (cart)
import { BottomNavigation } from "@/components/bottom-navigation";
import { useCart } from "@/contexts/cart-context";
import { produtosAPI } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import {
  Image,
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
  preco: number | string;
  imagem: string | null;
  estoque: number;
}
export default function CartScreen() {
  const router = useRouter();
  const {
    items: cartItems,
    updateQuantity,
    getTotalPrice,
    addItem,
  } = useCart();
  const [suggestedProducts, setSuggestedProducts] = useState<Produto[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const loadSuggestedProducts = useCallback(async () => {
    try {
      setLoadingSuggestions(true);
      const response = await produtosAPI.getAll();
      if (response.success && response.produtos) {
        const cartIds = cartItems.map((item) => item.id);
        const available = response.produtos.filter((p: Produto) => {
          const hashStr = p.id.slice(-10);
          const productId = parseInt(hashStr, 36);
          return !cartIds.includes(productId) && p.estoque > 0;
        });
        const shuffled = available.sort(() => Math.random() - 0.5);
        setSuggestedProducts(shuffled.slice(0, 4));
      }
    } catch (error) {
      console.error("Erro ao buscar sugestões:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  }, [cartItems]);
  useEffect(() => {
    loadSuggestedProducts();
  }, [loadSuggestedProducts]);
  const handleAddSuggestedProduct = (product: Produto) => {
    const preco =
      typeof product.preco === "string"
        ? parseFloat(product.preco)
        : product.preco;
    const hashStr = product.id.slice(-10);
    const productId = parseInt(hashStr, 36);
    addItem({
      id: productId,
      name: product.nome,
      price: preco,
      image: product.imagem,
      quantity: 1,
    });
    loadSuggestedProducts();
  };
  const handleUpdateQuantity = (id: number, delta: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (item) {
      const newQuantity = item.quantity + delta;
      if (newQuantity > 0) {
        updateQuantity(id, newQuantity);
      }
    }
  };
  const totalProducts = getTotalPrice();
  const taxes = 0.0;
  const total = totalProducts + taxes;
  return (
    <View style={styles.container}>
      
      <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Carrinho</Text>
        <TouchableOpacity onPress={() => console.log("Usuário saiu")}>
          <Text style={styles.clearButton}>Sair</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        
        {cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={80} color="#CCC" />
            <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
          </View>
        ) : (
          <>
            {cartItems.map((item) => (
              <View key={item.id} style={styles.productItem}>
                
                {!item.image ? (
                  <View style={styles.productImagePlaceholder}>
                    <Text style={styles.productImageEmoji}>📦</Text>
                  </View>
                ) : typeof item.image === "string" &&
                  item.image.length <= 4 &&
                  !item.image.startsWith("http") ? (
                  <View style={styles.productImagePlaceholder}>
                    <Text style={styles.productImageEmoji}>{item.image}</Text>
                  </View>
                ) : typeof item.image === "string" &&
                  item.image.startsWith("http") ? (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.productImage}
                  />
                ) : typeof item.image === "string" &&
                  item.image.startsWith("/uploads") ? (
                  <Image
                    source={{
                      uri: `https://santafe-dashboard.vercel.app${item.image}`,
                    }}
                    style={styles.productImage}
                  />
                ) : (
                  <Image
                    source={item.image as any}
                    style={styles.productImage}
                  />
                )}
                <View style={styles.productDetails}>
                  
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productPrice}>
                    R$ {item.price.toFixed(2)}
                  </Text>
                  <View style={styles.quantityRow}>
                    
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleUpdateQuantity(item.id, -1)}
                    >
                      <Ionicons name="remove" size={20} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleUpdateQuantity(item.id, 1)}
                    >
                      <Ionicons name="add" size={20} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.productActions}>
                  
                  <TouchableOpacity style={styles.favoriteButton}>
                    <Ionicons name="heart-outline" size={24} color="#666" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuButton}>
                    <Ionicons name="ellipsis-vertical" size={24} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <View style={styles.summaryContainer}>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Produtos ({cartItems.length})
                </Text>
                <Text style={styles.summaryValue}>
                  R$ {totalProducts.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Taxas</Text>
                <Text style={styles.summaryValue}>R$ {taxes.toFixed(2)}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabelSmall}>Total</Text>
                <Text style={styles.totalValueSmall}>
                  R$ {total.toFixed(2)}
                </Text>
              </View>
            </View>
            <View style={styles.suggestionsContainer}>
              
              <Text style={styles.suggestionsTitle}>
                Sugestões para você
              </Text>
              <Text style={styles.suggestionsSubtitle}>
                Adicione mais itens ao seu carrinho
              </Text>
              {loadingSuggestions ? (
                <View style={styles.suggestionsLoading}>
                  <Text style={styles.suggestionsLoadingText}>
                    Carregando sugestões...
                  </Text>
                </View>
              ) : suggestedProducts.length === 0 ? (
                <View style={styles.suggestionsLoading}>
                  <Text style={styles.suggestionsLoadingText}>
                    Nenhuma sugestão disponível
                  </Text>
                </View>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.suggestionsScroll}
                >
                  
                  {suggestedProducts.map((product) => {
                    const hashStr = product.id.slice(-10);
                    const productId = parseInt(hashStr, 36);
                    const isInCart = cartItems.some(
                      (item) => item.id === productId
                    );
                    const preco =
                      typeof product.preco === "string"
                        ? parseFloat(product.preco)
                        : product.preco;
                    const renderImage = () => {
                      if (!product.imagem)
                        return (
                          <View style={styles.suggestionImagePlaceholder}>
                            <Text style={styles.suggestionImageEmoji}>📦</Text>
                          </View>
                        );
                      if (
                        product.imagem.length <= 4 &&
                        !product.imagem.startsWith("http")
                      )
                        return (
                          <View style={styles.suggestionImagePlaceholder}>
                            <Text style={styles.suggestionImageEmoji}>
                              {product.imagem}
                            </Text>
                          </View>
                        );
                      if (product.imagem.startsWith("http"))
                        return (
                          <Image
                            source={{ uri: product.imagem }}
                            style={styles.suggestionImage}
                          />
                        );
                      if (product.imagem.startsWith("/uploads"))
                        return (
                          <Image
                            source={{
                              uri: `https://santafe-dashboard.vercel.app${product.imagem}`,
                            }}
                            style={styles.suggestionImage}
                          />
                        );
                      return (
                        <View style={styles.suggestionImagePlaceholder}>
                          <Text style={styles.suggestionImageEmoji}>📦</Text>
                        </View>
                      );
                    };
                    return (
                      <View key={product.id} style={styles.suggestionCard}>
                        
                        {renderImage()}
                        <Text style={styles.suggestionName} numberOfLines={2}>
                          {product.nome}
                        </Text>
                        <Text style={styles.suggestionPrice}>
                          R$ {preco.toFixed(2)}
                        </Text>
                        <TouchableOpacity
                          style={[
                            styles.addSuggestionButton,
                            isInCart && styles.addSuggestionButtonDisabled,
                          ]}
                          onPress={() => handleAddSuggestedProduct(product)}
                          disabled={isInCart}
                        >
                          
                          <Ionicons
                            name={isInCart ? "checkmark" : "add"}
                            size={20}
                            color="#FFF"
                          />
                          <Text style={styles.addSuggestionButtonText}>
                            {isInCart ? "Adicionado" : "Adicionar"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </ScrollView>
              )}
            </View>
          </>
        )}
        <View style={styles.bottomSpacer} />
      </ScrollView>
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => router.push("/checkout" as any)}
          >
            <Text style={styles.checkoutButtonText}>FINALIZAR PEDIDO</Text>
          </TouchableOpacity>
        </View>
      )}
      <BottomNavigation active="home" />
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
    paddingBottom: 16,
    backgroundColor: "#7C3AED",
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#FFF" },
  clearButton: { fontSize: 16, fontWeight: "600", color: "#FFF" },
  content: { flex: 1 },
  contentContainer: { paddingBottom: 20 },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyText: { fontSize: 18, color: "#999", marginTop: 20 },
  productItem: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    marginRight: 12,
  },
  productImagePlaceholder: {
    width: 70,
    height: 70,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  productImageEmoji: { fontSize: 40 },
  productDetails: { flex: 1, justifyContent: "space-between" },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#666",
    marginBottom: 8,
  },
  quantityRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    minWidth: 30,
    textAlign: "center",
  },
  productActions: {
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingLeft: 8,
  },
  favoriteButton: { padding: 4 },
  menuButton: { padding: 4 },
  summaryContainer: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginTop: 24,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: { fontSize: 14, color: "#666" },
  summaryValue: { fontSize: 14, fontWeight: "600", color: "#333" },
  divider: { height: 1, backgroundColor: "#E0E0E0", marginVertical: 8 },
  totalLabelSmall: { fontSize: 16, fontWeight: "700", color: "#333" },
  totalValueSmall: { fontSize: 18, fontWeight: "700", color: "#333" },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  checkoutButton: {
    backgroundColor: "#7C3AED",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  bottomSpacer: { height: 20 },
  suggestionsContainer: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginTop: 24,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  suggestionsSubtitle: { fontSize: 14, color: "#666", marginBottom: 16 },
  suggestionsScroll: { gap: 12, paddingRight: 20 },
  suggestionsLoading: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  suggestionsLoadingText: { fontSize: 14, color: "#999", fontStyle: "italic" },
  suggestionCard: {
    width: 140,
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  suggestionImage: {
    width: "100%",
    height: 80,
    resizeMode: "contain",
    marginBottom: 8,
  },
  suggestionImagePlaceholder: {
    width: "100%",
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    marginBottom: 8,
  },
  suggestionImageEmoji: { fontSize: 40 },
  suggestionName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
    minHeight: 36,
  },
  suggestionPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7C3AED",
    marginBottom: 10,
  },
  addSuggestionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7C3AED",
    borderRadius: 8,
    paddingVertical: 8,
    gap: 4,
  },
  addSuggestionButtonDisabled: { backgroundColor: "#4CAF50" },
  addSuggestionButtonText: { fontSize: 12, fontWeight: "700", color: "#FFF" },
});

