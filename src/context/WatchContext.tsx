import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Watch, WatchBrand, WatchCategory, WatchGender, WatchMovement, Currency } from '../types';
import { getStoredWatches, saveStoredWatches, resetStoredWatchesToDefault, CURRENCIES } from '../services/storage';

interface WatchFilterState {
  searchQuery: string;
  selectedBrand: WatchBrand | 'All';
  selectedCategory: WatchCategory | 'All';
  selectedGender: WatchGender | 'All';
  selectedMovement: WatchMovement | 'All';
  priceRange: [number, number];
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'name';
}

interface WatchContextType {
  watches: Watch[];
  filteredWatches: Watch[];
  filters: WatchFilterState;
  selectedWatch: Watch | null;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (usdAmount: number) => string;
  convertPrice: (usdAmount: number) => number;
  setSearchQuery: (query: string) => void;
  setSelectedBrand: (brand: WatchBrand | 'All') => void;
  setSelectedCategory: (cat: WatchCategory | 'All') => void;
  setSelectedGender: (gender: WatchGender | 'All') => void;
  setSelectedMovement: (movement: WatchMovement | 'All') => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sort: WatchFilterState['sortBy']) => void;
  resetFilters: () => void;
  openWatchDetail: (watch: Watch) => void;
  closeWatchDetail: () => void;
  addWatch: (watchData: Omit<Watch, 'id' | 'createdAt'>) => Watch;
  updateWatch: (id: string, watchData: Partial<Watch>) => void;
  deleteWatch: (id: string) => void;
  resetCatalogToDefault: () => void;
  getBrandCount: (brand: string) => number;
}

const initialFilters: WatchFilterState = {
  searchQuery: '',
  selectedBrand: 'All',
  selectedCategory: 'All',
  selectedGender: 'All',
  selectedMovement: 'All',
  priceRange: [0, 50000],
  sortBy: 'featured',
};

const WatchContext = createContext<WatchContextType | undefined>(undefined);

export const WatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watches, setWatches] = useState<Watch[]>([]);
  const [filters, setFilters] = useState<WatchFilterState>(initialFilters);
  const [selectedWatch, setSelectedWatch] = useState<Watch | null>(null);
  const [currency, setCurrency] = useState<Currency>('USD');

  useEffect(() => {
    const loaded = getStoredWatches();
    setWatches(loaded);
  }, []);

  const formatPrice = (usdAmount: number): string => {
    const curr = CURRENCIES[currency] || CURRENCIES.USD;
    return curr.format(usdAmount);
  };

  const convertPrice = (usdAmount: number): number => {
    const curr = CURRENCIES[currency] || CURRENCIES.USD;
    return Math.round(usdAmount * curr.rate);
  };

  const setSearchQuery = (query: string) => setFilters((prev) => ({ ...prev, searchQuery: query }));
  const setSelectedBrand = (brand: WatchBrand | 'All') => setFilters((prev) => ({ ...prev, selectedBrand: brand }));
  const setSelectedCategory = (cat: WatchCategory | 'All') => setFilters((prev) => ({ ...prev, selectedCategory: cat }));
  const setSelectedGender = (gender: WatchGender | 'All') => setFilters((prev) => ({ ...prev, selectedGender: gender }));
  const setSelectedMovement = (mov: WatchMovement | 'All') => setFilters((prev) => ({ ...prev, selectedMovement: mov }));
  const setPriceRange = (range: [number, number]) => setFilters((prev) => ({ ...prev, priceRange: range }));
  const setSortBy = (sort: WatchFilterState['sortBy']) => setFilters((prev) => ({ ...prev, sortBy: sort }));

  const resetFilters = () => setFilters(initialFilters);

  const openWatchDetail = (watch: Watch) => setSelectedWatch(watch);
  const closeWatchDetail = () => setSelectedWatch(null);

  const addWatch = (watchData: Omit<Watch, 'id' | 'createdAt'>): Watch => {
    const newWatch: Watch = {
      ...watchData,
      id: 'vlt-custom-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newWatch, ...watches];
    setWatches(updated);
    saveStoredWatches(updated);
    return newWatch;
  };

  const updateWatch = (id: string, watchData: Partial<Watch>) => {
    const updated = watches.map((w) => (w.id === id ? { ...w, ...watchData } : w));
    setWatches(updated);
    saveStoredWatches(updated);
    if (selectedWatch && selectedWatch.id === id) {
      setSelectedWatch({ ...selectedWatch, ...watchData });
    }
  };

  const deleteWatch = (id: string) => {
    const updated = watches.filter((w) => w.id !== id);
    setWatches(updated);
    saveStoredWatches(updated);
    if (selectedWatch && selectedWatch.id === id) {
      setSelectedWatch(null);
    }
  };

  const resetCatalogToDefault = () => {
    const defaults = resetStoredWatchesToDefault();
    setWatches(defaults);
  };

  const getBrandCount = (brand: string): number => {
    if (brand === 'All') return watches.length;
    return watches.filter((w) => w.brand.toLowerCase() === brand.toLowerCase()).length;
  };

  const filteredWatches = useMemo(() => {
    return watches
      .filter((w) => {
        // Brand filter
        if (filters.selectedBrand !== 'All' && w.brand.toLowerCase() !== filters.selectedBrand.toLowerCase()) {
          return false;
        }
        // Category filter
        if (filters.selectedCategory !== 'All' && w.category !== filters.selectedCategory) {
          return false;
        }
        // Gender filter
        if (filters.selectedGender !== 'All' && w.gender !== filters.selectedGender && w.gender !== 'Unisex') {
          return false;
        }
        // Movement filter
        if (filters.selectedMovement !== 'All' && w.movement !== filters.selectedMovement) {
          return false;
        }
        // Price filter
        if (w.price < filters.priceRange[0] || w.price > filters.priceRange[1]) {
          return false;
        }
        // Search filter
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase().trim();
          const matchesName = w.name.toLowerCase().includes(q);
          const matchesBrand = w.brand.toLowerCase().includes(q);
          const matchesRef = w.modelRef.toLowerCase().includes(q);
          const matchesDesc = w.description.toLowerCase().includes(q);
          const matchesTags = w.tags?.some((t) => t.toLowerCase().includes(q));
          if (!matchesName && !matchesBrand && !matchesRef && !matchesDesc && !matchesTags) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'name':
            return a.name.localeCompare(b.name);
          case 'featured':
          default:
            if (a.isFeatured && !b.isFeatured) return -1;
            if (!a.isFeatured && b.isFeatured) return 1;
            return (b.rating || 0) - (a.rating || 0);
        }
      });
  }, [watches, filters]);

  return (
    <WatchContext.Provider
      value={{
        watches,
        filteredWatches,
        filters,
        selectedWatch,
        currency,
        setCurrency,
        formatPrice,
        convertPrice,
        setSearchQuery,
        setSelectedBrand,
        setSelectedCategory,
        setSelectedGender,
        setSelectedMovement,
        setPriceRange,
        setSortBy,
        resetFilters,
        openWatchDetail,
        closeWatchDetail,
        addWatch,
        updateWatch,
        deleteWatch,
        resetCatalogToDefault,
        getBrandCount,
      }}
    >
      {children}
    </WatchContext.Provider>
  );
};

export const useWatches = () => {
  const context = useContext(WatchContext);
  if (!context) throw new Error('useWatches must be used within a WatchProvider');
  return context;
};
