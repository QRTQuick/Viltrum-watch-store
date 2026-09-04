import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserCollectionItem } from '../types';
import { auth, isFirebaseConfigured, ADMIN_EMAIL } from '../services/firebase';
import { getStoredUsers, saveStoredUser, isUserAdmin } from '../services/storage';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';

interface AuthContextType {
  user: { uid: string; email: string; displayName?: string } | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, pass: string, name: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemoAdmin: () => Promise<void>;
  loginAsDemoCustomer: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updatedData: Partial<UserProfile>) => void;
  toggleWishlist: (watchId: string) => void;
  isInWishlist: (watchId: string) => boolean;
  addCollectionItem: (item: Omit<UserCollectionItem, 'id'>) => void;
  removeCollectionItem: (itemId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_AUTH_KEY = 'viltrum_active_session_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ uid: string; email: string; displayName?: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize session from Firebase or localStorage
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
        if (fbUser && fbUser.email) {
          const u = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || fbUser.email.split('@')[0],
          };
          setUser(u);
          loadOrCreateProfile(u.uid, u.email, u.displayName);
        } else {
          checkLocalSession();
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      checkLocalSession();
      setLoading(false);
    }
  }, []);

  const checkLocalSession = () => {
    try {
      const stored = localStorage.getItem(LOCAL_AUTH_KEY);
      if (stored) {
        const u = JSON.parse(stored);
        setUser(u);
        loadOrCreateProfile(u.uid, u.email, u.displayName);
      }
    } catch (e) {
      console.error('Failed to load local auth session:', e);
    }
  };

  const loadOrCreateProfile = (uid: string, email: string, displayName?: string) => {
    const allUsers = getStoredUsers();
    let userProfile = allUsers[uid] || allUsers[email.toLowerCase()];

    const isAdmin = isUserAdmin(email);

    if (!userProfile) {
      userProfile = {
        uid,
        email,
        displayName: displayName || (isAdmin ? 'Chisom Life Eke (Admin)' : email.split('@')[0]),
        vipTier: isAdmin ? 'Viltrum Diamond VIP' : 'Silver Collector',
        shippingAddresses: [
          {
            id: 'addr-default-1',
            fullName: displayName || (isAdmin ? 'Chisom Life Eke' : 'Alex Morgan'),
            email,
            phone: isAdmin ? '+234 812 345 6789' : '+1 (555) 382-9901',
            street: isAdmin ? 'Quick Red Tech HQ, 14 Horology Blvd' : '100 Sunset Blvd, Suite 400',
            city: isAdmin ? 'Lagos' : 'Los Angeles',
            state: isAdmin ? 'Lagos' : 'CA',
            postalCode: isAdmin ? '100001' : '90210',
            country: isAdmin ? 'Nigeria' : 'United States',
            isDefault: true,
          },
        ],
        wishlist: ['vlt-rolex-submariner', 'vlt-rick-avantgarde-carbon'],
        collection: [
          {
            id: 'coll-1',
            watchName: 'Vintage Retro Illuminator Gold',
            brand: 'Casio',
            yearPurchased: '2024',
            image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
            notes: 'Daily beater timepiece with legendary gold shine.',
            estimatedValue: 85,
          },
        ],
        memberSince: 'August 2026',
        customHandle: isAdmin ? 'chisom_quickred' : email.split('@')[0],
        isAdmin,
      };
      saveStoredUser(userProfile);
    }
    setProfile(userProfile);
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      if (isFirebaseConfigured && auth) {
        try {
          const res = await signInWithEmailAndPassword(auth, cleanEmail, pass);
          const u = {
            uid: res.user.uid,
            email: res.user.email || cleanEmail,
            displayName: res.user.displayName || cleanEmail.split('@')[0],
          };
          setUser(u);
          localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(u));
          loadOrCreateProfile(u.uid, u.email, u.displayName);
          return { success: true };
        } catch (fbErr: any) {
          // If user doesn't exist in Firebase yet, let's also allow smooth local login or display error
          console.warn('Firebase login attempt fallback to local auth:', fbErr.message);
        }
      }

      // Local fallback auth
      const uid = 'usr_' + btoa(cleanEmail).replace(/=/g, '').slice(0, 12);
      const isAdm = isUserAdmin(cleanEmail);
      const u = {
        uid,
        email: cleanEmail,
        displayName: isAdm ? 'Chisom Life Eke (Admin)' : cleanEmail.split('@')[0],
      };
      setUser(u);
      localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(u));
      loadOrCreateProfile(u.uid, u.email, u.displayName);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const signup = async (email: string, pass: string, name: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      if (isFirebaseConfigured && auth) {
        try {
          const res = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
          const u = {
            uid: res.user.uid,
            email: res.user.email || cleanEmail,
            displayName: name || cleanEmail.split('@')[0],
          };
          setUser(u);
          localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(u));
          loadOrCreateProfile(u.uid, u.email, u.displayName);
          return { success: true };
        } catch (fbErr: any) {
          console.warn('Firebase signup attempt fallback to local:', fbErr.message);
        }
      }

      const uid = 'usr_' + Math.random().toString(36).substring(2, 9);
      const u = {
        uid,
        email: cleanEmail,
        displayName: name || cleanEmail.split('@')[0],
      };
      setUser(u);
      localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(u));
      loadOrCreateProfile(u.uid, u.email, u.displayName);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Signup failed' };
    }
  };

  const loginAsDemoAdmin = async () => {
    await login(ADMIN_EMAIL, 'viltrumAdmin2026!');
  };

  const loginAsDemoCustomer = async () => {
    await login('alex.morgan@viltrum.luxury', 'collector2026!');
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.warn('Firebase signout:', e);
      }
    }
    localStorage.removeItem(LOCAL_AUTH_KEY);
    setUser(null);
    setProfile(null);
  };

  const updateProfile = (updatedData: Partial<UserProfile>) => {
    if (!profile) return;
    const newProf = { ...profile, ...updatedData };
    setProfile(newProf);
    saveStoredUser(newProf);
  };

  const toggleWishlist = (watchId: string) => {
    if (!profile) {
      // If guest, create temporary guest profile
      const guestId = 'guest_temp';
      const newProf: UserProfile = {
        uid: guestId,
        email: 'guest@viltrum.app',
        displayName: 'Guest Collector',
        vipTier: 'Standard Member',
        shippingAddresses: [],
        wishlist: [watchId],
        collection: [],
        memberSince: 'September 2026',
      };
      setProfile(newProf);
      return;
    }

    const exists = profile.wishlist.includes(watchId);
    const updatedWishlist = exists
      ? profile.wishlist.filter((id) => id !== watchId)
      : [...profile.wishlist, watchId];

    updateProfile({ wishlist: updatedWishlist });
  };

  const isInWishlist = (watchId: string): boolean => {
    return profile?.wishlist?.includes(watchId) || false;
  };

  const addCollectionItem = (item: Omit<UserCollectionItem, 'id'>) => {
    if (!profile) return;
    const newItem: UserCollectionItem = {
      ...item,
      id: 'coll_' + Date.now(),
    };
    const updated = [newItem, ...(profile.collection || [])];
    updateProfile({ collection: updated });
  };

  const removeCollectionItem = (itemId: string) => {
    if (!profile) return;
    const updated = (profile.collection || []).filter((it) => it.id !== itemId);
    updateProfile({ collection: updated });
  };

  const isAdmin = Boolean(user && isUserAdmin(user.email));

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin,
        loading,
        login,
        signup,
        loginAsDemoAdmin,
        loginAsDemoCustomer,
        logout,
        updateProfile,
        toggleWishlist,
        isInWishlist,
        addCollectionItem,
        removeCollectionItem,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
