import {
  BOTTOM_NAV_HEIGHT,
  BottomNavigation,
} from "@/components/bottom-navigation";
import { CategoryFilter } from "@/components/category-filter";
import { ProductCard } from "@/components/product-card";
import { PageTransition } from "@/components/page-transition";
import { ProductCardSkeletonGrid } from "@/components/skeletons/product-card-skeleton";
import { Fonts } from "@/constants/fonts";
import { categoriasAPI, produtosAPI } from "@/services/api";
import { storageService } from "@/services/storage";
import { useUser } from "@/contexts/user-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Produto {
  id: string;
  nome: string;
  preco: number;
  descricao: string | null;
  imagem: string | null;
  estoque: number;
  categoria: {
    id: string;
    nome: string;
  };
}

interface Categoria {
  id: string;
  nome: string;
  _count: {
    produtos: number;
  };
}

export default function HomeScreen() {
  const router = useRouter();
  const { logout } = useUser();
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // Verifica se está logado
      const isLoggedIn = await storageService.isLoggedIn();
      if (!isLoggedIn) {
        router.replace("../login");
        return;
      }

      // Carrega produtos e categorias
      const [produtosRes, categoriasRes] = await Promise.all([
        produtosAPI.getAll(),
        categoriasAPI.getAll(),
      ]);

      if (produtosRes.success && produtosRes.produtos) {
        setProdutos(produtosRes.produtos);
      } else {
        Alert.alert("Erro", produtosRes.message || "Erro ao carregar produtos");
      }

      if (categoriasRes.success && categoriasRes.categorias) {
        setCategorias(categoriasRes.categorias);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      Alert.alert("Erro", "Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredProducts = produtos.filter((product) => {
    const matchesCategory =
      selectedCategory === "Todos" ||
      product.categoria.nome === selectedCategory;
    const matchesSearch = product.nome
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleLogout = async () => {
    Alert.alert("Sair", "Deseja realmente sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            // Remove do storageService (legado)
            await storageService.removeCliente();
            // Remove do UserContext (novo)
            await logout();
            // Redireciona para login
            router.replace("/(auth)/login");
          } catch (error) {
            console.error("Erro ao fazer logout:", error);
            Alert.alert("Erro", "Não foi possível sair. Tente novamente.");
          }
        },
      },
    ]);
  };

  const categoryNames = ["Todos", ...categorias.map((cat) => cat.nome).sort()];

  return (
    <PageTransition type="fade">
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>SantaFé</Text>
            <Text style={styles.subtitle}>O Supermercado na Sua casa</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Procurar"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options" size={24} color="#7C3AED" />
          </TouchableOpacity>
        </View>

        {/* Category Filter */}
        <CategoryFilter
          categories={categoryNames}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Products Grid */}
        <ScrollView
          style={styles.productsContainer}
          contentContainerStyle={styles.productsContent}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <ProductCardSkeletonGrid count={6} />
          ) : filteredProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={64} color="#CCC" />
              <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
              <Text style={styles.emptySubtext}>
                Tente buscar por outro termo
              </Text>
            </View>
          ) : (
            <View style={styles.productsGrid}>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.nome}
                  price={product.preco}
                  rating={4.5}
                  image={product.imagem}
                  onFavorite={() => toggleFavorite(product.id)}
                  isFavorite={favorites.includes(product.id)}
                />
              ))}
            </View>
          )}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        <BottomNavigation active="home" />
      </View>
    </PageTransition>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#7C3AED",
  },
  logo: {
    fontSize: 28,
    fontFamily: Fonts.logo,
    color: "#FFF",
  },
  subtitle: {
    fontSize: 12,
    fontFamily: Fonts.light,
    color: "#E0D4FF",
    marginTop: 2,
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
  },
  logoutText: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: "#FFF",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#7C3AED",
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: "#333",
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: "#FFF",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  productsContainer: {
    flex: 1,
  },
  productsContent: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: BOTTOM_NAV_HEIGHT,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: "#666",
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: "#999",
  },
  bottomSpacer: {
    height: 0,
  },
});
