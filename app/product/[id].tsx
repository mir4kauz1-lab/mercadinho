import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function ProductScreen() {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  // Dados mockados - você pode substituir por dados reais baseados no ID
  const product = {
    name: 'Pão Francês Unidade',
    price: 1.29,
    rating: 4.9,
    description:
      'Pão Francês Santafé — fresquinho, crocante por fora e macio por dentro! Ideal para o café da manhã ou aquele lanche da tarde irresistível. Peça agora e sinta o sabor da padaria em casa!',
    image: require('../../assets/images/react-logo.png'),
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const totalPrice = product.price * quantity;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="#7C3AED" />
      <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="search" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image source={product.image} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#FFA500" />
            <Text style={styles.ratingText}>{product.rating}</Text>
            <Text style={styles.priceText}>R$ {product.price.toFixed(2)}</Text>
          </View>

          <Text style={styles.description} numberOfLines={3}>{product.description}</Text>

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
              <TouchableOpacity style={styles.quantityButton} onPress={handleIncrement}>
                <Ionicons name="add" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalPrice}>R$ {totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Colocar no Carrinho</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#7C3AED',
  },
  headerButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  imageContainer: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  image: {
    width: '100%',
    height: 180,
  },
  detailsContainer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
    marginLeft: 8,
  },
  description: {
    fontSize: 12,
    lineHeight: 17,
    color: '#666',
    marginBottom: 12,
  },
  quantitySection: {
    marginBottom: 4,
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    minWidth: 32,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  totalContainer: {
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 16,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});
