import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, ScrollView, TextInput } from 'react-native';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
  Zap,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWatches } from '../context/WatchContext';
import { THEME } from '../styles/theme';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discount,
    shippingFee,
    total,
    appliedPromo,
    promoError,
    applyPromoCode,
    removePromoCode,
    openCheckout,
  } = useCart();

  const { formatPrice } = useWatches();
  const [promoInput, setPromoInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyPromo = () => {
    if (promoInput.trim()) {
      applyPromoCode(promoInput);
      setPromoInput('');
    }
  };

  const freeShippingThreshold = 500;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <Modal visible={isCartOpen} transparent animationType="fade" onRequestClose={closeCart}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={closeCart} />

        <View style={styles.drawer}>
          {/* Header */}
          <View style={styles.drawerHeader}>
            <View style={styles.headerTitleWrap}>
              <ShoppingBag size={20} color="#C9A24D" />
              <Text style={styles.drawerTitle}>Your Luxury Vault</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{items.length}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={closeCart}>
              <X size={20} color="#F8FAFC" />
            </TouchableOpacity>
          </View>

          {/* Free Shipping Progress Indicator */}
          <View style={styles.freeShippingBox}>
            {subtotal >= freeShippingThreshold ? (
              <View style={styles.freeShipSuccessRow}>
                <Sparkles size={14} color="#FFF3B0" />
                <Text style={styles.freeShipSuccessText}>
                  Complimentary Armored VIP Express Shipping Unlocked!
                </Text>
              </View>
            ) : (
              <View>
                <Text style={styles.freeShipNotice}>
                  Add <Text style={styles.freeShipAmount}>{formatPrice(freeShippingThreshold - subtotal)}</Text> more for free insured shipping
                </Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${progressToFreeShipping}%` }]} />
                </View>
              </View>
            )}
          </View>

          {/* Body: Items or Empty */}
          {items.length === 0 ? (
            <View style={styles.emptyCartBox}>
              <View style={styles.emptyIconWrap}>
                <ShoppingBag size={36} color="#64748B" />
              </View>
              <Text style={styles.emptyTitle}>Your Vault is Empty</Text>
              <Text style={styles.emptySubtitle}>
                Explore prestigious timepieces from Rolex, Casio, Rick, Arnahory, G-Shock, and more.
              </Text>
              <TouchableOpacity
                style={styles.exploreBtn}
                onPress={() => closeCart()}
              >
                <Text style={styles.exploreBtnText}>Browse Watch Catalog</Text>
                <ArrowRight size={16} color="#07080A" />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
                {items.map(({ watch, quantity, selectedStrap }) => (
                  <View key={watch.id} style={styles.cartItemCard}>
                    <Image
                      source={{ uri: watch.images[0] || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80' }}
                      style={styles.itemImage}
                    />
                    <View style={styles.itemDetails}>
                      <View style={styles.itemHeader}>
                        <Text style={styles.itemBrand}>{watch.brand.toUpperCase()}</Text>
                        <TouchableOpacity
                          style={styles.removeBtn}
                          onPress={() => removeFromCart(watch.id)}
                        >
                          <Trash2 size={14} color="#EF4444" />
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.itemName} numberOfLines={1}>
                        {watch.name}
                      </Text>

                      {selectedStrap && (
                        <Text style={styles.itemStrap} numberOfLines={1}>
                          Strap: {selectedStrap}
                        </Text>
                      )}

                      <View style={styles.itemBottomRow}>
                        <View style={styles.stepperWrap}>
                          <TouchableOpacity
                            style={styles.stepperSmallBtn}
                            onPress={() => updateQuantity(watch.id, quantity - 1)}
                          >
                            <Minus size={12} color="#F8FAFC" />
                          </TouchableOpacity>
                          <Text style={styles.stepperQuantityText}>{quantity}</Text>
                          <TouchableOpacity
                            style={styles.stepperSmallBtn}
                            onPress={() => updateQuantity(watch.id, quantity + 1)}
                          >
                            <Plus size={12} color="#F8FAFC" />
                          </TouchableOpacity>
                        </View>

                        <Text style={styles.itemPrice}>
                          {formatPrice(watch.price * quantity)}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>

              {/* Promo Code Engine */}
              <View style={styles.promoSection}>
                {appliedPromo ? (
                  <View style={styles.appliedPromoBadge}>
                    <View style={styles.promoBadgeLeft}>
                      <Tag size={13} color="#10B981" />
                      <Text style={styles.appliedPromoCodeText}>{appliedPromo.code}</Text>
                      <Text style={styles.appliedPromoDesc}>(-{formatPrice(discount)})</Text>
                    </View>
                    <TouchableOpacity onPress={removePromoCode}>
                      <X size={14} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.promoInputRow}>
                    <TextInput
                      style={styles.promoInput}
                      placeholder="Promo code (e.g. QUICKRED10)"
                      placeholderTextColor="#64748B"
                      value={promoInput}
                      onChangeText={setPromoInput}
                      autoCapitalize="characters"
                    />
                    <TouchableOpacity
                      style={styles.promoApplyBtn}
                      onPress={handleApplyPromo}
                    >
                      <Text style={styles.promoApplyBtnText}>Apply</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {promoError && <Text style={styles.promoErrorText}>{promoError}</Text>}
              </View>

              {/* Summary & Checkout Footer */}
              <View style={styles.footerSection}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
                </View>

                {discount > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryDiscountLabel}>Privilege Discount</Text>
                    <Text style={styles.summaryDiscountValue}>-{formatPrice(discount)}</Text>
                  </View>
                )}

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Insured Armored Courier</Text>
                  <Text style={styles.summaryValue}>
                    {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                  </Text>
                </View>

                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>{formatPrice(total)}</Text>
                </View>

                <TouchableOpacity style={styles.checkoutBtn} onPress={openCheckout}>
                  <Zap size={18} color="#07080A" />
                  <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
                </TouchableOpacity>

                <View style={styles.securitySeal}>
                  <ShieldCheck size={14} color="#C9A24D" />
                  <Text style={styles.securitySealText}>
                    Encrypted 256-bit Horology Escrow Protection
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  drawer: {
    width: '100%',
    maxWidth: 440,
    height: '100%',
    backgroundColor: '#0D1017',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(201, 162, 77, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: '#121824',
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  drawerTitle: {
    fontFamily: THEME.fonts.serif,
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF3B0',
    letterSpacing: 1,
  },
  countBadge: {
    backgroundColor: 'rgba(201, 162, 77, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
  },
  countBadgeText: {
    color: '#FFF3B0',
    fontSize: 11,
    fontWeight: '800',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  freeShippingBox: {
    backgroundColor: 'rgba(201, 162, 77, 0.08)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(201, 162, 77, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  freeShipSuccessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  freeShipSuccessText: {
    color: '#FFF3B0',
    fontSize: 11.5,
    fontWeight: '700',
  },
  freeShipNotice: {
    color: '#CBD5E1',
    fontSize: 11.5,
    marginBottom: 6,
  },
  freeShipAmount: {
    color: '#FFF3B0',
    fontWeight: '700',
  },
  progressBarBg: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#C9A24D',
    borderRadius: 2,
  },
  emptyCartBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyIconWrap: {
    width: 70,
    height: 70,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: THEME.fonts.serif,
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 12.5,
    color: '#94A3B8',
    textAlign: 'center',
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
  itemsList: {
    flex: 1,
    padding: 16,
  },
  cartItemCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 12,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#141A26',
    resizeMode: 'cover',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemBrand: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C9A24D',
    letterSpacing: 0.5,
  },
  removeBtn: {
    padding: 4,
  },
  itemName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#F8FAFC',
    marginVertical: 2,
  },
  itemStrap: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginBottom: 4,
  },
  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  stepperSmallBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperQuantityText: {
    color: '#F8FAFC',
    fontSize: 11.5,
    fontWeight: '700',
    paddingHorizontal: 8,
  },
  itemPrice: {
    fontFamily: THEME.fonts.serif,
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFF3B0',
  },
  promoSection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  promoInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  promoInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 36,
    color: '#F8FAFC',
    fontSize: 12,
    outlineStyle: 'none' as any,
  },
  promoApplyBtn: {
    backgroundColor: 'rgba(201, 162, 77, 0.2)',
    borderWidth: 1,
    borderColor: '#C9A24D',
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoApplyBtnText: {
    color: '#FFF3B0',
    fontSize: 11.5,
    fontWeight: '700',
  },
  appliedPromoBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  promoBadgeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appliedPromoCodeText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '800',
  },
  appliedPromoDesc: {
    color: '#CBD5E1',
    fontSize: 11,
  },
  promoErrorText: {
    color: '#EF4444',
    fontSize: 10.5,
    marginTop: 4,
  },
  footerSection: {
    padding: 16,
    backgroundColor: '#121824',
    borderTopWidth: 1,
    borderTopColor: 'rgba(201, 162, 77, 0.2)',
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#94A3B8',
    fontSize: 12,
  },
  summaryValue: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
  },
  summaryDiscountLabel: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
  },
  summaryDiscountValue: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 8,
    marginTop: 4,
  },
  totalLabel: {
    color: '#FFF3B0',
    fontSize: 14,
    fontWeight: '800',
  },
  totalValue: {
    fontFamily: THEME.fonts.serif,
    fontSize: 20,
    fontWeight: '900',
    color: '#FFF3B0',
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#C9A24D',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 6,
    shadowColor: '#C9A24D',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  checkoutBtnText: {
    color: '#07080A',
    fontSize: 13.5,
    fontWeight: '900',
  },
  securitySeal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  securitySealText: {
    color: '#64748B',
    fontSize: 10,
  },
});
