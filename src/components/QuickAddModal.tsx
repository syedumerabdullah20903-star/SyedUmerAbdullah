import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Check, AlertCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductColor } from '../types';

export const QuickAddModal: React.FC = () => {
  const {
    quickAddProduct,
    setQuickAddProduct,
    addToCart,
    formatPrice,
  } = useShop();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (quickAddProduct) {
      setSelectedSize('');
      setSelectedColor(quickAddProduct.colors[0] || null);
      setError('');
    }
  }, [quickAddProduct]);

  if (!quickAddProduct) return null;

  const handleAdd = () => {
    if (!selectedSize) {
      setError('Please select a size before adding to your bag.');
      return;
    }
    if (!selectedColor) {
      setError('Please select a color.');
      return;
    }
    addToCart(quickAddProduct, selectedSize, selectedColor, 1);
    setQuickAddProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setQuickAddProduct(null)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-[#FAF8F5] rounded-lg shadow-2xl border border-stone-200 overflow-hidden z-10 p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <img
                src={quickAddProduct.images[0]}
                alt={quickAddProduct.name}
                className="w-14 h-18 object-cover rounded bg-stone-100"
              />
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                  {quickAddProduct.subCategory}
                </span>
                <h3 className="text-sm font-semibold text-stone-900 line-clamp-1">
                  {quickAddProduct.name}
                </h3>
                <p className="text-xs font-mono font-semibold text-[#0C0C0D] tabular-nums mt-0.5">
                  {formatPrice(quickAddProduct.pricePKR)}
                </p>
              </div>
            </div>

            <button
              onClick={() => setQuickAddProduct(null)}
              className="p-1 text-stone-400 hover:text-black"
            >
              <X size={18} />
            </button>
          </div>

          {/* Color Selector */}
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-900 block">
              Color: <span className="font-normal text-stone-600">{selectedColor?.name}</span>
            </span>
            <div className="flex items-center gap-2">
              {quickAddProduct.colors.map((color) => {
                const isSelected = selectedColor?.name === color.name;
                return (
                  <button
                    key={color.name}
                    onClick={() => {
                      setSelectedColor(color);
                      setError('');
                    }}
                    className={`relative w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isSelected ? 'ring-2 ring-black ring-offset-2' : 'hover:scale-110'
                    }`}
                  >
                    <span
                      className="w-full h-full rounded-full border border-stone-300"
                      style={{ backgroundColor: color.hex }}
                    />
                    {isSelected && (
                      <Check
                        size={12}
                        className={
                          color.hex.toLowerCase() === '#ffffff' || color.hex.toLowerCase() === '#f9f9f9'
                            ? 'text-black'
                            : 'text-white'
                        }
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-900 block">
              Size Selection <span className="text-rose-600">*</span>
            </span>
            <div className="grid grid-cols-4 gap-2">
              {quickAddProduct.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size);
                    setError('');
                  }}
                  className={`py-2 text-xs uppercase tracking-wider font-semibold rounded border transition-all font-mono ${
                    selectedSize === size
                      ? 'bg-[#0C0C0D] text-white border-[#0C0C0D]'
                      : 'border-stone-300 text-stone-800 hover:border-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 p-2 rounded border border-rose-200">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleAdd}
            className="w-full py-3.5 bg-[#0C0C0D] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#D4AF37] hover:text-[#0C0C0D] transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag size={14} />
            <span>Confirm & Add to Bag</span>
          </button>
        </div>
      </div>
    </div>
  );
};
