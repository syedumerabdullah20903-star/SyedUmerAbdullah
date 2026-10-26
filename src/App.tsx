/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { CategoryShowcase } from './components/CategoryShowcase';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { OrderConfirmationView } from './components/OrderConfirmationView';
import { WishlistView } from './components/WishlistView';
import { SearchModal } from './components/SearchModal';
import { QuickAddModal } from './components/QuickAddModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { SizePredictorModal } from './components/SizePredictorModal';
import { BrandStorySection } from './components/BrandStorySection';
import { NewsletterSection } from './components/NewsletterSection';
import { ToastContainer } from './components/ToastContainer';
import { 
  AboutPage, 
  FAQPage, 
  ShippingReturnsPage, 
  ContactPage, 
  OrderLookupPage 
} from './components/StaticPages';
import { ArrowRight, Sparkles } from 'lucide-react';

const SeasonalBanner: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <section className="py-12 sm:py-16 bg-[#161618] dark:bg-[#08080A] text-[#FAF8F5] relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-lg overflow-hidden border border-white/10 bg-gradient-to-r from-[#0C0C0D] to-[#1E1F24] dark:from-[#060709] dark:to-[#13151B] p-6 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-[#D4AF37] font-semibold">
              <Sparkles size={14} />
              <span>Limited Master Edition</span>
            </div>
            <h3 
              className="text-2xl sm:text-3xl md:text-4xl text-white font-light tracking-tight"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              The Monochrome Tailoring Capsule
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Strictly limited to 50 garments per design. Cut from Italian 340 GSM worsted wool with silk interior lining and hand-carved horn buttons.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigateTo('catalog', { category: 'men', badge: 'New Arrival' })}
                className="px-6 py-3 bg-[#FAF8F5] dark:bg-[#C6A56B] text-[#0C0C0D] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#D4AF37] dark:hover:bg-[#DFC79B] transition-colors inline-flex items-center gap-2 touch-target"
              >
                <span>Inspect The Capsule</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="w-full md:w-80 aspect-[4/3] rounded overflow-hidden bg-stone-800 shrink-0 border border-white/10 shadow-lg">
            <img
              src="/src/assets/images/zavik_men_tailored_suit_1792755888011.jpg"
              alt="Monochrome Capsule"
              className="w-full h-full object-cover filter contrast-[1.08]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const MainContent: React.FC = () => {
  const { activeView, viewParams, navigateTo } = useShop();

  switch (activeView) {
    case 'catalog':
      return <ProductGrid />;

    case 'product-detail':
      return <ProductDetailPage productId={viewParams.productId || 'zvk-m-01'} />;

    case 'wishlist':
      return <WishlistView />;

    case 'checkout':
      return <CheckoutView />;

    case 'order-confirmation':
      return <OrderConfirmationView orderId={viewParams.orderId} />;

    case 'order-lookup':
      return <OrderLookupPage />;

    case 'about':
      return <AboutPage />;

    case 'faq':
      return <FAQPage />;

    case 'shipping-returns':
      return <ShippingReturnsPage />;

    case 'contact':
      return <ContactPage />;

    case 'home':
    default:
      return (
        <main className="space-y-0">
          <HeroSection />
          <CategoryShowcase />

          {/* Curated Bestseller Spotlight */}
          <div className="bg-[#FAF8F5] dark:bg-[#0D0E11] transition-colors">
            <ProductGrid
              initialBadge="Bestseller"
              title="Atelier Iconic Bestsellers"
              subtitle="The defining garments chosen by discerning collectors worldwide."
            />
          </div>

          <SeasonalBanner />

          {/* New Arrivals Showcase */}
          <div className="bg-[#FAF8F5] dark:bg-[#0D0E11] py-4 transition-colors">
            <ProductGrid
              initialBadge="New Arrival"
              title="Recent Runway & Atelier Drops"
              subtitle="Fresh contemporary silhouettes tailored for the current season."
            />
          </div>

          <BrandStorySection />
          <NewsletterSection />
        </main>
      );
  }
};

export default function App() {
  return (
    <ShopProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#0D0E11] text-[#111111] dark:text-[#F8F6F1] transition-colors duration-200 antialiased selection:bg-[#D4AF37] selection:text-[#0C0C0D]">
        <Header />
        <div className="flex-grow">
          <MainContent />
        </div>
        <Footer />

        {/* Global Overlays & Modals */}
        <CartDrawer />
        <SearchModal />
        <QuickAddModal />
        <SizeGuideModal />
        <SizePredictorModal />
        <ToastContainer />
      </div>
    </ShopProvider>
  );
}
