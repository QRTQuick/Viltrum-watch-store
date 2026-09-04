import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, ScrollView, Platform } from 'react-native';
import {
  X,
  Heart,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  CheckCircle2,
  Award,
  Crown,
  Share2,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react';
import { Watch } from '../types';
import { useAuth } from '../context/AuthContext';
import { useWatches } from '../context/WatchContext';
import { useCart } from '../context/CartContext';
import { THEME } from '../styles/theme';

interface WatchDetailModalProps {
  watch: Watch | null;
  onClose: () => void;
}

const STRAP_OPTIONS = [
  'Oystersteel Precision Link',
  'Supple Hand-Stitched Leather',
  'Quick Red Tech Crimson Fluororubber',
  'Milanese Stainless Mesh',
  '18K Gold Fluted Bracelet',
];

export const WatchDetailModal: React.FC<WatchDetailModalProps> = ({ watch, onClose }) => {
  if (!watch) return null;

  const { isInWishlist, toggleWishlist, user } = useAuth();
  const { formatPrice } = useWatches();
  const { addToCart, checkoutDirectBuyNow } = useCart();

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [selectedStrap, setSelectedStrap] = useState(watch.strapType || STRAP_OPTIONS[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'guarantee'>('specs');
  const [copiedLink, setCopiedLink] = useState(false);

  const isLiked = isInWishlist(watch.id);
  const images = watch.images && watch.images.length > 0 ? watch.images : [
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=85'
  ];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + '/#watch-' + watch.id);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <Modal visible={Boolean(watch)} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Close & Header Actions */}
          <View style={styles.modalHeader}>
            <View style={styles.brandBadgeWrap}>
              <Crown size={14} color="#C9A24D" />
              <Text style={styles.brandTitle}>{watch.brand.toUpperCase()}</Text>
              <Text style={styles.headerRefText}>Ref. {watch.modelRef}</Text>
            </View>

            <View style={styles.headerRightActions}>
              <TouchableOpacity style={styles.headerActionBtn} onPress={handleShare}>
                <Share2 size={16} color={copiedLink ? '#10B981' : '#94A3B8'} />
                {copiedLink && <Text style={styles.copiedHint}>Link Copied!</Text>}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.headerActionBtn, isLiked && styles.headerActionBtnLiked]}
                onPress={() => toggleWishlist(watch.id)}
              >
                <Heart
                  size={16}
                  color={isLiked ? '#FF4D4D' : '#94A3B8'}
                  fill={isLiked ? '#FF4D4D' : 'transparent'}
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <X size={20} color="#F8FAFC" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Body with Scroll */}
          <ScrollView style={styles.modalScrollBody} showsVerticalScrollIndicator={false}>
            <View style={styles.mainLayoutGrid}>
              {/* Left Column: Image Showcase */}
              <View style={styles.leftCol}>
                <View style={styles.mainImageWrap}>
                  <Image
                    source={{ uri: images[selectedImgIndex] || images[0] }}
                    style={styles.mainImage}
                  />
                  {watch.originalPrice && (
                    <View style={styles.detailDiscountBadge}>
                      <Text style={styles.detailDiscountText}>
                        SAVE {Math.round(((watch.originalPrice - watch.price) / watch.originalPrice) * 100)}%
                      </Text>
                    </View>
                  )}
                </View>

                {/* Thumbnails row */}
                {images.length > 1 && (
                  <View style={styles.thumbnailRow}>
                    {images.map((img, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={[
                          styles.thumbItem,
                          selectedImgIndex === idx && styles.thumbItemActive,
                        ]}
                        onPress={() => setSelectedImgIndex(idx)}
                      >
                        <Image source={{ uri: img }} style={styles.thumbImage} />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Authenticity Certificate Box */}
                <View style={styles.authCertificateBox}>
                  <ShieldCheck size={20} color="#C9A24D" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.authCertTitle}>Quick Red Tech Certified Genuine</Text>
                    <Text style={styles.authCertSubtitle}>
                      Inspected by Master Horologists • Serial #{watch.id.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Right Column: Information & Actions */}
              <View style={styles.rightCol}>
                <Text style={styles.watchNameLarge}>{watch.name}</Text>

                {/* Rating & Reviews Bar */}
                <View style={styles.ratingsRow}>
                  <View style={styles.starsGroup}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        color="#F59E0B"
                        fill={star <= Math.round(watch.rating) ? '#F59E0B' : 'transparent'}
                      />
                    ))}
                    <Text style={styles.ratingNumberText}>{watch.rating.toFixed(2)}</Text>
                    <Text style={styles.reviewsCountText}>({watch.reviewsCount} collector reviews)</Text>
                  </View>

                  <View style={styles.stockStatusBadge}>
                    <Text style={styles.stockStatusText}>
                      {watch.stock > 0 ? `${watch.stock} Units in Vault` : 'Sold Out'}
                    </Text>
                  </View>
                </View>

                {/* Price Display */}
                <View style={styles.priceContainer}>
                  <Text style={styles.mainPriceText}>{formatPrice(watch.price)}</Text>
                  {watch.originalPrice && (
                    <Text style={styles.mainOriginalPriceText}>
                      {formatPrice(watch.originalPrice)}
                    </Text>
                  )}
                  <View style={styles.taxIncludedPill}>
                    <Text style={styles.taxIncludedText}>All Taxes & Duties Included</Text>
                  </View>
                </View>

                {/* Description */}
                <Text style={styles.descriptionText}>{watch.description}</Text>

                {/* Strap Choice Selector */}
                <View style={styles.strapSelectionSection}>
                  <Text style={styles.sectionLabel}>Select Watch Strap / Bracelet</Text>
                  <View style={styles.strapOptionsWrap}>
                    {[watch.strapType, ...STRAP_OPTIONS.filter((s) => s !== watch.strapType)].slice(0, 4).map((strap) => (
                      <TouchableOpacity
                        key={strap}
                        style={[
                          styles.strapOptionPill,
                          selectedStrap === strap && styles.strapOptionPillActive,
                        ]}
                        onPress={() => setSelectedStrap(strap)}
                      >
                        <Text
                          style={[
                            styles.strapOptionText,
                            selectedStrap === strap && styles.strapOptionTextActive,
                          ]}
                        >
                          {strap}
                        </Text>
                        {selectedStrap === strap && (
                          <CheckCircle2 size={12} color="#FFF3B0" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Quantity Stepper */}
                <View style={styles.quantitySection}>
                  <Text style={styles.sectionLabel}>Quantity</Text>
                  <View style={styles.stepperContainer}>
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus size={14} color="#F8FAFC" />
                    </TouchableOpacity>
                    <Text style={styles.stepperVal}>{quantity}</Text>
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => setQuantity(Math.min(watch.stock, quantity + 1))}
                    >
                      <Plus size={14} color="#F8FAFC" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Primary Action Buttons */}
                <View style={styles.actionButtonsRow}>
                  <TouchableOpacity
                    style={styles.addToCartLargeBtn}
                    onPress={() => {
                      addToCart(watch, quantity, selectedStrap);
                      onClose();
                    }}
                  >
                    <ShoppingBag size={18} color="#07080A" />
                    <Text style={styles.addToCartLargeText}>Add to Cart • {formatPrice(watch.price * quantity)}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.buyNowLargeBtn}
                    onPress={() => {
                      checkoutDirectBuyNow(watch, selectedStrap);
                      onClose();
                    }}
                  >
                    <Zap size={18} color="#FFF" />
                    <Text style={styles.buyNowLargeText}>Buy Now</Text>
                  </TouchableOpacity>
                </View>

                {/* Tabs: Specifications / Guarantee / Reviews */}
                <View style={styles.tabHeader}>
                  <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'specs' && styles.tabBtnActive]}
                    onPress={() => setActiveTab('specs')}
                  >
                    <Text style={[styles.tabBtnText, activeTab === 'specs' && styles.tabBtnTextActive]}>
                      Horology Specs
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'guarantee' && styles.tabBtnActive]}
                    onPress={() => setActiveTab('guarantee')}
                  >
                    <Text style={[styles.tabBtnText, activeTab === 'guarantee' && styles.tabBtnTextActive]}>
                      Quick Red Tech Guarantee
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'reviews' && styles.tabBtnActive]}
                    onPress={() => setActiveTab('reviews')}
                  >
                    <Text style={[styles.tabBtnText, activeTab === 'reviews' && styles.tabBtnTextActive]}>
                      Reviews ({watch.reviewsCount})
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Tab 1: Horology Specs Table */}
                {activeTab === 'specs' && (
                  <View style={styles.specsTable}>
                    <View style={styles.specRow}>
                      <Text style={styles.specLabel}>Brand & Origin</Text>
                      <Text style={styles.specValue}>{watch.brand} • Authentic Certified</Text>
                    </View>
                    <View style={styles.specRow}>
                      <Text style={styles.specLabel}>Model Reference</Text>
                      <Text style={styles.specValue}>{watch.modelRef}</Text>
                    </View>
                    <View style={styles.specRow}>
                      <Text style={styles.specLabel}>Calibre & Movement</Text>
                      <Text style={styles.specValue}>{watch.movement}</Text>
                    </View>
                    <View style={styles.specRow}>
                      <Text style={styles.specLabel}>Case Diameter</Text>
                      <Text style={styles.specValue}>{watch.caseSize}</Text>
                    </View>
                    <View style={styles.specRow}>
                      <Text style={styles.specLabel}>Case Material</Text>
                      <Text style={styles.specValue}>{watch.caseMaterial}</Text>
                    </View>
                    <View style={styles.specRow}>
                      <Text style={styles.specLabel}>Dial Face</Text>
                      <Text style={styles.specValue}>{watch.dialColor}</Text>
                    </View>
                    <View style={styles.specRow}>
                      <Text style={styles.specLabel}>Water Resistance</Text>
                      <Text style={styles.specValue}>{watch.waterResistance}</Text>
                    </View>
                    <View style={styles.specRow}>
                      <Text style={styles.specLabel}>Power Reserve</Text>
                      <Text style={styles.specValue}>{watch.powerReserve || 'Full Autonomous Charge'}</Text>
                    </View>
                    <View style={styles.specRow}>
                      <Text style={styles.specLabel}>Warranty</Text>
                      <Text style={styles.specValue}>{watch.warranty || '5-Year International Viltrum Warranty'}</Text>
                    </View>
                  </View>
                )}

                {/* Tab 2: Guarantee */}
                {activeTab === 'guarantee' && (
                  <View style={styles.guaranteeBox}>
                    <View style={styles.guaranteeItem}>
                      <ShieldCheck size={18} color="#C9A24D" />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.guaranteeItemTitle}>100% Lifetime Authenticity Guarantee</Text>
                        <Text style={styles.guaranteeItemDesc}>
                          Every watch undergoes a 30-point inspection by Quick Red Tech master watchmakers.
                        </Text>
                      </View>
                    </View>

                    <View style={styles.guaranteeItem}>
                      <Truck size={18} color="#3B82F6" />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.guaranteeItemTitle}>Discreet Armored Insured Shipping</Text>
                        <Text style={styles.guaranteeItemDesc}>
                          Full value coverage with signature-required tracking to all global destinations.
                        </Text>
                      </View>
                    </View>

                    <View style={styles.guaranteeItem}>
                      <RotateCcw size={18} color="#10B981" />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.guaranteeItemTitle}>14-Day Complimentary Return Policy</Text>
                        <Text style={styles.guaranteeItemDesc}>
                          If the timepiece is not entirely as expected, return it securely in original condition.
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Tab 3: Reviews */}
                {activeTab === 'reviews' && (
                  <View style={styles.reviewsBox}>
                    <View style={styles.reviewCard}>
                      <View style={styles.reviewHeader}>
                        <Text style={styles.reviewerName}>David Sterling (Verified Collector)</Text>
                        <View style={styles.starsGroup}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={11} color="#F59E0B" fill="#F59E0B" />
                          ))}
                        </View>
                      </View>
                      <Text style={styles.reviewText}>
                        "Breathtaking finish! The watch arrived in an armored Pelican case with the Quick Red Tech certificate and paperwork. Truly impeccable service."
                      </Text>
                    </View>

                    <View style={styles.reviewCard}>
                      <View style={styles.reviewHeader}>
                        <Text style={styles.reviewerName}>Helena Thorne (VIP Member)</Text>
                        <View style={styles.starsGroup}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={11} color="#F59E0B" fill="#F59E0B" />
                          ))}
                        </View>
                      </View>
                      <Text style={styles.reviewText}>
                        "Exceeded all expectations. Movement is smooth and accurate to within +1 second per day. Fast delivery to London."
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#0D1017',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 77, 0.3)',
    width: '100%',
    maxWidth: 1000,
    maxHeight: '90%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 25,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: '#121824',
  },
  brandBadgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontFamily: THEME.fonts.serif,
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF3B0',
    letterSpacing: 1,
  },
  headerRefText: {
    fontSize: 11,
    color: '#94A3B8',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerActionBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerActionBtnLiked: {
    backgroundColor: 'rgba(230, 30, 42, 0.2)',
  },
  copiedHint: {
    position: 'absolute',
    top: 38,
    right: 0,
    backgroundColor: '#10B981',
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScrollBody: {
    flex: 1,
    padding: 20,
  },
  mainLayoutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  leftCol: {
    flex: 1,
    minWidth: 320,
  },
  mainImageWrap: {
    width: '100%',
    height: 360,
    backgroundColor: '#141A26',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailDiscountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#E61E2A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  detailDiscountText: {
    color: '#FFF',
    fontSize: 10.5,
    fontWeight: '900',
  },
  thumbnailRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  thumbItem: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#141A26',
  },
  thumbItemActive: {
    borderColor: '#C9A24D',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  authCertificateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(201, 162, 77, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 77, 0.25)',
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
  },
  authCertTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFF3B0',
  },
  authCertSubtitle: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  rightCol: {
    flex: 1.2,
    minWidth: 320,
  },
  watchNameLarge: {
    fontFamily: THEME.fonts.serif,
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
    lineHeight: 28,
    marginBottom: 8,
  },
  ratingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  starsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingNumberText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F8FAFC',
    marginLeft: 4,
  },
  reviewsCountText: {
    fontSize: 11,
    color: '#64748B',
  },
  stockStatusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  stockStatusText: {
    color: '#10B981',
    fontSize: 10.5,
    fontWeight: '700',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  mainPriceText: {
    fontFamily: THEME.fonts.serif,
    fontSize: 28,
    fontWeight: '900',
    color: '#FFF3B0',
  },
  mainOriginalPriceText: {
    fontSize: 16,
    color: '#64748B',
    textDecorationLine: 'line-through',
  },
  taxIncludedPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  taxIncludedText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 20,
    marginBottom: 16,
  },
  strapSelectionSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#C9A24D',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  strapOptionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  strapOptionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  strapOptionPillActive: {
    backgroundColor: 'rgba(201, 162, 77, 0.2)',
    borderColor: '#C9A24D',
  },
  strapOptionText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  strapOptionTextActive: {
    color: '#FFF3B0',
    fontWeight: '700',
  },
  quantitySection: {
    marginBottom: 18,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  stepperBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperVal: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
    paddingHorizontal: 14,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  addToCartLargeBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#C9A24D',
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: '#C9A24D',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  addToCartLargeText: {
    color: '#07080A',
    fontSize: 13.5,
    fontWeight: '800',
  },
  buyNowLargeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#E61E2A',
    paddingVertical: 14,
    borderRadius: 10,
  },
  buyNowLargeText: {
    color: '#FFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  tabHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 12,
  },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  tabBtnActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#C9A24D',
  },
  tabBtnText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  tabBtnTextActive: {
    color: '#FFF3B0',
    fontWeight: '800',
  },
  specsTable: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  specLabel: {
    color: '#94A3B8',
    fontSize: 11.5,
  },
  specValue: {
    color: '#F8FAFC',
    fontSize: 11.5,
    fontWeight: '700',
  },
  guaranteeBox: {
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    padding: 14,
    borderRadius: 10,
  },
  guaranteeItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  guaranteeItemTitle: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  guaranteeItemDesc: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 15,
  },
  reviewsBox: {
    gap: 10,
  },
  reviewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
    padding: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewerName: {
    color: '#FFF3B0',
    fontSize: 11.5,
    fontWeight: '700',
  },
  reviewText: {
    color: '#CBD5E1',
    fontSize: 11.5,
    lineHeight: 16,
  },
});
