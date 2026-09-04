import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, Modal, ScrollView, Platform } from 'react-native';
import {
  X,
  CreditCard,
  Lock,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  QrCode,
  Copy,
  Building,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWatches } from '../context/WatchContext';
import { useAuth } from '../context/AuthContext';
import { ShippingAddress, PaymentMethod } from '../types';
import { THEME } from '../styles/theme';

export const CheckoutModal: React.FC = () => {
  const { isCheckoutOpen, closeCheckout, items, subtotal, discount, shippingFee, total, placeOrder } = useCart();
  const { formatPrice } = useWatches();
  const { user, profile } = useAuth();

  const [step, setStep] = useState<1 | 2>(1); // 1: Shipping & Courier, 2: Payment & Review
  const [isProcessing, setIsProcessing] = useState(false);
  const [carrier, setCarrier] = useState('FedEx Priority Armored Insured');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Credit/Debit Card');

  // Form State
  const defaultAddr = profile?.shippingAddresses?.[0];
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: defaultAddr?.fullName || profile?.displayName || '',
    email: defaultAddr?.email || user?.email || '',
    phone: defaultAddr?.phone || '+1 (555) 000-0000',
    street: defaultAddr?.street || '',
    city: defaultAddr?.city || '',
    state: defaultAddr?.state || '',
    postalCode: defaultAddr?.postalCode || '',
    country: defaultAddr?.country || 'United States',
  });

  // Credit card interactive state
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState(formData.fullName || 'VILTRUM COLLECTOR');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [copiedCrypto, setCopiedCrypto] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleInputChange = (field: keyof ShippingAddress, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (field === 'fullName') {
      setCardHolder(val || 'VILTRUM COLLECTOR');
    }
  };

  const handleCompleteOrder = async () => {
    setIsProcessing(true);
    // Simulate high-security token authorization
    setTimeout(async () => {
      try {
        await placeOrder(formData, paymentMethod, carrier);
        setIsProcessing(false);
      } catch (e) {
        setIsProcessing(false);
      }
    }, 1200);
  };

  const handleCopyCrypto = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('0x98A4ViltrumQuickRedTechVault77B90C');
      setCopiedCrypto(true);
      setTimeout(() => setCopiedCrypto(false), 2000);
    }
  };

  return (
    <Modal visible={isCheckoutOpen} transparent animationType="fade" onRequestClose={closeCheckout}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Lock size={16} color="#C9A24D" />
              <Text style={styles.headerTitle}>Viltrum Encrypted Checkout</Text>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={closeCheckout}>
              <X size={20} color="#F8FAFC" />
            </TouchableOpacity>
          </View>

          {/* Stepper Header */}
          <View style={styles.stepperTabs}>
            <TouchableOpacity
              style={[styles.stepTab, step === 1 && styles.stepTabActive]}
              onPress={() => setStep(1)}
            >
              <View style={[styles.stepNumber, step === 1 && styles.stepNumberActive]}>
                <Text style={[styles.stepNumberText, step === 1 && styles.stepNumberTextActive]}>1</Text>
              </View>
              <Text style={[styles.stepTabText, step === 1 && styles.stepTabTextActive]}>
                Insured Delivery Address
              </Text>
            </TouchableOpacity>

            <View style={styles.stepDivider} />

            <TouchableOpacity
              style={[styles.stepTab, step === 2 && styles.stepTabActive]}
              onPress={() => setStep(2)}
            >
              <View style={[styles.stepNumber, step === 2 && styles.stepNumberActive]}>
                <Text style={[styles.stepNumberText, step === 2 && styles.stepNumberTextActive]}>2</Text>
              </View>
              <Text style={[styles.stepTabText, step === 2 && styles.stepTabTextActive]}>
                Payment & Authorization
              </Text>
            </TouchableOpacity>
          </View>

          {/* Body Content */}
          <ScrollView style={styles.bodyScroll} showsVerticalScrollIndicator={false}>
            {step === 1 ? (
              <View style={styles.stepContent}>
                <Text style={styles.sectionHeading}>Armored Shipping Destination</Text>
                <Text style={styles.sectionSub}>
                  All packages are dispatched via sealed high-security priority courier with real-time GPS tracking.
                </Text>

                <View style={styles.formGrid}>
                  <View style={styles.formGroupFull}>
                    <Text style={styles.inputLabel}>Full Legal Name *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Chisom Life Eke"
                      placeholderTextColor="#64748B"
                      value={formData.fullName}
                      onChangeText={(v) => handleInputChange('fullName', v)}
                    />
                  </View>

                  <View style={styles.formGroupHalf}>
                    <Text style={styles.inputLabel}>Email Address for Tracking *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="chisomlifeeke@gmail.com"
                      placeholderTextColor="#64748B"
                      value={formData.email}
                      onChangeText={(v) => handleInputChange('email', v)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.formGroupHalf}>
                    <Text style={styles.inputLabel}>Contact Phone *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="+234 812 345 6789"
                      placeholderTextColor="#64748B"
                      value={formData.phone}
                      onChangeText={(v) => handleInputChange('phone', v)}
                      keyboardType="phone-pad"
                    />
                  </View>

                  <View style={styles.formGroupFull}>
                    <Text style={styles.inputLabel}>Street Address *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Suite / Street address"
                      placeholderTextColor="#64748B"
                      value={formData.street}
                      onChangeText={(v) => handleInputChange('street', v)}
                    />
                  </View>

                  <View style={styles.formGroupHalf}>
                    <Text style={styles.inputLabel}>City *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Lagos / Los Angeles"
                      placeholderTextColor="#64748B"
                      value={formData.city}
                      onChangeText={(v) => handleInputChange('city', v)}
                    />
                  </View>

                  <View style={styles.formGroupHalf}>
                    <Text style={styles.inputLabel}>State / Region *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="State or Province"
                      placeholderTextColor="#64748B"
                      value={formData.state}
                      onChangeText={(v) => handleInputChange('state', v)}
                    />
                  </View>

                  <View style={styles.formGroupHalf}>
                    <Text style={styles.inputLabel}>Postal / ZIP Code *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Postal code"
                      placeholderTextColor="#64748B"
                      value={formData.postalCode}
                      onChangeText={(v) => handleInputChange('postalCode', v)}
                    />
                  </View>

                  <View style={styles.formGroupHalf}>
                    <Text style={styles.inputLabel}>Country *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Country"
                      placeholderTextColor="#64748B"
                      value={formData.country}
                      onChangeText={(v) => handleInputChange('country', v)}
                    />
                  </View>
                </View>

                {/* Courier Selection */}
                <Text style={[styles.sectionHeading, { marginTop: 20 }]}>Select Courier Carrier</Text>
                <View style={styles.carrierList}>
                  {[
                    {
                      name: 'FedEx Priority Armored Insured',
                      time: '1-3 Business Days • Full Insurance',
                      price: 'Free',
                    },
                    {
                      name: 'DHL Express Worldwide Luxury Flight',
                      time: '2-4 Business Days • Signature Required',
                      price: 'Free',
                    },
                    {
                      name: 'White Glove Concierge Hand-Delivery',
                      time: 'Direct by Quick Red Tech Courier',
                      price: 'VIP Included',
                    },
                  ].map((c) => (
                    <TouchableOpacity
                      key={c.name}
                      style={[
                        styles.carrierCard,
                        carrier === c.name && styles.carrierCardActive,
                      ]}
                      onPress={() => setCarrier(c.name)}
                    >
                      <View style={styles.carrierLeft}>
                        <Truck size={18} color={carrier === c.name ? '#FFF3B0' : '#94A3B8'} />
                        <View>
                          <Text style={styles.carrierName}>{c.name}</Text>
                          <Text style={styles.carrierTime}>{c.time}</Text>
                        </View>
                      </View>
                      <Text style={styles.carrierPrice}>{c.price}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Continue to payment */}
                <TouchableOpacity
                  style={styles.nextStepBtn}
                  onPress={() => setStep(2)}
                >
                  <Text style={styles.nextStepBtnText}>Continue to Payment</Text>
                  <ArrowRight size={16} color="#07080A" />
                </TouchableOpacity>
              </View>
            ) : (
              /* Step 2: Payment & Final Review */
              <View style={styles.stepContent}>
                <Text style={styles.sectionHeading}>Select Secure Payment Method</Text>

                {/* Payment Method Selector Pills */}
                <View style={styles.paymentMethodsGrid}>
                  {[
                    'Credit/Debit Card',
                    'Apple Pay',
                    'Google Pay',
                    'Crypto (USDT/BTC)',
                    'Bank Wire',
                  ].map((method) => (
                    <TouchableOpacity
                      key={method}
                      style={[
                        styles.methodPill,
                        paymentMethod === method && styles.methodPillActive,
                      ]}
                      onPress={() => setPaymentMethod(method as any)}
                    >
                      <Text
                        style={[
                          styles.methodPillText,
                          paymentMethod === method && styles.methodPillTextActive,
                        ]}
                      >
                        {method}
                      </Text>
                      {paymentMethod === method && (
                        <CheckCircle2 size={13} color="#FFF3B0" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Interactive Payment UI based on method */}
                {paymentMethod === 'Credit/Debit Card' && (
                  <View style={styles.cardPaymentContainer}>
                    {/* 3D Animated Luxury Credit Card */}
                    <View style={styles.luxuryCreditCard}>
                      <View style={styles.cardTopRow}>
                        <Text style={styles.cardBankTitle}>VILTRUM ELITE BLACK</Text>
                        <Sparkles size={16} color="#FFF3B0" />
                      </View>
                      <View style={styles.cardChip} />
                      <Text style={styles.cardNumberDisplay}>{cardNumber}</Text>
                      <View style={styles.cardBottomRow}>
                        <View>
                          <Text style={styles.cardMicroLabel}>CARD HOLDER</Text>
                          <Text style={styles.cardHolderDisplay}>{cardHolder.toUpperCase()}</Text>
                        </View>
                        <View>
                          <Text style={styles.cardMicroLabel}>EXPIRES</Text>
                          <Text style={styles.cardExpiryDisplay}>{cardExpiry}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Card inputs */}
                    <View style={styles.cardInputFields}>
                      <View style={styles.formGroupFull}>
                        <Text style={styles.inputLabel}>Card Number</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="4242 4242 4242 4242"
                          placeholderTextColor="#64748B"
                          value={cardNumber}
                          onChangeText={setCardNumber}
                        />
                      </View>
                      <View style={styles.formGroupHalf}>
                        <Text style={styles.inputLabel}>Expiration (MM/YY)</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="12/28"
                          placeholderTextColor="#64748B"
                          value={cardExpiry}
                          onChangeText={setCardExpiry}
                        />
                      </View>
                      <View style={styles.formGroupHalf}>
                        <Text style={styles.inputLabel}>Security Code (CVV)</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="888"
                          placeholderTextColor="#64748B"
                          value={cardCvv}
                          onChangeText={setCardCvv}
                          secureTextEntry
                        />
                      </View>
                    </View>
                  </View>
                )}

                {/* Crypto Payment */}
                {paymentMethod === 'Crypto (USDT/BTC)' && (
                  <View style={styles.cryptoBox}>
                    <View style={styles.cryptoHeader}>
                      <QrCode size={20} color="#C9A24D" />
                      <Text style={styles.cryptoTitle}>Quick Red Tech Web3 Escrow Vault</Text>
                    </View>
                    <Text style={styles.cryptoSub}>
                      Send exact USDT (TRC-20 / ERC-20) or Bitcoin to the verified escrow contract below.
                    </Text>
                    <View style={styles.cryptoAddressRow}>
                      <Text style={styles.cryptoAddressText} numberOfLines={1}>
                        0x98A4ViltrumQuickRedTechVault77B90C
                      </Text>
                      <TouchableOpacity style={styles.copyBtn} onPress={handleCopyCrypto}>
                        <Copy size={14} color="#07080A" />
                        <Text style={styles.copyBtnText}>{copiedCrypto ? 'Copied' : 'Copy'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Apple / Google Pay */}
                {(paymentMethod === 'Apple Pay' || paymentMethod === 'Google Pay') && (
                  <View style={styles.digitalWalletBox}>
                    <Sparkles size={24} color="#C9A24D" />
                    <Text style={styles.digitalWalletTitle}>Instant {paymentMethod} Authorization</Text>
                    <Text style={styles.digitalWalletSub}>
                      Biometric fingerprint or FaceID confirmation will be requested when you tap complete.
                    </Text>
                  </View>
                )}

                {/* Bank Wire */}
                {paymentMethod === 'Bank Wire' && (
                  <View style={styles.bankWireBox}>
                    <Building size={20} color="#C9A24D" />
                    <Text style={styles.bankWireTitle}>Direct International Wire Transfer</Text>
                    <Text style={styles.bankWireText}>
                      Beneficiary: Viltrum Horology LLC / Quick Red Tech{'\n'}
                      IBAN: CH93 0076 2011 6238 5293 3{'\n'}
                      SWIFT/BIC: QRTWISSX
                    </Text>
                  </View>
                )}

                {/* Order Summary Recap */}
                <View style={styles.orderSummaryRecap}>
                  <Text style={styles.recapHeading}>Order Vault Breakdown ({items.length} Timepieces)</Text>
                  {items.map(({ watch, quantity }) => (
                    <View key={watch.id} style={styles.recapItem}>
                      <Text style={styles.recapItemName} numberOfLines={1}>
                        {quantity}x {watch.brand} - {watch.name}
                      </Text>
                      <Text style={styles.recapItemPrice}>{formatPrice(watch.price * quantity)}</Text>
                    </View>
                  ))}

                  <View style={styles.recapDivider} />

                  <View style={styles.recapRow}>
                    <Text style={styles.recapLabel}>Subtotal</Text>
                    <Text style={styles.recapVal}>{formatPrice(subtotal)}</Text>
                  </View>

                  {discount > 0 && (
                    <View style={styles.recapRow}>
                      <Text style={[styles.recapLabel, { color: '#10B981' }]}>Discount</Text>
                      <Text style={[styles.recapVal, { color: '#10B981' }]}>-{formatPrice(discount)}</Text>
                    </View>
                  )}

                  <View style={styles.recapRow}>
                    <Text style={styles.recapLabel}>Insured Armored Courier</Text>
                    <Text style={styles.recapVal}>FREE</Text>
                  </View>

                  <View style={[styles.recapRow, styles.recapGrandTotal]}>
                    <Text style={styles.recapGrandTotalLabel}>Final Amount Authorized</Text>
                    <Text style={styles.recapGrandTotalVal}>{formatPrice(total)}</Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.step2Actions}>
                  <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => setStep(1)}
                  >
                    <Text style={styles.backBtnText}>← Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.completeOrderBtn, isProcessing && styles.completeOrderBtnDisabled]}
                    disabled={isProcessing}
                    onPress={handleCompleteOrder}
                  >
                    <Lock size={16} color="#07080A" />
                    <Text style={styles.completeOrderBtnText}>
                      {isProcessing ? 'Authorizing Escrow...' : `Authorize & Pay ${formatPrice(total)}`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
  modalBox: {
    backgroundColor: '#0D1017',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 77, 0.3)',
    width: '100%',
    maxWidth: 780,
    maxHeight: '92%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 25,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: '#121824',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontFamily: THEME.fonts.serif,
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF3B0',
    letterSpacing: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  stepTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepTabActive: {},
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberActive: {
    backgroundColor: '#C9A24D',
  },
  stepNumberText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '800',
  },
  stepNumberTextActive: {
    color: '#07080A',
  },
  stepTabText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  stepTabTextActive: {
    color: '#FFF3B0',
    fontWeight: '800',
  },
  stepDivider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 16,
  },
  bodyScroll: {
    flex: 1,
    padding: 20,
  },
  stepContent: {
    gap: 16,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF3B0',
    letterSpacing: 0.5,
  },
  sectionSub: {
    fontSize: 11.5,
    color: '#94A3B8',
    lineHeight: 16,
  },
  formGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  formGroupFull: {
    width: '100%',
  },
  formGroupHalf: {
    flex: 1,
    minWidth: 200,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#CBD5E1',
    marginBottom: 4,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    color: '#F8FAFC',
    fontSize: 12.5,
    outlineStyle: 'none' as any,
  },
  carrierList: {
    gap: 8,
  },
  carrierCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  carrierCardActive: {
    backgroundColor: 'rgba(201, 162, 77, 0.12)',
    borderColor: '#C9A24D',
  },
  carrierLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  carrierName: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  carrierTime: {
    fontSize: 10.5,
    color: '#94A3B8',
  },
  carrierPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#10B981',
  },
  nextStepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#C9A24D',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 8,
  },
  nextStepBtnText: {
    color: '#07080A',
    fontSize: 13.5,
    fontWeight: '900',
  },
  paymentMethodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  methodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  methodPillActive: {
    backgroundColor: 'rgba(201, 162, 77, 0.2)',
    borderColor: '#C9A24D',
  },
  methodPillText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  methodPillTextActive: {
    color: '#FFF3B0',
    fontWeight: '800',
  },
  cardPaymentContainer: {
    gap: 14,
  },
  luxuryCreditCard: {
    backgroundColor: 'linear-gradient(135deg, #1C2333 0%, #0D111A 100%)' as any,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 77, 0.4)',
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 15,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBankTitle: {
    fontFamily: THEME.fonts.serif,
    fontSize: 12,
    fontWeight: '900',
    color: '#FFF3B0',
    letterSpacing: 2,
  },
  cardChip: {
    width: 36,
    height: 26,
    borderRadius: 5,
    backgroundColor: '#C9A24D',
    marginVertical: 14,
  },
  cardNumberDisplay: {
    fontFamily: THEME.fonts.mono,
    fontSize: 16,
    color: '#F8FAFC',
    letterSpacing: 3,
    marginBottom: 14,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardMicroLabel: {
    fontSize: 8,
    color: '#94A3B8',
    letterSpacing: 1,
  },
  cardHolderDisplay: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFF3B0',
    letterSpacing: 1,
  },
  cardExpiryDisplay: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  cardInputFields: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  cryptoBox: {
    backgroundColor: 'rgba(201, 162, 77, 0.08)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 77, 0.25)',
    gap: 8,
  },
  cryptoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cryptoTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFF3B0',
  },
  cryptoSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  cryptoAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#07080A',
    borderRadius: 8,
    padding: 10,
    gap: 8,
  },
  cryptoAddressText: {
    flex: 1,
    fontFamily: THEME.fonts.mono,
    fontSize: 11,
    color: '#FFF3B0',
  },
  copyBtn: {
    backgroundColor: '#C9A24D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  copyBtnText: {
    color: '#07080A',
    fontSize: 10.5,
    fontWeight: '800',
  },
  digitalWalletBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  digitalWalletTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF3B0',
    marginTop: 8,
    marginBottom: 4,
  },
  digitalWalletSub: {
    fontSize: 11.5,
    color: '#94A3B8',
    textAlign: 'center',
  },
  bankWireBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  bankWireTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFF3B0',
  },
  bankWireText: {
    fontFamily: THEME.fonts.mono,
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 18,
  },
  orderSummaryRecap: {
    backgroundColor: '#121824',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 6,
    marginTop: 8,
  },
  recapHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#C9A24D',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  recapItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recapItemName: {
    flex: 1,
    fontSize: 11.5,
    color: '#CBD5E1',
  },
  recapItemPrice: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#F8FAFC',
    marginLeft: 8,
  },
  recapDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 4,
  },
  recapRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recapLabel: {
    fontSize: 11.5,
    color: '#94A3B8',
  },
  recapVal: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  recapGrandTotal: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(201, 162, 77, 0.2)',
    paddingTop: 6,
    marginTop: 4,
  },
  recapGrandTotalLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFF3B0',
  },
  recapGrandTotalVal: {
    fontFamily: THEME.fonts.serif,
    fontSize: 17,
    fontWeight: '900',
    color: '#FFF3B0',
  },
  step2Actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  backBtn: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  completeOrderBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#C9A24D',
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: '#C9A24D',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  completeOrderBtnDisabled: {
    opacity: 0.6,
  },
  completeOrderBtnText: {
    color: '#07080A',
    fontSize: 13.5,
    fontWeight: '900',
  },
});
