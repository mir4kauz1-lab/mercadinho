import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TabKey = 'home' | 'explore' | 'chat' | 'favorites';

interface BottomNavigationProps {
  active: TabKey;
  onFabPress?: () => void;
}

export const BOTTOM_NAV_HEIGHT = 50;

export function BottomNavigation({ active, onFabPress }: BottomNavigationProps) {
  const router = useRouter();

  const handleNavigate = (key: TabKey) => {
    switch (key) {
      case 'home':
        router.replace('/(tabs)');
        break;
      case 'explore':
        router.replace('/(tabs)/explore');
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.nav}>
        <TouchableOpacity style={styles.navItem} onPress={() => handleNavigate('home')}>
          <Ionicons name="home" size={24} color={active === 'home' ? '#FFF' : '#E0D4FF'} />
          <Text style={active === 'home' ? styles.navLabelActive : styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => handleNavigate('explore')}>
          <Ionicons
            name="pricetag-outline"
            size={24}
            color={active === 'explore' ? '#FFF' : '#E0D4FF'}
          />
          <Text style={active === 'explore' ? styles.navLabelActive : styles.navLabel}>Ofertas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => handleNavigate('chat')}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="#E0D4FF" />
          <Text style={styles.navLabel}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => handleNavigate('favorites')}>
          <Ionicons name="heart-outline" size={24} color="#E0D4FF" />
          <Text style={styles.navLabel}>Favoritos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 0,
  },
  nav: {
    flexDirection: 'row',
    backgroundColor: '#7C3AED',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navLabel: {
    fontSize: 11,
    color: '#E0D4FF',
    fontWeight: '500',
  },
  navLabelActive: {
    fontSize: 11,
    color: '#FFF',
    fontWeight: '600',
  },
});
