import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  Product, 
  CartItem, 
  CurrencyCode, 
  ActiveView, 
  Order, 
  CustomerDetails, 
  ToastMessage, 
  ProductColor,
  ThemeMode 
} from '../types';
import { PRODUCTS } from '../data/products';
import { convertAndFormatPrice } from '../utils/currency';

interface ViewParams {
  productId?: string;
  category?: string;
  subCategory?: string;
  badge?: string;
  orderId?: string;
}

interface ShopContextType {
  // Navigation
  activeView: ActiveView;
  viewParams: ViewParams;
  navigateTo: (view: ActiveView, params?: ViewParams) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: ProductColor, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  cartSubtotalPKR: number;
  cartDiscountPKR: number;
  cartShippingPKR: number;
  cartTotalPKR: number;
  cartCount: number;
  freeShippingThresholdPKR: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;

  // Currency
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountPKR: number) => string;

  // Promo / Discount
  discountCode: string;
  discountPercent: number;
  applyDiscountCode: (code: string) => { success: boolean; message: string };
  removeDiscountCode: () => void;

  // Checkout & Orders
  orders: Order[];
  currentOrder: Order | null;
  placeOrder: (customer: CustomerDetails, paymentMethod: 'cod' | 'card') => Order;
  getOrderById: (orderId: string) => Order | undefined;

  // Overlays & Modals
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  quickAddProduct: Product | null;
  setQuickAddProduct: (product: Product | null) => void;
  isSizeGuideOpen: boolean;
  sizeGuideCategory: 'men' | 'women' | 'shoes';
  openSizeGuide: (category?: 'men' | 'women' | 'shoes') => void;
  closeSizeGuide: () => void;

  // Size Predictor
  isSizePredictorOpen: boolean;
  sizePredictorProduct: Product | null;
  openSizePredictor: (product: Product, onApplySize?: (size: string) => void) => void;
  closeSizePredictor: () => void;
  applyPredictedSize: (size: string) => void;
  savedSizingProfile: { heightCm: number; weightKg: number; fitPreference: 'slim' | 'regular' | 'loose' } | null;
  saveSizingProfile: (profile: { heightCm: number; weightKg: number; fitPreference: 'slim' | 'regular' | 'loose' }) => void;

  // Theme Mode (Light / Dark / System)
  themeMode: ThemeMode;
  activeTheme: 'light' | 'dark';
  setThemeMode: (mode: ThemeMode) => void;

  // Toast Notifications
  toasts: ToastMessage[];
  addToast: (title: string, description?: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'zavik_cart_v1';
const WISHLIST_STORAGE_KEY = 'zavik_wishlist_v1';
const CURRENCY_STORAGE_KEY = 'zavik_currency_v1';
const ORDERS_STORAGE_KEY = 'zavik_orders_v1';
const DISCOUNT_STORAGE_KEY = 'zavik_discount_v1';
const SIZING_PROFILE_STORAGE_KEY = 'zavik_sizing_profile_v1';
const THEME_STORAGE_KEY = 'zavik_theme_mode_v1';

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation state
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [viewParams, setViewParams] = useState<ViewParams>({});

  // Currency state (Default PKR as confirmed by user)
  const [currency, setCurrencyState] = useState<CurrencyCode>('PKR');

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Promo code
  const [discountCode, setDiscountCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeGuideCategory, setSizeGuideCategory] = useState<'men' | 'women' | 'shoes'>('men');

  // Size Predictor
  const [isSizePredictorOpen, setIsSizePredictorOpen] = useState(false);
  const [sizePredictorProduct, setSizePredictorProduct] = useState<Product | null>(null);
  const [onApplySizeCallback, setOnApplySizeCallback] = useState<((size: string) => void) | null>(null);
  const [savedSizingProfile, setSavedSizingProfile] = useState<{
    heightCm: number;
    weightKg: number;
    fitPreference: 'slim' | 'regular' | 'loose';
  } | null>(null);

  // Theme state (Light / Dark / System)
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [systemIsDark, setSystemIsDark] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Hydrate from LocalStorage on mount
  useEffect(() => {
    try {
      const storedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY) as CurrencyCode;
      if (storedCurrency && ['PKR', 'USD', 'EUR', 'GBP'].includes(storedCurrency)) {
        setCurrencyState(storedCurrency);
      }

      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        const parsed = JSON.parse(storedCart);
        if (Array.isArray(parsed)) {
          // Verify products still exist
          const validItems: CartItem[] = parsed
            .map((item: any) => {
              const matchedProduct = PRODUCTS.find((p) => p.id === item.productId);
              if (!matchedProduct) return null;
              return {
                ...item,
                product: matchedProduct,
              };
            })
            .filter(Boolean);
          setCart(validItems);
        }
      }

      const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (storedWishlist) {
        const parsed = JSON.parse(storedWishlist);
        if (Array.isArray(parsed)) {
          setWishlist(parsed);
        }
      }

      const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (storedOrders) {
        const parsed = JSON.parse(storedOrders);
        if (Array.isArray(parsed)) {
          setOrders(parsed);
        }
      }

      const storedDiscount = localStorage.getItem(DISCOUNT_STORAGE_KEY);
      if (storedDiscount) {
        const parsed = JSON.parse(storedDiscount);
        if (parsed?.code && parsed?.percent) {
          setDiscountCode(parsed.code);
          setDiscountPercent(parsed.percent);
        }
      }

      const storedProfile = localStorage.getItem(SIZING_PROFILE_STORAGE_KEY);
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        if (parsed?.heightCm && parsed?.weightKg) {
          setSavedSizingProfile(parsed);
        }
      }

      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode;
      if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
        setThemeModeState(storedTheme);
      }
    } catch (err) {
      console.warn('LocalStorage hydration error:', err);
    }
  }, []);

  // Listen to system dark mode preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemIsDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Active theme calculation
  const activeTheme: 'light' | 'dark' = themeMode === 'system' 
    ? (systemIsDark ? 'dark' : 'light') 
    : themeMode;

  // Sync activeTheme to HTML root element
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (activeTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [activeTheme]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (e) {
      console.warn('Failed to save theme to localStorage', e);
    }
  };

  // Lock body scroll when modals/drawers are open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const isModalOpen = isCartDrawerOpen || isSearchOpen || quickAddProduct !== null || isSizeGuideOpen || isSizePredictorOpen;
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartDrawerOpen, isSearchOpen, quickAddProduct, isSizeGuideOpen, isSizePredictorOpen]);

  // Save Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.warn('Failed to save cart to localStorage', err);
    }
  }, [cart]);

  // Save Wishlist to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (err) {
      console.warn('Failed to save wishlist to localStorage', err);
    }
  }, [wishlist]);

  // Save Currency to LocalStorage
  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, code);
    } catch (err) {
      console.warn('Failed to save currency to localStorage', err);
    }
  };

  // Save Orders to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (err) {
      console.warn('Failed to save orders to localStorage', err);
    }
  }, [orders]);

  // Toast Helpers
  const addToast = (title: string, description?: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Navigation Helper with auto scroll-to-top
  const navigateTo = (view: ActiveView, params: ViewParams = {}) => {
    setActiveView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Operations
  const addToCart = (product: Product, size: string, color: ProductColor, quantity = 1) => {
    const cartItemId = `${product.id}_${size}_${color.name.replace(/\s+/g, '-').toLowerCase()}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: cartItemId,
            productId: product.id,
            product,
            selectedSize: size,
            selectedColor: color,
            quantity,
            addedAt: Date.now(),
          },
        ];
      }
    });

    addToast(
      'Added to Shopping Bag',
      `${product.name} (${size}) in ${color.name}`,
      'success'
    );
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    const item = cart.find((i) => i.id === cartItemId);
    setCart((prev) => prev.filter((i) => i.id !== cartItemId));
    if (item) {
      addToast('Removed from Bag', item.product.name, 'info');
    }
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Operations
  const toggleWishlist = (productId: string) => {
    const exists = wishlist.includes(productId);
    const product = PRODUCTS.find((p) => p.id === productId);
    if (exists) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      addToast('Removed from Wishlist', product?.name, 'info');
    } else {
      setWishlist((prev) => [...prev, productId]);
      addToast('Saved to Wishlist', product?.name, 'success');
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Discount Codes
  const applyDiscountCode = (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'ZAVIK10') {
      setDiscountCode('ZAVIK10');
      setDiscountPercent(10);
      try {
        localStorage.setItem(DISCOUNT_STORAGE_KEY, JSON.stringify({ code: 'ZAVIK10', percent: 10 }));
      } catch (e) {}
      addToast('Promo Code Applied', '10% atelier privilege granted', 'success');
      return { success: true, message: '10% discount applied to your order!' };
    } else if (normalized === 'LUXURY20') {
      setDiscountCode('LUXURY20');
      setDiscountPercent(20);
      try {
        localStorage.setItem(DISCOUNT_STORAGE_KEY, JSON.stringify({ code: 'LUXURY20', percent: 20 }));
      } catch (e) {}
      addToast('Promo Code Applied', '20% haute couture privilege granted', 'success');
      return { success: true, message: '20% discount applied to your order!' };
    } else if (normalized === 'WELCOME15') {
      setDiscountCode('WELCOME15');
      setDiscountPercent(15);
      try {
        localStorage.setItem(DISCOUNT_STORAGE_KEY, JSON.stringify({ code: 'WELCOME15', percent: 15 }));
      } catch (e) {}
      addToast('Promo Code Applied', '15% welcome privilege granted', 'success');
      return { success: true, message: '15% discount applied to your order!' };
    } else {
      return { success: false, message: 'Invalid or expired promotional code.' };
    }
  };

  const removeDiscountCode = () => {
    setDiscountCode('');
    setDiscountPercent(0);
    try {
      localStorage.removeItem(DISCOUNT_STORAGE_KEY);
    } catch (e) {}
    addToast('Discount Removed', undefined, 'info');
  };

  // Calculations
  const cartSubtotalPKR = useMemo(() => {
    return cart.reduce((total, item) => total + item.product.pricePKR * item.quantity, 0);
  }, [cart]);

  const cartDiscountPKR = useMemo(() => {
    if (discountPercent <= 0) return 0;
    return Math.round((cartSubtotalPKR * discountPercent) / 100);
  }, [cartSubtotalPKR, discountPercent]);

  const freeShippingThresholdPKR = 15000;

  const cartShippingPKR = useMemo(() => {
    if (cart.length === 0) return 0;
    return cartSubtotalPKR >= freeShippingThresholdPKR ? 0 : 850;
  }, [cartSubtotalPKR, cart.length]);

  const cartTotalPKR = useMemo(() => {
    return Math.max(0, cartSubtotalPKR - cartDiscountPKR + cartShippingPKR);
  }, [cartSubtotalPKR, cartDiscountPKR, cartShippingPKR]);

  const cartCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const wishlistCount = wishlist.length;

  // Multi-Step Checkout: Place simulated Order
  const placeOrder = (customer: CustomerDetails, paymentMethod: 'cod' | 'card'): Order => {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `ZVK-${randomSuffix}`;
    const orderId = `order_${timestamp}`;
    const deliveryDateObj = new Date(timestamp + 3 * 24 * 60 * 60 * 1000);
    const estimatedDeliveryDate = deliveryDateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });

    const newOrder: Order = {
      orderId,
      orderNumber,
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      status: 'confirmed',
      customer,
      items: cart.map((i) => ({
        productId: i.productId,
        productName: i.product.name,
        productImage: i.product.images[0],
        selectedSize: i.selectedSize,
        selectedColor: i.selectedColor.name,
        quantity: i.quantity,
        pricePKR: i.product.pricePKR,
      })),
      subtotalPKR: cartSubtotalPKR,
      discountPKR: cartDiscountPKR,
      shippingPKR: cartShippingPKR,
      totalPKR: cartTotalPKR,
      appliedDiscountCode: discountCode || undefined,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending_on_delivery' : 'authorized_simulated',
      estimatedDeliveryDate,
      trackingNumber: `TRK-ZVK-${Math.floor(10000000 + Math.random() * 90000000)}`,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
    clearCart();
    return newOrder;
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.orderId === orderId || o.orderNumber === orderId);
  };

  // Size guide helpers
  const openSizeGuide = (category: 'men' | 'women' | 'shoes' = 'men') => {
    setSizeGuideCategory(category);
    setIsSizeGuideOpen(true);
  };

  const closeSizeGuide = () => {
    setIsSizeGuideOpen(false);
  };

  // Size Predictor helpers
  const openSizePredictor = (product: Product, onApplySize?: (size: string) => void) => {
    setSizePredictorProduct(product);
    if (onApplySize) {
      setOnApplySizeCallback(() => onApplySize);
    } else {
      setOnApplySizeCallback(null);
    }
    setIsSizePredictorOpen(true);
  };

  const closeSizePredictor = () => {
    setIsSizePredictorOpen(false);
    setSizePredictorProduct(null);
    setOnApplySizeCallback(null);
  };

  const applyPredictedSize = (size: string) => {
    if (onApplySizeCallback) {
      onApplySizeCallback(size);
    }
    addToast('Atelier Size Recommended', `Recommended size ${size} selected for this piece.`, 'success');
    closeSizePredictor();
  };

  const saveSizingProfile = (profile: { heightCm: number; weightKg: number; fitPreference: 'slim' | 'regular' | 'loose' }) => {
    setSavedSizingProfile(profile);
    try {
      localStorage.setItem(SIZING_PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save sizing profile', e);
    }
  };

  const formatPrice = (amountPKR: number) => {
    return convertAndFormatPrice(amountPKR, currency);
  };

  return (
    <ShopContext.Provider
      value={{
        activeView,
        viewParams,
        navigateTo,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        cartSubtotalPKR,
        cartDiscountPKR,
        cartShippingPKR,
        cartTotalPKR,
        cartCount,
        freeShippingThresholdPKR,
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount,
        currency,
        setCurrency,
        formatPrice,
        discountCode,
        discountPercent,
        applyDiscountCode,
        removeDiscountCode,
        orders,
        currentOrder,
        placeOrder,
        getOrderById,
        isSearchOpen,
        setIsSearchOpen,
        quickAddProduct,
        setQuickAddProduct,
        isSizeGuideOpen,
        sizeGuideCategory,
        openSizeGuide,
        closeSizeGuide,
        isSizePredictorOpen,
        sizePredictorProduct,
        openSizePredictor,
        closeSizePredictor,
        applyPredictedSize,
        savedSizingProfile,
        saveSizingProfile,
        themeMode,
        activeTheme,
        setThemeMode,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
