import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#0C0C0D] text-white p-4 rounded shadow-2xl border border-stone-800 flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-200"
        >
          {toast.type === 'success' && (
            <CheckCircle2 size={16} className="text-[#D4AF37] shrink-0 mt-0.5" />
          )}
          {toast.type === 'error' && (
            <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
          )}
          {toast.type === 'info' && (
            <Info size={16} className="text-stone-300 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 space-y-0.5">
            <h4 className="text-xs font-semibold text-white tracking-wide">
              {toast.title}
            </h4>
            {toast.description && (
              <p className="text-[11px] text-stone-300 font-light leading-snug">
                {toast.description}
              </p>
            )}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-stone-400 hover:text-white p-0.5"
            aria-label="Dismiss toast"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
