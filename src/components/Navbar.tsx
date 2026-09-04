import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, Platform, Modal, ScrollView } from 'react-native';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  Download,
  ChevronDown,
  Globe,
  Sliders,
  LogOut,
  PackageCheck,
  Award,
  Crown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWatches } from '../context/WatchContext';
import { useCart } from '../context/CartContext';
import { THEME } from '../styles/theme';
import { BRAND_LIST } from '../data/initialWatches';
import { Currency } from '../types';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenAuth: () => void;
  deferredPrompt: any;
  installPWA: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenAuth,
  deferredPrompt,
  installPWA,
}) => {
  const { user, profile, isAdmin, logout } = useAuth();
  const {
    filters,
    setSearchQuery,
    setSelectedBrand,
    currency,
    setCurrency,
    formatPrice,
    watches,
    openWatchDetail,
  } = useWatches();
  const { cartCount, openCart } = useCart();

  const [searchFocused, setSearchFocused] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);

  // Search live suggestions
  const searchResults = searchInput.trim()
    ? watches
        .filter(
          (w) =>
            w.name.toLowerCase().includes(searchInput.toLowerCase()) ||
            w.brand.toLowerCase().includes(searchInput.toLowerCase()) ||
            w.modelRef.toLowerCase().includes(searchInput.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);
    setCurrentView('catalog');
    setSearchFocused(false);
  };

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand as any);
    setCurrentView('catalog');
    setBrandDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <View style={styles.headerContainer}>
      {/* Top Banner: Authenticated Horology Notice & Powered By Quick Red Tech */}
      <View style={styles.topMicroBanner}>
        <View style={styles.topMicroContent}>
          <View style={styles.rowCentered}>
            <Sparkles size={13} color="#C9A24D" />
            <Text style={styles.topMicroText}>
              Official Viltrum Boutique — <Text style={styles.quickRedText}>Powered by Quick Red Tech</Text> • 100% Insured Worldwide Delivery
            </Text>
          </View>
          <View style={styles.topMicroRight}>
            <TouchableOpacity
              style={styles.microLink}
              onPress={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
            >
              <Globe size={12} color="#94A3B8" />
              <Text style={styles.microLinkText}>{currency}</Text>
              <ChevronDown size={10} color="#94A3B8" />
            </TouchableOpacity>

            {deferredPrompt && (
              <TouchableOpacity style={styles.pwaInstallMicroBtn} onPress={installPWA}>
                <Download size={11} color="#07080A" />
                <Text style={styles.pwaInstallMicroText}>Install App</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Currency Dropdown Popover */}
        {currencyDropdownOpen && (
          <View style={styles.currencyDropdown}>
            {(['USD', 'EUR', 'GBP', 'NGN', 'AED', 'JPY'] as Currency[]).map((cur) => (
              <TouchableOpacity
                key={cur}
                style={[
                  styles.currencyItem,
                  currency === cur && styles.currencyItemActive,
                ]}
                onPress={() => {
                  setCurrency(cur);
                  setCurrencyDropdownOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.currencyItemText,
                    currency === cur && styles.currencyItemTextActive,
                  ]}
                >
                  {cur}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Main Navigation Bar */}
      <View style={styles.mainNav}>
        {/* Mobile menu toggle */}
        <TouchableOpacity
          style={styles.mobileMenuButton}
          onPress={() => setMobileMenuOpen(true)}
        >
          <Menu size={22} color="#F8FAFC" />
        </TouchableOpacity>

        {/* Brand Logo */}
        <TouchableOpacity
          style={styles.logoContainer}
          onPress={() => {
            setCurrentView('home');
            setSelectedBrand('All');
          }}
        >
          <View style={styles.logoBadge}>
            <Crown size={18} color="#C9A24D" />
          </View>
          <View>
            <View style={styles.rowCentered}>
              <Text style={styles.logoTitle}>VILTRUM</Text>
              <View style={styles.luxuryDot} />
            </View>
            <Text style={styles.logoSubtitle}>POWERED BY QUICK RED TECH</Text>
          </View>
        </TouchableOpacity>

        {/* Desktop Navigation Links */}
        <View style={styles.desktopNavLinks}>
          <TouchableOpacity
            style={[styles.navLink, currentView === 'home' && styles.navLinkActive]}
            onPress={() => {
              setCurrentView('home');
              setSelectedBrand('All');
            }}
          >
            <Text style={[styles.navLinkText, currentView === 'home' && styles.navLinkTextActive]}>
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navLink, currentView === 'catalog' && filters.selectedBrand === 'All' && styles.navLinkActive]}
            onPress={() => {
              setSelectedBrand('All');
              setCurrentView('catalog');
            }}
          >
            <Text style={[styles.navLinkText, currentView === 'catalog' && filters.selectedBrand === 'All' && styles.navLinkTextActive]}>
              All Watches
            </Text>
          </TouchableOpacity>

          {/* Quick Brand Links */}
          {['Rolex', 'Casio', 'Poedager', 'Rick', 'Arnahory', 'G-Shock', 'CK', 'Fossil', 'MK'].map((brand) => (
            <TouchableOpacity
              key={brand}
              style={[
                styles.navLink,
                currentView === 'catalog' && filters.selectedBrand === brand && styles.navLinkActive,
              ]}
              onPress={() => handleBrandSelect(brand)}
            >
              <Text
                style={[
                  styles.navLinkText,
                  currentView === 'catalog' && filters.selectedBrand === brand && styles.navLinkTextActive,
                ]}
              >
                {brand}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Action Controls (Search, Wishlist, Cart, Profile, Admin) */}
        <View style={styles.navActions}>
          {/* Quick Search Bar */}
          <View style={styles.searchWrapper}>
            <Search size={16} color="#94A3B8" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Rolex, Casio, Rick, Ref..."
              placeholderTextColor="#64748B"
              value={searchInput}
              onChangeText={(text) => {
                setSearchInput(text);
                setSearchFocused(true);
              }}
              onFocus={() => setSearchFocused(true)}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
            {searchInput.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchInput('');
                  setSearchQuery('');
                }}
                style={styles.searchClearBtn}
              >
                <X size={14} color="#94A3B8" />
              </TouchableOpacity>
            )}

            {/* Live Search Suggestions Dropdown */}
            {searchFocused && searchResults.length > 0 && (
              <View style={styles.searchDropdown}>
                <View style={styles.searchDropdownHeader}>
                  <Text style={styles.searchDropdownTitle}>Matching Timepieces</Text>
                  <TouchableOpacity onPress={() => setSearchFocused(false)}>
                    <X size={14} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
                {searchResults.map((w) => (
                  <TouchableOpacity
                    key={w.id}
                    style={styles.searchResultItem}
                    onPress={() => {
                      openWatchDetail(w);
                      setSearchFocused(false);
                      setSearchInput('');
                    }}
                  >
                    <Image source={{ uri: w.images[0] }} style={styles.searchResultImg} />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.searchResultBrand}>{w.brand}</Text>
                      <Text style={styles.searchResultName} numberOfLines={1}>
                        {w.name}
                      </Text>
                    </View>
                    <Text style={styles.searchResultPrice}>{formatPrice(w.price)}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.searchViewAllBtn}
                  onPress={handleSearchSubmit}
                >
                  <Text style={styles.searchViewAllText}>
                    View all matching watches →
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Wishlist Button */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setCurrentView('wishlist')}
          >
            <Heart size={20} color={profile?.wishlist?.length ? '#FF4D4D' : '#F8FAFC'} />
            {profile && profile.wishlist && profile.wishlist.length > 0 && (
              <View style={styles.iconBadge}>
                <Text style={styles.iconBadgeText}>{profile.wishlist.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Cart Button */}
          <TouchableOpacity
            style={[styles.iconButton, styles.cartButton]}
            onPress={openCart}
          >
            <ShoppingBag size={20} color="#07080A" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Admin Button (Distinct Gold/Crimson Pill) */}
          <TouchableOpacity
            style={[
              styles.adminNavButton,
              isAdmin && styles.adminNavButtonActive,
            ]}
            onPress={() => setCurrentView('admin')}
          >
            <ShieldCheck size={16} color={isAdmin ? '#FFF3B0' : '#C9A24D'} />
            <Text style={[styles.adminNavText, isAdmin && styles.adminNavTextActive]}>
              {isAdmin ? 'Admin Vault' : 'Admin'}
            </Text>
            {isAdmin && <View style={styles.adminLiveDot} />}
          </TouchableOpacity>

          {/* User Profile / Auth Button */}
          <TouchableOpacity
            style={styles.userNavButton}
            onPress={() => {
              if (user) {
                setUserDropdownOpen(!userDropdownOpen);
              } else {
                onOpenAuth();
              }
            }}
          >
            <View style={styles.userAvatar}>
              {isAdmin ? (
                <Crown size={14} color="#C9A24D" />
              ) : (
                <User size={14} color="#F8FAFC" />
              )}
            </View>
            <Text style={styles.userNavText} numberOfLines={1}>
              {user ? (isAdmin ? 'Chisom (Admin)' : profile?.displayName || 'My Account') : 'Sign In'}
            </Text>
            {user && <ChevronDown size={12} color="#94A3B8" />}
          </TouchableOpacity>

          {/* User Popover Menu */}
          {userDropdownOpen && user && (
            <View style={styles.userMenuDropdown}>
              <View style={styles.userMenuHeader}>
                <Text style={styles.userMenuName}>{profile?.displayName || user.email}</Text>
                <Text style={styles.userMenuEmail}>{user.email}</Text>
                <View style={styles.vipTierBadge}>
                  <Sparkles size={11} color="#C9A24D" />
                  <Text style={styles.vipTierText}>{profile?.vipTier || 'Standard Collector'}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.userMenuItem}
                onPress={() => {
                  setCurrentView('profile');
                  setUserDropdownOpen(false);
                }}
              >
                <User size={16} color="#C9A24D" />
                <Text style={styles.userMenuItemText}>My Collector Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.userMenuItem}
                onPress={() => {
                  setCurrentView('orders');
                  setUserDropdownOpen(false);
                }}
              >
                <PackageCheck size={16} color="#3B82F6" />
                <Text style={styles.userMenuItemText}>Order Tracking & Receipts</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.userMenuItem}
                onPress={() => {
                  setCurrentView('wishlist');
                  setUserDropdownOpen(false);
                }}
              >
                <Heart size={16} color="#FF4D4D" />
                <Text style={styles.userMenuItemText}>My Saved Wishlist</Text>
              </TouchableOpacity>

              {isAdmin && (
                <TouchableOpacity
                  style={[styles.userMenuItem, styles.userMenuItemAdmin]}
                  onPress={() => {
                    setCurrentView('admin');
                    setUserDropdownOpen(false);
                  }}
                >
                  <ShieldCheck size={16} color="#E61E2A" />
                  <Text style={styles.userMenuItemAdminText}>Admin Management Portal</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.userMenuItem, styles.userMenuLogout]}
                onPress={() => {
                  logout();
                  setUserDropdownOpen(false);
                }}
              >
                <LogOut size={16} color="#EF4444" />
                <Text style={styles.userMenuLogoutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Mobile Drawer Menu Modal */}
      {mobileMenuOpen && (
        <Modal visible={mobileMenuOpen} transparent animationType="fade">
          <View style={styles.mobileModalBackdrop}>
            <View style={styles.mobileDrawer}>
              <View style={styles.mobileDrawerHeader}>
                <View style={styles.logoContainer}>
                  <Crown size={20} color="#C9A24D" />
                  <Text style={styles.logoTitle}>VILTRUM</Text>
                </View>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setMobileMenuOpen(false)}
                >
                  <X size={22} color="#F8FAFC" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.mobileDrawerScroll}>
                {/* User Status / Login in Mobile */}
                <View style={styles.mobileUserCard}>
                  {user ? (
                    <View>
                      <Text style={styles.mobileUserName}>{profile?.displayName || user.email}</Text>
                      <Text style={styles.mobileUserEmail}>{user.email}</Text>
                      {isAdmin && (
                        <View style={styles.adminPillBadge}>
                          <ShieldCheck size={12} color="#FFF" />
                          <Text style={styles.adminPillText}>Authorized Master Admin</Text>
                        </View>
                      )}
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.mobileSignInBtn}
                      onPress={() => {
                        setMobileMenuOpen(false);
                        onOpenAuth();
                      }}
                    >
                      <User size={16} color="#07080A" />
                      <Text style={styles.mobileSignInText}>Sign In / Register</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Primary Nav Links */}
                <Text style={styles.mobileSectionTitle}>Navigation</Text>
                <TouchableOpacity
                  style={styles.mobileNavItem}
                  onPress={() => {
                    setCurrentView('home');
                    setSelectedBrand('All');
                    setMobileMenuOpen(false);
                  }}
                >
                  <Text style={styles.mobileNavText}>Home Showcase</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.mobileNavItem}
                  onPress={() => {
                    setSelectedBrand('All');
                    setCurrentView('catalog');
                    setMobileMenuOpen(false);
                  }}
                >
                  <Text style={styles.mobileNavText}>All Watches Catalog</Text>
                </TouchableOpacity>

                {/* Brands Section */}
                <Text style={styles.mobileSectionTitle}>Watch Brands We Sell</Text>
                <View style={styles.mobileBrandsGrid}>
                  {['Rolex', 'Casio', 'Poedager', 'Rick', 'Arnahory', 'G-Shock', 'CK', 'Fossil', 'MK'].map((b) => (
                    <TouchableOpacity
                      key={b}
                      style={[
                        styles.mobileBrandBadge,
                        filters.selectedBrand === b && styles.mobileBrandBadgeActive,
                      ]}
                      onPress={() => handleBrandSelect(b)}
                    >
                      <Text
                        style={[
                          styles.mobileBrandText,
                          filters.selectedBrand === b && styles.mobileBrandTextActive,
                        ]}
                      >
                        {b}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Quick Shortcuts */}
                <Text style={styles.mobileSectionTitle}>Collector Services</Text>
                {user && (
                  <>
                    <TouchableOpacity
                      style={styles.mobileNavItem}
                      onPress={() => {
                        setCurrentView('profile');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <User size={16} color="#C9A24D" />
                      <Text style={styles.mobileNavText}>My Watch Box & Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.mobileNavItem}
                      onPress={() => {
                        setCurrentView('orders');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <PackageCheck size={16} color="#3B82F6" />
                      <Text style={styles.mobileNavText}>My Orders & Invoices</Text>
                    </TouchableOpacity>
                  </>
                )}

                <TouchableOpacity
                  style={styles.mobileNavItem}
                  onPress={() => {
                    setCurrentView('wishlist');
                    setMobileMenuOpen(false);
                  }}
                >
                  <Heart size={16} color="#FF4D4D" />
                  <Text style={styles.mobileNavText}>Saved Wishlist ({profile?.wishlist?.length || 0})</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.mobileNavItem, styles.mobileNavAdminItem]}
                  onPress={() => {
                    setCurrentView('admin');
                    setMobileMenuOpen(false);
                  }}
                >
                  <ShieldCheck size={18} color="#E61E2A" />
                  <Text style={styles.mobileNavAdminText}>
                    {isAdmin ? 'Admin Vault (chisomlifeeke@gmail.com)' : 'Admin Portal Access'}
                  </Text>
                </TouchableOpacity>

                {deferredPrompt && (
                  <TouchableOpacity
                    style={styles.mobileInstallBtn}
                    onPress={() => {
                      setMobileMenuOpen(false);
                      installPWA();
                    }}
                  >
                    <Download size={16} color="#07080A" />
                    <Text style={styles.mobileInstallText}>Install Viltrum PWA App</Text>
                  </TouchableOpacity>
                )}

                {user && (
                  <TouchableOpacity
                    style={styles.mobileLogoutBtn}
                    onPress={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut size={16} color="#EF4444" />
                    <Text style={styles.mobileLogoutText}>Sign Out</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#07080A',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(201, 162, 77, 0.18)',
    position: 'sticky' as any,
    top: 0,
    zIndex: 100,
  },
  topMicroBanner: {
    backgroundColor: '#0B0F17',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    position: 'relative',
  },
  topMicroContent: {
    maxWidth: 1400,
    marginHorizontal: 'auto' as any,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topMicroText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 6,
  },
  quickRedText: {
    color: '#FF4D4D',
    fontWeight: '700',
  },
  topMicroRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  microLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  microLinkText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '600',
  },
  pwaInstallMicroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#C9A24D',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 99,
  },
  pwaInstallMicroText: {
    color: '#07080A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  currencyDropdown: {
    position: 'absolute',
    top: 32,
    right: 16,
    backgroundColor: '#121824',
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 77, 0.3)',
    borderRadius: 8,
    padding: 6,
    zIndex: 200,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  currencyItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  currencyItemActive: {
    backgroundColor: 'rgba(201, 162, 77, 0.2)',
  },
  currencyItemText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  currencyItemTextActive: {
    color: '#FFF3B0',
    fontWeight: '800',
  },
  mainNav: {
    maxWidth: 1400,
    marginHorizontal: 'auto' as any,
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(201, 162, 77, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 77, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTitle: {
    fontFamily: THEME.fonts.serif,
    fontSize: 20,
    fontWeight: '900',
    color: '#FFF3B0',
    letterSpacing: 2.5,
  },
  luxuryDot: {
    width: 5,
    height: 5,
    borderRadius: 99,
    backgroundColor: '#E61E2A',
    marginLeft: 4,
  },
  logoSubtitle: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#FF4D4D',
    letterSpacing: 1.5,
    marginTop: -2,
  },
  desktopNavLinks: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  navLink: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 6,
  },
  navLinkActive: {
    backgroundColor: 'rgba(201, 162, 77, 0.14)',
    borderBottomWidth: 2,
    borderBottomColor: '#C9A24D',
  },
  navLinkText: {
    color: '#94A3B8',
    fontSize: 12.5,
    fontWeight: '600',
  },
  navLinkTextActive: {
    color: '#FFF3B0',
    fontWeight: '700',
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 99,
    paddingHorizontal: 12,
    height: 38,
    width: 220,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 12,
    padding: 0,
    outlineStyle: 'none' as any,
  },
  searchClearBtn: {
    padding: 4,
  },
  searchDropdown: {
    position: 'absolute',
    top: 46,
    left: 0,
    right: -100,
    backgroundColor: '#121824',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 77, 0.3)',
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 12,
    zIndex: 300,
  },
  searchDropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  searchDropdownTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C9A24D',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  searchResultImg: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#1A2234',
  },
  searchResultBrand: {
    fontSize: 10,
    fontWeight: '700',
    color: '#C9A24D',
  },
  searchResultName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  searchResultPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF3B0',
    marginLeft: 8,
  },
  searchViewAllBtn: {
    marginTop: 8,
    alignItems: 'center',
    paddingVertical: 6,
  },
  searchViewAllText: {
    color: '#FF4D4D',
    fontSize: 11,
    fontWeight: '700',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartButton: {
    backgroundColor: '#C9A24D',
  },
  iconBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#E61E2A',
    width: 17,
    height: 17,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadgeText: {
    color: '#FFF',
    fontSize: 9.5,
    fontWeight: '900',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#07080A',
    borderWidth: 1.5,
    borderColor: '#FFF3B0',
    width: 18,
    height: 18,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#FFF3B0',
    fontSize: 9.5,
    fontWeight: '900',
  },
  adminNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 99,
    backgroundColor: 'rgba(201, 162, 77, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 77, 0.3)',
  },
  adminNavButtonActive: {
    backgroundColor: 'rgba(230, 30, 42, 0.2)',
    borderColor: '#E61E2A',
  },
  adminNavText: {
    color: '#C9A24D',
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  adminNavTextActive: {
    color: '#FF8888',
  },
  adminLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 99,
    backgroundColor: '#10B981',
  },
  userNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    height: 38,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 99,
    backgroundColor: 'rgba(201, 162, 77, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userNavText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
    maxWidth: 90,
  },
  userMenuDropdown: {
    position: 'absolute',
    top: 50,
    right: 0,
    backgroundColor: '#121824',
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 77, 0.3)',
    borderRadius: 14,
    width: 240,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 20,
    zIndex: 300,
  },
  userMenuHeader: {
    paddingBottom: 10,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  userMenuName: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  userMenuEmail: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  vipTierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(201, 162, 77, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
    marginTop: 6,
  },
  vipTierText: {
    color: '#FFF3B0',
    fontSize: 10,
    fontWeight: '700',
  },
  userMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  userMenuItemText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '500',
  },
  userMenuItemAdmin: {
    backgroundColor: 'rgba(230, 30, 42, 0.12)',
    marginVertical: 4,
  },
  userMenuItemAdminText: {
    color: '#FF8888',
    fontSize: 12,
    fontWeight: '700',
  },
  userMenuLogout: {
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 10,
  },
  userMenuLogoutText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
  mobileMenuButton: {
    display: 'none',
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    flexDirection: 'row',
  },
  mobileDrawer: {
    width: '82%',
    maxWidth: 320,
    backgroundColor: '#0D1017',
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: 'rgba(201, 162, 77, 0.25)',
    padding: 20,
  },
  mobileDrawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  mobileDrawerScroll: {
    flex: 1,
    marginTop: 12,
  },
  mobileUserCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  mobileUserName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  mobileUserEmail: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  adminPillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E61E2A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  adminPillText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  mobileSignInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#C9A24D',
    paddingVertical: 10,
    borderRadius: 8,
  },
  mobileSignInText: {
    color: '#07080A',
    fontSize: 12.5,
    fontWeight: '800',
  },
  mobileSectionTitle: {
    color: '#C9A24D',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: 16,
    marginBottom: 8,
  },
  mobileNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  mobileNavText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
  },
  mobileBrandsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 6,
  },
  mobileBrandBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  mobileBrandBadgeActive: {
    backgroundColor: 'rgba(201, 162, 77, 0.2)',
    borderColor: '#C9A24D',
  },
  mobileBrandText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  mobileBrandTextActive: {
    color: '#FFF3B0',
    fontWeight: '800',
  },
  mobileNavAdminItem: {
    backgroundColor: 'rgba(230, 30, 42, 0.12)',
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 6,
  },
  mobileNavAdminText: {
    color: '#FF8888',
    fontSize: 12.5,
    fontWeight: '700',
  },
  mobileInstallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#C9A24D',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  mobileInstallText: {
    color: '#07080A',
    fontSize: 12.5,
    fontWeight: '800',
  },
  mobileLogoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginTop: 10,
  },
  mobileLogoutText: {
    color: '#EF4444',
    fontSize: 12.5,
    fontWeight: '600',
  },
  rowCentered: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
