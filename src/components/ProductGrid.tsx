import React, { useState, useMemo } from 'react';
import { 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  ChevronDown 
} from 'lucide-react';
import { ProductCard } from './ProductCard';
import { PRODUCTS, SUB_CATEGORIES } from '../data/products';
import { useShop } from '../context/ShopContext';
import { CatalogFilterState } from '../types';

interface ProductGridProps {
  initialCategory?: 'all' | 'men' | 'women' | 'shoes';
  initialBadge?: 'all' | 'New Arrival' | 'Bestseller' | 'Sale';
  title?: string;
  subtitle?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  initialCategory = 'all',
  initialBadge = 'all',
  title,
  subtitle,
}) => {
  const { viewParams, formatPrice } = useShop();

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Filter State
  const [filters, setFilters] = useState<CatalogFilterState>({
    category: (viewParams.category as any) || initialCategory,
    subCategory: viewParams.subCategory || '',
    badge: (viewParams.badge as any) || initialBadge,
    selectedSizes: [],
    selectedColors: [],
    minPricePKR: 0,
    maxPricePKR: 60000,
    inStockOnly: false,
    searchQuery: '',
    sortBy: 'featured',
  });

  // Keep state synced if viewParams change
  React.useEffect(() => {
    if (viewParams.category) {
      setFilters((prev) => ({ ...prev, category: viewParams.category as any }));
    }
    if (viewParams.badge) {
      setFilters((prev) => ({ ...prev, badge: viewParams.badge as any }));
    }
    if (viewParams.subCategory) {
      setFilters((prev) => ({ ...prev, subCategory: viewParams.subCategory || '' }));
    }
  }, [viewParams.category, viewParams.badge, viewParams.subCategory]);

  // Derived subcategories for current category
  const availableSubCategories = useMemo(() => {
    if (filters.category === 'all') {
      return Array.from(new Set(PRODUCTS.map((p) => p.subCategory)));
    }
    return SUB_CATEGORIES[filters.category] || [];
  }, [filters.category]);

  // Available Sizes across active category
  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    PRODUCTS.forEach((p) => {
      if (filters.category === 'all' || p.category === filters.category) {
        p.sizes.forEach((s) => set.add(s));
      }
    });
    return Array.from(set);
  }, [filters.category]);

  // Available Colors
  const availableColors = useMemo(() => {
    const map = new Map<string, string>();
    PRODUCTS.forEach((p) => {
      p.colors.forEach((c) => map.set(c.name, c.hex));
    });
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, []);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }
      if (filters.subCategory && product.subCategory !== filters.subCategory) {
        return false;
      }
      if (filters.badge !== 'all' && product.badge !== filters.badge) {
        return false;
      }
      if (product.pricePKR < filters.minPricePKR || product.pricePKR > filters.maxPricePKR) {
        return false;
      }
      if (filters.selectedSizes.length > 0) {
        const hasSize = filters.selectedSizes.some((s) => product.sizes.includes(s));
        if (!hasSize) return false;
      }
      if (filters.selectedColors.length > 0) {
        const hasColor = filters.selectedColors.some((colorName) =>
          product.colors.some((c) => c.name === colorName)
        );
        if (!hasColor) return false;
      }
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCategory = product.subCategory.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory) return false;
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-low') {
        return a.pricePKR - b.pricePKR;
      }
      if (filters.sortBy === 'price-high') {
        return b.pricePKR - a.pricePKR;
      }
      if (filters.sortBy === 'newest') {
        return (b.badge === 'New Arrival' ? 1 : 0) - (a.badge === 'New Arrival' ? 1 : 0);
      }
      if (filters.sortBy === 'popularity') {
        return b.reviewCount - a.reviewCount;
      }
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.subCategory) count++;
    if (filters.badge !== 'all') count++;
    if (filters.selectedSizes.length > 0) count += filters.selectedSizes.length;
    if (filters.selectedColors.length > 0) count += filters.selectedColors.length;
    if (filters.minPricePKR > 0 || filters.maxPricePKR < 60000) count++;
    if (filters.inStockOnly) count++;
    return count;
  }, [filters]);

  const resetFilters = () => {
    setFilters({
      category: 'all',
      subCategory: '',
      badge: 'all',
      selectedSizes: [],
      selectedColors: [],
      minPricePKR: 0,
      maxPricePKR: 60000,
      inStockOnly: false,
      searchQuery: '',
      sortBy: 'featured',
    });
  };

  const toggleSize = (size: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedSizes: prev.selectedSizes.includes(size)
        ? prev.selectedSizes.filter((s) => s !== size)
        : [...prev.selectedSizes, size],
    }));
  };

  const toggleColor = (colorName: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedColors: prev.selectedColors.includes(colorName)
        ? prev.selectedColors.filter((c) => c !== colorName)
        : [...prev.selectedColors, colorName],
    }));
  };

  // Header Titles
  const getDisplayTitle = () => {
    if (title) return title;
    if (filters.badge === 'New Arrival') return 'New Atelier Arrivals';
    if (filters.badge === 'Sale') return 'Private Privilege Sale';
    if (filters.badge === 'Bestseller') return 'Iconic Bestsellers';
    if (filters.category === 'men') return "The Men's Collection";
    if (filters.category === 'women') return "The Women's Collection";
    if (filters.category === 'shoes') return 'Footwear & Loafers';
    return 'The Complete Collection';
  };

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* Title Header */}
      <div className="mb-6 sm:mb-8 text-center max-w-2xl mx-auto px-2">
        <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-[#C6A56B] font-semibold">
          ZAVIK Haute Edition
        </span>
        <h2 
          className="text-2xl sm:text-3xl lg:text-4xl text-[#111111] dark:text-[#F8F6F1] font-light mt-1 tracking-tight"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {getDisplayTitle()}
        </h2>
        <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-1 sm:mt-2">
          {subtitle || 'Discreet luxury aesthetics engineered with uncompromised natural fabrics and precision tailoring.'}
        </p>
      </div>

      {/* Mobile-First Sticky / Compact Filter & Sort Toolbar */}
      <div className="border-y border-stone-200 dark:border-stone-800 py-3 mb-5 flex items-center justify-between gap-2">
        {/* Category Segmented Scrollable Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {(['all', 'men', 'women', 'shoes'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilters((prev) => ({ ...prev, category: cat, subCategory: '' }))}
              className={`min-h-[38px] px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase rounded transition-colors whitespace-nowrap touch-target flex items-center justify-center ${
                filters.category === cat
                  ? 'bg-[#111111] dark:bg-[#C6A56B] text-[#F8F6F1]'
                  : 'text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white bg-stone-100 dark:bg-stone-800'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Right Controls: Filter Drawer Toggle & Sort Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="min-h-[38px] px-3 flex items-center gap-1.5 border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#1A1A1C] rounded text-xs font-semibold text-stone-800 dark:text-stone-200 hover:border-black transition-colors touch-target"
            aria-label="Open filter options"
          >
            <SlidersHorizontal size={14} />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#111111] dark:bg-[#C6A56B] text-white text-[10px] font-bold flex items-center justify-center font-mono">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
              aria-label="Sort products by"
              className="appearance-none bg-white dark:bg-[#1A1A1C] pl-2.5 pr-7 min-h-[38px] border border-stone-300 dark:border-stone-700 rounded text-xs font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:border-black cursor-pointer touch-target"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low-High</option>
              <option value="price-high">Price: High-Low</option>
              <option value="newest">Newest</option>
              <option value="popularity">Most Coveted</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Horizontal Sub-Category Chips (Touch-friendly scroll) */}
      {availableSubCategories.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 no-scrollbar">
          <button
            onClick={() => setFilters((prev) => ({ ...prev, subCategory: '' }))}
            className={`min-h-[34px] px-3 text-xs font-medium rounded-full border transition-colors whitespace-nowrap flex items-center ${
              filters.subCategory === ''
                ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-semibold'
                : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800/60'
            }`}
          >
            All Types
          </button>
          {availableSubCategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setFilters((prev) => ({ ...prev, subCategory: sub === filters.subCategory ? '' : sub }))}
              className={`min-h-[34px] px-3 text-xs font-medium rounded-full border transition-colors whitespace-nowrap flex items-center ${
                filters.subCategory === sub
                  ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-semibold'
                  : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800/60'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-5 text-xs text-stone-600 dark:text-stone-300">
          <span className="font-semibold text-stone-400 text-[11px] uppercase tracking-wider mr-1">Filters:</span>
          {filters.subCategory && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-200 dark:bg-stone-800 rounded-full text-xs">
              {filters.subCategory}
              <button onClick={() => setFilters((p) => ({ ...p, subCategory: '' }))} className="p-0.5">
                <X size={12} />
              </button>
            </span>
          )}
          {filters.badge !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-200 dark:bg-stone-800 rounded-full text-xs">
              {filters.badge}
              <button onClick={() => setFilters((p) => ({ ...p, badge: 'all' }))} className="p-0.5">
                <X size={12} />
              </button>
            </span>
          )}
          {filters.selectedSizes.map((s) => (
            <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-200 dark:bg-stone-800 rounded-full text-xs">
              {s}
              <button onClick={() => toggleSize(s)} className="p-0.5">
                <X size={12} />
              </button>
            </span>
          ))}
          <button
            onClick={resetFilters}
            className="text-[#C6A56B] hover:underline flex items-center gap-1 ml-2 text-xs font-semibold"
          >
            <RotateCcw size={12} />
            <span>Reset All</span>
          </button>
        </div>
      )}

      {/* Product Count Header */}
      <div className="mb-4 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
        <span>
          Showing <strong className="text-stone-900 dark:text-stone-100">{filteredProducts.length}</strong> atelier pieces
        </span>
      </div>

      {/* Mobile-First 2-Column Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-10">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center bg-white dark:bg-[#1A1A1C] border border-stone-200 dark:border-stone-800 rounded-lg max-w-sm mx-auto p-6 shadow-xs">
          <p 
            className="text-lg text-[#111111] dark:text-[#F8F6F1] font-light"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            No atelier garments match your current selection.
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
            Try adjusting your price range or clearing specific filter options.
          </p>
          <button
            onClick={resetFilters}
            className="mt-5 min-h-[44px] px-6 py-2.5 bg-[#111111] dark:bg-[#C6A56B] text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-stone-800 transition-colors touch-target"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Mobile Bottom-Sheet / Desktop Side-Drawer Filter Modal */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            onClick={() => setIsFilterDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
          />

          {/* Drawer container: Bottom Sheet on Mobile, Right Drawer on Desktop */}
          <div className="fixed inset-x-0 bottom-0 sm:inset-x-auto sm:inset-y-0 sm:right-0 max-h-[85vh] sm:max-h-none sm:max-w-sm w-full bg-[#F8F6F1] dark:bg-[#1A1A1C] text-[#111111] dark:text-[#F8F6F1] shadow-2xl flex flex-col z-10 rounded-t-2xl sm:rounded-none border-t sm:border-t-0 sm:border-l border-stone-200 dark:border-stone-800 animate-in slide-in-from-bottom sm:slide-in-from-right duration-250">
            {/* Mobile Drag Handle */}
            <div className="sm:hidden pt-3 pb-1 flex justify-center">
              <div className="w-12 h-1 bg-stone-300 dark:bg-stone-700 rounded-full" />
            </div>

            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div>
                <h3 
                  className="text-xl font-light text-[#111111] dark:text-[#F8F6F1]"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Filter Atelier Pieces
                </h3>
                <span className="text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Refine by Cut, Sizing & Price
                </span>
              </div>
              <button 
                onClick={() => setIsFilterDrawerOpen(false)}
                className="w-11 h-11 flex items-center justify-center text-stone-500 hover:text-black dark:hover:text-white transition-colors touch-target"
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>

            {/* Filter Content Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Editions */}
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-stone-900 dark:text-stone-100 mb-2.5">
                  Edition
                </p>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'New Arrival', 'Bestseller', 'Sale'] as const).map((b) => (
                    <button
                      key={b}
                      onClick={() => setFilters((p) => ({ ...p, badge: b }))}
                      className={`min-h-[38px] px-3.5 py-1.5 text-xs rounded border transition-colors touch-target ${
                        filters.badge === b
                          ? 'bg-[#111111] dark:bg-[#C6A56B] text-white border-transparent font-semibold'
                          : 'border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-black'
                      }`}
                    >
                      {b === 'all' ? 'All Editions' : b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs uppercase tracking-wider font-semibold text-stone-900 dark:text-stone-100">
                    Max Price
                  </p>
                  <span className="text-xs font-mono font-semibold text-black dark:text-white">
                    {formatPrice(filters.maxPricePKR)}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="60000"
                  step="2500"
                  value={filters.maxPricePKR}
                  onChange={(e) => setFilters((p) => ({ ...p, maxPricePKR: Number(e.target.value) }))}
                  className="w-full accent-[#111111] dark:accent-[#C6A56B] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
                  <span>{formatPrice(5000)}</span>
                  <span>{formatPrice(60000)}</span>
                </div>
              </div>

              {/* Sizes Filter (44px touch targets) */}
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-stone-900 dark:text-stone-100 mb-2.5">
                  Garment & Footwear Sizes
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {availableSizes.map((size) => {
                    const selected = filters.selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`min-h-[42px] py-2 text-xs rounded border transition-colors text-center font-mono touch-target ${
                          selected
                            ? 'bg-[#111111] dark:bg-[#C6A56B] text-white border-transparent font-bold'
                            : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-black'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* In-Stock Toggle */}
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
                <label className="min-h-[44px] flex items-center justify-between cursor-pointer touch-target">
                  <span className="text-xs uppercase tracking-wider font-semibold text-stone-900 dark:text-stone-100">
                    In Stock Pieces Only
                  </span>
                  <input
                    type="checkbox"
                    checked={filters.inStockOnly}
                    onChange={(e) => setFilters((p) => ({ ...p, inStockOnly: e.target.checked }))}
                    className="w-5 h-5 accent-[#111111] dark:accent-[#C6A56B] cursor-pointer rounded"
                  />
                </label>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-100/70 dark:bg-stone-900/70 flex items-center gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 min-h-[44px] py-2.5 text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 rounded hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors touch-target"
              >
                Reset All
              </button>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="flex-1 min-h-[44px] py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#111111] dark:bg-[#C6A56B] rounded hover:bg-stone-800 transition-colors touch-target"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
