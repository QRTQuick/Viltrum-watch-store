import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Crown,
  ShieldCheck,
  Zap,
  Mail,
  Phone,
  Globe,
  Lock,
  Sparkles,
} from 'lucide-react';
import { BRAND_LIST } from '../data/initialWatches';
import { THEME } from '../styles/theme';
import { ADMIN_EMAIL } from '../services/firebase';

interface FooterProps {
  onSelectBrand: (brand: string) => void;
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectBrand, onNavigate }) => {
  return (
    <View style={styles.footerContainer}>
      {/* Top Banner Ribbon */}
      <View style={styles.topRibbon}>
        <View style={styles.ribbonContent}>
          <View style={styles.ribbonItem}>
            <ShieldCheck size={18} color="#C9A24D" />
            <Text style={styles.ribbonText}>Quick Red Tech 100% Certified Horology</Text>
          </View>
          <View style={styles.ribbonItem}>
            <Lock size={18} color="#10B981" />
            <Text style={styles.ribbonText}>Encrypted High-Security Vault Escrow</Text>
          </View>
          <View style={styles.ribbonItem}>
            <Zap size={18} color="#E61E2A" />
            <Text style={styles.ribbonText}>Powered by Quick Red Tech Engineering</Text>
          </View>
        </View>
      </View>

      {/* Main Footer Body */}
      <View style={styles.mainFooter}>
        <View style={styles.footerGrid}>
          {/* Brand & Mission Column */}
          <View style={styles.colBrand}>
            <View style={styles.brandRow}>
              <View style={styles.logoBadge}>
                <Crown size={20} color="#C9A24D" />
              </View>
              <View>
                <Text style={styles.logoTitle}>VILTRUM</Text>
                <Text style={styles.logoSubtitle}>POWERED BY QUICK RED TECH</Text>
              </View>
            </View>
            <Text style={styles.brandBio}>
              The world's premier digital horology boutique. Authentic Swiss, Japanese, and haute horlogerie timepieces rigorously authenticated, insured, and delivered globally.
            </Text>
            <View style={styles.adminContactBadge}>
              <Mail size={12} color="#C9A24D" />
              <Text style={styles.adminContactText}>Admin Vault: {ADMIN_EMAIL}</Text>
            </View>
          </View>

          {/* Watch Brands We Sell */}
          <View style={styles.colLinks}>
            <Text style={styles.colTitle}>Watch Brands We Sell</Text>
            <View style={styles.brandPillsGrid}>
              {['Rolex', 'Casio', 'Poedager', 'Rick', 'Arnahory', 'G-Shock', 'CK', 'Fossil', 'MK'].map((brand) => (
                <TouchableOpacity
                  key={brand}
                  style={styles.brandFooterPill}
                  onPress={() => onSelectBrand(brand)}
                >
                  <Text style={styles.brandFooterPillText}>{brand}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Collector Services */}
          <View style={styles.colLinks}>
            <Text style={styles.colTitle}>Collector Services</Text>
            <TouchableOpacity style={styles.footerLink} onPress={() => onNavigate('catalog')}>
              <Text style={styles.footerLinkText}>All Luxury Watches</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerLink} onPress={() => onNavigate('profile')}>
              <Text style={styles.footerLinkText}>My Watch Box Showcase</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerLink} onPress={() => onNavigate('orders')}>
              <Text style={styles.footerLinkText}>Track Insured Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerLink} onPress={() => onNavigate('wishlist')}>
              <Text style={styles.footerLinkText}>Saved Wishlist</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerLink} onPress={() => onNavigate('admin')}>
              <Text style={[styles.footerLinkText, { color: '#FF8888', fontWeight: '700' }]}>
                Admin Management Portal
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quick Red Tech Concierge */}
          <View style={styles.colLinks}>
            <Text style={styles.colTitle}>Quick Red Tech Concierge</Text>
            <Text style={styles.conciergeText}>
              24/7 VIP Horology Support & Private Acquisitions:
            </Text>
            <Text style={styles.conciergeContact}>
              Email: quickredtech@gmail.com{'\n'}
              Admin: chisomlifeeke@gmail.com{'\n'}
              Worldwide Insured Armored Dispatch
            </Text>
          </View>
        </View>

        {/* Bottom Copyright Bar */}
        <View style={styles.bottomBar}>
          <Text style={styles.copyrightText}>
            © {new Date().getFullYear()} <Text style={{ color: '#FFF3B0', fontWeight: '800' }}>Viltrum Horology</Text>. Powered by <Text style={{ color: '#FF4D4D', fontWeight: '800' }}>Quick Red Tech</Text>. All rights reserved.
          </Text>
          <Text style={styles.pwaNoticeText}>
            Progressive Web App (PWA) • Firebase Auth & Cloud Sync Enabled
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#07080A',
    borderTopWidth: 1,
    borderTopColor: 'rgba(201, 162, 77, 0.2)',
    marginTop: 40,
  },
  topRibbon: {
    backgroundColor: '#0D1017',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  ribbonContent: {
    maxWidth: 1400,
    marginHorizontal: 'auto' as any,
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 12,
  },
  ribbonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ribbonText: {
    color: '#CBD5E1',
    fontSize: 11.5,
    fontWeight: '600',
  },
  mainFooter: {
    maxWidth: 1400,
    marginHorizontal: 'auto' as any,
    paddingHorizontal: 16,
    paddingTop: 36,
    paddingBottom: 20,
  },
  footerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 28,
    marginBottom: 30,
  },
  colBrand: {
    flex: 1.5,
    minWidth: 280,
    gap: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(201, 162, 77, 0.15)',
    borderWidth: 1,
    borderColor: '#C9A24D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTitle: {
    fontFamily: THEME.fonts.serif,
    fontSize: 20,
    fontWeight: '900',
    color: '#FFF3B0',
    letterSpacing: 2,
  },
  logoSubtitle: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#FF4D4D',
    letterSpacing: 1.5,
  },
  brandBio: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
  },
  adminContactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  adminContactText: {
    fontSize: 11,
    color: '#CBD5E1',
  },
  colLinks: {
    flex: 1,
    minWidth: 200,
    gap: 8,
  },
  colTitle: {
    fontFamily: THEME.fonts.serif,
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFF3B0',
    letterSpacing: 1,
    marginBottom: 6,
  },
  brandPillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  brandFooterPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  brandFooterPillText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  footerLink: {
    paddingVertical: 3,
  },
  footerLinkText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
  },
  conciergeText: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 16,
  },
  conciergeContact: {
    fontSize: 11.5,
    color: '#CBD5E1',
    fontFamily: THEME.fonts.mono,
    lineHeight: 18,
    marginTop: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 16,
  },
  copyrightText: {
    fontSize: 11,
    color: '#64748B',
  },
  pwaNoticeText: {
    fontSize: 11,
    color: '#64748B',
  },
});
