import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Truck,
  RotateCcw,
  ArrowRight,
  Crown,
  Compass,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { useWatches } from '../context/WatchContext';
import { BRAND_INFO } from '../data/initialWatches';
import { THEME } from '../styles/theme';

interface HeroBannerProps {
  onExploreCatalog: () => void;
  onSelectBrand: (brand: string) => void;
  onOpenAdmin: () => void;
}

const FEATURED_SLIDES = [
  {
    title: 'THE APEX OF SWISS PRECISION',
    subtitle: 'Rolex Cosmograph Daytona Panda & Submariner Ceramic Series',
    tag: 'Haute Horlogerie',
    accentColor: '#C9A24D',
    brand: 'Rolex',
    price: '$32,500',
    image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'AVANT-GARDE CYBER TOURBILLON',
    subtitle: 'Rick Hyperion Forged NTPT Carbon & Exposed Mechanics',
    tag: 'Quick Red Tech Exclusive',
    accentColor: '#FF4D4D',
    brand: 'Rick',
    price: '$2,450',
    image: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=1200&q=85',
  },
  {
    title: 'GOLDEN HERITAGE & INDESTRUCTIBLE ICON',
    subtitle: 'G-Shock Full Metal 5000 Gold Heritage Tough Solar Edition',
    tag: 'Global Masterpiece',
    accentColor: '#E5B94E',
    brand: 'G-Shock',
    price: '$580',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&q=85',
  },
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreCatalog,
  onSelectBrand,
  onOpenAdmin,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { setSelectedBrand } = useWatches();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % FEATURED_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = FEATURED_SLIDES[currentSlideIndex];

  return (
    <View style={styles.heroWrapper}>
      {/* Cinematic Hero Box */}
      <View style={styles.heroContainer}>
        {/* Background Image with Gradient Overlay */}
        <Image
          source={{ uri: currentSlide.image }}
          style={styles.heroBgImage}
        />
        <View style={styles.heroOverlayGradient} />

        {/* Content Box */}
        <View style={styles.heroContent}>
          {/* Tagline Badge */}
          <View style={styles.badgeRow}>
            <View style={styles.luxuryTagBadge}>
              <Sparkles size={13} color="#C9A24D" />
              <Text style={styles.luxuryTagText}>{currentSlide.tag}</Text>
            </View>
            <View style={styles.quickRedBadge}>
              <Zap size={12} color="#FFF" />
              <Text style={styles.quickRedBadgeText}>Powered by Quick Red Tech</Text>
            </View>
          </View>

          {/* Main Titles */}
          <Text style={styles.heroMainTitle}>{currentSlide.title}</Text>
          <Text style={styles.heroSubtitle}>{currentSlide.subtitle}</Text>

          {/* Price preview badge */}
          <View style={styles.slidePriceBadge}>
            <Text style={styles.slidePriceLabel}>Starting from</Text>
            <Text style={styles.slidePriceVal}>{currentSlide.price}</Text>
          </View>

          {/* Action CTAs */}
          <View style={styles.heroActionsRow}>
            <TouchableOpacity
              style={styles.primaryHeroBtn}
              onPress={() => {
                setSelectedBrand(currentSlide.brand as any);
                onExploreCatalog();
              }}
            >
              <Text style={styles.primaryHeroBtnText}>Discover {currentSlide.brand}</Text>
              <ArrowRight size={16} color="#07080A" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryHeroBtn}
              onPress={onExploreCatalog}
            >
              <Text style={styles.secondaryHeroBtnText}>View All 9 Watch Brands</Text>
            </TouchableOpacity>
          </View>

          {/* Slide Indicators */}
          <View style={styles.slideDotsRow}>
            {FEATURED_SLIDES.map((_, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.slideDot,
                  currentSlideIndex === i && styles.slideDotActive,
                ]}
                onPress={() => setCurrentSlideIndex(i)}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Brand Selection Bar: Rolex, Casio, Poedager, Rick, Arnahory, G-Shock, CK, Fossil, MK */}
      <View style={styles.brandBarSection}>
        <View style={styles.brandBarHeader}>
          <Text style={styles.brandBarSectionTitle}>Featured Horology Houses & Brands</Text>
          <Text style={styles.brandBarSectionSubtitle}>Curated luxury timepieces authenticated by Quick Red Tech</Text>
        </View>

        <View style={styles.brandsMarqueeGrid}>
          {['Rolex', 'Casio', 'Poedager', 'Rick', 'Arnahory', 'G-Shock', 'CK', 'Fossil', 'MK'].map((brand) => {
            const info = BRAND_INFO[brand];
            return (
              <TouchableOpacity
                key={brand}
                style={styles.brandMarqueeCard}
                onPress={() => {
                  onSelectBrand(brand);
                }}
              >
                <View style={styles.brandCardTop}>
                  <Text style={styles.brandCardTitle}>{brand.toUpperCase()}</Text>
                  <Crown size={12} color="#C9A24D" />
                </View>
                <Text style={styles.brandCardMotto} numberOfLines={1}>
                  {info?.tag || 'Exclusive Horology'}
                </Text>
                <View style={styles.brandCardBottom}>
                  <Text style={styles.brandOriginText}>{info?.origin || 'Authentic'}</Text>
                  <ArrowRight size={12} color="#C9A24D" />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Trust & Guarantee Grid */}
      <View style={styles.trustGrid}>
        <View style={styles.trustCard}>
          <View style={styles.trustIconWrap}>
            <ShieldCheck size={22} color="#C9A24D" />
          </View>
          <View style={styles.trustTextWrap}>
            <Text style={styles.trustTitle}>100% Certified Authentic</Text>
            <Text style={styles.trustDesc}>Every timepiece rigorously examined by Quick Red Tech horologists.</Text>
          </View>
        </View>

        <View style={styles.trustCard}>
          <View style={styles.trustIconWrap}>
            <Truck size={22} color="#3B82F6" />
          </View>
          <View style={styles.trustTextWrap}>
            <Text style={styles.trustTitle}>Insured Worldwide Delivery</Text>
            <Text style={styles.trustDesc}>Complimentary armored express shipping on orders over $500.</Text>
          </View>
        </View>

        <View style={styles.trustCard}>
          <View style={styles.trustIconWrap}>
            <Crown size={22} color="#E61E2A" />
          </View>
          <View style={styles.trustTextWrap}>
            <Text style={styles.trustTitle}>5-Year International Warranty</Text>
            <Text style={styles.trustDesc}>Full servicing and authentic parts guarantee included.</Text>
          </View>
        </View>

        <View style={styles.trustCard}>
          <View style={styles.trustIconWrap}>
            <RotateCcw size={22} color="#10B981" />
          </View>
          <View style={styles.trustTextWrap}>
            <Text style={styles.trustTitle}>14-Day Concierge Return</Text>
            <Text style={styles.trustDesc}>Zero risk try-on with hassle-free returns in original packaging.</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroWrapper: {
    width: '100%',
    maxWidth: 1400,
    marginHorizontal: 'auto' as any,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  heroContainer: {
    position: 'relative',
    height: 480,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 77, 0.25)',
    justifyContent: 'flex-end',
    backgroundColor: '#0D1017',
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  heroBgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlayGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(7, 8, 10, 0.78)',
  },
  heroContent: {
    padding: 36,
    zIndex: 10,
    maxWidth: 760,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  luxuryTagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(201, 162, 77, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 77, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 99,
  },
  luxuryTagText: {
    color: '#FFF3B0',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  quickRedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E61E2A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
  },
  quickRedBadgeText: {
    color: '#FFF',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroMainTitle: {
    fontFamily: THEME.fonts.serif,
    fontSize: 34,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 1.5,
    lineHeight: 40,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#CBD5E1',
    fontWeight: '400',
    lineHeight: 22,
    marginBottom: 16,
  },
  slidePriceBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 20,
  },
  slidePriceLabel: {
    color: '#94A3B8',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  slidePriceVal: {
    fontFamily: THEME.fonts.serif,
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF3B0',
  },
  heroActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 18,
  },
  primaryHeroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#C9A24D',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: '#C9A24D',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryHeroBtnText: {
    color: '#07080A',
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  secondaryHeroBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  secondaryHeroBtnText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  slideDotsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  slideDot: {
    width: 10,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  slideDotActive: {
    width: 26,
    backgroundColor: '#C9A24D',
  },
  brandBarSection: {
    marginTop: 28,
  },
  brandBarHeader: {
    marginBottom: 14,
  },
  brandBarSectionTitle: {
    fontFamily: THEME.fonts.serif,
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF3B0',
    letterSpacing: 1,
  },
  brandBarSectionSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  brandsMarqueeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  brandMarqueeCard: {
    flex: 1,
    minWidth: 130,
    backgroundColor: 'rgba(18, 24, 38, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 77, 0.2)',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'space-between',
  },
  brandCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  brandCardTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 1,
  },
  brandCardMotto: {
    fontSize: 10,
    color: '#94A3B8',
    marginBottom: 8,
  },
  brandCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 6,
  },
  brandOriginText: {
    fontSize: 9.5,
    color: '#64748B',
    fontWeight: '600',
  },
  trustGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 28,
  },
  trustCard: {
    flex: 1,
    minWidth: 220,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trustIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustTextWrap: {
    flex: 1,
  },
  trustTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  trustDesc: {
    fontSize: 10.5,
    color: '#94A3B8',
    lineHeight: 14,
  },
});
