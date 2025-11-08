import { BOTTOM_NAV_HEIGHT, BottomNavigation } from '@/components/bottom-navigation';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Descubra</Text>
          <Text style={styles.subtitle}>Ofertas especiais para você</Text>
        </View>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#FFF" />
          <TextInput
            placeholder="Buscar promoções"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            style={styles.searchInput}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cardLarge}>
          <Text style={styles.cardTitle}>Cupom da Semana</Text>
          <Text style={styles.cardHighlight}>10% OFF em bebidas</Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.cardSmall}>
            <Text style={styles.cardLabel}>Club SantaFé</Text>
            <Text style={styles.cardValue}>Compre 2 Leve 3</Text>
          </View>
          <View style={styles.cardSmall}>
            <Text style={styles.cardLabel}>Entrega Grátis</Text>
            <Text style={styles.cardValue}>Pedidos acima de R$ 99</Text>
          </View>
        </View>
      </ScrollView>

      <BottomNavigation active="explore" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#7C3AED',
    gap: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFF',
  },
  subtitle: {
    fontSize: 13,
    color: '#E0D4FF',
    marginTop: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#FFF',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: BOTTOM_NAV_HEIGHT,
    gap: 20,
  },
  cardLarge: {
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    color: '#E0D4FF',
    fontWeight: '600',
  },
  cardHighlight: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
  },
  cardSmall: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    gap: 6,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7C3AED',
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
});
