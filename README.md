# Viltrum Luxury Horology Boutique
> **Powered by Quick Red Tech**

Viltrum is a luxury horology Progressive Web App (PWA) built with **React Native for Web**, Vite, and **Firebase**. It offers an authenticated boutique shopping experience for prestige watches with interactive live lookup, encrypted checkout, user dashboards, and an authorized **Admin Portal**.

---

## 💎 Features

- **Watch Brands Included**:
  - 👑 **Rolex** (Submariner Kermit, Cosmograph Daytona Panda, Day-Date 40 Presidential)
  - ⏱️ **Casio** (Vintage Illuminator Gold, Edifice Carbon Chronograph)
  - 💎 **Poedager** (Royal Emerald Quartz, Horizon Skeleton Automatic)
  - ⚡ **Rick** (Hyperion Forged Carbon Tourbillon, Phantom Monolith Tonneau)
  - 🏛️ **Arnahory** (Heritage Grand Chronometer, Ultra-Slim Obsidian)
  - 🛡️ **G-Shock** (CasiOak 2100 Stealth, Full Metal 5000 Gold, Mudmaster Master of G)
  - 🖤 **CK / Calvin Klein** (Minimalist Sunray Gunmetal, City Chronograph Silver)
  - 📜 **Fossil** (Grant Chronograph Roman Classic, Neutra Automatic Skeleton Smoke)
  - ✨ **MK / Michael Kors** (Lexington Chronograph 18K Gold, Runway Slim Midnight Black)

- **Search & Filter Engine**:
  - Live real-time search by model name, brand house, or reference number
  - Filter tabs for all 9 brands with dynamic count badges
  - Multi-criteria filtering: Categories (Luxury, Chronograph, Sports & Rugged, Classic Dress, Digital/Smart, Skeleton/Tourbillon), Movement, Gender, and Price Range Presets
  - Sorting by Featured, Price Low-to-High, Price High-to-Low, Rating, Newest

- **High-Security Cart & Payment Flow**:
  - Interactive slide-over Cart Drawer with free insured shipping progress bar
  - Multi-tier checkout with real-time address validation
  - Animated 3D Luxury Credit Card with live cardholder preview and flip
  - Apple Pay / Google Pay 1-touch simulated authorization
  - Web3 Crypto Escrow (USDT / BTC) and International Bank Wire options
  - Coupon Engine (`QUICKRED10` for 10% off, `VILTRUM100` for $100 off, `VILTRUMVIP` for 15% off)
  - Celebratory Confetti and official downloadable printable invoice

- **User Collector Pages**:
  - VIP Member Tier badge
  - **My Watch Box**: Users can catalog and showcase their own personal watch collection with photos, acquisition year, valuation, and collector stories
  - Public shareable profile URL
  - Order Tracking with real-time fulfillment timeline (`Confirmed` → `QRT Inspection` → `In Transit` → `Delivered`)
  - Saved Wishlists with 1-click move to cart

- **Authorized Master Admin Vault (`chisomlifeeke@gmail.com`)**:
  - Strict route guard: Only accessible when logged in with `chisomlifeeke@gmail.com`
  - **Upload New Timepieces**: Full form with image file upload, brand picker, reference code, specs, movement, and featured toggles
  - **Catalog Management**: Quick inline edit, stock updates, and deletion
  - **Customer Orders**: Live order tracking and status management
  - **Analytics & Valuation**: Total revenue, store valuation, and brand breakdown metrics

- **Progressive Web App (PWA)**:
  - Valid `manifest.json` with multi-resolution maskable gold/crimson icons
  - Offline caching service worker (`sw.js`)
  - Install app banner & native prompts for Android, iOS, and Desktop

---

## 🚀 Environment Variables (`.env`)

The `.env` file is gitignored. Create `.env` based on `.env.example`:

```env
VITE_APP_NAME="Viltrum"
VITE_APP_TAGLINE="Powered by Quick Red Tech"
VITE_ADMIN_EMAIL="chisomlifeeke@gmail.com"

# Firebase Web App Config
VITE_FIREBASE_API_KEY="your-firebase-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-app.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"
```

---

## 🛠️ Development & Build

```bash
# Install dependencies
npm install

# Start local development server on 0.0.0.0:5173
npm run dev

# Build production bundle
npm run build
```
