import { Watch, Order, UserProfile, Currency, CurrencyRate } from '../types';
import { INITIAL_WATCHES } from '../data/initialWatches';
import { ADMIN_EMAIL } from './firebase';

const STORAGE_KEYS = {
  WATCHES: 'viltrum_watches_v1',
  ORDERS: 'viltrum_orders_v1',
  USERS: 'viltrum_user_profiles_v1',
  CART: 'viltrum_cart_v1',
  CURRENT_USER: 'viltrum_auth_user_v1',
  CURRENCY: 'viltrum_selected_currency_v1',
};

export const CURRENCIES: Record<Currency, CurrencyRate> = {
  USD: {
    code: 'USD',
    symbol: '$',
    rate: 1.0,
    format: (amt) => `$${amt.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    rate: 0.92,
    format: (amt) => `€${(amt * 0.92).toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    rate: 0.79,
    format: (amt) => `£${(amt * 0.79).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
  },
  NGN: {
    code: 'NGN',
    symbol: '₦',
    rate: 1550.0,
    format: (amt) => `₦${(amt * 1550).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
  },
  AED: {
    code: 'AED',
    symbol: 'AED ',
    rate: 3.67,
    format: (amt) => `AED ${(amt * 3.67).toLocaleString('en-AE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    rate: 152.0,
    format: (amt) => `¥${(amt * 152).toLocaleString('ja-JP', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
  },
};

// ==================== WATCHES STORAGE ====================
export const getStoredWatches = (): Watch[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WATCHES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.WATCHES, JSON.stringify(INITIAL_WATCHES));
      return INITIAL_WATCHES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEYS.WATCHES, JSON.stringify(INITIAL_WATCHES));
      return INITIAL_WATCHES;
    }
    return parsed;
  } catch (e) {
    console.error('Error reading watches from storage:', e);
    return INITIAL_WATCHES;
  }
};

export const saveStoredWatches = (watches: Watch[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.WATCHES, JSON.stringify(watches));
  } catch (e) {
    console.error('Error saving watches to storage:', e);
  }
};

export const resetStoredWatchesToDefault = (): Watch[] => {
  localStorage.setItem(STORAGE_KEYS.WATCHES, JSON.stringify(INITIAL_WATCHES));
  return INITIAL_WATCHES;
};

// ==================== ORDERS STORAGE ====================
export const getStoredOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) {
      // Seed some demo orders for admin review
      const demoOrders: Order[] = [
        {
          id: 'VLT-2026-9041',
          userId: 'user-demo-1',
          userEmail: 'marcus.vance@viltrum.luxury',
          userName: 'Marcus Vance',
          items: [
            {
              watch: INITIAL_WATCHES[0], // Rolex Submariner
              quantity: 1,
              selectedStrap: 'Oyster Stainless Steel with Glidelock',
            },
          ],
          subtotal: 14850,
          discount: 1485,
          shippingFee: 0,
          tax: 0,
          total: 13365,
          currency: 'USD',
          status: 'Shipped',
          shippingAddress: {
            fullName: 'Marcus Vance',
            email: 'marcus.vance@viltrum.luxury',
            phone: '+1 (555) 234-5678',
            street: '740 Park Avenue, Penthouse B',
            city: 'New York',
            state: 'NY',
            postalCode: '10021',
            country: 'United States',
          },
          paymentMethod: 'Credit/Debit Card',
          paymentStatus: 'Paid',
          trackingNumber: 'QRT-FDX-88492019US',
          carrier: 'FedEx Priority Insured',
          promoCode: 'QUICKRED10',
          createdAt: '2026-09-01T14:30:00.000Z',
          updatedAt: '2026-09-02T09:15:00.000Z',
        },
        {
          id: 'VLT-2026-9042',
          userId: 'user-chisom-admin',
          userEmail: 'chisomlifeeke@gmail.com',
          userName: 'Chisom Life Eke',
          items: [
            {
              watch: INITIAL_WATCHES[5], // Rick Hyperion Tourbillon
              quantity: 1,
              selectedStrap: 'Crimson Fluororubber',
            },
            {
              watch: INITIAL_WATCHES[8], // G-Shock Full Metal Gold
              quantity: 1,
            },
          ],
          subtotal: 3030,
          discount: 0,
          shippingFee: 0,
          tax: 0,
          total: 3030,
          currency: 'USD',
          status: 'Authenticating',
          shippingAddress: {
            fullName: 'Chisom Life Eke',
            email: 'chisomlifeeke@gmail.com',
            phone: '+234 812 345 6789',
            street: 'Quick Red Tech HQ, 14 Horology Boulevard',
            city: 'Lagos',
            state: 'Lagos',
            postalCode: '100001',
            country: 'Nigeria',
          },
          paymentMethod: 'Crypto (USDT/BTC)',
          paymentStatus: 'Paid',
          trackingNumber: 'QRT-DHL-55209384NG',
          carrier: 'DHL Express Worldwide',
          createdAt: '2026-09-03T18:00:00.000Z',
          updatedAt: '2026-09-04T08:00:00.000Z',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(demoOrders));
      return demoOrders;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading orders from storage:', e);
    return [];
  }
};

export const saveStoredOrders = (orders: Order[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  } catch (e) {
    console.error('Error saving orders to storage:', e);
  }
};

// ==================== USER PROFILES STORAGE ====================
export const getStoredUsers = (): Record<string, UserProfile> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading user profiles:', e);
    return {};
  }
};

export const saveStoredUser = (profile: UserProfile): void => {
  try {
    const users = getStoredUsers();
    users[profile.uid] = profile;
    if (profile.email) {
      users[profile.email.toLowerCase()] = profile;
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving user profile:', e);
  }
};

// ==================== ADMIN CHECK ====================
export const isUserAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase();
};
