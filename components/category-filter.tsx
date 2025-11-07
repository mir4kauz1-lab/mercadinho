import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <ScrollView
      style={styles.scroll}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.categoryButtonActive
          ]}
          onPress={() => onSelectCategory(category)}
        >
          <Text 
            style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextActive
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    height: 64,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  categoryButtonActive: {
    backgroundColor: '#7C3AED',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  categoryTextActive: {
    color: '#FFF',
  },
});
