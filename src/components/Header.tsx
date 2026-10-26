import React, { useState } from 'react';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  Menu, 
  X, 
  ChevronDown, 
  Globe,
  Sun,
  Moon,
  Laptop
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CurrencyCode, ThemeMode } from '../types';

export const Header: React.FC = () => {
  const {
    activeView,
    viewParams,
    navigateTo,
    cartCount,
    wishlistCount,
    setIsCartDrawerOpen,
    setIsSearchOpen,
    currency,
    setCurrency,
    themeMode,
    setThemeMode,
  } = useShop();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  const currencies: CurrencyCode[] = ['PKR', 'USD', 'EUR', 'GBP'];

  const navLinks = [
    { label: 'Home', view: 'home' as const },
    { label: 'Men', view: 'catalog' as const, category: 'men' },
    { label: 'Women', view: 'catalog' as const, category: 'women' },
    { label: 'Shoes', view: 'catalog' as const, category: 'shoes' },
    { label: 'New Arrivals', view: 'catalog' as const, badge: 'New Arrival' },
    { label: 'Bestsellers', view: 'catalog' as const, badge: 'Bestseller' },
    { label: 'Sale', view: 'catalog' as const, badge: 'Sale' },
  ];

  const handleNavClick = (link: typeof navLinks[0]) => {
    setIsMobileMenuOpen(false);
    if (link.view === 'home') {
      navigateTo('home');
    } else {
      navigateTo('catalog', {
        category: link.category,
        badge: link.badge,
        subCategory: undefined,
      });
    }
  };

  const isLinkActive = (link: typeof navLinks[0]) => {
    if (link.view === 'home') return activeView === 'home';
    if (activeView === 'catalog') {
      if (link.badge) return viewParams.badge === link.badge;
      if (link.category) return viewParams.category === link.category;
    }
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F8F6F1]/95 dark:bg-[#111111]/95 backdrop-blur-md border-b border-black/[0.08] dark:border-white/10 transition-colors">
      {/* Compact Mobile Announcement Bar */}
      <div className="bg-[#111111] dark:bg-[#000000] text-[#F8F6F1] text-[10px] sm:text-[11px] tracking-[0.18em] uppercase py-1.5 px-3 text-center font-medium overflow-hidden">
        <div className="flex items-center justify-center gap-2 max-w-7xl mx-auto truncate">
          <span className="text-[#C6A56B] font-semibold shrink-0">HAUTE PRÊT-À-PORTER</span>
          <span className="text-white/30 hidden xs:inline">•</span>
          <span className="truncate">Free White-Glove Delivery over Rs. 15,000</span>
          <span className="text-white/30 hidden sm:inline">•</span>
          <span className="text-[#C6A56B] hidden sm:inline shrink-0">Code: ZAVIK10</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-6">
        {/* Mobile Left: Hamburger Menu (44px touch target) */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="w-11 h-11 flex items-center justify-center text-stone-800 dark:text-stone-200 hover:text-black dark:hover:text-white rounded-md active:bg-black/5 dark:active:bg-white/5 transition-colors touch-target"
            aria-label="Open mobile menu"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Center (Mobile) / Left (Desktop): ZAVIK Wordmark */}
        <div className="flex-1 lg:flex-initial flex justify-center lg:justify-start">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigateTo('home');
            }}
            className="group flex flex-col items-center lg:items-start text-center lg:text-left shrink-0 py-1"
          >
            <span 
              className="text-2xl sm:text-3xl font-extrabold tracking-[0.28em] text-[#111111] dark:text-[#F8F6F1] uppercase transition-transform group-hover:opacity-90"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              ZAVIK
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-[0.35em] text-[#C6A56B] uppercase font-semibold -mt-1 hidden xs:block">
              Atelier Paris · Lahore
            </span>
          </button>
        </div>

        {/* Desktop Nav Links (44px touch targets on desktop/laptop) */}
        <nav className="hidden lg:flex items-center gap-7 text-xs tracking-[0.16em] uppercase font-semibold text-stone-700 dark:text-stone-300">
          {navLinks.map((link) => {
            const active = isLinkActive(link);
            return (
              <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                className={`relative py-2 whitespace-nowrap transition-colors duration-200 hover:text-black dark:hover:text-white ${
                  active ? 'text-black dark:text-white font-bold' : 'text-stone-600 dark:text-stone-300'
                } ${link.label === 'Sale' ? 'text-rose-600 dark:text-rose-400 font-bold' : ''}`}
              >
                {link.label}
                {active && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#111111] dark:bg-[#C6A56B] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions Zone: Touch-Friendly Buttons */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          {/* Currency Switcher (Hidden on small mobile, accessible in drawer) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => {
                setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen);
                setIsThemeDropdownOpen(false);
              }}
              className="h-10 px-2.5 flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-stone-200 hover:text-black dark:hover:text-white rounded border border-stone-300/80 dark:border-stone-700 hover:border-stone-500 transition-colors whitespace-nowrap"
              aria-label="Select currency"
            >
              <Globe size={13} className="text-[#C6A56B]" />
              <span className="font-mono">{currency}</span>
              <ChevronDown size={12} className={`transition-transform duration-200 ${isCurrencyDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCurrencyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-[#F8F6F1] dark:bg-[#202023] border border-stone-200 dark:border-stone-700 shadow-xl rounded-md py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-stone-400 font-medium border-b border-stone-100 dark:border-stone-700">
                  Select Currency
                </div>
                {currencies.map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      setCurrency(curr);
                      setIsCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors ${
                      currency === curr ? 'font-bold text-black dark:text-white bg-stone-100 dark:bg-stone-800' : 'text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <span>{curr}</span>
                    {currency === curr && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C6A56B]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Theme Switcher */}
          <div className="relative hidden md:block">
            <button
              onClick={() => {
                setIsThemeDropdownOpen(!isThemeDropdownOpen);
                setIsCurrencyDropdownOpen(false);
              }}
              className="h-10 w-10 flex items-center justify-center text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white rounded border border-stone-300/80 dark:border-stone-700 hover:border-stone-500 transition-colors"
              aria-label="Toggle theme mode"
              title="Theme Mode"
            >
              {themeMode === 'dark' ? (
                <Moon size={15} className="text-[#C6A56B]" />
              ) : themeMode === 'light' ? (
                <Sun size={15} className="text-[#C6A56B]" />
              ) : (
                <Laptop size={15} className="text-[#C6A56B]" />
              )}
            </button>

            {isThemeDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-[#F8F6F1] dark:bg-[#202023] border border-stone-200 dark:border-stone-700 shadow-xl rounded-md py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-stone-400 font-medium border-b border-stone-100 dark:border-stone-700">
                  Theme Setting
                </div>
                {(['light', 'dark', 'system'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setThemeMode(mode);
                      setIsThemeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between capitalize hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors ${
                      themeMode === mode ? 'font-bold text-black dark:text-white bg-stone-100 dark:bg-stone-800' : 'text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <span>{mode} Mode</span>
                    {themeMode === mode && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C6A56B]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Trigger (Min 44x44px touch target) */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-11 h-11 flex items-center justify-center text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white transition-colors rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.06] touch-target"
            aria-label="Search collection"
            title="Search products"
          >
            <Search size={19} strokeWidth={1.8} />
          </button>

          {/* Wishlist Trigger (Desktop/Tablet) */}
          <button
            onClick={() => navigateTo('wishlist')}
            className="relative w-11 h-11 hidden xs:flex items-center justify-center text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white transition-colors rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.06] touch-target"
            aria-label="Wishlist"
            title="Saved items"
          >
            <Heart 
              size={19} 
              strokeWidth={1.8} 
              className={wishlistCount > 0 ? 'fill-[#C6A56B] text-[#C6A56B]' : ''} 
            />
            {wishlistCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-[#111111] dark:bg-[#C6A56B] rounded-full tabular-nums">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Bag Trigger (Always visible, 44px touch target) */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="relative h-11 px-3 sm:px-3.5 bg-[#111111] dark:bg-[#202023] text-[#F8F6F1] rounded-full hover:bg-stone-800 dark:hover:bg-stone-700 transition-all active:scale-[0.98] shadow-sm flex items-center gap-2 touch-target"
            aria-label="Shopping bag"
          >
            <ShoppingBag size={17} strokeWidth={2} className="text-[#C6A56B]" />
            <span className="text-xs font-semibold tracking-wider font-mono tabular-nums">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Left Slide-Over with 48px touch links & Theme selection) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Left Drawer Container */}
          <div className="fixed inset-y-0 left-0 max-w-[320px] w-full bg-[#F8F6F1] dark:bg-[#1A1A1C] text-[#111111] dark:text-[#F8F6F1] shadow-2xl z-10 flex flex-col justify-between overflow-y-auto border-r border-stone-200 dark:border-stone-800 animate-in slide-in-from-left duration-250">
            {/* Drawer Top Header */}
            <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div>
                <span 
                  className="text-2xl font-extrabold tracking-[0.25em] text-[#111111] dark:text-[#F8F6F1] uppercase block"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  ZAVIK
                </span>
                <span className="text-[8px] tracking-[0.3em] uppercase text-[#C6A56B] font-semibold block">
                  Haute Prêt-à-Porter
                </span>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-11 h-11 flex items-center justify-center text-stone-500 hover:text-black dark:hover:text-white rounded-md touch-target"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Touch-Friendly Links (48px tap targets) */}
            <div className="flex-1 px-4 py-4 space-y-1">
              <p className="px-3 pt-2 pb-1 text-[10px] tracking-[0.25em] text-stone-400 dark:text-stone-500 uppercase font-bold">
                Departments
              </p>

              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  className={`w-full min-h-[48px] px-3 flex items-center justify-between text-base tracking-[0.12em] uppercase font-semibold rounded-md transition-colors ${
                    isLinkActive(link)
                      ? 'bg-stone-200/80 dark:bg-stone-800 text-black dark:text-white font-bold'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/50'
                  } ${link.label === 'Sale' ? 'text-rose-600 dark:text-rose-400' : ''}`}
                >
                  <span>{link.label}</span>
                  {isLinkActive(link) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C6A56B]" />
                  )}
                </button>
              ))}

              <div className="pt-3 pb-1 border-t border-stone-200 dark:border-stone-800 my-2">
                <p className="px-3 pb-1 text-[10px] tracking-[0.25em] text-stone-400 dark:text-stone-500 uppercase font-bold">
                  Personal & Concierge
                </p>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateTo('wishlist');
                  }}
                  className="w-full min-h-[48px] px-3 flex items-center justify-between text-sm tracking-wider uppercase font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/50 rounded-md"
                >
                  <span className="flex items-center gap-2">
                    <Heart size={16} className="text-[#C6A56B]" />
                    <span>Saved Wishlist</span>
                  </span>
                  {wishlistCount > 0 && (
                    <span className="text-xs font-mono font-bold px-2 py-0.5 bg-black dark:bg-[#C6A56B] text-white rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateTo('order-lookup');
                  }}
                  className="w-full min-h-[48px] px-3 flex items-center text-sm tracking-wider uppercase font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/50 rounded-md"
                >
                  Track Atelier Delivery
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateTo('about');
                  }}
                  className="w-full min-h-[48px] px-3 flex items-center text-sm tracking-wider uppercase font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/50 rounded-md"
                >
                  The Maison ZAVIK
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateTo('shipping-returns');
                  }}
                  className="w-full min-h-[48px] px-3 flex items-center text-sm tracking-wider uppercase font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/50 rounded-md"
                >
                  Shipping & Exchanges
                </button>
              </div>
            </div>

            {/* Bottom Controls: Theme Mode & Currency */}
            <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/60 space-y-3">
              {/* Theme Settings Selector (3 working modes: Light, Dark, System) */}
              <div>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400 mb-1.5">
                  Appearance Theme
                </p>
                <div className="grid grid-cols-3 gap-1 bg-stone-200 dark:bg-stone-800 p-1 rounded-lg">
                  <button
                    onClick={() => setThemeMode('light')}
                    className={`min-h-[36px] flex items-center justify-center gap-1.5 text-xs font-semibold rounded-md transition-all ${
                      themeMode === 'light'
                        ? 'bg-white text-black shadow-xs'
                        : 'text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    <Sun size={13} />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => setThemeMode('dark')}
                    className={`min-h-[36px] flex items-center justify-center gap-1.5 text-xs font-semibold rounded-md transition-all ${
                      themeMode === 'dark'
                        ? 'bg-white dark:bg-stone-950 text-black dark:text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    <Moon size={13} />
                    <span>Dark</span>
                  </button>
                  <button
                    onClick={() => setThemeMode('system')}
                    className={`min-h-[36px] flex items-center justify-center gap-1.5 text-xs font-semibold rounded-md transition-all ${
                      themeMode === 'system'
                        ? 'bg-white dark:bg-stone-950 text-black dark:text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    <Laptop size={13} />
                    <span>System</span>
                  </button>
                </div>
              </div>

              {/* Mobile Currency Selector */}
              <div>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400 mb-1.5">
                  Currency ({currency})
                </p>
                <div className="grid grid-cols-4 gap-1">
                  {currencies.map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setCurrency(curr)}
                      className={`min-h-[34px] text-xs font-mono font-semibold rounded border transition-colors ${
                        currency === curr
                          ? 'bg-[#111111] dark:bg-[#C6A56B] text-white border-transparent'
                          : 'border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-500'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
