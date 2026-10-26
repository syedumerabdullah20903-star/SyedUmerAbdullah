import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, navigateTo, formatPrice } = useShop();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [query]);

  const popularSearches = [
    'Blazer',
    'Silk Gown',
    'Italian Loafers',
    'Cashmere',
    'Poplin Shirt',
    'Trench Coat',
  ];

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setIsSearchOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative min-h-screen flex items-start justify-center p-4 sm:p-6 md:p-12">
        <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-lg shadow-2xl border border-stone-200 overflow-hidden my-8 z-10 animate-in fade-in zoom-in-95 duration-200">
          {/* Search Header */}
          <div className="p-4 sm:p-6 border-b border-stone-200 flex items-center gap-3">
            <Search size={20} className="text-[#A88756] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search garments, tailoring, footwear or silk editions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-stone-400 hover:text-black p-1"
                aria-label="Clear query"
              >
                <X size={16} />
              </button>
            )}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="text-stone-500 hover:text-black text-xs uppercase tracking-wider font-semibold pl-2 border-l border-stone-200"
            >
              Esc
            </button>
          </div>

          {/* Quick Suggestions / Results */}
          <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
            {!query.trim() ? (
              <div className="space-y-4">
                <p className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-3">
                <p className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-2">
                  {searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'} Found
                </p>
                <div className="divide-y divide-stone-200">
                  {searchResults.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigateTo('product-detail', { productId: p.id });
                      }}
                      className="py-3 flex items-center justify-between gap-4 hover:bg-stone-100/70 p-2 rounded cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-12 h-14 object-cover rounded bg-stone-200"
                        />
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
                            {p.subCategory}
                          </p>
                          <h4 className="text-xs font-semibold text-stone-900 group-hover:text-[#A88756] transition-colors">
                            {p.name}
                          </h4>
                          <span className="text-xs font-mono font-semibold text-stone-800 tabular-nums">
                            {formatPrice(p.pricePKR)}
                          </span>
                        </div>
                      </div>

                      <ArrowRight size={14} className="text-stone-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-stone-500 space-y-2">
                <p className="text-sm">No atelier pieces matched "{query}"</p>
                <p className="text-xs text-stone-400">
                  Try checking your spelling or search for "blazer", "dress", or "shoes".
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
