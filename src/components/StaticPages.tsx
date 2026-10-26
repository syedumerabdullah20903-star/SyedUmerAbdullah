import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  HelpCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Search, 
  CheckCircle2, 
  ChevronDown 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
      <div className="text-center space-y-3">
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#A88756] font-semibold">
          The Maison Story
        </span>
        <h1 
          className="text-3xl sm:text-4xl md:text-5xl text-[#0C0C0D] dark:text-[#F8F6F1] font-light tracking-tight"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          The Architecture of ZAVIK
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-xl mx-auto font-light leading-relaxed">
          Born out of a refusal to accept that luxury aesthetics, premium noble fabrics, and enduring craftsmanship must carry an astronomical markup.
        </p>
      </div>

      <div className="aspect-[16/9] w-full overflow-hidden bg-stone-200 dark:bg-stone-800 rounded">
        <img
          src="/src/assets/images/zavik_hero_luxury_editorial_1792755887394.jpg"
          alt="ZAVIK Atelier Craftsmen"
          className="w-full h-full object-cover filter brightness-[0.85]"
        />
      </div>

      <div className="prose prose-stone dark:prose-invert max-w-none space-y-6 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-light">
        <h3 className="text-lg sm:text-xl font-normal text-stone-900 dark:text-stone-100" style={{ fontFamily: 'var(--font-serif)' }}>
          1. The Creative Vision
        </h3>
        <p>
          ZAVIK was established to bridge the chasm between disposable fast fashion and prohibitive ultra-luxury couture. 
          Taking aesthetic cues from the minimalist mastery of European ateliers, we engineer silhouettes characterized by 
          unflinching structural discipline, clean lines, and neutral chromatic harmony.
        </p>

        <h3 className="text-lg sm:text-xl font-normal text-stone-900 dark:text-stone-100" style={{ fontFamily: 'var(--font-serif)' }}>
          2. Fabric Sourcing Without Compromise
        </h3>
        <p>
          We source directly from heritage textile mills across Biella, Como, and specialized South Asian artisan weaving guilds. 
          Our suits are tailored from Super 120s virgin wool; our gowns are cut on the true bias from pure 22-momme Mulberry silk; 
          and our tees are spun from hand-harvested Peruvian Pima cotton.
        </p>

        <h3 className="text-lg sm:text-xl font-normal text-stone-900 dark:text-stone-100" style={{ fontFamily: 'var(--font-serif)' }}>
          3. Fair Value & Ethical Ateliers
        </h3>
        <p>
          By maintaining a digital-first direct salon model, we remove the multi-tiered wholesale distributor fees, opulent 
          retail rent, and celebrity sponsorship budgets that inflate legacy luxury prices by 10x to 15x. The result is pure, 
          authentic craftsmanship at accessible mid-range pricing.
        </p>
      </div>

      <div className="pt-4 sm:pt-8 text-center">
        <button
          onClick={() => navigateTo('catalog', { category: 'all' })}
          className="px-8 py-3.5 bg-[#0C0C0D] dark:bg-[#C6A56B] text-white dark:text-[#0C0C0D] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#D4AF37] dark:hover:bg-[#DFC79B] transition-colors touch-target"
        >
          Explore Our Wardrobe Collections
        </button>
      </div>
    </div>
  );
};

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is the philosophy behind ZAVIK pricing?',
      a: 'ZAVIK provides the genuine garment construction, drape, and noble fabric quality of luxury fashion houses at mid-range direct-to-consumer prices. By eliminating middlemen and retail markups, our clients receive master-tailored pieces without designer inflation.',
    },
    {
      q: 'How does Cash on Delivery (COD) operate?',
      a: 'For orders placed under Cash on Delivery, our white-glove courier delivers the package in signature packaging. You may inspect the package and pay the exact invoice amount in cash directly upon receipt.',
    },
    {
      q: 'What is the estimated delivery timeframe?',
      a: 'Standard domestic delivery arrives within 3-4 business days. Priority Express Atelier Courier delivers within 1-2 business days. Tracking details and SMS notifications are transmitted immediately upon workroom release.',
    },
    {
      q: 'What is your exchange and return policy?',
      a: 'We offer complimentary 14-day returns and size exchanges. Garments must remain unworn, unwashed, and in their original signature dust bags with security tags intact.',
    },
    {
      q: 'How should I determine my optimal tailored fit?',
      a: 'All ZAVIK garments are cut true to European sizing standards. You may consult our interactive Size Guide on any product detail page, or message our Atelier Concierge for bespoke sizing recommendations.',
    },
  ];

  return (
    <div className="py-12 sm:py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
      <div className="text-center space-y-2">
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#A88756] font-semibold">
          Client Inquiries
        </span>
        <h1 
          className="text-3xl sm:text-4xl text-[#0C0C0D] dark:text-[#F8F6F1] font-light tracking-tight"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Frequently Asked Questions
        </h1>
      </div>

      <div className="divide-y divide-stone-200 dark:divide-stone-800 border-y border-stone-200 dark:border-stone-800">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="py-5">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left gap-4 group py-1 touch-target"
              >
                <span className="text-sm font-semibold text-stone-900 dark:text-stone-100 group-hover:text-[#A88756] dark:group-hover:text-[#D4AF37] transition-colors">
                  {faq.q}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-stone-400 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-black dark:text-white' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <p className="mt-3 text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-light leading-relaxed animate-in fade-in duration-150">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ShippingReturnsPage: React.FC = () => {
  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
      <div className="text-center space-y-2">
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#A88756] font-semibold">
          White-Glove Logistics
        </span>
        <h1 
          className="text-3xl sm:text-4xl text-[#0C0C0D] dark:text-[#F8F6F1] font-light tracking-tight"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Shipping, Delivery & Returns Policy
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-[#181B22] border border-stone-200 dark:border-stone-800 rounded text-center space-y-2 shadow-xs">
          <Truck size={24} className="mx-auto text-[#0C0C0D] dark:text-[#D4AF37]" />
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
            Complimentary Shipping
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Orders above Rs. 15,000 qualify for complimentary white-glove transport with signature confirmation.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-[#181B22] border border-stone-200 dark:border-stone-800 rounded text-center space-y-2 shadow-xs">
          <RotateCcw size={24} className="mx-auto text-[#0C0C0D] dark:text-[#D4AF37]" />
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
            14-Day Exchanges
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Try your pieces in the comfort of your sanctuary. Exchanges for alternative sizes are fully complimentary.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-[#181B22] border border-stone-200 dark:border-stone-800 rounded text-center space-y-2 shadow-xs">
          <ShieldCheck size={24} className="mx-auto text-[#0C0C0D] dark:text-[#D4AF37]" />
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
            Atelier Packaging
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Delivered in breathable archival cotton garment bags, cedar garment protection, and rigid presentation boxes.
          </p>
        </div>
      </div>

      <div className="space-y-6 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-light">
        <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
          Return Instructions
        </h4>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Ensure the garments are in pristine, unworn condition with tags and original packaging intact.</li>
          <li>Initiate an exchange request via our Atelier Concierge portal or email concierge@zavik.com.</li>
          <li>Our courier partner will pick up the parcel directly from your doorstep at no additional charge.</li>
          <li>Upon quality inspection at our atelier, replacement garments or store credits are released immediately.</li>
        </ol>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { addToast } = useShop();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    addToast('Inquiry Received', 'An Atelier Concierge specialist will contact you within 4 business hours.', 'success');
  };

  return (
    <div className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center space-y-2">
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#A88756] font-semibold">
          Client Relations
        </span>
        <h1 
          className="text-3xl sm:text-4xl text-[#0C0C0D] font-light tracking-tight"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Atelier Client Concierge
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto">
          For styling appointments, order tracking assistance, bespoke alterations, or fabric consultations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact info cards */}
        <div className="md:col-span-5 space-y-4 text-xs text-stone-600 dark:text-stone-300">
          <div className="p-5 bg-white dark:bg-[#181B22] border border-stone-200 dark:border-stone-800 rounded space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-semibold uppercase tracking-wider">
              <Mail size={16} className="text-[#A88756] dark:text-[#D4AF37]" />
              <span>Email Inquiries</span>
            </div>
            <p>concierge@zavik.com</p>
            <p className="text-stone-400 dark:text-stone-500">Response within 4 hours</p>
          </div>

          <div className="p-5 bg-white dark:bg-[#181B22] border border-stone-200 dark:border-stone-800 rounded space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-semibold uppercase tracking-wider">
              <Phone size={16} className="text-[#A88756] dark:text-[#D4AF37]" />
              <span>Direct Workroom Line</span>
            </div>
            <p className="font-mono">+92 42 3578 9900</p>
            <p className="text-stone-400 dark:text-stone-500">Monday – Saturday: 10:00 – 19:00 PKT</p>
          </div>

          <div className="p-5 bg-white dark:bg-[#181B22] border border-stone-200 dark:border-stone-800 rounded space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-semibold uppercase tracking-wider">
              <MapPin size={16} className="text-[#A88756] dark:text-[#D4AF37]" />
              <span>Atelier Location</span>
            </div>
            <p>ZAVIK Flagship Workroom</p>
            <p>Gulberg Galleria, Main Boulevard, Lahore, Pakistan</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 bg-white dark:bg-[#181B22] p-6 sm:p-8 border border-stone-200 dark:border-stone-800 rounded shadow-xs">
          {sent ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 size={36} className="mx-auto text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-lg font-medium text-stone-900 dark:text-stone-100" style={{ fontFamily: 'var(--font-serif)' }}>
                Your Message Has Been Dispatched
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto">
                Thank you for contacting the ZAVIK atelier. A client advisor will respond promptly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-[#101216] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded focus:outline-none focus:border-black dark:focus:border-[#C6A56B]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@domain.com"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-[#101216] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded focus:outline-none focus:border-black dark:focus:border-[#C6A56B]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Inquiry Topic
                </label>
                <select className="w-full px-3 py-2 text-xs bg-white dark:bg-[#101216] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded focus:outline-none focus:border-black dark:focus:border-[#C6A56B]">
                  <option>Order Status & Tracking</option>
                  <option>Sizing & Fabric Advice</option>
                  <option>Exchange or Return Request</option>
                  <option>Press & Private Trunk Show</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your inquiry or order details..."
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-[#101216] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded focus:outline-none focus:border-black dark:focus:border-[#C6A56B]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0C0C0D] dark:bg-[#C6A56B] text-white dark:text-[#0C0C0D] text-xs uppercase tracking-[0.2em] font-semibold rounded hover:bg-[#D4AF37] dark:hover:bg-[#DFC79B] transition-colors touch-target"
              >
                Send to Atelier Concierge
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const OrderLookupPage: React.FC = () => {
  const { orders, navigateTo } = useShop();
  const [searchCode, setSearchCode] = useState('');
  const [error, setError] = useState(false);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchCode.trim().toUpperCase();
    const found = orders.find(
      (o) => o.orderNumber.toUpperCase() === clean || o.trackingNumber.toUpperCase() === clean
    );
    if (found) {
      navigateTo('order-confirmation', { orderId: found.orderId });
    } else {
      setError(true);
    }
  };

  return (
    <div className="py-12 sm:py-16 max-w-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#A88756] font-semibold">
          Dispatch Verification
        </span>
        <h1 
          className="text-3xl sm:text-4xl text-[#0C0C0D] dark:text-[#F8F6F1] font-light tracking-tight"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Track Your Atelier Order
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Enter your Order Reference (e.g. ZVK-123456) or tracking number.
        </p>
      </div>

      <form onSubmit={handleLookup} className="space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            required
            value={searchCode}
            onChange={(e) => {
              setSearchCode(e.target.value);
              setError(false);
            }}
            placeholder="e.g. ZVK-892410"
            className="w-full pl-10 pr-4 py-3 text-xs bg-white dark:bg-[#101216] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded font-mono uppercase focus:outline-none focus:border-black dark:focus:border-[#C6A56B]"
          />
        </div>

        {error && (
          <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded border border-rose-200 dark:border-rose-900/50">
            Order reference not found in current local session records. Please verify the code or check past order history below.
          </p>
        )}

        <button
          type="submit"
          className="w-full py-3.5 bg-[#0C0C0D] dark:bg-[#C6A56B] text-white dark:text-[#0C0C0D] text-xs uppercase tracking-[0.2em] font-semibold rounded hover:bg-[#D4AF37] dark:hover:bg-[#DFC79B] transition-colors touch-target"
        >
          Locate Order & Delivery Timeline
        </button>
      </form>

      {/* Recent Orders in Local Storage */}
      {orders.length > 0 && (
        <div className="pt-8 border-t border-stone-200 dark:border-stone-800 space-y-3">
          <p className="text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300">
            Recent Orders in Browser Storage ({orders.length})
          </p>
          <div className="divide-y divide-stone-200 dark:divide-stone-800 border border-stone-200 dark:border-stone-800 rounded bg-white dark:bg-[#181B22] overflow-hidden">
            {orders.map((o) => (
              <div
                key={o.orderId}
                onClick={() => navigateTo('order-confirmation', { orderId: o.orderId })}
                className="p-3.5 flex items-center justify-between text-xs hover:bg-stone-50 dark:hover:bg-[#1E222B] cursor-pointer transition-colors"
              >
                <div>
                  <p className="font-mono font-bold text-stone-900 dark:text-stone-100">{o.orderNumber}</p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    {o.date} · {o.items.length} items · Status: {o.status.toUpperCase()}
                  </p>
                </div>
                <span className="text-[#A88756] dark:text-[#D4AF37] hover:underline font-medium">
                  View Receipt →
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
