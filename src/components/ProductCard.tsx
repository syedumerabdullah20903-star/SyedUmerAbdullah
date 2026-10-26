import React from 'react';
import { Heart, Plus } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    navigateTo, 
    formatPrice, 
    isInWishlist, 
    toggleWishlist,
    setQuickAddProduct
  } = useShop();

  const isWishlisted = isInWishlist(product.id);

  const handleCardClick = () => {
    navigateTo('product-detail', { productId: product.id });
  };

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickAddProduct(product);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer flex flex-col relative transition-all duration-200 select-none"
    >
      {/* Image Container (aspect 3/4) */}
      <div className="relative w-full aspect-[3/4] bg-stone-200/60 dark:bg-stone-800/60 overflow-hidden rounded-sm">
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out sm:group-hover:scale-105"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
            if (target.parentElement) {
              target.parentElement.classList.add(
                'bg-gradient-to-br',
                'from-stone-200',
                'to-stone-300',
                'dark:from-stone-800',
                'dark:to-stone-900'
              );
            }
          }}
        />

        {/* Badge (Clean unboxed luxury text) */}
        {product.badge && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#111111]/90 dark:bg-black/90 backdrop-blur-sm text-[#F8F6F1] text-[9px] sm:text-[10px] uppercase tracking-[0.16em] px-2 py-0.5 sm:px-2.5 sm:py-1 font-semibold rounded-xs pointer-events-none">
            {product.badge}
          </div>
        )}

        {/* Wishlist Button: 44x44px touch target for easy tapping on mobile */}
        <button
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute top-1 right-1 sm:top-2 sm:right-2 w-11 h-11 flex items-center justify-center text-stone-700 dark:text-stone-200 hover:text-black dark:hover:text-white transition-transform active:scale-90 z-10 touch-target"
        >
          <span className="w-8 h-8 rounded-full bg-white/85 dark:bg-black/75 backdrop-blur-md flex items-center justify-center shadow-xs">
            <Heart
              size={15}
              className={`transition-colors ${
                isWishlisted ? 'fill-[#C6A56B] text-[#C6A56B]' : 'text-stone-700 dark:text-stone-300'
              }`}
            />
          </span>
        </button>

        {/* Quick Add Button on Desktop Hover, or tap icon on Mobile */}
        <div className="absolute inset-x-2 bottom-2 hidden sm:block opacity-0 sm:group-hover:opacity-100 transition-all duration-200 transform translate-y-1 sm:group-hover:translate-y-0">
          <button
            onClick={handleQuickAddClick}
            className="w-full min-h-[38px] bg-[#111111]/95 dark:bg-[#202023]/95 text-[#F8F6F1] text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-[#C6A56B] hover:text-[#111111] transition-colors flex items-center justify-center gap-1.5 shadow-md"
          >
            <Plus size={13} />
            <span>Quick Select</span>
          </button>
        </div>
      </div>

      {/* Product Details (Zero-Pill clean typography) */}
      <div className="pt-2.5 sm:pt-3.5 flex flex-col space-y-1 flex-grow">
        {/* Category & Color indicators */}
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] tracking-[0.14em] uppercase text-stone-500 dark:text-stone-400 font-medium">
          <span className="truncate">{product.subCategory}</span>
          <div className="flex items-center gap-1 shrink-0 ml-1">
            {product.colors.slice(0, 3).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="w-2 h-2 rounded-full border border-stone-300 dark:border-stone-600 shadow-2xs"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        {/* Product Title */}
        <h3 className="text-xs sm:text-sm font-medium text-stone-900 dark:text-stone-100 sm:group-hover:text-[#C6A56B] transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Price Row with Tabular Numbers */}
        <div className="pt-0.5 flex flex-wrap items-baseline gap-1.5 sm:gap-2">
          <span className="text-xs sm:text-sm font-bold text-[#111111] dark:text-[#F8F6F1] font-mono tabular-nums">
            {formatPrice(product.pricePKR)}
          </span>
          {product.originalPricePKR && (
            <span className="text-[10px] sm:text-xs text-stone-400 dark:text-stone-500 line-through font-mono tabular-nums">
              {formatPrice(product.originalPricePKR)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
