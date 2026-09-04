import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput } from 'react-native';
import { SlidersHorizontal, X, ArrowUpDown, Tag, Sparkles, RefreshCw, Check } from 'lucide-react';
import { useWatches } from '../context/WatchContext';
import { BRAND_LIST } from '../data/initialWatches';
import { WatchBrand, WatchCategory, WatchGender, WatchMovement } from '../types';

const CATEGORIES: (WatchCategory | 'All')[] = [
  'All',
  'Luxury',
  'Chronograph',
  'Sports & Rugged',
  'Classic Dress',
  'Digital / Smart',
  'Tourbillon / Skeleton',
];

const MOVEMENTS: (WatchMovement | 'All')[] = [
  'All',
  'Automatic',
  'Quartz',
  'Solar Quartz',
  'Manual Wind',
  'Digital',
];

const GENDERS: (WatchGender | 'All')[] = ['All', 'Men', 'Women', 'Unisex'];

const PRICE_PRESETS: { label: string; range: [number, number] }[] = [
  { label: 'All Prices', range: [0, 50000] },
  { label: 'Under $250', range: [0, 250] },
  { label: '$250 - $1,000', range: [250, 1000] },
  { label: '$1,000 - $5,000', range: [1000, 5000] },
  { label: '$5,000 - $20,000', range: [5000, 20000] },
  { label: '$20,000+', range: [20000, 50000] },
];

