import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || 'chisomlifeeke@gmail.com').trim().toLowerCase();
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Viltrum';
export const APP_TAGLINE = import.meta.env.VITE_APP_TAGLINE || 'Powered by Quick Red Tech';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  !firebaseConfig.apiKey.includes('DemoKey') &&
  !firebaseConfig.apiKey.includes('your-api-key') &&
  firebaseConfig.projectId &&
  !firebaseConfig.projectId.includes('your-project')
);

let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;
let googleProvider: any = null;

try {
  if (isFirebaseConfigured) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    googleProvider = new GoogleAuthProvider();
    console.log('Viltrum: Firebase initialized successfully with cloud project.');
  } else {
    console.log('Viltrum: Running in smart local-first persistence mode (Provide real Firebase credentials in .env to connect to live Firebase cloud).');
  }
} catch (error) {
  console.warn('Viltrum: Firebase initialization notice (falling back to persistent local storage):', error);
}

export { app, auth, db, storage, googleProvider };
