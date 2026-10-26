import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Plus, 
  Minus, 
  Tag, 
  CheckCircle2, 
  Truck 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotalPKR,
    cartDiscountPKR,
    cartShippingPKR,
    cartTotalPKR,
    freeShippingThresholdPKR,
    formatPrice,
    discountCode,
    discountPercent,
    applyDiscountCode,
    removeDiscountCode,
    navigateTo,
  } = useShop();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; error?: boolean } | null>(null);

  if (!isCartDrawerOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyDiscountCode(promoInput);
    setPromoMessage({ text: res.message, error: !res.success });
    if (res.success) {
      setPromoInput('');
    }
  };

  const amountNeededForFreeShipping = Math.max(0, freeShippingThresholdPKR - cartSubtotalPKR);
  const shippingProgress = Math.min(100, Math.round((cartSubtotalPKR / freeShippingThresholdPKR) * 100));

  const handleCheckoutClick = () => {
    setIsCartDrawerOpen(false);
    navigateTo('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-[#F8F6F1] dark:bg-[#1A1A1C] text-[#111111] dark:text-[#F8F6F1] shadow-2xl flex flex-col z-10 border-l border-stone-200 dark:border-stone-800 animate-in slide-in-from-right duration-250">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#111111] dark:text-[#C6A56B]" />
            <h2 
              className="text-xl font-light text-[#111111] dark:text-[#F8F6F1]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Shopping Bag
            </h2>
            <span className="text-xs font-mono font-bold text-stone-500">
              ({cart.length})
            </span>
          </div>

          <button
            onClick={() => setIsCartDrawerOpen(false)}
            aria-label="Close bag drawer"
            className="w-11 h-11 flex items-center justify-center text-stone-500 hover:text-black dark:hover:text-white transition-colors touch-target"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Strip */}
        <div className="px-4 sm:px-6 py-2.5 bg-stone-200/60 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between text-xs mb-1 font-medium text-stone-700 dark:text-stone-300">
            <span className="flex items-center gap-1.5 truncate">
              <Truck size={14} className="text-[#C6A56B] shrink-0" />
              {amountNeededForFreeShipping === 0 ? (
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold truncate">
                  Complimentary White-Glove Delivery unlocked
                </span>
              ) : (
                <span className="truncate">
                  Add <strong className="font-mono text-black dark:text-white">{formatPrice(amountNeededForFreeShipping)}</strong> for Free Delivery
                </span>
              )}
            </span>
            <span className="font-mono text-[11px] text-stone-500 ml-2">{shippingProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#111111] dark:bg-[#C6A56B] transition-all duration-500"
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        {cart.length > 0 ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-stone-200 dark:divide-stone-800">
            {cart.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-3 sm:gap-4">
                {/* Thumbnail */}
                <div 
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigateTo('product-detail', { productId: item.product.id });
                  }}
                  className="w-18 h-22 sm:w-20 sm:h-24 bg-stone-200 dark:bg-stone-800 rounded-xs shrink-0 overflow-hidden cursor-pointer"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 
                        onClick={() => {
                          setIsCartDrawerOpen(false);
                          navigateTo('product-detail', { productId: item.product.id });
                        }}
                        className="text-xs font-semibold text-stone-900 dark:text-stone-100 hover:text-[#C6A56B] cursor-pointer line-clamp-1"
                      >
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-rose-600 transition-colors -mr-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
                      <span>Size: <strong className="text-stone-800 dark:text-stone-200 font-mono">{item.selectedSize}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <span 
                          className="w-2 h-2 rounded-full border border-stone-300"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        <span>{item.selectedColor.name}</span>
                      </span>
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between pt-2">
                    {/* Touch Stepper (44px tap targets) */}
                    <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded bg-white dark:bg-[#202023]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white touch-target"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-2 text-xs font-mono font-medium text-stone-900 dark:text-stone-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white touch-target"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-[#111111] dark:text-[#F8F6F1] font-mono tabular-nums">
                      {formatPrice(item.product.pricePKR * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-stone-400">
              <ShoppingBag size={24} strokeWidth={1.5} />
            </div>
            <h3 
              className="text-lg font-light text-[#111111] dark:text-[#F8F6F1]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Your Shopping Bag is Empty
            </h3>
            <p className="text-xs text-stone-500 max-w-xs">
              Explore our latest Haute Prêt-à-Porter arrivals and curate your seasonal wardrobe.
            </p>
            <button
              onClick={() => {
                setIsCartDrawerOpen(false);
                navigateTo('catalog', { category: 'all' });
              }}
              className="mt-2 min-h-[44px] px-6 py-2.5 bg-[#111111] dark:bg-[#C6A56B] text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-[#C6A56B] transition-colors touch-target"
            >
              Discover Collection
            </button>
          </div>
        )}

        {/* Drawer Bottom Valuation & Checkout CTA */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-[#1F1F23]/80 space-y-3">
            {/* Promo Code Form */}
            <div>
              {discountPercent > 0 ? (
                <div className="flex items-center justify-between p-2 bg-stone-100 dark:bg-stone-800 rounded text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                    <span className="truncate">
                      Code <strong className="font-mono">{discountCode}</strong> applied ({discountPercent}% off)
                    </span>
                  </div>
                  <button
                    onClick={removeDiscountCode}
                    className="text-stone-400 hover:text-rose-600 text-[11px] underline ml-2 shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Code (e.g. ZAVIK10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="w-full pl-8 pr-2.5 min-h-[38px] text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#1A1A1C] rounded font-mono uppercase focus:outline-none focus:border-black"
                    />
                  </div>
                  <button
                    type="submit"
                    className="min-h-[38px] px-3.5 bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-900 hover:text-white transition-colors text-xs uppercase tracking-wider font-semibold rounded touch-target"
                  >
                    Apply
                  </button>
                </form>
              )}

              {promoMessage && (
                <p className={`text-[11px] mt-1 ${promoMessage.error ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {promoMessage.text}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs pt-1">
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">{formatPrice(cartSubtotalPKR)}</span>
              </div>

              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                  <span>Privilege Discount ({discountPercent}%)</span>
                  <span className="font-mono tabular-nums">-{formatPrice(cartDiscountPKR)}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>White-Glove Shipping</span>
                <span className="font-mono tabular-nums">
                  {cartShippingPKR === 0 ? (
                    <span className="text-emerald-700 dark:text-emerald-400 uppercase font-semibold text-[10px]">Complimentary</span>
                  ) : (
                    formatPrice(cartShippingPKR)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-stone-900 dark:text-stone-100 font-bold text-sm pt-2 border-t border-stone-200 dark:border-stone-800">
                <span>Estimated Total</span>
                <span className="font-mono tabular-nums text-black dark:text-white">{formatPrice(cartTotalPKR)}</span>
              </div>
            </div>

            {/* Checkout Action (48px touch target) */}
            <button
              onClick={handleCheckoutClick}
              className="w-full min-h-[48px] bg-[#111111] dark:bg-[#C6A56B] text-[#F8F6F1] dark:text-[#111111] text-xs uppercase tracking-[0.2em] font-bold rounded hover:bg-[#C6A56B] hover:text-[#111111] dark:hover:bg-white transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.99] touch-target"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
