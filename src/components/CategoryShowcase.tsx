import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CategoryShowcase: React.FC = () => {
  const { navigateTo } = useShop();

  const categories = [
    {
      id: 'men',
      title: "Men's Collection",
      subtitle: 'Tailored Suiting, Poplin Shirts & Outerwear',
      image: '/src/assets/images/zavik_men_tailored_suit_1792755888011.jpg',
      aspect: 'aspect-[3/4]',
    },
    {
      id: 'women',
      title: "Women's Collection",
      subtitle: 'Bias Silk Gowns, Sculpted Coats & Organza',
      image: '/src/assets/images/zavik_women_silk_dress_1792755887567.jpg',
      aspect: 'aspect-[3/4]',
    },
    {
      id: 'shoes',
      title: 'Footwear & Loafers',
      subtitle: 'Florentine Bit Loafers, Nappa Court & Boots',
      image: '/src/assets/images/zavik_shoes_leather_loafers_1792755888430.jpg',
      aspect: 'aspect-[3/4]',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#FAF8F5] dark:bg-[#0D0E11] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <span className="text-[11px] tracking-[0.28em] uppercase text-[#A88756] font-semibold">
              The Department Editions
            </span>
            <h2 
              className="text-2xl sm:text-3xl md:text-4xl text-[#0C0C0D] dark:text-[#F8F6F1] font-light mt-1 tracking-tight"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Curated Wardrobe Pillars
            </h2>
          </div>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-2 md:mt-0 max-w-md">
            Architectural silhouettes crafted in limited runs with pure natural fibers and generational artisan techniques.
          </p>
        </div>

        {/* 3-Column Luxury Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigateTo('catalog', { category: cat.id })}
              className="group cursor-pointer relative overflow-hidden bg-stone-100 dark:bg-stone-900 flex flex-col justify-end rounded-xs shadow-xs"
            >
              {/* Media Container */}
              <div className={`relative w-full ${cat.aspect} overflow-hidden`}>
                <img
                  src={cat.image}
                  alt={cat.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      target.parentElement.classList.add(
                        'bg-gradient-to-b',
                        'from-stone-200',
                        'to-stone-400'
                      );
                    }
                  }}
                />
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 
                        className="text-2xl font-light text-white tracking-wide"
                        style={{ fontFamily: 'var(--font-serif)' }}
                      >
                        {cat.title}
                      </h3>
                      <p className="text-xs text-stone-300 font-light tracking-wide mt-1">
                        {cat.subtitle}
                      </p>
                    </div>

                    <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-[#FAF8F5] group-hover:text-[#0C0C0D] group-hover:border-transparent transition-all duration-300 shrink-0">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-[11px] tracking-[0.2em] uppercase text-stone-300 font-medium">
                    <span>View Edition</span>
                    <span className="text-[#D4AF37]">Shop Now →</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
