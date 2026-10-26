import React from 'react';
import { useShop } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { navigateTo, openSizeGuide, currency } = useShop();

  return (
    <footer className="bg-[#0C0C0D] dark:bg-[#060709] text-[#FAF8F5] pt-12 sm:pt-16 pb-10 sm:pb-12 border-t border-white/10 dark:border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Top Wordmark & Atelier Mission */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 sm:pb-12 border-b border-white/10">
          <div>
            <span 
              className="text-2xl sm:text-3xl font-extrabold tracking-[0.25em] text-white uppercase block"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              ZAVIK
            </span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-medium block mt-1">
              Haute Prêt-à-Porter · Established MMXXIV
            </span>
          </div>

          <p className="text-xs text-stone-400 font-light max-w-md leading-relaxed">
            Delivering the silhouette, noble textile integrity, and refined experience of European luxury houses at accessible contemporary pricing.
          </p>
        </div>

        {/* 4-Column Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-xs">
          {/* Col 1: Collections */}
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
              The Collections
            </p>
            <ul className="space-y-2 text-stone-400 font-light">
              <li>
                <button
                  onClick={() => navigateTo('catalog', { category: 'men' })}
                  className="py-1 text-left hover:text-white transition-colors"
                >
                  Men's Tailoring & Apparel
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('catalog', { category: 'women' })}
                  className="py-1 text-left hover:text-white transition-colors"
                >
                  Women's Gowns & Outerwear
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('catalog', { category: 'shoes' })}
                  className="py-1 text-left hover:text-white transition-colors"
                >
                  Footwear & Bit Loafers
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('catalog', { badge: 'New Arrival' })}
                  className="py-1 text-left hover:text-white transition-colors"
                >
                  New Atelier Drops
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('catalog', { badge: 'Sale' })}
                  className="py-1 text-left text-rose-400 hover:text-rose-300 transition-colors"
                >
                  Private Privilege Sale
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Client Services */}
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
              Client Concierge
            </p>
            <ul className="space-y-2 text-stone-400 font-light">
              <li>
                <button
                  onClick={() => navigateTo('shipping-returns')}
                  className="py-1 text-left hover:text-white transition-colors"
                >
                  Shipping & Returns
                </button>
              </li>
              <li>
                <button
                  onClick={() => openSizeGuide('men')}
                  className="py-1 text-left hover:text-white transition-colors"
                >
                  Atelier Size & Fit Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('order-lookup')}
                  className="py-1 text-left hover:text-white transition-colors"
                >
                  Track Atelier Delivery
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('faq')}
                  className="py-1 text-left hover:text-white transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="py-1 text-left hover:text-white transition-colors"
                >
                  Contact Concierge
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: The Maison */}
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
              The Maison
            </p>
            <ul className="space-y-2 text-stone-400 font-light">
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="py-1 text-left hover:text-white transition-colors"
                >
                  About ZAVIK
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="py-1 text-left hover:text-white transition-colors"
                >
                  Noble Fabric Sourcing
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="py-1 text-left hover:text-white transition-colors"
                >
                  Fair Value Philosophy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="py-1 text-left hover:text-white transition-colors"
                >
                  Private Appointments
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Regional & Terms */}
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
              Presence & Settlement
            </p>
            <p className="text-stone-400 font-light text-[11px] leading-relaxed">
              Serving global collectors. Pricing displayed in <strong className="text-white font-mono">{currency}</strong>.
            </p>
            <div className="pt-2 text-stone-500 text-[10px] space-y-1">
              <p>Cash on Delivery Supported</p>
              <p>Complimentary Domestic Packaging</p>
              <p>Encrypted Client Data Protection</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Terms */}
        <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 font-light">
          <p>© {new Date().getFullYear()} ZAVIK Haute Prêt-à-Porter. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Authentication Seal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
