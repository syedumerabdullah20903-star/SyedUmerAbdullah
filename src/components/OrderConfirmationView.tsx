import React, { useMemo } from 'react';
import { 
  CheckCircle, 
  Printer, 
  Package, 
  Truck, 
  Clock, 
  Home, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface OrderConfirmationViewProps {
  orderId?: string;
}

export const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = ({ orderId }) => {
  const { currentOrder, getOrderById, formatPrice, navigateTo } = useShop();

  const order = useMemo(() => {
    if (orderId) {
      return getOrderById(orderId) || currentOrder;
    }
    return currentOrder;
  }, [orderId, currentOrder, getOrderById]);

  if (!order) {
    return (
      <div className="py-20 max-w-xl mx-auto px-4 text-center">
        <h2 
          className="text-2xl font-light text-[#0C0C0D]"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          No Active Atelier Order Found
        </h2>
        <p className="text-xs text-stone-500 mt-2 mb-6">
          You have not placed an order in this current session yet, or the order code has expired.
        </p>
        <button
          onClick={() => navigateTo('home')}
          className="px-6 py-3 bg-[#0C0C0D] text-white text-xs uppercase tracking-wider font-semibold hover:bg-stone-800 transition-colors"
        >
          Return to Boutique
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const trackingSteps = [
    { title: 'Order Confirmed', time: 'Today', done: true, icon: CheckCircle },
    { title: 'Atelier Tailoring & Quality Audit', time: 'In Progress', done: true, icon: Package },
    { title: 'Courier Dispatch & Seal', time: 'Tomorrow', done: false, icon: Truck },
    { title: 'White-Glove Delivery', time: order.estimatedDeliveryDate, done: false, icon: Home },
  ];

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Printable Receipt Card */}
      <div className="bg-white border border-stone-200 rounded-lg shadow-sm p-6 sm:p-10 print:border-none print:shadow-none space-y-8">
        {/* Header confirmation */}
        <div className="text-center space-y-3 pb-8 border-b border-stone-200">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center">
            <CheckCircle size={32} />
          </div>

          <span className="text-[11px] tracking-[0.3em] uppercase text-[#A88756] font-semibold">
            Order Confirmed & Registered
          </span>

          <h1 
            className="text-3xl sm:text-4xl text-[#0C0C0D] font-light"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Thank You, {order.customer.firstName}
          </h1>

          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
            Your atelier order has been logged into our master workroom queue. A confirmation dispatch has been sent to{' '}
            <strong className="text-stone-800">{order.customer.email}</strong>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-3 text-xs font-mono">
            <span className="px-3 py-1 bg-stone-100 rounded text-stone-800">
              Order No: <strong>{order.orderNumber}</strong>
            </span>
            <span className="px-3 py-1 bg-stone-100 rounded text-stone-800">
              Tracking: <strong>{order.trackingNumber}</strong>
            </span>
            <span className="px-3 py-1 bg-stone-100 rounded text-stone-800">
              Date: <strong>{order.date}</strong>
            </span>
          </div>
        </div>

        {/* Live Tracking Timeline */}
        <div className="space-y-4 print:hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-900">
              Live Atelier Order Tracker
            </h3>
            <span className="text-xs text-stone-500 flex items-center gap-1 font-mono">
              <Clock size={12} className="text-[#A88756]" />
              Estimated Delivery: {order.estimatedDeliveryDate}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#FAF8F5] border border-stone-200 rounded">
            {trackingSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="flex flex-col items-start space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                      step.done ? 'bg-[#0C0C0D] text-[#D4AF37]' : 'bg-stone-200 text-stone-400'
                    }`}>
                      <Icon size={14} />
                    </div>
                    <span className="text-[10px] font-mono text-stone-400">Step 0{idx + 1}</span>
                  </div>
                  <p className="text-xs font-semibold text-stone-900 leading-tight">
                    {step.title}
                  </p>
                  <p className="text-[10px] text-stone-500 font-mono">
                    {step.time}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Itemized Receipt Table */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-900">
            Official Itemized Receipt
          </h3>

          <div className="border border-stone-200 rounded overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Garment / Piece</th>
                  <th className="p-3">Tailored Options</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-stone-800">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/50">
                    <td className="p-3 font-medium">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-8 h-10 object-cover rounded bg-stone-100 shrink-0"
                        />
                        <span className="line-clamp-1">{item.productName}</span>
                      </div>
                    </td>
                    <td className="p-3 text-stone-600 font-mono text-[11px]">
                      Size: {item.selectedSize} · {item.selectedColor}
                    </td>
                    <td className="p-3 text-center font-mono">{item.quantity}</td>
                    <td className="p-3 text-right font-mono font-semibold tabular-nums">
                      {formatPrice(item.pricePKR * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Breakdown & Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-stone-200 text-xs">
          {/* Customer Info */}
          <div className="space-y-1.5 text-stone-600">
            <p className="uppercase tracking-wider font-semibold text-stone-900 pb-1">
              Delivery Destination & Payment
            </p>
            <p className="font-semibold text-stone-900">
              {order.customer.firstName} {order.customer.lastName}
            </p>
            <p>{order.customer.address}</p>
            {order.customer.apartment && <p>{order.customer.apartment}</p>}
            <p>
              {order.customer.city}, {order.customer.stateProvince} {order.customer.postalCode}
            </p>
            <p className="font-mono">Phone: {order.customer.phone}</p>
            <p className="pt-2">
              Payment Method:{' '}
              <strong className="text-stone-900 uppercase">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card (Simulated)'}
              </strong>
            </p>
          </div>

          {/* Pricing Totals */}
          <div className="space-y-2 text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums">{formatPrice(order.subtotalPKR)}</span>
            </div>

            {order.discountPKR > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Privilege Discount</span>
                <span className="font-mono tabular-nums">-{formatPrice(order.discountPKR)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping & White-Glove Handling</span>
              <span className="font-mono tabular-nums">
                {order.shippingPKR === 0 ? 'Complimentary' : formatPrice(order.shippingPKR)}
              </span>
            </div>

            <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline font-bold text-sm text-stone-900">
              <span>Total Paid / Payable</span>
              <span className="text-base font-mono tabular-nums text-black">
                {formatPrice(order.totalPKR)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions Toolbar */}
        <div className="pt-8 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 border border-stone-300 rounded text-xs font-semibold text-stone-700 hover:border-black flex items-center gap-2 transition-colors"
          >
            <Printer size={15} />
            <span>Print Official Receipt</span>
          </button>

          <button
            onClick={() => navigateTo('home')}
            className="px-6 py-2.5 bg-[#0C0C0D] text-white rounded text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#D4AF37] hover:text-[#0C0C0D] transition-colors flex items-center gap-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
