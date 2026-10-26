import React, { useState } from 'react';
import { 
  ChevronRight, 
  ShieldCheck, 
  CreditCard, 
  Banknote, 
  Truck, 
  Lock, 
  ArrowLeft, 
  CheckCircle2, 
  ChevronDown 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CustomerDetails } from '../types';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotalPKR,
    cartDiscountPKR,
    cartShippingPKR,
    cartTotalPKR,
    formatPrice,
    placeOrder,
    navigateTo,
    discountCode,
    discountPercent,
  } = useShop();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);

  // Customer Form State
  const [formData, setFormData] = useState<CustomerDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: 'Lahore',
    stateProvince: 'Punjab',
    postalCode: '54000',
    country: 'Pakistan',
    deliveryNotes: '',
  });

  const [deliveryTier, setDeliveryTier] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4242 •••• •••• 4242',
    nameOnCard: '',
    expiry: '12/28',
    cvv: '888',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Express surcharge
  const expressSurchargePKR = deliveryTier === 'express' ? 1500 : 0;
  const finalPayablePKR = cartTotalPKR + expressSurchargePKR;

  // Validation
  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errors.email = 'Valid email is required for tracking';
    }
    if (!formData.phone.trim() || formData.phone.length < 9) {
      errors.phone = 'Valid phone number is required';
    }
    if (!formData.address.trim()) errors.address = 'Street address is required';
    if (!formData.city.trim()) errors.city = 'City is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (step === 2) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinalOrderSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const order = placeOrder(formData, paymentMethod);
      setIsSubmitting(false);
      navigateTo('order-confirmation', { orderId: order.orderId });
    }, 800);
  };

  if (cart.length === 0) {
    return (
      <div className="py-16 max-w-sm mx-auto px-4 text-center">
        <h2 
          className="text-2xl font-light text-[#111111] dark:text-[#F8F6F1]"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          No Items in Bag for Checkout
        </h2>
        <p className="text-xs text-stone-500 mt-2 mb-6">
          Your shopping bag is currently empty. Please add items to begin checkout.
        </p>
        <button
          onClick={() => navigateTo('catalog', { category: 'all' })}
          className="min-h-[44px] px-6 py-2.5 bg-[#111111] dark:bg-[#C6A56B] text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-stone-800 transition-colors touch-target"
        >
          Browse Collections
        </button>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* Mobile Collapsible Order Summary Bar */}
      <div className="lg:hidden mb-6 bg-white dark:bg-[#1A1A1C] border border-stone-200 dark:border-stone-800 rounded-lg p-3.5 shadow-xs">
        <button
          type="button"
          onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
          className="w-full flex items-center justify-between text-xs font-semibold text-stone-800 dark:text-stone-200 touch-target"
        >
          <span className="flex items-center gap-1.5">
            <span>Order Summary ({cart.length} items)</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${isMobileSummaryOpen ? 'rotate-180' : ''}`} />
          </span>
          <span className="font-mono text-sm font-bold text-black dark:text-white tabular-nums">
            {formatPrice(finalPayablePKR)}
          </span>
        </button>

        {isMobileSummaryOpen && (
          <div className="pt-3 mt-2 border-t border-stone-200 dark:border-stone-800 space-y-2 text-xs">
            <div className="max-h-40 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800">
              {cart.map((item) => (
                <div key={item.id} className="py-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-8 h-10 object-cover rounded bg-stone-100 shrink-0" />
                    <span className="truncate">{item.product.name} ({item.selectedSize}) × {item.quantity}</span>
                  </div>
                  <span className="font-mono font-semibold shrink-0">{formatPrice(item.product.pricePKR * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-1">
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Subtotal</span>
                <span className="font-mono">{formatPrice(cartSubtotalPKR)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                  <span>Discount ({discountPercent}%)</span>
                  <span className="font-mono">-{formatPrice(cartDiscountPKR)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Delivery</span>
                <span className="font-mono">
                  {cartShippingPKR + expressSurchargePKR === 0 ? 'Free' : formatPrice(cartShippingPKR + expressSurchargePKR)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Stepper (Mobile compact) */}
      <div className="max-w-xl mx-auto mb-6 sm:mb-10 px-2">
        <div className="flex items-center justify-between text-[11px] sm:text-xs uppercase tracking-wider font-semibold">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-black dark:text-white font-bold' : 'text-stone-400'}`}>
            <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] font-mono ${
              step >= 1 ? 'bg-[#111111] dark:bg-[#C6A56B] text-white' : 'bg-stone-200 dark:bg-stone-800 text-stone-600'
            }`}>
              1
            </span>
            <span>Contact</span>
          </div>

          <div className="flex-1 max-w-[40px] sm:max-w-[80px] h-[1px] bg-stone-300 dark:bg-stone-700 mx-2" />

          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-black dark:text-white font-bold' : 'text-stone-400'}`}>
            <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] font-mono ${
              step >= 2 ? 'bg-[#111111] dark:bg-[#C6A56B] text-white' : 'bg-stone-200 dark:bg-stone-800 text-stone-600'
            }`}>
              2
            </span>
            <span>Payment</span>
          </div>

          <div className="flex-1 max-w-[40px] sm:max-w-[80px] h-[1px] bg-stone-300 dark:bg-stone-700 mx-2" />

          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-black dark:text-white font-bold' : 'text-stone-400'}`}>
            <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] font-mono ${
              step === 3 ? 'bg-[#111111] dark:bg-[#C6A56B] text-white' : 'bg-stone-200 dark:bg-stone-800 text-stone-600'
            }`}>
              3
            </span>
            <span>Confirm</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Left, Sticky Summary Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
        {/* Form Container (lg: 7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#1A1A1C] p-4 sm:p-8 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs">
          {/* STEP 1: Address & Contact */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4 sm:space-y-6">
              <div>
                <h2 
                  className="text-xl sm:text-2xl font-light text-[#111111] dark:text-[#F8F6F1]"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Contact & Shipping Destination
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Accurate phone and address are required for courier dispatch and delivery updates.
                </p>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    First Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="e.g. Tariq"
                    className={`w-full min-h-[44px] px-3.5 py-2.5 text-xs border rounded bg-white dark:bg-[#202023] text-stone-900 dark:text-stone-100 focus:outline-none ${
                      formErrors.firstName ? 'border-rose-500' : 'border-stone-300 dark:border-stone-700 focus:border-black'
                    }`}
                  />
                  {formErrors.firstName && (
                    <span className="text-[11px] text-rose-600">{formErrors.firstName}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Last Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="e.g. Mansoor"
                    className={`w-full min-h-[44px] px-3.5 py-2.5 text-xs border rounded bg-white dark:bg-[#202023] text-stone-900 dark:text-stone-100 focus:outline-none ${
                      formErrors.lastName ? 'border-rose-500' : 'border-stone-300 dark:border-stone-700 focus:border-black'
                    }`}
                  />
                  {formErrors.lastName && (
                    <span className="text-[11px] text-rose-600">{formErrors.lastName}</span>
                  )}
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Email Address <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    inputMode="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tariq@example.com"
                    className={`w-full min-h-[44px] px-3.5 py-2.5 text-xs border rounded bg-white dark:bg-[#202023] text-stone-900 dark:text-stone-100 focus:outline-none ${
                      formErrors.email ? 'border-rose-500' : 'border-stone-300 dark:border-stone-700 focus:border-black'
                    }`}
                  />
                  {formErrors.email && (
                    <span className="text-[11px] text-rose-600">{formErrors.email}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Mobile Phone <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    inputMode="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+92 300 1234567"
                    className={`w-full min-h-[44px] px-3.5 py-2.5 text-xs border rounded bg-white dark:bg-[#202023] text-stone-900 dark:text-stone-100 focus:outline-none ${
                      formErrors.phone ? 'border-rose-500' : 'border-stone-300 dark:border-stone-700 focus:border-black'
                    }`}
                  />
                  {formErrors.phone && (
                    <span className="text-[11px] text-rose-600">{formErrors.phone}</span>
                  )}
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Street Address & House/Building Number <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. House 42, Block D, Gulberg III"
                  className={`w-full min-h-[44px] px-3.5 py-2.5 text-xs border rounded bg-white dark:bg-[#202023] text-stone-900 dark:text-stone-100 focus:outline-none ${
                    formErrors.address ? 'border-rose-500' : 'border-stone-300 dark:border-stone-700 focus:border-black'
                  }`}
                />
                {formErrors.address && (
                  <span className="text-[11px] text-rose-600">{formErrors.address}</span>
                )}
              </div>

              {/* Apartment / Suite */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Apartment, Suite, Unit (Optional)
                </label>
                <input
                  type="text"
                  value={formData.apartment}
                  onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                  placeholder="e.g. Suite 4B"
                  className="w-full min-h-[44px] px-3.5 py-2.5 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#202023] rounded focus:outline-none focus:border-black"
                />
              </div>

              {/* City, Province, Postal, Country */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    City <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full min-h-[44px] px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#202023] rounded focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Province
                  </label>
                  <input
                    type="text"
                    value={formData.stateProvince}
                    onChange={(e) => setFormData({ ...formData, stateProvince: e.target.value })}
                    className="w-full min-h-[44px] px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#202023] rounded focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full min-h-[44px] px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#202023] rounded focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.country}
                    className="w-full min-h-[44px] px-3 py-2 text-xs border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 rounded text-stone-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Delivery Notes */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Atelier Packaging Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.deliveryNotes}
                  onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                  placeholder="e.g. Leave with concierge; gift packaging requested"
                  className="w-full px-3.5 py-2 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#202023] rounded focus:outline-none focus:border-black"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 bg-[#111111] dark:bg-[#C6A56B] text-white dark:text-[#111111] text-xs uppercase tracking-[0.2em] font-bold rounded hover:bg-[#C6A56B] hover:text-[#111111] transition-colors flex items-center justify-center gap-2 touch-target shadow-md active:scale-[0.99]"
                >
                  <span>Continue to Delivery & Payment</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Delivery & Payment Options */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 
                  className="text-xl sm:text-2xl font-light text-[#111111] dark:text-[#F8F6F1]"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Delivery Service & Payment Method
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Select your preferred transport speed and payment settlement.
                </p>
              </div>

              {/* Shipping Tier Selector */}
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-wider font-semibold text-stone-900 dark:text-stone-100">
                  Select Delivery Service
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setDeliveryTier('standard')}
                    className={`min-h-[72px] p-4 border rounded cursor-pointer transition-all touch-target ${
                      deliveryTier === 'standard'
                        ? 'border-black dark:border-white bg-stone-50 dark:bg-stone-800 ring-1 ring-black dark:ring-white'
                        : 'border-stone-300 dark:border-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100">Standard White-Glove</span>
                      <span className="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                        {cartShippingPKR === 0 ? 'Complimentary' : formatPrice(cartShippingPKR)}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                      3-4 business days. Signature box & garment bag.
                    </p>
                  </div>

                  <div
                    onClick={() => setDeliveryTier('express')}
                    className={`min-h-[72px] p-4 border rounded cursor-pointer transition-all touch-target ${
                      deliveryTier === 'express'
                        ? 'border-black dark:border-white bg-stone-50 dark:bg-stone-800 ring-1 ring-black dark:ring-white'
                        : 'border-stone-300 dark:border-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100">Express Courier</span>
                      <span className="text-xs font-mono font-semibold text-stone-900 dark:text-stone-100">
                        +{formatPrice(1500)}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                      1-2 business days. Direct priority courier service.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3 pt-3 border-t border-stone-200 dark:border-stone-800">
                <p className="text-xs uppercase tracking-wider font-semibold text-stone-900 dark:text-stone-100">
                  Payment Method
                </p>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`min-h-[64px] p-4 border rounded cursor-pointer transition-all touch-target ${
                    paymentMethod === 'cod'
                      ? 'border-black dark:border-white bg-stone-50 dark:bg-stone-800 ring-1 ring-black dark:ring-white'
                      : 'border-stone-300 dark:border-stone-700 hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Banknote className="text-stone-800 dark:text-stone-200 shrink-0" size={20} />
                    <div className="flex-1">
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        Cash on Delivery (COD) — Recommended
                      </span>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                        Inspect garments upon arrival and settle with courier in cash.
                      </p>
                    </div>
                    {paymentMethod === 'cod' && <CheckCircle2 size={16} className="text-black dark:text-[#C6A56B] shrink-0" />}
                  </div>
                </div>

                {/* Simulated Card */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`min-h-[64px] p-4 border rounded cursor-pointer transition-all touch-target ${
                    paymentMethod === 'card'
                      ? 'border-black dark:border-white bg-stone-50 dark:bg-stone-800 ring-1 ring-black dark:ring-white'
                      : 'border-stone-300 dark:border-stone-700 hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-stone-800 dark:text-stone-200 shrink-0" size={20} />
                    <div className="flex-1">
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        Credit / Debit Card (Online Simulation)
                      </span>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                        Simulated card authorization with instant receipt.
                      </p>
                    </div>
                    {paymentMethod === 'card' && <CheckCircle2 size={16} className="text-black dark:text-[#C6A56B] shrink-0" />}
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-700 grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={cardDetails.nameOnCard || `${formData.firstName} ${formData.lastName}`}
                          onChange={(e) => setCardDetails({ ...cardDetails, nameOnCard: e.target.value })}
                          className="w-full min-h-[44px] px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#202023] rounded font-mono"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardDetails.cardNumber}
                          onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                          className="w-full min-h-[44px] px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#202023] rounded font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 mb-1">
                          Expires
                        </label>
                        <input
                          type="text"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                          className="w-full min-h-[44px] px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#202023] rounded font-mono text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                          className="w-full min-h-[44px] px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#202023] rounded font-mono text-center"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="min-h-[44px] px-4 py-2 text-xs text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white flex items-center gap-1.5 touch-target"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="min-h-[48px] px-8 py-3 bg-[#111111] dark:bg-[#C6A56B] text-white dark:text-[#111111] text-xs uppercase tracking-[0.2em] font-bold rounded hover:bg-[#C6A56B] transition-colors flex items-center gap-2 touch-target shadow-md active:scale-[0.99]"
                >
                  <span>Review Final Order</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Place Order */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 
                  className="text-xl sm:text-2xl font-light text-[#111111] dark:text-[#F8F6F1]"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Review Atelier Order & Authorize
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Please verify your coordinates and garment selections before final reservation.
                </p>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Shipping */}
                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded space-y-1">
                  <div className="flex items-center justify-between pb-1 border-b border-stone-200 dark:border-stone-700">
                    <span className="uppercase tracking-wider font-semibold text-stone-900 dark:text-stone-100">
                      Destination
                    </span>
                    <button
                      onClick={() => setStep(1)}
                      className="text-[#C6A56B] hover:underline text-[11px] font-semibold"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="font-semibold text-stone-900 dark:text-stone-100 pt-1">
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p className="text-stone-600 dark:text-stone-300">{formData.address}</p>
                  <p className="text-stone-600 dark:text-stone-300">
                    {formData.city}, {formData.stateProvince}
                  </p>
                  <p className="text-stone-500 dark:text-stone-400 font-mono pt-1">📞 {formData.phone}</p>
                </div>

                {/* Delivery & Payment Method */}
                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded space-y-1">
                  <div className="flex items-center justify-between pb-1 border-b border-stone-200 dark:border-stone-700">
                    <span className="uppercase tracking-wider font-semibold text-stone-900 dark:text-stone-100">
                      Service & Payment
                    </span>
                    <button
                      onClick={() => setStep(2)}
                      className="text-[#C6A56B] hover:underline text-[11px] font-semibold"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="font-semibold text-stone-900 dark:text-stone-100 pt-1">
                    {deliveryTier === 'express' ? 'Express Courier' : 'Standard White-Glove'}
                  </p>
                  <p className="text-stone-600 dark:text-stone-300">
                    {paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Credit Card (Simulated)'}
                  </p>
                  <p className="text-stone-500 dark:text-stone-400 text-[11px] pt-1">
                    ETA: 2-3 business days
                  </p>
                </div>
              </div>

              {/* Security Banner */}
              <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded flex items-center gap-2.5 text-xs text-stone-600 dark:text-stone-300">
                <Lock size={15} className="text-[#C6A56B] shrink-0" />
                <span>
                  Protected local checkout. No sensitive card credentials stored on public servers.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto min-h-[44px] px-4 py-2 text-xs text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white flex items-center justify-center gap-1.5 touch-target"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Delivery</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalOrderSubmit}
                  className="w-full sm:w-auto min-h-[50px] px-8 py-3.5 bg-[#111111] dark:bg-[#C6A56B] text-white dark:text-[#111111] text-xs uppercase tracking-[0.2em] font-bold rounded hover:bg-[#C6A56B] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 touch-target active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <span>Confirming Atelier Order...</span>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      <span>Place Order ({formatPrice(finalPayablePKR)})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Sticky Order Summary (lg: 5 cols) */}
        <div className="hidden lg:block lg:col-span-5">
          <div className="sticky top-28 bg-white dark:bg-[#1A1A1C] p-6 rounded-lg border border-stone-200 dark:border-stone-800 space-y-5">
            <h3 
              className="text-xl font-light text-[#111111] dark:text-[#F8F6F1]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Order Valuation Summary
            </h3>

            {/* Itemized preview */}
            <div className="divide-y divide-stone-100 dark:divide-stone-800 max-h-56 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 truncate">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-9 h-11 object-cover rounded bg-stone-100 shrink-0" />
                    <div className="truncate">
                      <p className="font-medium text-stone-900 dark:text-stone-100 truncate">{item.product.name}</p>
                      <p className="text-[11px] text-stone-500">Size {item.selectedSize} × {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-mono font-semibold tabular-nums shrink-0">{formatPrice(item.product.pricePKR * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs pt-2 border-t border-stone-200 dark:border-stone-800">
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">{formatPrice(cartSubtotalPKR)}</span>
              </div>

              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                  <span>Privilege Code ({discountCode})</span>
                  <span className="font-mono tabular-nums">-{formatPrice(cartDiscountPKR)}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Delivery Service</span>
                <span className="font-mono tabular-nums">
                  {cartShippingPKR === 0 ? 'Complimentary' : formatPrice(cartShippingPKR)}
                </span>
              </div>

              {deliveryTier === 'express' && (
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>Express Upgrade</span>
                  <span className="font-mono tabular-nums">+{formatPrice(1500)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex justify-between items-baseline text-sm font-bold text-stone-900 dark:text-stone-100">
                <span>Total Due</span>
                <span className="text-lg font-mono tabular-nums text-black dark:text-white">
                  {formatPrice(finalPayablePKR)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded text-[11px] text-stone-500 dark:text-stone-400">
              <p className="font-semibold text-stone-800 dark:text-stone-200">Complimentary Atelier Returns</p>
              <p>Eligible for size exchanges or returns within 14 calendar days of delivery.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
