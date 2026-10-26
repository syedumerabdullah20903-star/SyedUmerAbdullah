import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const HeroSection: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <section className="relative w-full overflow-hidden bg-[#111111] text-[#F8F6F1]">
      {/* Background Image with Responsive Mobile-First Height */}
      <div className="relative h-[62vh] min-h-[420px] sm:h-[72vh] sm:min-h-[520px] lg:h-[82vh] lg:min-h-[620px] w-full">
        <img
          src="/src/assets/images/zavik_hero_luxury_editorial_1792755887394.jpg"
          alt="ZAVIK Haute Couture Campaign"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top filter brightness-[0.85] contrast-[1.05]"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
            if (target.parentElement) {
              target.parentElement.classList.add(
                'bg-gradient-to-br',
                'from-[#1A1A1C]',
                'via-[#202024]',
                'to-[#111111]'
              );
            }
          }}
        />

        {/* Measured Contrast Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-black/40 to-black/20 opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/80 via-transparent to-transparent" />

        {/* Content Overlay — Mobile-First spacing and thumb reach */}
        <div className="absolute inset-0 flex items-end pb-8 sm:pb-16 lg:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl space-y-3 sm:space-y-5">
              {/* Season Kicker */}
              <div className="flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#C6A56B] font-semibold">
                <Sparkles size={13} className="text-[#C6A56B]" />
                <span>Atelier Drop No. 04 · Autumn / Winter</span>
              </div>

              {/* Display Headline */}
              <h1 
                className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-white leading-[1.1] text-balance"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Haute Prêt-à-Porter. <br />
                <span className="italic font-normal text-[#F8F6F1]/90">Sculpted For Modernity.</span>
              </h1>

              {/* Concise Brand Narrative */}
              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-lg line-clamp-2 sm:line-clamp-none">
                ZAVIK reimagines European tailoring traditions with contemporary minimalist precision. 
                Experience luxury maison aesthetics at accessible mid-range prices.
              </p>

              {/* Touch-Friendly Action Buttons (Min 44px height) */}
              <div className="pt-2 sm:pt-3 flex flex-wrap items-center gap-2.5 sm:gap-4">
                <button
                  onClick={() => navigateTo('catalog', { category: 'all' })}
                  className="min-h-[44px] px-6 py-2.5 bg-[#F8F6F1] text-[#111111] text-xs uppercase tracking-[0.18em] font-bold hover:bg-[#C6A56B] hover:text-[#111111] active:scale-[0.98] transition-all flex items-center gap-2 shadow-md touch-target"
                >
                  <span>Shop Now</span>
                  <ArrowRight size={14} />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateTo('catalog', { category: 'men' })}
                    className="min-h-[44px] px-3.5 py-2.5 bg-black/50 backdrop-blur-sm border border-white/20 text-white text-xs uppercase tracking-wider font-medium hover:border-white active:bg-white/20 transition-colors touch-target"
                  >
                    Men
                  </button>
                  <button
                    onClick={() => navigateTo('catalog', { category: 'women' })}
                    className="min-h-[44px] px-3.5 py-2.5 bg-black/50 backdrop-blur-sm border border-white/20 text-white text-xs uppercase tracking-wider font-medium hover:border-white active:bg-white/20 transition-colors touch-target"
                  >
                    Women
                  </button>
                  <button
                    onClick={() => navigateTo('catalog', { category: 'shoes' })}
                    className="min-h-[44px] px-3.5 py-2.5 bg-black/50 backdrop-blur-sm border border-white/20 text-white text-xs uppercase tracking-wider font-medium hover:border-white active:bg-white/20 transition-colors touch-target"
                  >
                    Shoes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Atmospheric Strip under Hero (Scrollable / wrapped for mobile) */}
      <div className="border-y border-white/10 bg-[#161618] py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-[10px] sm:text-xs tracking-[0.14em] uppercase text-stone-400 overflow-x-auto no-scrollbar whitespace-nowrap">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[#C6A56B]">✦</span>
            <span>Italian & French Sourced Fabrics</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[#C6A56B]">✦</span>
            <span>Master Atelier Hand-Finishing</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[#C6A56B]">✦</span>
            <span>Free Domestic Delivery & Exchanges</span>
          </div>
        </div>
      </div>
    </section>
  );
};
