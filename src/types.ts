export type WatchBrand =
  | 'Rolex'
  | 'Casio'
  | 'Poedager'
  | 'Rick'
  | 'Arnahory'
  | 'G-Shock'
  | 'CK'
  | 'Fossil'
  | 'MK'
  | string;

export type WatchCategory =
  | 'Luxury'
  | 'Chronograph'
  | 'Sports & Rugged'
  | 'Classic Dress'
  | 'Digital / Smart'
  | 'Tourbillon / Skeleton';

export type WatchMovement =
  | 'Automatic'
  | 'Quartz'
  | 'Solar Quartz'
  | 'Manual Wind'
  | 'Digital';

export type WatchGender = 'Men' | 'Women' | 'Unisex';

export interface Watch {
  id: string;
  name: string;
  brand: WatchBrand;
  modelRef: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: WatchCategory;
  gender: WatchGender;
  movement: WatchMovement;
  caseSize: string;
  caseMaterial: string;
  dialColor: string;
  strapType: string;
  waterResistance: string;
  powerReserve?: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  images: string[];
  tags: string[];
  warranty?: string;
  createdAt: string;
}

export interface CartItem {
  watch: Watch;
  quantity: number;
  selectedStrap?: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type PaymentMethod =
  | 'Credit/Debit Card'
  | 'Apple Pay'
  | 'Google Pay'
  | 'PayPal'
  | 'Crypto (USDT/BTC)'
  | 'Bank Wire';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Authenticating'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  currency: string;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending Verification';
  trackingNumber: string;
  carrier: string;
  promoCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserCollectionItem {
  id: string;
  watchName: string;
  brand: string;
  yearPurchased: string;
  image: string;
  notes: string;
  estimatedValue?: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string;
  bio?: string;
  vipTier: 'Standard Member' | 'Silver Collector' | 'Gold Horologist' | 'Viltrum Diamond VIP';
  shippingAddresses: (ShippingAddress & { id: string; isDefault?: boolean })[];
  wishlist: string[];
  collection: UserCollectionItem[];
  memberSince: string;
  customHandle?: string;
  isAdmin?: boolean;
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'NGN' | 'AED' | 'JPY';

export interface CurrencyRate {
  code: Currency;
  symbol: string;
  rate: number; // multiplier from USD
  format: (amount: number) => string;
}
