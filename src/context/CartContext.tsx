import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Watch, Order, ShippingAddress, PaymentMethod, OrderStatus } from '../types';
import { getStoredOrders, saveStoredOrders } from '../services/storage';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

interface PromoCode {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  description: string;
}

const AVAILABLE_PROMOS: PromoCode[] = [
  { code: 'QUICKRED10', type: 'percent', value: 10, description: '10% Quick Red Tech Privilege Discount' },
  { code: 'VILTRUM100', type: 'fixed', value: 100, description: '$100 Horology Welcome Voucher' },
  { code: 'VILTRUMVIP', type: 'percent', value: 15, description: '15% Diamond VIP Collector Discount' },
];

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  appliedPromo: PromoCode | null;
  promoError: string | null;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  placedOrder: Order | null;
  orders: Order[];
  addToCart: (watch: Watch, quantity?: number, selectedStrap?: string) => void;
  updateQuantity: (watchId: string, quantity: number) => void;
  removeFromCart: (watchId: string) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  closeOrderSuccess: () => void;
  checkoutDirectBuyNow: (watch: Watch, selectedStrap?: string) => void;
  placeOrder: (
    shippingAddress: ShippingAddress,
    paymentMethod: PaymentMethod,
    carrierChoice?: string
  ) => Promise<Order>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
}

const CART_LOCAL_KEY = 'viltrum_cart_items_v1';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_LOCAL_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch (e) {
      console.error('Failed to parse cart:', e);
    }
    const storedOrders = getStoredOrders();
    setOrders(storedOrders);
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(CART_LOCAL_KEY, JSON.stringify(newItems));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  };

  const addToCart = (watch: Watch, quantity = 1, selectedStrap?: string) => {
    const existingIndex = items.findIndex((i) => i.watch.id === watch.id);
    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = [...items];
      updated[existingIndex].quantity += quantity;
      if (selectedStrap) updated[existingIndex].selectedStrap = selectedStrap;
    } else {
      updated = [...items, { watch, quantity, selectedStrap: selectedStrap || watch.strapType }];
    }
    saveCart(updated);
    setIsCartOpen(true);
  };

  const checkoutDirectBuyNow = (watch: Watch, selectedStrap?: string) => {
    const existingIndex = items.findIndex((i) => i.watch.id === watch.id);
    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = [...items];
    } else {
      updated = [...items, { watch, quantity: 1, selectedStrap: selectedStrap || watch.strapType }];
    }
    saveCart(updated);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const updateQuantity = (watchId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(watchId);
      return;
    }
    const updated = items.map((i) => (i.watch.id === watchId ? { ...i, quantity } : i));
    saveCart(updated);
  };

  const removeFromCart = (watchId: string) => {
    const updated = items.filter((i) => i.watch.id !== watchId);
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
    setAppliedPromo(null);
  };

  const applyPromoCode = (code: string): boolean => {
    const found = AVAILABLE_PROMOS.find((p) => p.code.toLowerCase() === code.trim().toLowerCase());
    if (found) {
      setAppliedPromo(found);
      setPromoError(null);
      return true;
    } else {
      setPromoError('Invalid coupon code. Try QUICKRED10 or VILTRUMVIP');
      return false;
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoError(null);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const openCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);
  const closeOrderSuccess = () => setPlacedOrder(null);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.watch.price * item.quantity, 0);

  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      discount = Math.round((subtotal * appliedPromo.value) / 100);
    } else {
      discount = Math.min(subtotal, appliedPromo.value);
    }
  }

  const shippingFee = subtotal > 500 ? 0 : 45; // Complimentary VIP Express for $500+
  const tax = 0; // Tax included for luxury concierge
  const total = Math.max(0, subtotal - discount + shippingFee + tax);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#C9A24D', '#E5B94E', '#FF4D4D', '#FFFFFF', '#0D1017'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#C9A24D', '#E5B94E', '#E61E2A'],
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#C9A24D', '#E5B94E', '#E61E2A'],
        });
      }, 300);
    } catch (e) {
      // ignore
    }
  };

  const placeOrder = async (
    shippingAddress: ShippingAddress,
    paymentMethod: PaymentMethod,
    carrierChoice = 'FedEx Express Insured'
  ): Promise<Order> => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingPrefix = 'QRT-EXP-';
    const trackingNum = trackingPrefix + Math.floor(10000000 + Math.random() * 90000000) + 'LUX';

    const newOrder: Order = {
      id: `VLT-2026-${randomSuffix}`,
      userId: user?.uid || 'guest_' + Math.random().toString(36).substring(2, 8),
      userEmail: shippingAddress.email || user?.email || 'guest@viltrum.app',
      userName: shippingAddress.fullName || user?.displayName || 'Valued Collector',
      items: [...items],
      subtotal,
      discount,
      shippingFee,
      tax,
      total,
      currency: 'USD',
      status: 'Confirmed',
      shippingAddress,
      paymentMethod,
      paymentStatus: 'Paid',
      trackingNumber: trackingNum,
      carrier: carrierChoice,
      promoCode: appliedPromo?.code,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    saveStoredOrders(updatedOrders);

    // Clear cart and trigger celebratory animation
    clearCart();
    setIsCheckoutOpen(false);
    setPlacedOrder(newOrder);
    triggerCelebration();

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o
    );
    setOrders(updated);
    saveStoredOrders(updated);
  };

  const deleteOrder = (orderId: string) => {
    const updated = orders.filter((o) => o.id !== orderId);
    setOrders(updated);
    saveStoredOrders(updated);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        subtotal,
        discount,
        shippingFee,
        tax,
        total,
        appliedPromo,
        promoError,
        isCartOpen,
        isCheckoutOpen,
        placedOrder,
        orders,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyPromoCode,
        removePromoCode,
        openCart,
        closeCart,
        openCheckout,
        closeCheckout,
        closeOrderSuccess,
        checkoutDirectBuyNow,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
