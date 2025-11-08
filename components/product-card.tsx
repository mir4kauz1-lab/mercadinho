import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProductCardProps {
  id?: string;
  name: string;
  price: number;
  rating: number;
  image: any;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

export function ProductCard({ id = '1', name, price, rating, image, onFavorite, isFavorite = false }: ProductCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/product/[id]',
      params: { id },
    });
  };

  const handleFavorite = (e: any) => {
    e.stopPropagation();
    onFavorite?.();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} resizeMode="contain" />
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        <Text style={styles.price}>R$ {price.toFixed(2)}</Text>
        
        <View style={styles.footer}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFA500" />
            <Text style={styles.rating}>{rating.toFixed(1)}</Text>
          </View>
          
          <TouchableOpacity onPress={handleFavorite} style={styles.favoriteButton}>
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? "#FF0000" : "#666"} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    minHeight: 36,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  favoriteButton: {
    padding: 4,
  },
});
