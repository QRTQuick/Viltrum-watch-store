import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWatches } from '../context/WatchContext';
import { useCart } from '../context/CartContext';
import { WatchCard } from '../components/WatchCard';
import { THEME } from '../styles/theme';

export const WishlistPage: React.FC<{ onExploreCatalog: () => void }> = ({ onExploreCatalog }) => {
  const { profile } = useAuth();
  const { watches } = useWatches();

  const wishlistWatches = watches.filter((w) => profile?.wishlist?.includes(w.id));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Heart size={24} color="#FF4D4D" fill="#FF4D4D" />
          <View>
            <Text style={styles.title}>Saved Timepieces & Wishlist</Text>
            <Text style={styles.subtitle}>
              Curated watches saved for your personal vault ({wishlistWatches.length} items).
            </Text>
          </View>
        </View>
      </View>

      {wishlistWatches.length === 0 ? (
        <View style={styles.emptyBox}>
          <Heart size={44} color="#64748B" />
          <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
          <Text style={styles.emptyText}>
            Tap the heart icon on any Rolex, Casio, Rick, Arnahory, G-Shock, CK, Fossil, or MK watch to save it here.
          </Text>
          <TouchableOpacity style={styles.exploreBtn} onPress={onExploreCatalog}>
            <Text style={styles.exploreBtnText}>Discover Watches</Text>
            <ArrowRight size={16} color="#07080A" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.gridContainer}>
          {wishlistWatches.map((watch) => (
            <View key={watch.id} style={styles.cardCol}>
              <WatchCard watch={watch} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 1400,
    marginHorizontal: 'auto' as any,
    width: '100%',
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontFamily: THEME.fonts.serif,
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF3B0',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  emptyBox: {
    backgroundColor: '#0D1017',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  emptyTitle: {
    fontFamily: THEME.fonts.serif,
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
    marginTop: 12,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 12.5,
    color: '#94A3B8',
    textAlign: 'center',
    maxWidth: 400,
    lineHeight: 18,
    marginBottom: 20,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#C9A24D',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  exploreBtnText: {
    color: '#07080A',
    fontSize: 13,
    fontWeight: '800',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  cardCol: {
    width: '100%',
    padding: 8,
    minWidth: 280,
    maxWidth: '33.333%',
  },
});
