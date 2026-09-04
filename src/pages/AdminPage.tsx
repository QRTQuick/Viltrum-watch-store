import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, ScrollView, Platform } from 'react-native';
import {
  ShieldCheck,
  ShieldAlert,
  PlusCircle,
  Package,
  Layers,
  BarChart3,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Upload,
  Crown,
  Sparkles,
  Search,
  Zap,
  Tag,
  Truck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWatches } from '../context/WatchContext';
import { useCart } from '../context/CartContext';
import { ADMIN_EMAIL, isFirebaseConfigured } from '../services/firebase';
import { BRAND_LIST } from '../data/initialWatches';
import { Watch, WatchBrand, WatchCategory, WatchGender, WatchMovement, OrderStatus } from '../types';
import { THEME } from '../styles/theme';

export const AdminPage: React.FC = () => {
  const { user, isAdmin, loginAsDemoAdmin, logout } = useAuth();
  const {
    watches,
    addWatch,
    updateWatch,
    deleteWatch,
    resetCatalogToDefault,
    formatPrice,
    openWatchDetail,
  } = useWatches();
  const { orders, updateOrderStatus, deleteOrder } = useCart();

  const [activeTab, setActiveTab] = useState<'upload' | 'inventory' | 'orders' | 'analytics'>('upload');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [editingWatchId, setEditingWatchId] = useState<string | null>(null);
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryBrandFilter, setInventoryBrandFilter] = useState('All');

  // Form state for uploading/editing watch
  const [name, setName] = useState('');
  const [brand, setBrand] = useState<WatchBrand>('Rolex');
  const [modelRef, setModelRef] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<WatchCategory>('Luxury');
  const [gender, setGender] = useState<WatchGender>('Men');
  const [movement, setMovement] = useState<WatchMovement>('Automatic');
  const [caseSize, setCaseSize] = useState('41mm');
  const [caseMaterial, setCaseMaterial] = useState('904L Oystersteel');
  const [dialColor, setDialColor] = useState('Midnight Black');
  const [strapType, setStrapType] = useState('Oyster Stainless Steel');
  const [waterResistance, setWaterResistance] = useState('300m / 1000ft');
  const [powerReserve, setPowerReserve] = useState('70 Hours');
  const [stock, setStock] = useState('5');
  const [rating, setRating] = useState('4.9');
  const [imageUrl1, setImageUrl1] = useState('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=85');
  const [imageUrl2, setImageUrl2] = useState('https://images.unsplash.com/photo-1547996160-71dfa63582b8?auto=format&fit=crop&w=900&q=85');
  const [tagsInput, setTagsInput] = useState('Rolex, Luxury, Diver, Certified Authentic');
  const [isFeatured, setIsFeatured] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);

  // Guard: if user is not logged in or not chisomlifeeke@gmail.com
  if (!user || !isAdmin) {
    return (
      <View style={styles.restrictedContainer}>
        <View style={styles.restrictedCard}>
          <View style={styles.restrictedIconOuter}>
            <ShieldAlert size={48} color="#EF4444" />
          </View>

          <Text style={styles.restrictedTitle}>Access Restricted: Authorized Admin Only</Text>
          <Text style={styles.restrictedDesc}>
            The Viltrum Admin Vault is strictly reserved for the authorized master administrator:
          </Text>

          <View style={styles.adminEmailBadge}>
            <Crown size={14} color="#FFF3B0" />
            <Text style={styles.adminEmailBadgeText}>{ADMIN_EMAIL}</Text>
          </View>

          {user && (
            <Text style={styles.currentUserNotice}>
              You are currently logged in as: <Text style={{ color: '#EF4444', fontWeight: '700' }}>{user.email}</Text>
            </Text>
          )}

          <TouchableOpacity
            style={styles.authorizeAdminBtn}
            onPress={loginAsDemoAdmin}
          >
            <ShieldCheck size={18} color="#07080A" />
            <Text style={styles.authorizeAdminBtnText}>
              Log In as Master Admin ({ADMIN_EMAIL})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Handle local image file upload (converts to base64 data-url)
  const handleFileUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setImageUrl1(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublishWatch = () => {
    if (!name.trim() || !price || isNaN(Number(price))) {
      alert('Please provide a valid Watch Name and Numeric Price.');
      return;
    }

    const watchData = {
      name: name.trim(),
      brand,
      modelRef: modelRef.trim() || `REF-${Math.floor(1000 + Math.random() * 9000)}`,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      description: description.trim() || `Prestigious ${brand} timepiece authenticated by Quick Red Tech with original packaging and certificate.`,
      category,
      gender,
      movement,
      caseSize: caseSize.trim() || '41mm',
      caseMaterial: caseMaterial.trim() || 'Stainless Steel',
      dialColor: dialColor.trim() || 'Sunburst Black',
      strapType: strapType.trim() || 'Stainless Steel Bracelet',
      waterResistance: waterResistance.trim() || '100m',
      powerReserve: powerReserve.trim() || '48 Hours',
      stock: Number(stock) || 5,
      rating: Number(rating) || 4.9,
      reviewsCount: Math.floor(15 + Math.random() * 80),
      isFeatured,
      isBestSeller,
      isNewArrival,
      images: [imageUrl1, ...(imageUrl2 ? [imageUrl2] : [])],
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      warranty: '5-Year Viltrum International Warranty & Quick Red Tech Certificate',
    };

    if (editingWatchId) {
      updateWatch(editingWatchId, watchData);
      setSuccessMsg(`Successfully updated "${name}" in catalog!`);
      setEditingWatchId(null);
    } else {
      addWatch(watchData);
      setSuccessMsg(`Successfully published new "${name}" to store catalog!`);
    }

    // Reset Form
    setName('');
    setModelRef('');
    setPrice('');
    setOriginalPrice('');
    setDescription('');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleStartEdit = (w: Watch) => {
    setEditingWatchId(w.id);
    setName(w.name);
    setBrand(w.brand);
    setModelRef(w.modelRef);
    setPrice(w.price.toString());
    setOriginalPrice(w.originalPrice ? w.originalPrice.toString() : '');
    setDescription(w.description);
    setCategory(w.category);
    setGender(w.gender);
    setMovement(w.movement);
    setCaseSize(w.caseSize);
    setCaseMaterial(w.caseMaterial);
    setDialColor(w.dialColor);
    setStrapType(w.strapType);
    setWaterResistance(w.waterResistance);
    setPowerReserve(w.powerReserve || '48 Hours');
    setStock(w.stock.toString());
    setRating(w.rating.toString());
    setImageUrl1(w.images[0] || '');
    setImageUrl2(w.images[1] || '');
    setTagsInput(w.tags ? w.tags.join(', ') : '');
    setIsFeatured(Boolean(w.isFeatured));
    setIsBestSeller(Boolean(w.isBestSeller));
    setIsNewArrival(Boolean(w.isNewArrival));
    setActiveTab('upload');
  };

  // Filter inventory
  const inventoryList = watches.filter((w) => {
    if (inventoryBrandFilter !== 'All' && w.brand.toLowerCase() !== inventoryBrandFilter.toLowerCase()) {
      return false;
    }
    if (inventorySearch.trim()) {
      const q = inventorySearch.toLowerCase();
      return (
        w.name.toLowerCase().includes(q) ||
        w.brand.toLowerCase().includes(q) ||
        w.modelRef.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate analytics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalWatches = watches.length;
  const totalStockUnits = watches.reduce((sum, w) => sum + w.stock, 0);
  const inventoryValuation = watches.reduce((sum, w) => sum + w.price * w.stock, 0);

  return (
    <View style={styles.container}>
      {/* Admin Top Banner */}
      <View style={styles.adminHeaderBanner}>
        <View style={styles.headerLeft}>
          <View style={styles.adminAvatarShield}>
            <Crown size={22} color="#FFF3B0" />
          </View>
          <View>
            <View style={styles.rowCentered}>
              <Text style={styles.adminTitle}>Viltrum Master Admin Vault</Text>
              <View style={styles.liveShieldBadge}>
                <ShieldCheck size={12} color="#FFF" />
                <Text style={styles.liveShieldText}>Authorized</Text>
              </View>
            </View>
            <Text style={styles.adminEmailText}>
              Logged in as: <Text style={styles.adminEmailHighlight}>{user.email}</Text> • Powered by Quick Red Tech
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutAdminBtn} onPress={logout}>
          <Text style={styles.logoutAdminBtnText}>Sign Out of Vault</Text>
        </TouchableOpacity>
      </View>

      {/* Success Notification Alert */}
      {successMsg && (
        <View style={styles.successBanner}>
          <CheckCircle2 size={18} color="#10B981" />
          <Text style={styles.successBannerText}>{successMsg}</Text>
        </View>
      )}

      {/* Admin Tabs Bar */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'upload' && styles.tabBtnActive]}
          onPress={() => setActiveTab('upload')}
        >
          <PlusCircle size={16} color={activeTab === 'upload' ? '#FFF3B0' : '#94A3B8'} />
          <Text style={[styles.tabBtnText, activeTab === 'upload' && styles.tabBtnTextActive]}>
            {editingWatchId ? 'Edit Watch' : 'Upload New Watch'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'inventory' && styles.tabBtnActive]}
          onPress={() => setActiveTab('inventory')}
        >
          <Layers size={16} color={activeTab === 'inventory' ? '#FFF3B0' : '#94A3B8'} />
          <Text style={[styles.tabBtnText, activeTab === 'inventory' && styles.tabBtnTextActive]}>
            Manage Catalog ({watches.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'orders' && styles.tabBtnActive]}
          onPress={() => setActiveTab('orders')}
        >
          <Package size={16} color={activeTab === 'orders' ? '#FFF3B0' : '#94A3B8'} />
          <Text style={[styles.tabBtnText, activeTab === 'orders' && styles.tabBtnTextActive]}>
            Customer Orders ({orders.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'analytics' && styles.tabBtnActive]}
          onPress={() => setActiveTab('analytics')}
        >
          <BarChart3 size={16} color={activeTab === 'analytics' ? '#FFF3B0' : '#94A3B8'} />
          <Text style={[styles.tabBtnText, activeTab === 'analytics' && styles.tabBtnTextActive]}>
            Sales & Analytics
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab 1: Upload / Edit Watch Form */}
      {activeTab === 'upload' && (
        <ScrollView style={styles.scrollSection} showsVerticalScrollIndicator={false}>
          <View style={styles.formCard}>
            <View style={styles.formCardHeader}>
              <Text style={styles.formCardTitle}>
                {editingWatchId ? `Editing Timepiece: ${name}` : 'Upload New Timepiece to Store Catalog'}
              </Text>
              {editingWatchId && (
                <TouchableOpacity
                  style={styles.cancelEditBtn}
                  onPress={() => {
                    setEditingWatchId(null);
                    setName('');
                    setPrice('');
                  }}
                >
                  <Text style={styles.cancelEditText}>Cancel Editing</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.formFieldsGrid}>
              {/* Watch Name */}
              <View style={styles.fieldFull}>
                <Text style={styles.label}>Watch Title / Model Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Submariner Date Ceramic 'Kermit Star'"
                  placeholderTextColor="#64748B"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              {/* Brand Selector */}
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Brand House *</Text>
                <View style={styles.brandButtonsWrap}>
                  {['Rolex', 'Casio', 'Poedager', 'Rick', 'Arnahory', 'G-Shock', 'CK', 'Fossil', 'MK'].map((b) => (
                    <TouchableOpacity
                      key={b}
                      style={[styles.brandPickBtn, brand === b && styles.brandPickBtnActive]}
                      onPress={() => setBrand(b)}
                    >
                      <Text style={[styles.brandPickText, brand === b && styles.brandPickTextActive]}>
                        {b}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Model Ref */}
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Model Reference Code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 126610LV or RK-011-CYBER"
                  placeholderTextColor="#64748B"
                  value={modelRef}
                  onChangeText={setModelRef}
                />
              </View>

              {/* Price & Original Price */}
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Selling Price ($ USD) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="14850"
                  placeholderTextColor="#64748B"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Original List Price ($ USD, Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="16500"
                  placeholderTextColor="#64748B"
                  value={originalPrice}
                  onChangeText={setOriginalPrice}
                  keyboardType="numeric"
                />
              </View>

              {/* Category */}
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Horology Category</Text>
                <View style={styles.pillsWrap}>
                  {['Luxury', 'Chronograph', 'Sports & Rugged', 'Classic Dress', 'Digital / Smart', 'Tourbillon / Skeleton'].map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.smallPill, category === cat && styles.smallPillActive]}
                      onPress={() => setCategory(cat as any)}
                    >
                      <Text style={[styles.smallPillText, category === cat && styles.smallPillTextActive]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Movement */}
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Movement Type</Text>
                <View style={styles.pillsWrap}>
                  {['Automatic', 'Quartz', 'Solar Quartz', 'Manual Wind', 'Digital'].map((mov) => (
                    <TouchableOpacity
                      key={mov}
                      style={[styles.smallPill, movement === mov && styles.smallPillActive]}
                      onPress={() => setMovement(mov as any)}
                    >
                      <Text style={[styles.smallPillText, movement === mov && styles.smallPillTextActive]}>
                        {mov}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Case Specs */}
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Case Size (e.g. 41mm)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="41mm"
                  placeholderTextColor="#64748B"
                  value={caseSize}
                  onChangeText={setCaseSize}
                />
              </View>

              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Case Material</Text>
                <TextInput
                  style={styles.input}
                  placeholder="904L Oystersteel / 18K Gold / Carbon"
                  placeholderTextColor="#64748B"
                  value={caseMaterial}
                  onChangeText={setCaseMaterial}
                />
              </View>

              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Dial Color</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Emerald Green / Onyx Black / Champagne"
                  placeholderTextColor="#64748B"
                  value={dialColor}
                  onChangeText={setDialColor}
                />
              </View>

              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Strap / Bracelet</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Oyster Stainless Steel with Glidelock"
                  placeholderTextColor="#64748B"
                  value={strapType}
                  onChangeText={setStrapType}
                />
              </View>

              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Water Resistance</Text>
                <TextInput
                  style={styles.input}
                  placeholder="300m / 1000ft"
                  placeholderTextColor="#64748B"
                  value={waterResistance}
                  onChangeText={setWaterResistance}
                />
              </View>

              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Power Reserve</Text>
                <TextInput
                  style={styles.input}
                  placeholder="70 Hours"
                  placeholderTextColor="#64748B"
                  value={powerReserve}
                  onChangeText={setPowerReserve}
                />
              </View>

              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Inventory Vault Stock</Text>
                <TextInput
                  style={styles.input}
                  placeholder="5"
                  placeholderTextColor="#64748B"
                  value={stock}
                  onChangeText={setStock}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Customer Rating (1.0 - 5.0)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="4.9"
                  placeholderTextColor="#64748B"
                  value={rating}
                  onChangeText={setRating}
                  keyboardType="numeric"
                />
              </View>

              {/* Description */}
              <View style={styles.fieldFull}>
                <Text style={styles.label}>Detailed Horology Description</Text>
                <TextInput
                  style={[styles.input, { height: 70, paddingTop: 8 }]}
                  placeholder="Enter timepiece background, craftsmanship, and specifications..."
                  placeholderTextColor="#64748B"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                />
              </View>

              {/* Image URLs and Local Upload */}
              <View style={styles.fieldFull}>
                <Text style={styles.label}>Watch Photography (URL or Local Image Upload)</Text>
                <View style={{ gap: 8 }}>
                  <TextInput
                    style={styles.input}
                    placeholder="Primary image URL: https://images.unsplash.com/..."
                    placeholderTextColor="#64748B"
                    value={imageUrl1}
                    onChangeText={setImageUrl1}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Secondary angle image URL (optional)"
                    placeholderTextColor="#64748B"
                    value={imageUrl2}
                    onChangeText={setImageUrl2}
                  />

                  {/* Browser Native File Picker */}
                  <View style={styles.filePickerRow}>
                    <Text style={styles.filePickerLabel}>Or choose image from device:</Text>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      style={{ color: '#94A3B8', fontSize: 12 }}
                    />
                  </View>

                  {/* Live Preview of image */}
                  {imageUrl1 && (
                    <View style={styles.imagePreviewWrap}>
                      <Image source={{ uri: imageUrl1 }} style={styles.imagePreview} />
                      <Text style={styles.imagePreviewText}>Live Photography Preview</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Tags */}
              <View style={styles.fieldFull}>
                <Text style={styles.label}>Search & Catalog Tags (Comma-separated)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Rolex, Submariner, Ceramic, Green, Diver, Quick Red Tech"
                  placeholderTextColor="#64748B"
                  value={tagsInput}
                  onChangeText={setTagsInput}
                />
              </View>

              {/* Toggles */}
              <View style={styles.fieldFull}>
                <Text style={styles.label}>Badges & Placement</Text>
                <View style={styles.toggleRow}>
                  <TouchableOpacity
                    style={[styles.toggleBtn, isFeatured && styles.toggleBtnActive]}
                    onPress={() => setIsFeatured(!isFeatured)}
                  >
                    <Sparkles size={14} color={isFeatured ? '#FFF3B0' : '#94A3B8'} />
                    <Text style={[styles.toggleText, isFeatured && styles.toggleTextActive]}>
                      Featured Spotlight
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.toggleBtn, isBestSeller && styles.toggleBtnActive]}
                    onPress={() => setIsBestSeller(!isBestSeller)}
                  >
                    <Crown size={14} color={isBestSeller ? '#FFF3B0' : '#94A3B8'} />
                    <Text style={[styles.toggleText, isBestSeller && styles.toggleTextActive]}>
                      Best Seller
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.toggleBtn, isNewArrival && styles.toggleBtnActive]}
                    onPress={() => setIsNewArrival(!isNewArrival)}
                  >
                    <Zap size={14} color={isNewArrival ? '#FFF3B0' : '#94A3B8'} />
                    <Text style={[styles.toggleText, isNewArrival && styles.toggleTextActive]}>
                      New Arrival
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.publishBtn} onPress={handlePublishWatch}>
              <Upload size={18} color="#07080A" />
              <Text style={styles.publishBtnText}>
                {editingWatchId ? 'Save & Update Timepiece' : 'Publish Timepiece to Live Boutique'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Tab 2: Manage Inventory */}
      {activeTab === 'inventory' && (
        <ScrollView style={styles.scrollSection} showsVerticalScrollIndicator={false}>
          {/* Controls Bar */}
          <View style={styles.inventoryControls}>
            <View style={styles.inventorySearchWrap}>
              <Search size={16} color="#94A3B8" />
              <TextInput
                style={styles.inventorySearchInput}
                placeholder="Search catalog by name, brand, or ref..."
                placeholderTextColor="#64748B"
                value={inventorySearch}
                onChangeText={setInventorySearch}
              />
            </View>

            <TouchableOpacity style={styles.resetCatalogBtn} onPress={resetCatalogToDefault}>
              <RefreshCw size={14} color="#C9A24D" />
              <Text style={styles.resetCatalogText}>Reset to Seed Catalog</Text>
            </TouchableOpacity>
          </View>

          {/* Table / Cards of Inventory */}
          <View style={styles.inventoryGrid}>
            {inventoryList.map((w) => (
              <View key={w.id} style={styles.inventoryCard}>
                <Image
                  source={{ uri: w.images[0] || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80' }}
                  style={styles.inventoryCardImg}
                />
                <View style={styles.inventoryCardDetails}>
                  <View style={styles.inventoryCardTop}>
                    <Text style={styles.invBrandBadge}>{w.brand.toUpperCase()}</Text>
                    <Text style={styles.invRefText}>Ref. {w.modelRef}</Text>
                  </View>
                  <Text style={styles.invNameText} numberOfLines={1}>
                    {w.name}
                  </Text>
                  <Text style={styles.invPriceText}>{formatPrice(w.price)}</Text>
                  <Text style={styles.invStockText}>In Vault: {w.stock} Units</Text>

                  {/* Actions */}
                  <View style={styles.invActionsRow}>
                    <TouchableOpacity
                      style={styles.invEditBtn}
                      onPress={() => handleStartEdit(w)}
                    >
                      <Edit size={13} color="#FFF3B0" />
                      <Text style={styles.invEditText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.invDeleteBtn}
                      onPress={() => {
                        if (confirm(`Are you sure you want to delete ${w.name}?`)) {
                          deleteWatch(w.id);
                        }
                      }}
                    >
                      <Trash2 size={13} color="#EF4444" />
                      <Text style={styles.invDeleteText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Tab 3: Customer Orders */}
      {activeTab === 'orders' && (
        <ScrollView style={styles.scrollSection} showsVerticalScrollIndicator={false}>
          <View style={styles.ordersListContainer}>
            <Text style={styles.sectionTitle}>
              Real-time Customer Acquisitions & Shipments ({orders.length} Orders)
            </Text>

            {orders.map((order) => (
              <View key={order.id} style={styles.orderAdminCard}>
                <View style={styles.orderAdminHeader}>
                  <View>
                    <Text style={styles.orderAdminId}>{order.id}</Text>
                    <Text style={styles.orderAdminDate}>
                      Placed on {new Date(order.createdAt).toLocaleString()}
                    </Text>
                  </View>

                  {/* Status Dropdown */}
                  <View style={styles.statusDropdownWrap}>
                    <Text style={styles.statusLabel}>Fulfillment Status:</Text>
                    <View style={styles.statusPillsRow}>
                      {(
                        [
                          'Confirmed',
                          'Authenticating',
                          'Shipped',
                          'Delivered',
                        ] as OrderStatus[]
                      ).map((st) => (
                        <TouchableOpacity
                          key={st}
                          style={[
                            styles.orderStatusPill,
                            order.status === st && styles.orderStatusPillActive,
                          ]}
                          onPress={() => updateOrderStatus(order.id, st)}
                        >
                          <Text
                            style={[
                              styles.orderStatusPillText,
                              order.status === st && styles.orderStatusPillTextActive,
                            ]}
                          >
                            {st}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                {/* Customer Details */}
                <View style={styles.orderCustomerInfo}>
                  <Text style={styles.orderCustName}>Customer: {order.userName} ({order.userEmail})</Text>
                  <Text style={styles.orderCustAddress}>
                    Address: {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}, {order.shippingAddress.country} • Phone: {order.shippingAddress.phone}
                  </Text>
                  <Text style={styles.orderTrackingLine}>
                    Courier: {order.carrier} • Tracking #{order.trackingNumber}
                  </Text>
                </View>

                {/* Items & Total */}
                <View style={styles.orderItemsAdminList}>
                  {order.items.map(({ watch, quantity, selectedStrap }, idx) => (
                    <View key={idx} style={styles.orderItemAdminRow}>
                      <Text style={styles.orderItemAdminName}>
                        {quantity}x {watch.brand} - {watch.name} ({selectedStrap || 'Standard'})
                      </Text>
                      <Text style={styles.orderItemAdminPrice}>
                        {formatPrice(watch.price * quantity)}
                      </Text>
                    </View>
                  ))}
                  <View style={styles.orderTotalAdminRow}>
                    <Text style={styles.orderTotalAdminLabel}>Total Amount Paid ({order.paymentMethod}):</Text>
                    <Text style={styles.orderTotalAdminVal}>{formatPrice(order.total)}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Tab 4: Analytics */}
      {activeTab === 'analytics' && (
        <ScrollView style={styles.scrollSection} showsVerticalScrollIndicator={false}>
          <View style={styles.analyticsGrid}>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsMetricLabel}>Total Revenue (GMV)</Text>
              <Text style={styles.analyticsMetricVal}>{formatPrice(totalRevenue)}</Text>
              <Text style={styles.analyticsMetricSub}>From {orders.length} authenticated transactions</Text>
            </View>

            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsMetricLabel}>Total Inventory Valuation</Text>
              <Text style={styles.analyticsMetricVal}>{formatPrice(inventoryValuation)}</Text>
              <Text style={styles.analyticsMetricSub}>Across {totalStockUnits} timepieces in vault</Text>
            </View>

            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsMetricLabel}>Active Catalog Models</Text>
              <Text style={styles.analyticsMetricVal}>{totalWatches}</Text>
              <Text style={styles.analyticsMetricSub}>9 Luxury Brands Registered</Text>
            </View>
          </View>

          {/* Brand Distribution Section */}
          <View style={styles.brandMetricsSection}>
            <Text style={styles.brandMetricsHeading}>Brand Portfolio Breakdown</Text>
            <View style={styles.brandMetricsGrid}>
              {['Rolex', 'Casio', 'Poedager', 'Rick', 'Arnahory', 'G-Shock', 'CK', 'Fossil', 'MK'].map((b) => {
                const count = watches.filter((w) => w.brand.toLowerCase() === b.toLowerCase()).length;
                const value = watches
                  .filter((w) => w.brand.toLowerCase() === b.toLowerCase())
                  .reduce((sum, w) => sum + w.price * w.stock, 0);

                return (
                  <View key={b} style={styles.brandMetricPill}>
                    <View style={styles.brandMetricTop}>
                      <Text style={styles.brandMetricName}>{b}</Text>
                      <Text style={styles.brandMetricCount}>{count} Models</Text>
                    </View>
                    <Text style={styles.brandMetricVal}>{formatPrice(value)} stock value</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  restrictedContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 500,
  },
  restrictedCard: {
    backgroundColor: '#0D1017',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    borderRadius: 20,
    padding: 30,
    maxWidth: 520,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 20,
  },
  restrictedIconOuter: {
    width: 80,
    height: 80,
    borderRadius: 99,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  restrictedTitle: {
    fontFamily: THEME.fonts.serif,
    fontSize: 20,
    fontWeight: '900',
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 8,
  },
  restrictedDesc: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
  },
  adminEmailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(201, 162, 77, 0.15)',
    borderWidth: 1,
    borderColor: '#C9A24D',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 14,
  },
  adminEmailBadgeText: {
    color: '#FFF3B0',
    fontFamily: THEME.fonts.mono,
    fontSize: 13,
    fontWeight: '800',
  },
  currentUserNotice: {
    fontSize: 11.5,
    color: '#94A3B8',
    marginBottom: 16,
  },
  authorizeAdminBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#C9A24D',
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 10,
  },
  authorizeAdminBtnText: {
    color: '#07080A',
    fontSize: 13,
    fontWeight: '900',
  },
  container: {
    maxWidth: 1400,
    marginHorizontal: 'auto' as any,
    width: '100%',
    padding: 16,
  },
  adminHeaderBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    backgroundColor: 'rgba(18, 24, 38, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 77, 0.3)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  adminAvatarShield: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: 'rgba(230, 30, 42, 0.25)',
    borderWidth: 1,
    borderColor: '#E61E2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminTitle: {
    fontFamily: THEME.fonts.serif,
    fontSize: 17,
    fontWeight: '900',
    color: '#FFF3B0',
    letterSpacing: 1,
  },
  liveShieldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10B981',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 99,
    marginLeft: 8,
  },
  liveShieldText: {
    color: '#FFF',
    fontSize: 9.5,
    fontWeight: '800',
  },
  adminEmailText: {
    color: '#94A3B8',
    fontSize: 11.5,
    marginTop: 2,
  },
  adminEmailHighlight: {
    color: '#FF8888',
    fontWeight: '700',
  },
  logoutAdminBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutAdminBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  successBannerText: {
    color: '#D1FAE5',
    fontSize: 13,
    fontWeight: '700',
  },
  tabsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tabBtn: {
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
  tabBtnActive: {
    backgroundColor: 'rgba(201, 162, 77, 0.2)',
    borderColor: '#C9A24D',
  },
  tabBtnText: {
    color: '#94A3B8',
    fontSize: 12.5,
    fontWeight: '600',
  },
  tabBtnTextActive: {
    color: '#FFF3B0',
    fontWeight: '800',
  },
  scrollSection: {
    flex: 1,
  },
  formCard: {
    backgroundColor: '#0D1017',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 77, 0.25)',
    padding: 20,
  },
  formCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    paddingBottom: 12,
  },
  formCardTitle: {
    fontFamily: THEME.fonts.serif,
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF3B0',
  },
  cancelEditBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 6,
  },
  cancelEditText: {
    color: '#CBD5E1',
    fontSize: 11,
  },
  formFieldsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  fieldFull: {
    width: '100%',
  },
  fieldHalf: {
    flex: 1,
    minWidth: 280,
  },
  label: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#CBD5E1',
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
    color: '#F8FAFC',
    fontSize: 12.5,
    outlineStyle: 'none' as any,
  },
  brandButtonsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  brandPickBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  brandPickBtnActive: {
    backgroundColor: '#C9A24D',
    borderColor: '#C9A24D',
  },
  brandPickText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  brandPickTextActive: {
    color: '#07080A',
    fontWeight: '900',
  },
  pillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  smallPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  smallPillActive: {
    backgroundColor: 'rgba(201, 162, 77, 0.2)',
    borderWidth: 1,
    borderColor: '#C9A24D',
  },
  smallPillText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  smallPillTextActive: {
    color: '#FFF3B0',
    fontWeight: '800',
  },
  filePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  filePickerLabel: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
  },
  imagePreviewWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 8,
    borderRadius: 8,
  },
  imagePreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#141A26',
  },
  imagePreviewText: {
    color: '#10B981',
    fontSize: 11.5,
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  toggleBtnActive: {
    backgroundColor: 'rgba(201, 162, 77, 0.2)',
    borderColor: '#C9A24D',
  },
  toggleText: {
    color: '#94A3B8',
    fontSize: 11.5,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#FFF3B0',
    fontWeight: '800',
  },
  publishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#C9A24D',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#C9A24D',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  publishBtnText: {
    color: '#07080A',
    fontSize: 14,
    fontWeight: '900',
  },
  inventoryControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  inventorySearchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D1017',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    flex: 1,
    minWidth: 260,
    gap: 8,
  },
  inventorySearchInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 12,
    outlineStyle: 'none' as any,
  },
  resetCatalogBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(201, 162, 77, 0.15)',
    borderWidth: 1,
    borderColor: '#C9A24D',
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 8,
  },
  resetCatalogText: {
    color: '#FFF3B0',
    fontSize: 12,
    fontWeight: '700',
  },
  inventoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  inventoryCard: {
    flex: 1,
    minWidth: 280,
    maxWidth: 420,
    flexDirection: 'row',
    backgroundColor: '#0D1017',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 10,
    gap: 12,
  },
  inventoryCardImg: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#141A26',
    resizeMode: 'cover',
  },
  inventoryCardDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  inventoryCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  invBrandBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C9A24D',
  },
  invRefText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  invNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  invPriceText: {
    fontFamily: THEME.fonts.serif,
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF3B0',
  },
  invStockText: {
    fontSize: 10.5,
    color: '#10B981',
    fontWeight: '600',
  },
  invActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  invEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(201, 162, 77, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  invEditText: {
    color: '#FFF3B0',
    fontSize: 11,
    fontWeight: '700',
  },
  invDeleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  invDeleteText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '700',
  },
  ordersListContainer: {
    gap: 12,
  },
  sectionTitle: {
    fontFamily: THEME.fonts.serif,
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF3B0',
    marginBottom: 6,
  },
  orderAdminCard: {
    backgroundColor: '#0D1017',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
    gap: 12,
  },
  orderAdminHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    paddingBottom: 10,
  },
  orderAdminId: {
    fontFamily: THEME.fonts.mono,
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF3B0',
  },
  orderAdminDate: {
    fontSize: 11,
    color: '#94A3B8',
  },
  statusDropdownWrap: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusLabel: {
    fontSize: 10,
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  statusPillsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  orderStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  orderStatusPillActive: {
    backgroundColor: '#C9A24D',
  },
  orderStatusPillText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  orderStatusPillTextActive: {
    color: '#07080A',
    fontWeight: '800',
  },
  orderCustomerInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
    padding: 10,
    gap: 2,
  },
  orderCustName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  orderCustAddress: {
    fontSize: 11,
    color: '#CBD5E1',
  },
  orderTrackingLine: {
    fontSize: 11,
    color: '#93C5FD',
    fontWeight: '600',
    marginTop: 2,
  },
  orderItemsAdminList: {
    gap: 4,
  },
  orderItemAdminRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderItemAdminName: {
    fontSize: 11.5,
    color: '#CBD5E1',
  },
  orderItemAdminPrice: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  orderTotalAdminRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(201, 162, 77, 0.2)',
    paddingTop: 6,
    marginTop: 4,
  },
  orderTotalAdminLabel: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#FFF3B0',
  },
  orderTotalAdminVal: {
    fontFamily: THEME.fonts.serif,
    fontSize: 15,
    fontWeight: '900',
    color: '#FFF3B0',
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  analyticsCard: {
    flex: 1,
    minWidth: 240,
    backgroundColor: '#0D1017',
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 77, 0.2)',
    borderRadius: 14,
    padding: 16,
    gap: 6,
  },
  analyticsMetricLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  analyticsMetricVal: {
    fontFamily: THEME.fonts.serif,
    fontSize: 26,
    fontWeight: '900',
    color: '#FFF3B0',
  },
  analyticsMetricSub: {
    fontSize: 11,
    color: '#64748B',
  },
  brandMetricsSection: {
    backgroundColor: '#0D1017',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 16,
  },
  brandMetricsHeading: {
    fontFamily: THEME.fonts.serif,
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF3B0',
    marginBottom: 12,
  },
  brandMetricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  brandMetricPill: {
    flex: 1,
    minWidth: 160,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  brandMetricTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  brandMetricName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  brandMetricCount: {
    fontSize: 11,
    color: '#C9A24D',
    fontWeight: '700',
  },
  brandMetricVal: {
    fontSize: 10.5,
    color: '#94A3B8',
  },
  rowCentered: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
