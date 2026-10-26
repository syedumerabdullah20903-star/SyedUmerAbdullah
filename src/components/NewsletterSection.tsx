import React, { useState } from 'react';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const NewsletterSection: React.FC = () => {
  const { addToast } = useShop();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    addToast('Welcome to the Atelier', 'Use code ZAVIK10 for 10% off your initial wardrobe order.', 'success');
  };

  return (
    <section className="py-16 sm:py-20 bg-[#F4EFEB] dark:bg-[#121419] border-t border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#A88756] font-semibold">
          The Private Registry
        </span>

        <h2 
          className="text-2xl sm:text-3xl md:text-4xl text-[#0C0C0D] dark:text-[#F8F6F1] font-light tracking-tight"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Receive Atelier Invitations & Private Drops
        </h2>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-lg mx-auto font-light leading-relaxed">
          Be first to inspect seasonal lookbooks, limited couture releases, and private trunk shows before general public availability.
        </p>

        {subscribed ? (
          <div className="p-6 bg-white dark:bg-[#181B22] border border-stone-200 dark:border-stone-800 rounded max-w-md mx-auto space-y-2 animate-in fade-in zoom-in-95 shadow-sm">
            <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider">
              <CheckCircle size={16} />
              <span>Privilege Granted</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              Your email has been entered into the ZAVIK Atelier Registry.
            </p>
            <div className="pt-2">
              <span className="inline-block px-4 py-2 bg-stone-100 dark:bg-stone-800 rounded text-xs font-mono font-bold text-black dark:text-white border border-stone-300 dark:border-stone-700">
                PROMO CODE: ZAVIK10
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your private email address"
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#181B22] border border-stone-300 dark:border-stone-700 rounded text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-black dark:focus:border-[#C6A56B] font-light"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#0C0C0D] dark:bg-[#C6A56B] text-white dark:text-[#0C0C0D] text-xs uppercase tracking-[0.2em] font-semibold rounded hover:bg-[#D4AF37] dark:hover:bg-[#E2C792] transition-colors flex items-center justify-center gap-2 shrink-0 touch-target"
            >
              <span>Join Registry</span>
              <ArrowRight size={14} />
            </button>
          </form>
        )}

        <p className="text-[10px] text-stone-400 dark:text-stone-500 tracking-wide uppercase">
          Strict Privacy Guaranteed · No Unsolicited Telemetry · Unsubscribe Anytime
        </p>
      </div>
    </section>
  );
};
