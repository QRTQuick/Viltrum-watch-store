import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Download, X, Sparkles, Smartphone } from 'lucide-react';

interface PWAInstallBannerProps {
  deferredPrompt: any;
  onInstall: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ deferredPrompt, onInstall }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !deferredPrompt) return null;

  return (
    <View style={styles.bannerContainer}>
      <View style={styles.bannerContent}>
        <View style={styles.bannerLeft}>
          <View style={styles.iconWrap}>
            <Smartphone size={18} color="#C9A24D" />
          </View>
          <View>
            <Text style={styles.bannerTitle}>Install Viltrum PWA App</Text>
            <Text style={styles.bannerDesc}>
              Experience ultra-fast native luxury horology on iOS, Android & Desktop with offline order access.
            </Text>
          </View>
        </View>

        <View style={styles.bannerActions}>
          <TouchableOpacity style={styles.installBtn} onPress={onInstall}>
            <Download size={14} color="#07080A" />
            <Text style={styles.installBtnText}>Install Now</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeBtn} onPress={() => setDismissed(true)}>
            <X size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: '#121824',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(201, 162, 77, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    zIndex: 90,
  },
  bannerContent: {
    maxWidth: 1400,
    marginHorizontal: 'auto' as any,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 260,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(201, 162, 77, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    color: '#FFF3B0',
    fontSize: 12.5,
    fontWeight: '800',
  },
  bannerDesc: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 1,
  },
  bannerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  installBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#C9A24D',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  installBtnText: {
    color: '#07080A',
    fontSize: 11.5,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 6,
  },
});
