import React from 'react';
import { Sparkles, Scissors, Gem, HeartHandshake } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const BrandStorySection: React.FC = () => {
  const { navigateTo } = useShop();

  const pillars = [
    {
      icon: Scissors,
      title: 'Architectural Tailoring',
      description: 'Structured shoulders, natural drape, and hand-finished pick stitches perfected across European master patterns.',
    },
    {
      icon: Gem,
      title: 'Noble Natural Fibers',
      description: 'Super 120s virgin wool, 22-momme Mulberry silk, long-staple Giza cotton, and full-grain Tuscan calfskin.',
    },
    {
      icon: HeartHandshake,
      title: 'Accessible Luxury Pricing',
      description: 'By operating direct-to-consumer without boutique retail overhead, we provide couture standards at honest mid-range prices.',
    },
  ];

  return (
    <section className="py-24 bg-[#0C0C0D] text-[#FAF8F5] relative overflow-hidden">
      {/* Subtle gold decorative glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-[#D4AF37] font-semibold">
              <Sparkles size={14} />
              <span>The Maison Heritage</span>
            </div>

            <h2 
              className="text-3xl sm:text-4xl md:text-5xl font-light text-white leading-tight tracking-tight text-balance"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Luxury is Not Exclusivity. <br />
              <span className="italic font-normal text-[#D4AF37]">It is Flawless Execution.</span>
            </h2>

            <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed">
              Founded on the belief that sartorial excellence should not be reserved solely for heritage European fashion houses, 
              <strong> ZAVIK</strong> merges high-fashion architectural silhouettes with honest, direct-to-consumer economics.
            </p>

            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed font-light">
              Every seam, lining, and button is scrutinized in our design ateliers. 
              We do not compromise on fabric weights, natural textures, or durability — crafting timeless investment pieces 
              that command respect from the boardroom to black-tie galas.
            </p>

            <div className="pt-2">
              <button
                onClick={() => navigateTo('about')}
                className="px-6 py-3 border border-[#D4AF37] text-[#D4AF37] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#D4AF37] hover:text-[#0C0C0D] transition-colors"
              >
                Read Our Maison Manifesto
              </button>
            </div>
          </div>

          {/* Right Pillar Cards */}
          <div className="lg:col-span-6 space-y-4">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="p-6 bg-white/[0.03] border border-white/10 rounded-sm hover:border-[#D4AF37]/40 transition-colors flex items-start gap-5"
                >
                  <div className="w-12 h-12 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Icon size={22} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                    <h3 
                      className="text-lg text-white font-medium tracking-wide"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-stone-400 leading-relaxed font-light">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