export const WatchFilterBar: React.FC = () => {
  const {
    filters,
    setSelectedBrand,
    setSelectedCategory,
    setSelectedGender,
    setSelectedMovement,
    setPriceRange,
    setSortBy,
    resetFilters,
    filteredWatches,
    getBrandCount,
    watches,
  } = useWatches();

  const [expandedFilters, setExpandedFilters] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const activeFiltersCount =
    (filters.selectedBrand !== 'All' ? 1 : 0) +
    (filters.selectedCategory !== 'All' ? 1 : 0) +
    (filters.selectedGender !== 'All' ? 1 : 0) +
    (filters.selectedMovement !== 'All' ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 50000 ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  return (
    <View style={styles.container}>
      {/* Brand Tabs Ribbon (Rolex, Casio, Poedager, Rick, Arnahory, G-Shock, CK, Fossil, MK) */}
      <View style={styles.brandRibbonWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.brandTabsScroll}
        >
          <TouchableOpacity
            style={[
              styles.brandTab,
              filters.selectedBrand === 'All' && styles.brandTabActive,
            ]}
            onPress={() => setSelectedBrand('All')}
          >
            <Text
              style={[
                styles.brandTabText,
                filters.selectedBrand === 'All' && styles.brandTabTextActive,
              ]}
            >
              All Brands
            </Text>
            <View style={styles.countPill}>
              <Text style={styles.countPillText}>{watches.length}</Text>
            </View>
          </TouchableOpacity>

          {BRAND_LIST.map((brand) => {
            const count = getBrandCount(brand);
            const isSelected = filters.selectedBrand.toLowerCase() === brand.toLowerCase();
            return (
              <TouchableOpacity
                key={brand}
                style={[styles.brandTab, isSelected && styles.brandTabActive]}
                onPress={() => setSelectedBrand(brand)}
              >
                <Text style={[styles.brandTabText, isSelected && styles.brandTabTextActive]}>
                  {brand}
                </Text>
                {count > 0 && (
                  <View style={[styles.countPill, isSelected && styles.countPillActive]}>
                    <Text style={[styles.countPillText, isSelected && styles.countPillTextActive]}>
                      {count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Filter Bar & Controls */}
      <View style={styles.controlsRow}>
        {/* Left: Category pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = filters.selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    isSelected && styles.categoryPillTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Right: Expand Filter & Sort Dropdown */}
        <View style={styles.rightControlsWrap}>
          {/* Advanced Filter Toggle */}
          <TouchableOpacity
            style={[
              styles.filterToggleBtn,
              expandedFilters && styles.filterToggleBtnActive,
            ]}
            onPress={() => setExpandedFilters(!expandedFilters)}
          >
            <SlidersHorizontal size={14} color={expandedFilters ? '#FFF3B0' : '#94A3B8'} />
            <Text
              style={[
                styles.filterToggleText,
                expandedFilters && styles.filterToggleTextActive,
              ]}
            >
              Filters
            </Text>
            {activeFiltersCount > 0 && (
              <View style={styles.activeFiltersBadge}>
                <Text style={styles.activeFiltersBadgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Sort Selector Button */}
          <TouchableOpacity
            style={styles.sortBtn}
            onPress={() => setSortDropdownOpen(!sortDropdownOpen)}
          >
            <ArrowUpDown size={14} color="#C9A24D" />
            <Text style={styles.sortBtnText}>
              Sort: {filters.sortBy === 'featured' ? 'Featured' : filters.sortBy === 'price-asc' ? 'Price: Low' : filters.sortBy === 'price-desc' ? 'Price: High' : filters.sortBy === 'rating' ? 'Rating' : 'Newest'}
            </Text>
          </TouchableOpacity>

          {/* Reset Filters if active */}
          {activeFiltersCount > 0 && (
            <TouchableOpacity style={styles.resetBtn} onPress={resetFilters}>
              <RefreshCw size={12} color="#EF4444" />
              <Text style={styles.resetBtnText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Sort Dropdown Modal */}
        {sortDropdownOpen && (
          <View style={styles.sortDropdown}>
            {[
              { id: 'featured', label: 'Featured & Best Rated' },
              { id: 'price-asc', label: 'Price: Low to High' },
              { id: 'price-desc', label: 'Price: High to Low' },
              { id: 'rating', label: 'Highest Customer Rating' },
              { id: 'newest', label: 'Newest Arrivals' },
              { id: 'name', label: 'Model Name (A-Z)' },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.sortItem,
                  filters.sortBy === opt.id && styles.sortItemActive,
                ]}
                onPress={() => {
                  setSortBy(opt.id as any);
                  setSortDropdownOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.sortItemText,
                    filters.sortBy === opt.id && styles.sortItemTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
                {filters.sortBy === opt.id && <Check size={14} color="#C9A24D" />}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Expanded Advanced Filters Panel */}
      {expandedFilters && (
        <View style={styles.advancedFilterPanel}>
          {/* Price Range Presets */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Price Range</Text>
            <View style={styles.filterPillsWrap}>
              {PRICE_PRESETS.map((p) => {
                const isSelected =
                  filters.priceRange[0] === p.range[0] &&
                  filters.priceRange[1] === p.range[1];
                return (
                  <TouchableOpacity
                    key={p.label}
                    style={[styles.smallPill, isSelected && styles.smallPillActive]}
                    onPress={() => setPriceRange(p.range)}
                  >
                    <Text
                      style={[
                        styles.smallPillText,
                        isSelected && styles.smallPillTextActive,
                      ]}
                    >
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Movement Type */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Horology Movement</Text>
            <View style={styles.filterPillsWrap}>
              {MOVEMENTS.map((mov) => {
                const isSelected = filters.selectedMovement === mov;
                return (
                  <TouchableOpacity
                    key={mov}
                    style={[styles.smallPill, isSelected && styles.smallPillActive]}
                    onPress={() => setSelectedMovement(mov)}
                  >
                    <Text
                      style={[
                        styles.smallPillText,
                        isSelected && styles.smallPillTextActive,
                      ]}
                    >
                      {mov}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Gender */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Target Style</Text>
            <View style={styles.filterPillsWrap}>
              {GENDERS.map((g) => {
                const isSelected = filters.selectedGender === g;
                return (
                  <TouchableOpacity
                    key={g}
                    style={[styles.smallPill, isSelected && styles.smallPillActive]}
                    onPress={() => setSelectedGender(g)}
                  >
                    <Text
                      style={[
                        styles.smallPillText,
                        isSelected && styles.smallPillTextActive,
                      ]}
                    >
                      {g}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      )}

      {/* Result Count Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.resultCountText}>
          Showing <Text style={styles.resultCountHighlight}>{filteredWatches.length}</Text> timepieces
          {filters.selectedBrand !== 'All' && ` in ${filters.selectedBrand}`}
          {filters.searchQuery && ` matching "${filters.searchQuery}"`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 1400,
    marginHorizontal: 'auto' as any,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  brandRibbonWrap: {
    marginBottom: 12,
  },
  brandTabsScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  brandTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0D1017',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
  },
  brandTabActive: {
    backgroundColor: 'rgba(201, 162, 77, 0.18)',
    borderColor: '#C9A24D',
  },
  brandTabText: {
    color: '#94A3B8',
    fontSize: 12.5,
    fontWeight: '600',
  },
  brandTabTextActive: {
    color: '#FFF3B0',
    fontWeight: '800',
  },
  countPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 99,
  },
  countPillActive: {
    backgroundColor: '#C9A24D',
  },
  countPillText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '700',
  },
  countPillTextActive: {
    color: '#07080A',
    fontWeight: '900',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    position: 'relative',
    backgroundColor: 'rgba(18, 24, 38, 0.5)',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  categoriesScroll: {
    flexDirection: 'row',
    gap: 6,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  categoryPillActive: {
    backgroundColor: '#C9A24D',
  },
  categoryPillText: {
    color: '#94A3B8',
    fontSize: 11.5,
    fontWeight: '600',
  },
  categoryPillTextActive: {
    color: '#07080A',
    fontWeight: '800',
  },
  rightControlsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  filterToggleBtnActive: {
    backgroundColor: 'rgba(201, 162, 77, 0.2)',
    borderColor: '#C9A24D',
  },
  filterToggleText: {
    color: '#CBD5E1',
    fontSize: 11.5,
    fontWeight: '600',
  },
  filterToggleTextActive: {
    color: '#FFF3B0',
    fontWeight: '800',
  },
  activeFiltersBadge: {
    backgroundColor: '#E61E2A',
    width: 16,
    height: 16,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFiltersBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  sortBtnText: {
    color: '#F8FAFC',
    fontSize: 11.5,
    fontWeight: '600',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  resetBtnText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '700',
  },
  sortDropdown: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: '#121824',
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 77, 0.3)',
    borderRadius: 12,
    padding: 6,
    width: 220,
    zIndex: 100,
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },
  sortItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
  },
  sortItemActive: {
    backgroundColor: 'rgba(201, 162, 77, 0.15)',
  },
  sortItemText: {
    color: '#94A3B8',
    fontSize: 11.5,
    fontWeight: '500',
  },
  sortItemTextActive: {
    color: '#FFF3B0',
    fontWeight: '700',
  },
  advancedFilterPanel: {
    backgroundColor: '#0D1017',
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 77, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    gap: 14,
  },
  filterSection: {
    gap: 6,
  },
  filterSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#C9A24D',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  filterPillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  smallPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  smallPillActive: {
    backgroundColor: 'rgba(201, 162, 77, 0.2)',
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
  statusBar: {
    marginTop: 10,
    paddingHorizontal: 4,
  },
  resultCountText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  resultCountHighlight: {
    color: '#FFF3B0',
    fontWeight: '800',
  },
});
