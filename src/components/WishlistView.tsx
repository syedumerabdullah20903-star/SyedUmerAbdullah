import React from 'react';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';

export const WishlistView: React.FC = () => {
  const { wishlist, navigateTo } = useShop();

  const savedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#A88756] font-semibold">
          Saved Atelier Pieces
        </span>
        <h1 
          className="text-3xl sm:text-4xl text-[#0C0C0D] font-light mt-1 tracking-tight"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Your Personal Wishlist
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-2">
          Curated silhouettes and accessories reserved for your seasonal wardrobe considerations.
        </p>
      </div>

      {savedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {savedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white border border-stone-200 rounded-lg max-w-md mx-auto p-8 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400 mb-4">
            <Heart size={26} strokeWidth={1.5} />
          </div>
          <h3 
            className="text-xl text-[#0C0C0D] font-light"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            No Pieces in Wishlist
          </h3>
          <p className="text-xs text-stone-500 mt-2 mb-6">
            Tap the heart icon on any garment to preserve it in your personal atelier collection.
          </p>
          <button
            onClick={() => navigateTo('catalog', { category: 'all' })}
            className="px-6 py-3 bg-[#0C0C0D] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#D4AF37] hover:text-[#0C0C0D] transition-colors inline-flex items-center gap-2"
          >
            <span>Explore Boutique</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
