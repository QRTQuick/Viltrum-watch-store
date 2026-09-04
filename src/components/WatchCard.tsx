import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import { Heart, ShoppingBag, Eye, Zap, Star, Shield, Sparkles } from 'lucide-react';
import { Watch } from '../types';
import { useAuth } from '../context/AuthContext';
import { useWatches } from '../context/WatchContext';
import { useCart } from '../context/CartContext';
import { THEME } from '../styles/theme';

interface WatchCardProps {
  watch: Watch;
  onOpenDetail?: (watch: Watch) => void;
}

export const WatchCard: React.FC<WatchCardProps> = ({ watch, onOpenDetail }) => {
  const { isInWishlist, toggleWishlist } = useAuth();
  const { formatPrice, openWatchDetail } = useWatches();
  const { addToCart, checkoutDirectBuyNow } = useCart();

  const isLiked = isInWishlist(watch.id);
  const handleOpen = () => {
    if (onOpenDetail) {
      onOpenDetail(watch);
    } else {
      openWatchDetail(watch);
    }
  };

  const discountPercent = watch.originalPrice
    ? Math.round(((watch.originalPrice - watch.price) / watch.originalPrice) * 100)
    : 0;

  return (
    <View style={styles.cardContainer}>
      {/* Card Image Wrap */}
      <TouchableOpacity
        style={styles.imageWrap}
        activeOpacity={0.9}
        onPress={handleOpen}
      >
        <Image
          source={{ uri: watch.images[0] || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80' }}
          style={styles.watchImage}
        />

        {/* Top Floating Badges */}
        <View style={styles.topBadgesRow}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeText}>{watch.brand.toUpperCase()}</Text>
          </View>

          {discountPercent > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>-{discountPercent}%</Text>
            </View>
          )}

          {watch.isBestSeller && (
            <View style={styles.bestSellerBadge}>
              <Sparkles size={9} color="#FFF3B0" />
              <Text style={styles.bestSellerText}>BEST SELLER</Text>
            </View>
          )}
        </View>

        {/* Wishlist Floating Button */}
        <TouchableOpacity
          style={[styles.wishlistBtn, isLiked && styles.wishlistBtnActive]}
          onPress={(e) => {
            e.stopPropagation();
            toggleWishlist(watch.id);
          }}
        >
          <Heart
            size={16}
            color={isLiked ? '#FF4D4D' : '#F8FAFC'}
            fill={isLiked ? '#FF4D4D' : 'transparent'}
          />
        </TouchableOpacity>

        {/* Quick View Hover Hint / Button */}
        <View style={styles.quickViewOverlay}>
          <Eye size={14} color="#FFF3B0" />
          <Text style={styles.quickViewText}>Inspect Timepiece</Text>
        </View>
      </TouchableOpacity>

      {/* Card Info Details */}
      <View style={styles.cardBody}>
        {/* Model Ref & Specs Line */}
        <View style={styles.specsLine}>
          <Text style={styles.modelRefText}>{watch.modelRef}</Text>
          <Text style={styles.dotSeparator}>•</Text>
          <Text style={styles.specMiniText}>{watch.movement}</Text>
          <Text style={styles.dotSeparator}>•</Text>
          <Text style={styles.specMiniText}>{watch.caseSize}</Text>
        </View>

        {/* Watch Name */}
        <TouchableOpacity onPress={handleOpen}>
          <Text style={styles.watchName} numberOfLines={2}>
            {watch.name}
          </Text>
        </TouchableOpacity>

        {/* Ratings & Stock Status */}
        <View style={styles.ratingRow}>
          <View style={styles.starsWrap}>
            <Star size={12} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingNum}>{watch.rating.toFixed(1)}</Text>
            <Text style={styles.reviewsCount}>({watch.reviewsCount})</Text>
          </View>

          {watch.stock <= 4 ? (
            <Text style={styles.lowStockText}>Only {watch.stock} Left</Text>
          ) : (
            <Text style={styles.inStockText}>In Stock</Text>
          )}
        </View>

        {/* Price Row */}
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.currentPrice}>{formatPrice(watch.price)}</Text>
            {watch.originalPrice && (
              <Text style={styles.originalPrice}>{formatPrice(watch.originalPrice)}</Text>
            )}
          </View>

          {/* Quick Red Tech Authenticity Stamp */}
          <View style={styles.authenticityStamp}>
            <Shield size={10} color="#C9A24D" />
            <Text style={styles.stampText}>QRT Certified</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.cardActionRow}>
          <TouchableOpacity
            style={styles.addToCartBtn}
            onPress={() => addToCart(watch, 1)}
          >
            <ShoppingBag size={14} color="#07080A" />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.instantBuyBtn}
            onPress={() => checkoutDirectBuyNow(watch)}
          >
            <Zap size={14} color="#FFF" />
            <Text style={styles.instantBuyText}>Buy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#0D1017',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    position: 'relative',
    transition: 'all 0.3s ease' as any,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 6,
  },
  imageWrap: {
    width: '100%',
    height: 240,
    backgroundColor: '#121824',
    position: 'relative',
    overflow: 'hidden',
  },
  watchImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  topBadgesRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'column',
    gap: 4,
    zIndex: 10,
  },
  brandBadge: {
    backgroundColor: 'rgba(7, 8, 10, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 77, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  brandBadgeText: {
    color: '#FFF3B0',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 1,
  },
  discountBadge: {
    backgroundColor: '#E61E2A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  discountBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
  },
  bestSellerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(201, 162, 77, 0.3)',
    borderWidth: 1,
    borderColor: '#C9A24D',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  bestSellerText: {
    color: '#FFF3B0',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  wishlistBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 99,
    backgroundColor: 'rgba(7, 8, 10, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  wishlistBtnActive: {
    backgroundColor: 'rgba(230, 30, 42, 0.25)',
    borderColor: '#FF4D4D',
  },
  quickViewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(7, 8, 10, 0.85)',
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(201, 162, 77, 0.2)',
  },
  quickViewText: {
    color: '#FFF3B0',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardBody: {
    padding: 14,
  },
  specsLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  modelRefText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#C9A24D',
    letterSpacing: 0.5,
  },
  dotSeparator: {
    color: '#475569',
    fontSize: 10,
  },
  specMiniText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  watchName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
    lineHeight: 18,
    height: 36,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  starsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingNum: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  reviewsCount: {
    fontSize: 10,
    color: '#64748B',
  },
  lowStockText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EF4444',
  },
  inStockText: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 8,
  },
  currentPrice: {
    fontFamily: THEME.fonts.serif,
    fontSize: 17,
    fontWeight: '800',
    color: '#FFF3B0',
  },
  originalPrice: {
    fontSize: 11,
    color: '#64748B',
    textDecorationLine: 'line-through',
    marginTop: -2,
  },
  authenticityStamp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(201, 162, 77, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 77, 0.2)',
  },
  stampText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#C9A24D',
    letterSpacing: 0.5,
  },
  cardActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#C9A24D',
    paddingVertical: 8,
    borderRadius: 8,
  },
  addToCartText: {
    color: '#07080A',
    fontSize: 11.5,
    fontWeight: '800',
  },
  instantBuyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#E61E2A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  instantBuyText: {
    color: '#FFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
});
