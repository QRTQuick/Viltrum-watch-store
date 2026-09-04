import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, SafeAreaView, StatusBar } from 'react-native';
import {
  Home,
  Compass,
  Heart,
  ShoppingBag,
  User,
  ShieldCheck,
  Sparkles,
  Award,
  Crown,
  Layers,
  ArrowRight,
  TrendingUp,
  Zap,
} from 'lucide-react';

import { AuthProvider, useAuth } from './context/AuthContext';
import { WatchProvider, useWatches } from './context/WatchContext';
import { CartProvider, useCart } from './context/CartContext';

import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { WatchCard } from './components/WatchCard';
import { WatchFilterBar } from './components/WatchFilterBar';
import { WatchDetailModal } from './components/WatchDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AuthModal } from './components/AuthModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { Footer } from './components/Footer';

import { AdminPage } from './pages/AdminPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { OrdersPage } from './pages/OrdersPage';
import { WishlistPage } from './pages/WishlistPage';
import { THEME } from './styles/theme';

const MainAppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'admin' | 'profile' | 'orders' | 'wishlist'>('home');
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const { watches, filteredWatches, selectedWatch, setSelectedBrand, closeWatchDetail } = useWatches();
  const { cartCount, openCart } = useCart();
  const { user, profile, isAdmin } = useAuth();

  // Listen for PWA install event
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert('To install Viltrum:\n\n• iOS: Tap Share button -> "Add to Home Screen"\n• Android/Chrome: Tap 3 dots menu -> "Install app"');
    }
  };

  const handleSelectBrand = (brand: string) => {
    setSelectedBrand(brand as any);
    setCurrentView('catalog');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const featuredWatches = watches.filter((w) => w.isFeatured);
  const bestSellers = watches.filter((w) => w.isBestSeller);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#07080A" />

      {/* PWA Install Notification Bar */}
      <PWAInstallBanner deferredPrompt={deferredPrompt} onInstall={handleInstallPWA} />

      {/* Global Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView as any}
        onOpenAuth={() => setAuthModalVisible(true)}
        deferredPrompt={deferredPrompt}
        installPWA={handleInstallPWA}
      />

      {/* Main Content Area */}
      <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false}>
        {/* VIEW 1: HOME PAGE */}
        {currentView === 'home' && (
          <View>
            <HeroBanner
              onExploreCatalog={() => setCurrentView('catalog')}
              onSelectBrand={handleSelectBrand}
              onOpenAdmin={() => setCurrentView('admin')}
            />

            {/* Featured Masterpieces Spotlight */}
            <View style={styles.sectionWrapper}>
              <View style={styles.sectionHeader}>
                <View>
                  <View style={styles.rowCentered}>
                    <Crown size={16} color="#C9A24D" />
                    <Text style={styles.sectionTitle}>Featured Horology Spotlight</Text>
                  </View>
                  <Text style={styles.sectionSubtitle}>
                    Flagship timepieces crafted by Rolex, Rick, Arnahory, and G-Shock
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.viewAllLink}
                  onPress={() => setCurrentView('catalog')}
                >
                  <Text style={styles.viewAllLinkText}>Explore All Timepieces</Text>
                  <ArrowRight size={14} color="#FFF3B0" />
                </TouchableOpacity>
              </View>

              <View style={styles.watchCardsGrid}>
                {featuredWatches.slice(0, 4).map((watch) => (
                  <View key={watch.id} style={styles.watchCardCol}>
                    <WatchCard watch={watch} />
                  </View>
                ))}
              </View>
            </View>

            {/* Brand Catalog Filter & Live Search Section */}
            <View style={styles.sectionWrapper}>
              <View style={styles.sectionHeader}>
                <View>
                  <View style={styles.rowCentered}>
                    <Sparkles size={16} color="#C9A24D" />
                    <Text style={styles.sectionTitle}>Explore All Watch Brands We Sell</Text>
                  </View>
                  <Text style={styles.sectionSubtitle}>
                    Rolex, Casio, Poedager, Rick, Arnahory, G-Shock, CK, Fossil, MK
                  </Text>
                </View>
              </View>

              <WatchFilterBar />

              <View style={styles.watchCardsGrid}>
                {filteredWatches.map((watch) => (
                  <View key={watch.id} style={styles.watchCardCol}>
                    <WatchCard watch={watch} />
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* VIEW 2: CATALOG PAGE */}
        {currentView === 'catalog' && (
          <View style={styles.catalogViewContainer}>
            <View style={styles.catalogViewHeader}>
              <Text style={styles.catalogMainHeading}>Viltrum Horology Catalog</Text>
              <Text style={styles.catalogSubHeading}>
                Discover, inspect, and acquire authentic luxury timepieces. Powered by Quick Red Tech.
              </Text>
            </View>

            <WatchFilterBar />

            <View style={styles.watchCardsGrid}>
              {filteredWatches.map((watch) => (
                <View key={watch.id} style={styles.watchCardCol}>
                  <WatchCard watch={watch} />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* VIEW 3: ADMIN PORTAL */}
        {currentView === 'admin' && <AdminPage />}

        {/* VIEW 4: USER PROFILE & WATCH BOX */}
        {currentView === 'profile' && (
          <UserProfilePage
            onNavigateToCatalog={() => setCurrentView('catalog')}
            onNavigateToOrders={() => setCurrentView('orders')}
            onOpenWatch={(w) => {}}
          />
        )}

        {/* VIEW 5: ORDERS & INVOICES */}
        {currentView === 'orders' && (
          <OrdersPage onExploreCatalog={() => setCurrentView('catalog')} />
        )}

        {/* VIEW 6: WISHLIST */}
        {currentView === 'wishlist' && (
          <WishlistPage onExploreCatalog={() => setCurrentView('catalog')} />
        )}

        {/* Global Footer */}
        <Footer onSelectBrand={handleSelectBrand} onNavigate={(v) => setCurrentView(v as any)} />
      </ScrollView>

      {/* Mobile Bottom Quick Navigation Dock (PWA App Bar) */}
      <View style={styles.mobileBottomDock}>
        <TouchableOpacity
          style={styles.dockItem}
          onPress={() => {
            setSelectedBrand('All');
            setCurrentView('home');
          }}
        >
          <Home size={20} color={currentView === 'home' ? '#FFF3B0' : '#94A3B8'} />
          <Text style={[styles.dockLabel, currentView === 'home' && styles.dockLabelActive]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dockItem}
          onPress={() => setCurrentView('catalog')}
        >
          <Compass size={20} color={currentView === 'catalog' ? '#FFF3B0' : '#94A3B8'} />
          <Text style={[styles.dockLabel, currentView === 'catalog' && styles.dockLabelActive]}>
            Watches
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dockItem}
          onPress={() => setCurrentView('wishlist')}
        >
          <Heart size={20} color={currentView === 'wishlist' ? '#FF4D4D' : '#94A3B8'} />
          <Text style={[styles.dockLabel, currentView === 'wishlist' && styles.dockLabelActive]}>
            Wishlist
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dockItem} onPress={openCart}>
          <View style={{ position: 'relative' }}>
            <ShoppingBag size={20} color="#C9A24D" />
            {cartCount > 0 && (
              <View style={styles.dockCartBadge}>
                <Text style={styles.dockCartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </View>
          <Text style={styles.dockLabel}>Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dockItem}
          onPress={() => {
            if (user) {
              setCurrentView('profile');
            } else {
              setAuthModalVisible(true);
            }
          }}
        >
          <User size={20} color={currentView === 'profile' ? '#FFF3B0' : '#94A3B8'} />
          <Text style={[styles.dockLabel, currentView === 'profile' && styles.dockLabelActive]}>
            {user ? 'Profile' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        {isAdmin && (
          <TouchableOpacity
            style={styles.dockItem}
            onPress={() => setCurrentView('admin')}
          >
            <ShieldCheck size={20} color={currentView === 'admin' ? '#FF4D4D' : '#E61E2A'} />
            <Text style={[styles.dockLabel, { color: '#FF8888', fontWeight: '800' }]}>
              Admin
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Global Modals */}
      <WatchDetailModal watch={selectedWatch} onClose={closeWatchDetail} />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal onViewOrders={() => setCurrentView('orders')} />
      <AuthModal visible={authModalVisible} onClose={() => setAuthModalVisible(false)} />
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <WatchProvider>
        <CartProvider>
          <MainAppContent />
        </CartProvider>
      </WatchProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#07080A',
    height: '100%',
    width: '100%',
  },
  mainScroll: {
    flex: 1,
  },
  sectionWrapper: {
    maxWidth: 1400,
    marginHorizontal: 'auto' as any,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 12,
  },
  sectionTitle: {
    fontFamily: THEME.fonts.serif,
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF3B0',
    letterSpacing: 1,
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 12.5,
    color: '#94A3B8',
    marginTop: 4,
  },
  viewAllLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(201, 162, 77, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 77, 0.3)',
  },
  viewAllLinkText: {
    color: '#FFF3B0',
    fontSize: 12,
    fontWeight: '800',
  },
  watchCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  watchCardCol: {
    width: '100%',
    padding: 8,
    minWidth: 260,
    maxWidth: '25%',
  },
  catalogViewContainer: {
    maxWidth: 1400,
    marginHorizontal: 'auto' as any,
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  catalogViewHeader: {
    marginBottom: 20,
  },
  catalogMainHeading: {
    fontFamily: THEME.fonts.serif,
    fontSize: 26,
    fontWeight: '900',
    color: '#FFF3B0',
    letterSpacing: 1.5,
  },
  catalogSubHeading: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
  mobileBottomDock: {
    display: 'none',
    position: 'sticky' as any,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(13, 16, 23, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(201, 162, 77, 0.25)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    zIndex: 90,
  },
  dockItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  dockLabel: {
    fontSize: 9.5,
    color: '#94A3B8',
    marginTop: 3,
    fontWeight: '600',
  },
  dockLabelActive: {
    color: '#FFF3B0',
    fontWeight: '800',
  },
  dockCartBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#E61E2A',
    width: 16,
    height: 16,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dockCartBadgeText: {
    color: '#FFF',
    fontSize: 8.5,
    fontWeight: '900',
  },
  rowCentered: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
