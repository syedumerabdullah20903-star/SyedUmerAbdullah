import React, { useState, useMemo, useRef } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Ruler, 
  AlertCircle, 
  Plus, 
  Minus,
  Check,
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';
import { ProductColor } from '../types';

interface ProductDetailPageProps {
  productId: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId }) => {
  const { 
    formatPrice, 
    addToCart, 
    isInWishlist, 
    toggleWishlist, 
    navigateTo, 
    openSizeGuide,
    openSizePredictor
  } = useShop();

  const product = useMemo(() => {
    return PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];
  }, [productId]);

  // Gallery Active Image
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Selected Variant States
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [sizeError, setSizeError] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'care' | 'shipping'>('details');

  const isWishlisted = isInWishlist(product.id);

  // Curated Related Products
  const relatedProducts = useMemo(() => {
    return PRODUCTS.filter(
      (p) => p.id !== product.id && (p.category === product.category || p.featured)
    ).slice(0, 4);
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      // Scroll to size selector smoothly
      const el = document.getElementById('size-selector-anchor');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSizeError(false);
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    if (sizeError) setSizeError(false);
  };

  return (
    <div className="py-4 sm:py-8 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-28 lg:pb-12">
      {/* Mobile-Friendly Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mb-4 sm:mb-8 overflow-x-auto no-scrollbar whitespace-nowrap py-1">
        <button onClick={() => navigateTo('home')} className="hover:text-black dark:hover:text-white py-1">
          Home
        </button>
        <ChevronRight size={11} />
        <button 
          onClick={() => navigateTo('catalog', { category: product.category })} 
          className="capitalize hover:text-black dark:hover:text-white py-1"
        >
          {product.category}
        </button>
        <ChevronRight size={11} />
        <span className="text-stone-900 dark:text-stone-100 font-medium truncate max-w-[140px] sm:max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-16">
        {/* Gallery Section */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-3 sm:gap-4">
          {/* Desktop/Tablet Thumbnails Column */}
          {product.images.length > 1 && (
            <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-h-[600px] shrink-0 no-scrollbar py-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-14 h-18 sm:w-18 sm:h-22 bg-stone-100 dark:bg-stone-800 rounded-xs overflow-hidden border-2 transition-all shrink-0 touch-target ${
                    activeImageIndex === idx ? 'border-black dark:border-white' : 'border-transparent opacity-75'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} angle ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Image Showcase with swipe/touch arrows */}
          <div className="relative flex-1 aspect-[3/4] bg-stone-100 dark:bg-stone-800 rounded-sm overflow-hidden group">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-transform duration-500"
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

            {/* Mobile Image Navigation Arrows (44px hitboxes) */}
            {product.images.length > 1 && (
              <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none md:hidden">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : product.images.length - 1));
                  }}
                  className="w-10 h-10 rounded-full bg-black/40 text-white backdrop-blur-sm flex items-center justify-center pointer-events-auto touch-target"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev < product.images.length - 1 ? prev + 1 : 0));
                  }}
                  className="w-10 h-10 rounded-full bg-black/40 text-white backdrop-blur-sm flex items-center justify-center pointer-events-auto touch-target"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* Mobile Pagination Dots */}
            {product.images.length > 1 && (
              <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 md:hidden pointer-events-none">
                {product.images.map((_, i) => (
                  <span
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeImageIndex === i ? 'bg-white w-4' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}

            {product.badge && (
              <span className="absolute top-3 left-3 bg-[#111111]/90 dark:bg-black/90 text-white text-[9px] sm:text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 font-semibold rounded-xs pointer-events-none">
                {product.badge}
              </span>
            )}
          </div>
        </div>

        {/* Purchase Module */}
        <div className="lg:col-span-5 flex flex-col justify-start space-y-5">
          {/* Title & Rating */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] sm:text-xs tracking-[0.2em] uppercase text-stone-500 dark:text-stone-400 font-semibold">
              <span>{product.subCategory}</span>
              <div className="flex items-center gap-1 text-stone-800 dark:text-stone-200">
                <span className="text-[#C6A56B]">★</span>
                <span className="font-mono text-xs">{product.rating}</span>
                <span className="text-stone-400">({product.reviewCount})</span>
              </div>
            </div>

            <h1 
              className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#111111] dark:text-[#F8F6F1] tracking-tight leading-tight pt-1"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {product.name}
            </h1>
          </div>

          {/* Price Row */}
          <div className="flex items-baseline gap-3 pt-1 border-b border-stone-200 dark:border-stone-800 pb-4">
            <span className="text-2xl sm:text-3xl font-bold text-[#111111] dark:text-[#F8F6F1] font-mono tabular-nums">
              {formatPrice(product.pricePKR)}
            </span>
            {product.originalPricePKR && (
              <span className="text-base text-stone-400 dark:text-stone-500 line-through font-mono tabular-nums">
                {formatPrice(product.originalPricePKR)}
              </span>
            )}
            {product.originalPricePKR && (
              <span className="text-xs uppercase tracking-wider text-rose-600 dark:text-rose-400 font-semibold">
                Privilege Offer
              </span>
            )}
          </div>

          {/* Short Narrative */}
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-light">
            {product.shortDescription}
          </p>

          {/* Color Selector (Touch-friendly 44px min tap area) */}
          <div className="space-y-2 pt-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-900 dark:text-stone-100 block">
              Color: <span className="text-stone-500 dark:text-stone-400 font-normal">{selectedColor.name}</span>
            </span>
            <div className="flex items-center gap-2">
              {product.colors.map((color) => {
                const isSelected = selectedColor.name === color.name;
                return (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select color ${color.name}`}
                    className={`w-11 h-11 flex items-center justify-center rounded-full transition-transform touch-target ${
                      isSelected ? 'ring-2 ring-black dark:ring-white ring-offset-2 dark:ring-offset-stone-900' : 'hover:scale-105'
                    }`}
                  >
                    <span
                      className="w-7 h-7 rounded-full border border-stone-300 dark:border-stone-600 flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && (
                        <Check 
                          size={13} 
                          className={color.hex.toLowerCase() === '#ffffff' || color.hex.toLowerCase() === '#f9f9f9' ? 'text-black' : 'text-white'} 
                        />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selector with AI Predictor & Size Guide triggers */}
          <div id="size-selector-anchor" className="space-y-2.5 pt-1">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="uppercase tracking-wider font-semibold text-stone-900 dark:text-stone-100">
                Select Size <span className="text-rose-600">*</span>
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => openSizePredictor(product, (predictedSize) => handleSizeSelect(predictedSize))}
                  className="min-h-[40px] text-xs font-semibold text-[#111111] dark:text-[#F8F6F1] hover:text-[#C6A56B] flex items-center gap-1.5 transition-colors group touch-target"
                >
                  <Sparkles size={14} className="text-[#C6A56B] group-hover:scale-110 transition-transform" />
                  <span className="underline decoration-[#C6A56B] underline-offset-2 font-bold">
                    AI Size Predictor
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => openSizeGuide(product.category)}
                  className="min-h-[40px] text-stone-500 dark:text-stone-400 hover:text-black dark:hover:text-white underline flex items-center gap-1 tracking-wide touch-target"
                >
                  <Ruler size={13} />
                  <span>Size Guide</span>
                </button>
              </div>
            </div>

            {/* 44px+ Touch Buttons for Sizes */}
            <div className="grid grid-cols-4 gap-2">
              {product.sizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeSelect(size)}
                    className={`min-h-[44px] py-2.5 text-xs uppercase tracking-wider font-semibold rounded border transition-all font-mono text-center touch-target ${
                      isSelected
                        ? 'bg-[#111111] dark:bg-[#C6A56B] text-white border-transparent font-bold shadow-xs'
                        : 'bg-white dark:bg-[#1A1A1C] border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            {/* Validation Feedback */}
            {sizeError && (
              <div className="flex items-center gap-2 p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs rounded">
                <AlertCircle size={15} className="shrink-0" />
                <span>Please select your tailored size before adding to your shopping bag.</span>
              </div>
            )}
          </div>

          {/* Quantity Selector & Stock Info */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded bg-white dark:bg-[#1A1A1C]">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="w-11 h-11 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:text-black disabled:opacity-30 touch-target"
              >
                <Minus size={14} />
              </button>
              <span className="px-3 text-xs font-mono font-semibold text-stone-900 dark:text-stone-100">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                disabled={quantity >= product.stockCount}
                aria-label="Increase quantity"
                className="w-11 h-11 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:text-black disabled:opacity-30 touch-target"
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>In Stock ({product.stockCount} in Atelier)</span>
            </div>
          </div>

          {/* Primary Action Buttons (Desktop inline, mobile has sticky bar below) */}
          <div className="pt-2 space-y-2.5">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full min-h-[48px] py-3.5 bg-[#111111] dark:bg-[#C6A56B] text-[#F8F6F1] dark:text-[#111111] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#C6A56B] hover:text-[#111111] dark:hover:bg-white transition-all flex items-center justify-center gap-2.5 shadow-md active:scale-[0.99] touch-target"
            >
              <ShoppingBag size={16} />
              <span>Add To Shopping Bag</span>
            </button>

            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className="w-full min-h-[44px] py-2.5 border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#1A1A1C] text-stone-800 dark:text-stone-200 text-xs uppercase tracking-wider font-medium hover:border-black dark:hover:border-white transition-colors flex items-center justify-center gap-2 touch-target"
            >
              <Heart
                size={16}
                className={isWishlisted ? 'fill-[#C6A56B] text-[#C6A56B]' : ''}
              />
              <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </div>

          {/* Service Guarantees */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 grid grid-cols-3 gap-2 text-center text-stone-600 dark:text-stone-400">
            <div className="space-y-0.5">
              <Truck size={17} className="mx-auto text-stone-800 dark:text-stone-200" />
              <p className="text-[10px] uppercase font-semibold text-stone-900 dark:text-stone-100">Complimentary</p>
              <p className="text-[9px] text-stone-400">Over Rs. 15,000</p>
            </div>
            <div className="space-y-0.5">
              <RotateCcw size={17} className="mx-auto text-stone-800 dark:text-stone-200" />
              <p className="text-[10px] uppercase font-semibold text-stone-900 dark:text-stone-100">14-Day Returns</p>
              <p className="text-[9px] text-stone-400">Free Exchanges</p>
            </div>
            <div className="space-y-0.5">
              <ShieldCheck size={17} className="mx-auto text-stone-800 dark:text-stone-200" />
              <p className="text-[10px] uppercase font-semibold text-stone-900 dark:text-stone-100">Guaranteed</p>
              <p className="text-[9px] text-stone-400">Noble Fibers</p>
            </div>
          </div>

          {/* Information Tabs */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
            <div className="flex border-b border-stone-200 dark:border-stone-800 gap-4 text-xs uppercase tracking-wider font-semibold overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`min-h-[40px] pb-2 border-b-2 whitespace-nowrap transition-colors touch-target ${
                  activeTab === 'details' ? 'border-black dark:border-white text-black dark:text-white font-bold' : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                Description
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('materials')}
                className={`min-h-[40px] pb-2 border-b-2 whitespace-nowrap transition-colors touch-target ${
                  activeTab === 'materials' ? 'border-black dark:border-white text-black dark:text-white font-bold' : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                Materials
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('care')}
                className={`min-h-[40px] pb-2 border-b-2 whitespace-nowrap transition-colors touch-target ${
                  activeTab === 'care' ? 'border-black dark:border-white text-black dark:text-white font-bold' : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                Care
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('shipping')}
                className={`min-h-[40px] pb-2 border-b-2 whitespace-nowrap transition-colors touch-target ${
                  activeTab === 'shipping' ? 'border-black dark:border-white text-black dark:text-white font-bold' : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                Delivery
              </button>
            </div>

            <div className="pt-3 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              {activeTab === 'details' && <p>{product.description}</p>}
              {activeTab === 'materials' && <p>{product.materials}</p>}
              {activeTab === 'care' && <p>{product.careInstructions}</p>}
              {activeTab === 'shipping' && (
                <p>
                  Delivered in archival garment bags with signature presentation boxes. Standard white-glove transport takes 3-4 business days.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Recommendation */}
      <div className="mt-16 sm:mt-24 pt-8 sm:pt-12 border-t border-stone-200 dark:border-stone-800">
        <div className="text-center mb-6 sm:mb-10">
          <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-[#C6A56B] font-semibold">
            Complete The Look
          </span>
          <h2 
            className="text-2xl sm:text-3xl text-[#111111] dark:text-[#F8F6F1] font-light mt-1"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Curated Atelier Pairings
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM PURCHASE BAR (Thumb ergonomic reach) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-[#F8F6F1]/95 dark:bg-[#1A1A1C]/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 p-3 z-30 shadow-xl flex items-center justify-between gap-3">
        <div className="flex flex-col shrink-0">
          <span className="text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400">
            {selectedSize ? `Size: ${selectedSize}` : 'Pick Size'}
          </span>
          <span className="text-base font-bold text-stone-900 dark:text-stone-100 font-mono tabular-nums">
            {formatPrice(product.pricePKR)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 min-h-[46px] bg-[#111111] dark:bg-[#C6A56B] text-white dark:text-[#111111] text-xs uppercase tracking-[0.18em] font-bold rounded hover:bg-[#C6A56B] transition-colors flex items-center justify-center gap-2 touch-target shadow-md active:scale-[0.98]"
        >
          <ShoppingBag size={15} />
          <span>Add To Bag</span>
        </button>
      </div>
    </div>
  );
};
