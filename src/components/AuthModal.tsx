import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal, Platform } from 'react-native';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Crown,
  Sparkles,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ADMIN_EMAIL, isFirebaseConfigured } from '../services/firebase';
import { THEME } from '../styles/theme';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose }) => {
  const { login, signup, loginAsDemoAdmin, loginAsDemoCustomer } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!visible) return null;

  const handleSubmit = async () => {
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signin') {
        const res = await login(email, password);
        if (res.success) {
          onClose();
        } else {
          setError(res.error || 'Invalid credentials');
        }
      } else {
        const res = await signup(email, password, name);
        if (res.success) {
          onClose();
        } else {
          setError(res.error || 'Failed to create account');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminDemo = async () => {
    setLoading(true);
    await loginAsDemoAdmin();
    setLoading(false);
    onClose();
  };

  const handleCustomerDemo = async () => {
    setLoading(true);
    await loginAsDemoCustomer();
    setLoading(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleWrap}>
              <Crown size={18} color="#C9A24D" />
              <Text style={styles.headerTitle}>Viltrum Collector Access</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color="#F8FAFC" />
            </TouchableOpacity>
          </View>

          {/* Firebase Connection Status Banner */}
          <View style={styles.firebaseStatusPill}>
            <Sparkles size={12} color={isFirebaseConfigured ? '#10B981' : '#C9A24D'} />
            <Text style={styles.firebaseStatusText}>
              {isFirebaseConfigured
                ? 'Firebase Cloud Authentication Active'
                : 'Viltrum Persistent Auth Ready • Powered by Quick Red Tech'}
            </Text>
          </View>

          {/* Mode Switcher Tabs */}
          <View style={styles.modeTabs}>
            <TouchableOpacity
              style={[styles.modeTab, mode === 'signin' && styles.modeTabActive]}
              onPress={() => {
                setMode('signin');
                setError(null);
              }}
            >
              <Text style={[styles.modeTabText, mode === 'signin' && styles.modeTabTextActive]}>
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeTab, mode === 'signup' && styles.modeTabActive]}
              onPress={() => {
                setMode('signup');
                setError(null);
              }}
            >
              <Text style={[styles.modeTabText, mode === 'signup' && styles.modeTabTextActive]}>
                Register VIP Account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.formBody}>
            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {mode === 'signup' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={styles.inputWrap}>
                  <User size={16} color="#94A3B8" />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Chisom Life Eke"
                    placeholderTextColor="#64748B"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputWrap}>
                <Mail size={16} color="#94A3B8" />
                <TextInput
                  style={styles.textInput}
                  placeholder="chisomlifeeke@gmail.com"
                  placeholderTextColor="#64748B"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrap}>
                <Lock size={16} color="#94A3B8" />
                <TextInput
                  style={styles.textInput}
                  placeholder="••••••••••••"
                  placeholderTextColor="#64748B"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitBtnText}>
                {loading
                  ? 'Authenticating...'
                  : mode === 'signin'
                  ? 'Sign In to Vault'
                  : 'Create VIP Account'}
              </Text>
              <ArrowRight size={16} color="#07080A" />
            </TouchableOpacity>

            {/* 1-Click Demo Shortcut Section */}
            <View style={styles.demoSection}>
              <Text style={styles.demoSectionTitle}>1-Click Fast Evaluation Access</Text>

              {/* Master Admin Button */}
              <TouchableOpacity
                style={styles.adminDemoBtn}
                onPress={handleAdminDemo}
                disabled={loading}
              >
                <View style={styles.adminDemoLeft}>
                  <ShieldCheck size={18} color="#FFF3B0" />
                  <View>
                    <Text style={styles.adminDemoTitle}>Master Admin Login</Text>
                    <Text style={styles.adminDemoEmail}>{ADMIN_EMAIL}</Text>
                  </View>
                </View>
                <View style={styles.adminBadge}>
                  <Text style={styles.adminBadgeText}>FULL ACCESS</Text>
                </View>
              </TouchableOpacity>

              {/* Customer Demo Button */}
              <TouchableOpacity
                style={styles.customerDemoBtn}
                onPress={handleCustomerDemo}
                disabled={loading}
              >
                <User size={16} color="#CBD5E1" />
                <Text style={styles.customerDemoText}>
                  Test as Customer (alex.morgan@viltrum.luxury)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
    maxWidth: 480,
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
  headerTitleWrap: {
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
  firebaseStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(201, 162, 77, 0.08)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(201, 162, 77, 0.15)',
  },
  firebaseStatusText: {
    color: '#CBD5E1',
    fontSize: 10.5,
    fontWeight: '600',
  },
  modeTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  modeTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modeTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#C9A24D',
    backgroundColor: 'rgba(201, 162, 77, 0.05)',
  },
  modeTabText: {
    color: '#94A3B8',
    fontSize: 12.5,
    fontWeight: '600',
  },
  modeTabTextActive: {
    color: '#FFF3B0',
    fontWeight: '800',
  },
  formBody: {
    padding: 20,
    gap: 14,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 8,
    padding: 10,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 11.5,
    fontWeight: '600',
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
    gap: 10,
  },
  textInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 13,
    outlineStyle: 'none' as any,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#C9A24D',
    paddingVertical: 13,
    borderRadius: 10,
    marginTop: 6,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: '#07080A',
    fontSize: 13,
    fontWeight: '900',
  },
  demoSection: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 14,
    gap: 8,
  },
  demoSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#C9A24D',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 4,
  },
  adminDemoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(230, 30, 42, 0.15)',
    borderWidth: 1,
    borderColor: '#E61E2A',
    borderRadius: 10,
    padding: 12,
  },
  adminDemoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  adminDemoTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFF3B0',
  },
  adminDemoEmail: {
    fontSize: 10.5,
    color: '#FF8888',
    marginTop: 1,
  },
  adminBadge: {
    backgroundColor: '#E61E2A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  adminBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
  },
  customerDemoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingVertical: 10,
  },
  customerDemoText: {
    color: '#CBD5E1',
    fontSize: 11.5,
    fontWeight: '600',
  },
});
