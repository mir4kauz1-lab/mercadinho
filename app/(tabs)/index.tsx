import { BOTTOM_NAV_HEIGHT, BottomNavigation } from '@/components/bottom-navigation';
import { CategoryFilter } from '@/components/category-filter';
import { ProductCard } from '@/components/product-card';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Mock de produtos
const PRODUCTS = [
  { id: 1, name: 'Picanha Friboi kg', price: 69.00, rating: 4.9, image: require('@/assets/images/partial-react-logo.png'), category: 'Todos' },
  { id: 2, name: 'Coca-Cola 2L', price: 8.99, rating: 4.8, image: require('@/assets/images/partial-react-logo.png'), category: 'Bebidas' },
  { id: 3, name: 'Pão Frances un', price: 1.29, rating: 4.6, image: require('@/assets/images/partial-react-logo.png'), category: 'Todos' },
  { id: 4, name: 'Batata Inglesa kg', price: 1.99, rating: 4.5, image: require('@/assets/images/partial-react-logo.png'), category: 'Todos' },
  { id: 5, name: 'Arroz Tio João 5kg', price: 28.90, rating: 4.7, image: require('@/assets/images/partial-react-logo.png'), category: 'Limpeza' },
  { id: 6, name: 'Feijão Preto kg', price: 7.50, rating: 4.6, image: require('@/assets/images/partial-react-logo.png'), category: 'Todos' },
];

const CATEGORIES = ['Todos', 'Limpeza', 'Bebidas', 'Açougue'];

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>SantaFé</Text>
          <Text style={styles.subtitle}>O Supermercado na Sua casa</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={32} color="#333" />
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
          <Ionicons name="options" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <CategoryFilter
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Products Grid */}
      <ScrollView
        style={styles.productsContainer}
        contentContainerStyle={styles.productsContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.productsGrid}>
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              rating={product.rating}
              image={product.image}
              onFavorite={() => toggleFavorite(product.id)}
              isFavorite={favorites.includes(product.id)}
            />
          ))}
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>

      <BottomNavigation active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFF',
  },
  logo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  profileButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bottomSpacer: {
    height: 0,
  },
});
