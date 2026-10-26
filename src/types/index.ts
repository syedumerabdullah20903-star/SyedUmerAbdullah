export type CurrencyCode = 'PKR' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  exchangeRateFromPKR: number; // multiplier to convert PKR to this currency
  format: (amount: number) => string;
}

export type CategoryType = 'men' | 'women' | 'shoes';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: CategoryType;
  subCategory: string;
  gender: 'men' | 'women' | 'unisex';
  pricePKR: number;
  originalPricePKR?: number;
  badge?: 'New Arrival' | 'Bestseller' | 'Sale' | null;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  description: string;
  shortDescription: string;
  materials: string;
  careInstructions: string;
  inStock: boolean;
  stockCount: number;
  featured?: boolean;
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  id: string; // unique item id combining product id + size + color
  productId: string;
  product: Product;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
  addedAt: number;
}

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  deliveryNotes?: string;
}

export type OrderStatus = 'confirmed' | 'tailoring' | 'dispatched' | 'delivered';

export interface Order {
  orderId: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  customer: CustomerDetails;
  items: {
    productId: string;
    productName: string;
    productImage: string;
    selectedSize: string;
    selectedColor: string;
    quantity: number;
    pricePKR: number;
  }[];
  subtotalPKR: number;
  discountPKR: number;
  shippingPKR: number;
  totalPKR: number;
  appliedDiscountCode?: string;
  paymentMethod: 'cod' | 'card';
  paymentStatus: 'pending_on_delivery' | 'authorized_simulated';
  estimatedDeliveryDate: string;
  trackingNumber: string;
}

export type ActiveView = 
  | 'home'
  | 'catalog'
  | 'product-detail'
  | 'cart'
  | 'wishlist'
  | 'checkout'
  | 'order-confirmation'
  | 'order-lookup'
  | 'about'
  | 'faq'
  | 'shipping-returns'
  | 'contact';

export interface CatalogFilterState {
  category: 'all' | 'men' | 'women' | 'shoes';
  subCategory: string;
  badge: 'all' | 'New Arrival' | 'Bestseller' | 'Sale';
  selectedSizes: string[];
  selectedColors: string[];
  minPricePKR: number;
  maxPricePKR: number;
  inStockOnly: boolean;
  searchQuery: string;
  sortBy: 'featured' | 'newest' | 'price-low' | 'price-high' | 'popularity';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  description?: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';

