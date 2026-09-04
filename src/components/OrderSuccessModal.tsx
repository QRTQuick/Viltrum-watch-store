import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, ScrollView, Platform } from 'react-native';
import {
  CheckCircle,
  Package,
  ShieldCheck,
  Truck,
  Download,
  ArrowRight,
  ExternalLink,
  Printer,
  Sparkles,
  X,
  Crown,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWatches } from '../context/WatchContext';
import { THEME } from '../styles/theme';

interface OrderSuccessModalProps {
  onViewOrders: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ onViewOrders }) => {
  const { placedOrder, closeOrderSuccess } = useCart();
  const { formatPrice } = useWatches();

  if (!placedOrder) return null;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <Modal visible={Boolean(placedOrder)} transparent animationType="fade" onRequestClose={closeOrderSuccess}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Crown size={18} color="#C9A24D" />
              <Text style={styles.headerTitle}>Order Authenticated & Secured</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={closeOrderSuccess}>
              <X size={20} color="#F8FAFC" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Success Hero Header */}
            <View style={styles.heroSection}>
              <View style={styles.successIconOuter}>
                <CheckCircle size={44} color="#10B981" />
              </View>
              <Text style={styles.heroMainText}>Congratulations on your Acquisition</Text>
              <Text style={styles.heroSubText}>
                Your timepiece is now entering the Quick Red Tech white-glove authentication pipeline.
              </Text>

              {/* Order Reference Badge */}
              <View style={styles.orderRefBadge}>
                <Text style={styles.orderRefLabel}>ORDER REFERENCE</Text>
                <Text style={styles.orderRefNumber}>{placedOrder.id}</Text>
              </View>
            </View>

            {/* Live Status Timeline Progress */}
            <View style={styles.statusTimelineBox}>
              <Text style={styles.timelineTitle}>Live Horology Fulfillment Status</Text>

              <View style={styles.timelineStepsRow}>
                <View style={styles.timelineStep}>
                  <View style={[styles.stepDot, styles.stepDotActive]}>
                    <CheckCircle size={12} color="#07080A" />
                  </View>
                  <Text style={[styles.stepLabel, styles.stepLabelActive]}>Confirmed</Text>
                </View>

                <View style={[styles.stepConnector, styles.stepConnectorActive]} />

                <View style={styles.timelineStep}>
                  <View style={[styles.stepDot, styles.stepDotPulse]}>
                    <ShieldCheck size={12} color="#FFF3B0" />
                  </View>
                  <Text style={[styles.stepLabel, styles.stepLabelActive]}>QRT Authenticating</Text>
                </View>

                <View style={styles.stepConnector} />

                <View style={styles.timelineStep}>
                  <View style={styles.stepDot}>
                    <Truck size={12} color="#64748B" />
                  </View>
                  <Text style={styles.stepLabel}>In Transit</Text>
                </View>

                <View style={styles.stepConnector} />

                <View style={styles.timelineStep}>
                  <View style={styles.stepDot}>
                    <Package size={12} color="#64748B" />
                  </View>
                  <Text style={styles.stepLabel}>Delivered</Text>
                </View>
              </View>

              {/* Tracking number pill */}
              <View style={styles.trackingInfoPill}>
                <Truck size={14} color="#3B82F6" />
                <Text style={styles.trackingInfoText}>
                  Carrier: {placedOrder.carrier} • Tracking #{placedOrder.trackingNumber}
                </Text>
              </View>
            </View>

            {/* Itemized Invoice Box */}
            <View style={styles.invoiceBox}>
              <View style={styles.invoiceHeader}>
                <Text style={styles.invoiceTitle}>OFFICIAL VILTRUM RECEIPT</Text>
                <Text style={styles.invoiceDate}>{new Date(placedOrder.createdAt).toLocaleDateString()}</Text>
              </View>

              {/* Items List */}
              <View style={styles.invoiceItemsList}>
                {placedOrder.items.map(({ watch, quantity, selectedStrap }, idx) => (
                  <View key={idx} style={styles.invoiceItemRow}>
                    <Image
                      source={{ uri: watch.images[0] || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80' }}
                      style={styles.invoiceItemImg}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.invoiceItemBrand}>{watch.brand.toUpperCase()}</Text>
                      <Text style={styles.invoiceItemName}>{watch.name}</Text>
                      {selectedStrap && (
                        <Text style={styles.invoiceItemStrap}>Strap: {selectedStrap}</Text>
                      )}
                      <Text style={styles.invoiceItemRef}>Ref. {watch.modelRef} • Qty: {quantity}</Text>
                    </View>
                    <Text style={styles.invoiceItemPrice}>{formatPrice(watch.price * quantity)}</Text>
                  </View>
                ))}
              </View>

              {/* Financial Totals */}
              <View style={styles.invoiceTotals}>
                <View style={styles.invoiceTotalRow}>
                  <Text style={styles.invLabel}>Subtotal</Text>
                  <Text style={styles.invVal}>{formatPrice(placedOrder.subtotal)}</Text>
                </View>
                {placedOrder.discount > 0 && (
                  <View style={styles.invoiceTotalRow}>
                    <Text style={[styles.invLabel, { color: '#10B981' }]}>Discount ({placedOrder.promoCode || 'Privilege'})</Text>
                    <Text style={[styles.invVal, { color: '#10B981' }]}>-{formatPrice(placedOrder.discount)}</Text>
                  </View>
                )}
                <View style={styles.invoiceTotalRow}>
                  <Text style={styles.invLabel}>Armored Insured Shipping</Text>
                  <Text style={styles.invVal}>FREE</Text>
                </View>
                <View style={[styles.invoiceTotalRow, styles.invGrandTotal]}>
                  <Text style={styles.invGrandLabel}>Grand Total Paid</Text>
                  <Text style={styles.invGrandVal}>{formatPrice(placedOrder.total)}</Text>
                </View>
              </View>

              {/* Delivery Address Details */}
              <View style={styles.destinationBox}>
                <Text style={styles.destinationHeading}>Delivery Destination</Text>
                <Text style={styles.destinationText}>
                  {placedOrder.shippingAddress.fullName}{'\n'}
                  {placedOrder.shippingAddress.street}{'\n'}
                  {placedOrder.shippingAddress.city}, {placedOrder.shippingAddress.state} {placedOrder.shippingAddress.postalCode}{'\n'}
                  {placedOrder.shippingAddress.country}{'\n'}
                  Phone: {placedOrder.shippingAddress.phone}
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionsFooter}>
              <TouchableOpacity style={styles.printBtn} onPress={handlePrint}>
                <Printer size={16} color="#F8FAFC" />
                <Text style={styles.printBtnText}>Print Official Invoice</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.viewOrdersBtn}
                onPress={() => {
                  closeOrderSuccess();
                  onViewOrders();
                }}
              >
                <Text style={styles.viewOrdersBtnText}>Track in My Orders</Text>
                <ArrowRight size={16} color="#07080A" />
              </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
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
    maxWidth: 720,
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
    fontSize: 15,
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
  scrollBody: {
    flex: 1,
    padding: 20,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  successIconOuter: {
    width: 72,
    height: 72,
    borderRadius: 99,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroMainText: {
    fontFamily: THEME.fonts.serif,
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF3B0',
    textAlign: 'center',
    marginBottom: 6,
  },
  heroSubText: {
    fontSize: 12.5,
    color: '#CBD5E1',
    textAlign: 'center',
    maxWidth: 480,
    lineHeight: 18,
    marginBottom: 14,
  },
  orderRefBadge: {
    backgroundColor: 'rgba(201, 162, 77, 0.15)',
    borderWidth: 1,
    borderColor: '#C9A24D',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  orderRefLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#C9A24D',
    letterSpacing: 1.5,
  },
  orderRefNumber: {
    fontFamily: THEME.fonts.mono,
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF3B0',
    letterSpacing: 2,
    marginTop: 2,
  },
  statusTimelineBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
    marginBottom: 20,
  },
  timelineTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFF3B0',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
    textAlign: 'center',
  },
  timelineStepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 14,
  },
  timelineStep: {
    alignItems: 'center',
    gap: 6,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: '#10B981',
  },
  stepDotPulse: {
    backgroundColor: 'rgba(201, 162, 77, 0.3)',
    borderWidth: 1,
    borderColor: '#C9A24D',
  },
  stepLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  stepLabelActive: {
    color: '#FFF3B0',
    fontWeight: '800',
  },
  stepConnector: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 4,
    marginBottom: 14,
  },
  stepConnectorActive: {
    backgroundColor: '#10B981',
  },
  trackingInfoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
    borderRadius: 8,
    padding: 8,
  },
  trackingInfoText: {
    color: '#93C5FD',
    fontSize: 11.5,
    fontWeight: '600',
  },
  invoiceBox: {
    backgroundColor: '#121824',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 77, 0.25)',
    padding: 16,
    marginBottom: 20,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    paddingBottom: 10,
    marginBottom: 12,
  },
  invoiceTitle: {
    fontFamily: THEME.fonts.serif,
    fontSize: 12,
    fontWeight: '900',
    color: '#C9A24D',
    letterSpacing: 1.5,
  },
  invoiceDate: {
    fontSize: 11,
    color: '#94A3B8',
  },
  invoiceItemsList: {
    gap: 10,
  },
  invoiceItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
    paddingBottom: 8,
  },
  invoiceItemImg: {
    width: 44,
    height: 44,
    borderRadius: 6,
    backgroundColor: '#1A2234',
  },
  invoiceItemBrand: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#C9A24D',
  },
  invoiceItemName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  invoiceItemStrap: {
    fontSize: 10,
    color: '#94A3B8',
  },
  invoiceItemRef: {
    fontSize: 10,
    color: '#64748B',
  },
  invoiceItemPrice: {
    fontFamily: THEME.fonts.serif,
    fontSize: 13,
    fontWeight: '800',
    color: '#FFF3B0',
  },
  invoiceTotals: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 8,
    gap: 4,
  },
  invoiceTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  invLabel: {
    fontSize: 11.5,
    color: '#94A3B8',
  },
  invVal: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  invGrandTotal: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(201, 162, 77, 0.3)',
    paddingTop: 6,
    marginTop: 4,
  },
  invGrandLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFF3B0',
  },
  invGrandVal: {
    fontFamily: THEME.fonts.serif,
    fontSize: 17,
    fontWeight: '900',
    color: '#FFF3B0',
  },
  destinationBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  destinationHeading: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#C9A24D',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  destinationText: {
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 16,
  },
  actionsFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  printBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  printBtnText: {
    color: '#F8FAFC',
    fontSize: 12.5,
    fontWeight: '700',
  },
  viewOrdersBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#C9A24D',
    paddingVertical: 12,
    borderRadius: 10,
  },
  viewOrdersBtnText: {
    color: '#07080A',
    fontSize: 13,
    fontWeight: '900',
  },
});
