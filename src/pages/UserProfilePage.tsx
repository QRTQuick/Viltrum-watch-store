import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, ScrollView } from 'react-native';
import {
  User,
  Shield,
  Heart,
  Package,
  Plus,
  Trash2,
  Edit2,
  Share2,
  Crown,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWatches } from '../context/WatchContext';
import { useCart } from '../context/CartContext';
import { BRAND_LIST } from '../data/initialWatches';
import { THEME } from '../styles/theme';

interface UserProfilePageProps {
  onNavigateToCatalog: () => void;
  onNavigateToOrders: () => void;
  onOpenWatch: (watch: any) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  onNavigateToCatalog,
  onNavigateToOrders,
  onOpenWatch,
}) => {
  const { user, profile, updateProfile, addCollectionItem, removeCollectionItem, isAdmin } = useAuth();
  const { watches, formatPrice } = useWatches();
  const { orders } = useCart();

  const [activeTab, setActiveTab] = useState<'collection' | 'profile' | 'addresses'>('collection');
  const [isAddingWatch, setIsAddingWatch] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // New Collection Item Form State
  const [newWatchName, setNewWatchName] = useState('');
  const [newWatchBrand, setNewWatchBrand] = useState('Rolex');
  const [newWatchYear, setNewWatchYear] = useState('2024');
  const [newWatchImage, setNewWatchImage] = useState('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80');
  const [newWatchNotes, setNewWatchNotes] = useState('');
  const [newWatchVal, setNewWatchVal] = useState('5000');

  // Edit Profile Form State
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [bio, setBio] = useState(profile?.bio || 'Horology connoisseur & luxury timepiece collector.');
  const [customHandle, setCustomHandle] = useState(profile?.customHandle || 'collector_vip');
  const [phone, setPhone] = useState(profile?.phone || '+1 (555) 392-8810');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!user || !profile) {
    return (
      <View style={styles.notLoggedInContainer}>
        <Text style={styles.notLoggedInTitle}>Please Sign In</Text>
        <Text style={styles.notLoggedInText}>
          Sign in or create a Viltrum VIP account to build your custom watch box and showcase your collection.
        </Text>
      </View>
    );
  }

  const handleSaveProfile = () => {
    updateProfile({
      displayName,
      bio,
      customHandle,
      phone,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddCollection = () => {
    if (!newWatchName.trim()) return;
    addCollectionItem({
      watchName: newWatchName.trim(),
      brand: newWatchBrand,
      yearPurchased: newWatchYear.trim() || '2025',
      image: newWatchImage.trim() || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
      notes: newWatchNotes.trim() || 'Precious horology piece.',
      estimatedValue: Number(newWatchVal) || 1000,
    });
    setIsAddingWatch(false);
    setNewWatchName('');
    setNewWatchNotes('');
  };

  const handleSharePublicProfile = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + '/#user-' + (profile.customHandle || user.uid));
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const userOrders = orders.filter((o) => o.userEmail.toLowerCase() === user.email.toLowerCase() || o.userId === user.uid);
  const wishlistWatches = watches.filter((w) => profile.wishlist?.includes(w.id));
  const collectionList = profile.collection || [];
  const totalBoxValuation = collectionList.reduce((sum, item) => sum + (item.estimatedValue || 0), 0);

  return (
    <View style={styles.container}>
      {/* Profile Cover & Header */}
      <View style={styles.profileHeaderCard}>
        <View style={styles.avatarRow}>
          <View style={styles.avatarLarge}>
            {isAdmin ? (
              <Crown size={36} color="#FFF3B0" />
            ) : (
              <User size={36} color="#F8FAFC" />
            )}
          </View>

          <View style={styles.profileInfoWrap}>
            <View style={styles.nameRow}>
              <Text style={styles.profileDisplayName}>{profile.displayName}</Text>
              <View style={styles.vipBadge}>
                <Sparkles size={11} color="#C9A24D" />
                <Text style={styles.vipBadgeText}>{profile.vipTier}</Text>
              </View>
            </View>
            <Text style={styles.profileHandleText}>@{profile.customHandle || 'collector'}</Text>
            <Text style={styles.profileBioText}>{profile.bio || 'Passionate luxury timepiece collector.'}</Text>
          </View>

          {/* Share Public Page Button */}
          <TouchableOpacity style={styles.shareProfileBtn} onPress={handleSharePublicProfile}>
            <Share2 size={15} color={copiedLink ? '#10B981' : '#07080A'} />
            <Text style={styles.shareProfileText}>
              {copiedLink ? 'Profile Link Copied!' : 'Share Public Watch Page'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.profileStatsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{collectionList.length}</Text>
            <Text style={styles.statLabel}>Watch Box Pieces</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{formatPrice(totalBoxValuation)}</Text>
            <Text style={styles.statLabel}>Box Est. Valuation</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{userOrders.length}</Text>
            <Text style={styles.statLabel}>Viltrum Orders</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{profile.wishlist?.length || 0}</Text>
            <Text style={styles.statLabel}>Wishlist Items</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabNavRow}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'collection' && styles.tabButtonActive]}
          onPress={() => setActiveTab('collection')}
        >
          <Layers size={16} color={activeTab === 'collection' ? '#FFF3B0' : '#94A3B8'} />
          <Text style={[styles.tabButtonText, activeTab === 'collection' && styles.tabButtonTextActive]}>
            My Curated Watch Box ({collectionList.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'profile' && styles.tabButtonActive]}
          onPress={() => setActiveTab('profile')}
        >
          <User size={16} color={activeTab === 'profile' ? '#FFF3B0' : '#94A3B8'} />
          <Text style={[styles.tabButtonText, activeTab === 'profile' && styles.tabButtonTextActive]}>
            Account & Profile Settings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'addresses' && styles.tabButtonActive]}
          onPress={() => setActiveTab('addresses')}
        >
          <MapPin size={16} color={activeTab === 'addresses' ? '#FFF3B0' : '#94A3B8'} />
          <Text style={[styles.tabButtonText, activeTab === 'addresses' && styles.tabButtonTextActive]}>
            Saved Armored Addresses
          </Text>
        </TouchableOpacity>
      </View>

      {/* TAB 1: My Watch Box / Collection */}
      {activeTab === 'collection' && (
        <View style={styles.sectionContent}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionHeading}>My Personal Watch Box</Text>
              <Text style={styles.sectionSubHeading}>
                Showcase and catalog your owned timepieces on your public profile.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.addWatchBoxBtn}
              onPress={() => setIsAddingWatch(!isAddingWatch)}
            >
              <Plus size={16} color="#07080A" />
              <Text style={styles.addWatchBoxBtnText}>
                {isAddingWatch ? 'Cancel' : 'Add Watch to Box'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Add Watch to Box Form */}
          {isAddingWatch && (
            <View style={styles.addWatchForm}>
              <Text style={styles.formTitle}>Add Timepiece to Your Curated Showcase</Text>

              <View style={styles.formInputsGrid}>
                <View style={styles.inputFull}>
                  <Text style={styles.label}>Watch Model Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Rolex Submariner Date / Casio Vintage Gold"
                    placeholderTextColor="#64748B"
                    value={newWatchName}
                    onChangeText={setNewWatchName}
                  />
                </View>

                <View style={styles.inputHalf}>
                  <Text style={styles.label}>Brand</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Rolex / Casio / Rick / Arnahory / G-Shock"
                    placeholderTextColor="#64748B"
                    value={newWatchBrand}
                    onChangeText={setNewWatchBrand}
                  />
                </View>

                <View style={styles.inputHalf}>
                  <Text style={styles.label}>Year Acquired</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="2025"
                    placeholderTextColor="#64748B"
                    value={newWatchYear}
                    onChangeText={setNewWatchYear}
                  />
                </View>

                <View style={styles.inputHalf}>
                  <Text style={styles.label}>Estimated Valuation ($ USD)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="8500"
                    placeholderTextColor="#64748B"
                    value={newWatchVal}
                    onChangeText={setNewWatchVal}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputHalf}>
                  <Text style={styles.label}>Photo URL</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="https://images.unsplash.com/..."
                    placeholderTextColor="#64748B"
                    value={newWatchImage}
                    onChangeText={setNewWatchImage}
                  />
                </View>

                <View style={styles.inputFull}>
                  <Text style={styles.label}>Collector's Story & Notes</Text>
                  <TextInput
                    style={[styles.input, { height: 60, paddingTop: 8 }]}
                    placeholder="Why this watch is special, dial patina, custom engravings..."
                    placeholderTextColor="#64748B"
                    value={newWatchNotes}
                    onChangeText={setNewWatchNotes}
                    multiline
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.saveCollectionBtn} onPress={handleAddCollection}>
                <CheckCircle2 size={16} color="#07080A" />
                <Text style={styles.saveCollectionBtnText}>Save to My Watch Box</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Collection Grid */}
          {collectionList.length === 0 ? (
            <View style={styles.emptyBoxContainer}>
              <Layers size={40} color="#64748B" />
              <Text style={styles.emptyBoxTitle}>Your Watch Box is Empty</Text>
              <Text style={styles.emptyBoxText}>
                Catalog watches you currently own to share your horology journey with fellow enthusiasts.
              </Text>
            </View>
          ) : (
            <View style={styles.collectionCardsGrid}>
              {collectionList.map((item) => (
                <View key={item.id} style={styles.collectionCard}>
                  <Image source={{ uri: item.image }} style={styles.collectionImg} />
                  <View style={styles.collectionCardBody}>
                    <View style={styles.collectionCardHeader}>
                      <Text style={styles.collectionBrand}>{item.brand.toUpperCase()}</Text>
                      <TouchableOpacity
                        style={styles.trashBtn}
                        onPress={() => removeCollectionItem(item.id)}
                      >
                        <Trash2 size={14} color="#EF4444" />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.collectionName}>{item.watchName}</Text>
                    <Text style={styles.collectionYear}>Acquired in {item.yearPurchased}</Text>

                    {item.notes && (
                      <Text style={styles.collectionNotes} numberOfLines={2}>
                        "{item.notes}"
                      </Text>
                    )}

                    {item.estimatedValue && (
                      <View style={styles.valuationBadge}>
                        <Text style={styles.valuationLabel}>Est. Value: </Text>
                        <Text style={styles.valuationVal}>{formatPrice(item.estimatedValue)}</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* TAB 2: Edit Profile */}
      {activeTab === 'profile' && (
        <View style={styles.sectionContent}>
          <View style={styles.formCard}>
            <Text style={styles.sectionHeading}>Edit Public Profile & Horology Bio</Text>

            {saveSuccess && (
              <View style={styles.saveSuccessBanner}>
                <CheckCircle2 size={16} color="#10B981" />
                <Text style={styles.saveSuccessText}>Profile successfully updated!</Text>
              </View>
            )}

            <View style={styles.formInputsGrid}>
              <View style={styles.inputHalf}>
                <Text style={styles.label}>Display Name</Text>
                <TextInput
                  style={styles.input}
                  value={displayName}
                  onChangeText={setDisplayName}
                />
              </View>

              <View style={styles.inputHalf}>
                <Text style={styles.label}>Custom Handle (@)</Text>
                <TextInput
                  style={styles.input}
                  value={customHandle}
                  onChangeText={setCustomHandle}
                />
              </View>

              <View style={styles.inputHalf}>
                <Text style={styles.label}>Email Address (Read-only)</Text>
                <TextInput
                  style={[styles.input, { opacity: 0.6 }]}
                  value={user.email}
                  editable={false}
                />
              </View>

              <View style={styles.inputHalf}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              <View style={styles.inputFull}>
                <Text style={styles.label}>Collector Bio / About Me</Text>
                <TextInput
                  style={[styles.input, { height: 70, paddingTop: 8 }]}
                  value={bio}
                  onChangeText={setBio}
                  multiline
                />
              </View>
            </View>

            <TouchableOpacity style={styles.saveChangesBtn} onPress={handleSaveProfile}>
              <Text style={styles.saveChangesBtnText}>Save Profile Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* TAB 3: Saved Addresses */}
      {activeTab === 'addresses' && (
        <View style={styles.sectionContent}>
          <Text style={styles.sectionHeading}>Saved Insured Shipping Destinations</Text>
          {profile.shippingAddresses?.map((addr) => (
            <View key={addr.id} style={styles.addressCard}>
              <View style={styles.addressHeader}>
                <Text style={styles.addressName}>{addr.fullName}</Text>
                {addr.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>DEFAULT DESTINATION</Text>
                  </View>
                )}
              </View>
              <Text style={styles.addressText}>
                {addr.street}{'\n'}
                {addr.city}, {addr.state} {addr.postalCode}{'\n'}
                {addr.country}{'\n'}
                Contact: {addr.phone}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  notLoggedInContainer: {
    padding: 40,
    alignItems: 'center',
  },
  notLoggedInTitle: {
    fontFamily: THEME.fonts.serif,
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF3B0',
    marginBottom: 8,
  },
  notLoggedInText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    maxWidth: 400,
  },
  container: {
    maxWidth: 1200,
    marginHorizontal: 'auto' as any,
    width: '100%',
    padding: 16,
  },
  profileHeaderCard: {
    backgroundColor: '#0D1017',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 77, 0.25)',
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 15,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    paddingBottom: 20,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 99,
    backgroundColor: 'rgba(201, 162, 77, 0.2)',
    borderWidth: 2,
    borderColor: '#C9A24D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfoWrap: {
    flex: 1,
    minWidth: 220,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileDisplayName: {
    fontFamily: THEME.fonts.serif,
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(201, 162, 77, 0.15)',
    borderWidth: 1,
    borderColor: '#C9A24D',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  vipBadgeText: {
    color: '#FFF3B0',
    fontSize: 10,
    fontWeight: '800',
  },
  profileHandleText: {
    color: '#C9A24D',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  profileBioText: {
    color: '#CBD5E1',
    fontSize: 12.5,
    marginTop: 4,
    lineHeight: 16,
  },
  shareProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#C9A24D',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  shareProfileText: {
    color: '#07080A',
    fontSize: 12,
    fontWeight: '800',
  },
  profileStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    flexWrap: 'wrap',
    gap: 12,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: THEME.fonts.serif,
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF3B0',
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  tabNavRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#0D1017',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  tabButtonActive: {
    backgroundColor: 'rgba(201, 162, 77, 0.2)',
    borderColor: '#C9A24D',
  },
  tabButtonText: {
    color: '#94A3B8',
    fontSize: 12.5,
    fontWeight: '600',
  },
  tabButtonTextActive: {
    color: '#FFF3B0',
    fontWeight: '800',
  },
  sectionContent: {
    gap: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  sectionHeading: {
    fontFamily: THEME.fonts.serif,
    fontSize: 17,
    fontWeight: '800',
    color: '#FFF3B0',
  },
  sectionSubHeading: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  addWatchBoxBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#C9A24D',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addWatchBoxBtnText: {
    color: '#07080A',
    fontSize: 12,
    fontWeight: '800',
  },
  addWatchForm: {
    backgroundColor: '#0D1017',
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 77, 0.3)',
    borderRadius: 14,
    padding: 18,
    gap: 12,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF3B0',
  },
  formInputsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  inputFull: {
    width: '100%',
  },
  inputHalf: {
    flex: 1,
    minWidth: 240,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#CBD5E1',
    marginBottom: 4,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    color: '#F8FAFC',
    fontSize: 12.5,
    outlineStyle: 'none' as any,
  },
  saveCollectionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#C9A24D',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 6,
  },
  saveCollectionBtnText: {
    color: '#07080A',
    fontSize: 13,
    fontWeight: '900',
  },
  emptyBoxContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 14,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  emptyBoxTitle: {
    fontFamily: THEME.fonts.serif,
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
    marginTop: 10,
    marginBottom: 4,
  },
  emptyBoxText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    maxWidth: 380,
  },
  collectionCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  collectionCard: {
    flex: 1,
    minWidth: 260,
    maxWidth: 380,
    backgroundColor: '#0D1017',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    overflow: 'hidden',
  },
  collectionImg: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    backgroundColor: '#141A26',
  },
  collectionCardBody: {
    padding: 14,
    gap: 6,
  },
  collectionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  collectionBrand: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C9A24D',
  },
  trashBtn: {
    padding: 4,
  },
  collectionName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  collectionYear: {
    fontSize: 11,
    color: '#94A3B8',
  },
  collectionNotes: {
    fontSize: 11.5,
    color: '#CBD5E1',
    fontStyle: 'italic',
  },
  valuationBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(201, 162, 77, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  valuationLabel: {
    fontSize: 10,
    color: '#94A3B8',
  },
  valuationVal: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFF3B0',
  },
  formCard: {
    backgroundColor: '#0D1017',
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 77, 0.25)',
    borderRadius: 14,
    padding: 20,
    gap: 14,
  },
  saveSuccessBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    padding: 10,
    borderRadius: 8,
  },
  saveSuccessText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
  saveChangesBtn: {
    backgroundColor: '#C9A24D',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveChangesBtnText: {
    color: '#07080A',
    fontSize: 13,
    fontWeight: '900',
  },
  addressCard: {
    backgroundColor: '#0D1017',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
    gap: 6,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  defaultBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    color: '#10B981',
    fontSize: 9,
    fontWeight: '800',
  },
  addressText: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 18,
  },
});
