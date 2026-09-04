import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import {
  PackageCheck,
  ShieldCheck,
  Truck,
  CheckCircle,
  Download,
  Printer,
  ChevronRight,
  ExternalLink,
  ShoppingBag,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWatches } from '../context/WatchContext';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import { THEME } from '../styles/theme';

export const OrdersPage: React.FC<{ onExploreCatalog: () => void }> = ({ onExploreCatalog }) => {
  const { orders } = useCart();
  const { formatPrice, openWatchDetail } = useWatches();
  const { user } = useAuth();

  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  const displayOrders = user
    ? orders.filter(
        (o) =>
          o.userEmail.toLowerCase() === user.email.toLowerCase() ||
          o.userId === user.uid
      )
    : orders;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <PackageCheck size={24} color="#C9A24D" />
          <View>
            <Text style={styles.title}>My Order Tracking & Receipts</Text>
            <Text style={styles.subtitle}>
              Real-time authentication timeline and insured transit status for your acquired timepieces.
            </Text>
          </View>
        </View>
      </View>

      {displayOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ShoppingBag size={48} color="#64748B" />
          <Text style={styles.emptyTitle}>No Acquisitions Yet</Text>
          <Text style={styles.emptyText}>
            You haven't placed any orders yet. Discover fine horology from Rolex, Casio, Rick, Arnahory, G-Shock, and more.
          </Text>
          <TouchableOpacity style={styles.exploreBtn} onPress={onExploreCatalog}>
            <Text style={styles.exploreBtnText}>Browse Watch Vault</Text>
            <ArrowRight size={16} color="#07080A" />
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.ordersScroll} showsVerticalScrollIndicator={false}>
          {displayOrders.map((order) => {
            const isConfirmed = ['Confirmed', 'Authenticating', 'Shipped', 'Out for Delivery', 'Delivered'].includes(order.status);
            const isAuthenticating = ['Authenticating', 'Shipped', 'Out for Delivery', 'Delivered'].includes(order.status);
            const isShipped = ['Shipped', 'Out for Delivery', 'Delivered'].includes(order.status);
            const isDelivered = order.status === 'Delivered';

            return (
              <View key={order.id} style={styles.orderCard}>
                {/* Order Top Bar */}
                <View style={styles.orderTopBar}>
                  <View>
                    <View style={styles.idRow}>
                      <Text style={styles.orderId}>{order.id}</Text>
                      <View style={styles.statusBadge}>
                        <Text style={styles.statusBadgeText}>{order.status.toUpperCase()}</Text>
                      </View>
                    </View>
                    <Text style={styles.orderDate}>
                      Acquired on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                  </View>

                  <View style={styles.orderTotalWrap}>
                    <Text style={styles.totalLabel}>Total Paid</Text>
                    <Text style={styles.totalAmount}>{formatPrice(order.total)}</Text>
                  </View>
                </View>

                {/* Progress Bar Timeline */}
                <View style={styles.timelineWrap}>
                  <View style={styles.timelineStep}>
                    <View style={[styles.timelineDot, isConfirmed && styles.timelineDotActive]}>
                      <CheckCircle size={10} color={isConfirmed ? '#07080A' : '#64748B'} />
                    </View>
                    <Text style={[styles.timelineStepLabel, isConfirmed && styles.timelineStepLabelActive]}>
                      Confirmed
                    </Text>
                  </View>

                  <View style={[styles.timelineLine, isAuthenticating && styles.timelineLineActive]} />

                  <View style={styles.timelineStep}>
                    <View style={[styles.timelineDot, isAuthenticating && styles.timelineDotActive]}>
                      <ShieldCheck size={10} color={isAuthenticating ? '#07080A' : '#64748B'} />
                    </View>
                    <Text style={[styles.timelineStepLabel, isAuthenticating && styles.timelineStepLabelActive]}>
                      QRT Inspection
                    </Text>
                  </View>

                  <View style={[styles.timelineLine, isShipped && styles.timelineLineActive]} />

                  <View style={styles.timelineStep}>
                    <View style={[styles.timelineDot, isShipped && styles.timelineDotActive]}>
                      <Truck size={10} color={isShipped ? '#07080A' : '#64748B'} />
                    </View>
                    <Text style={[styles.timelineStepLabel, isShipped && styles.timelineStepLabelActive]}>
                      In Transit
                    </Text>
                  </View>

                  <View style={[styles.timelineLine, isDelivered && styles.timelineLineActive]} />

                  <View style={styles.timelineStep}>
                    <View style={[styles.timelineDot, isDelivered && styles.timelineDotActive]}>
                      <PackageCheck size={10} color={isDelivered ? '#07080A' : '#64748B'} />
                    </View>
                    <Text style={[styles.timelineStepLabel, isDelivered && styles.timelineStepLabelActive]}>
                      Delivered
                    </Text>
                  </View>
                </View>

                {/* Tracking Code Line */}
                <View style={styles.trackingPill}>
                  <Truck size={14} color="#3B82F6" />
                  <Text style={styles.trackingPillText}>
                    Carrier: {order.carrier} • Tracking #{order.trackingNumber}
                  </Text>
                </View>

                {/* Items in this order */}
                <View style={styles.itemsList}>
                  {order.items.map(({ watch, quantity, selectedStrap }, i) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.itemRow}
                      onPress={() => openWatchDetail(watch)}
                    >
                      <Image
                        source={{ uri: watch.images[0] || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=300&q=80' }}
                        style={styles.itemImg}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.itemBrand}>{watch.brand.toUpperCase()}</Text>
                        <Text style={styles.itemName}>{watch.name}</Text>
                        <Text style={styles.itemStrap}>
                          {selectedStrap || watch.strapType} • Qty: {quantity}
                        </Text>
                      </View>
                      <Text style={styles.itemPrice}>{formatPrice(watch.price * quantity)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Footer buttons */}
                <View style={styles.orderCardFooter}>
                  <Text style={styles.destinationHint}>
                    Ship to: {order.shippingAddress.fullName}, {order.shippingAddress.city}, {order.shippingAddress.country}
                  </Text>

                  <TouchableOpacity
                    style={styles.receiptBtn}
                    onPress={() => {
                      if (typeof window !== 'undefined') window.print();
                    }}
                  >
                    <Printer size={14} color="#CBD5E1" />
                    <Text style={styles.receiptBtnText}>Print Official Receipt</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 1100,
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
  emptyContainer: {
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
  ordersScroll: {
    gap: 16,
  },
  orderCard: {
    backgroundColor: '#0D1017',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 77, 0.25)',
    padding: 18,
    marginBottom: 16,
    gap: 14,
  },
  orderTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    paddingBottom: 12,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderId: {
    fontFamily: THEME.fonts.mono,
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF3B0',
  },
  statusBadge: {
    backgroundColor: 'rgba(201, 162, 77, 0.2)',
    borderWidth: 1,
    borderColor: '#C9A24D',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadgeText: {
    color: '#FFF3B0',
    fontSize: 9.5,
    fontWeight: '800',
  },
  orderDate: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  orderTotalWrap: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 10.5,
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  totalAmount: {
    fontFamily: THEME.fonts.serif,
    fontSize: 17,
    fontWeight: '900',
    color: '#FFF3B0',
  },
  timelineWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    paddingVertical: 12,
    borderRadius: 10,
  },
  timelineStep: {
    alignItems: 'center',
    gap: 4,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotActive: {
    backgroundColor: '#10B981',
  },
  timelineStepLabel: {
    fontSize: 9.5,
    color: '#64748B',
    fontWeight: '600',
  },
  timelineStepLabelActive: {
    color: '#FFF3B0',
    fontWeight: '700',
  },
  timelineLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 4,
    marginBottom: 12,
  },
  timelineLineActive: {
    backgroundColor: '#10B981',
  },
  trackingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
    borderRadius: 8,
    padding: 8,
  },
  trackingPillText: {
    color: '#93C5FD',
    fontSize: 11.5,
    fontWeight: '600',
  },
  itemsList: {
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 8,
    borderRadius: 8,
  },
  itemImg: {
    width: 44,
    height: 44,
    borderRadius: 6,
    backgroundColor: '#141A26',
    resizeMode: 'cover',
  },
  itemBrand: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#C9A24D',
  },
  itemName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  itemStrap: {
    fontSize: 10,
    color: '#94A3B8',
  },
  itemPrice: {
    fontFamily: THEME.fonts.serif,
    fontSize: 13,
    fontWeight: '800',
    color: '#FFF3B0',
  },
  orderCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 10,
  },
  destinationHint: {
    fontSize: 11,
    color: '#94A3B8',
  },
  receiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  receiptBtnText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
  },
});
