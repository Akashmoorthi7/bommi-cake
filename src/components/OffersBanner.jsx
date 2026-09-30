import React from 'react';
import { Tag, Sparkles, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { DISCOUNT_COUPONS } from '../data/cakes';

export const OffersBanner = () => {
  const { coupon, applyCoupon } = useCart();
  const [copiedCode, setCopiedCode] = React.useState(null);

  const handleApply = (code) => {
    applyCoupon(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="bg-comic-charcoal text-white py-5 px-4 border-b-4 border-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Banner Title */}
        <div className="flex items-center gap-3">
          <div className="starburst bg-comic-red p-3 border-2 border-black animate-pulse">
            <span className="font-comic text-xl text-white">DEAL!</span>
          </div>
          <div>
            <h3 className="font-comic text-2xl text-comic-yellow tracking-wide flex items-center gap-2">
              SUPERHERO DISCOUNT VAULT <Sparkles className="w-5 h-5 text-comic-yellow animate-spin" />
            </h3>
            <p className="text-xs text-gray-300 font-bold">
              Tap any comic badge below to automatically apply the discount to your order!
            </p>
          </div>
        </div>

        {/* Coupons List */}
        <div className="flex flex-wrap items-center gap-3">
          {DISCOUNT_COUPONS.map((cpn) => {
            const isApplied = coupon && coupon.code === cpn.code;
            return (
              <button
                key={cpn.code}
                onClick={() => handleApply(cpn.code)}
                className={`comic-badge px-3.5 py-1.5 rounded-lg flex items-center gap-2 text-xs sm:text-sm cursor-pointer transition-transform transform active:scale-95 ${
                  isApplied
                    ? 'bg-comic-green text-black border-2 border-white ring-2 ring-comic-yellow scale-105'
                    : 'bg-white text-black hover:bg-comic-yellow'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span className="font-black font-comic tracking-wider text-sm">{cpn.code}</span>
                <span className="font-body font-bold text-xs bg-black/10 px-1.5 py-0.5 rounded">
                  {cpn.discountPercent ? `${cpn.discountPercent}% OFF` : `₹${cpn.discountAmount} OFF`}
                </span>
                {isApplied ? (
                  <span className="flex items-center text-xs font-bold text-green-900 bg-white/70 px-1 rounded">
                    <Check className="w-3 h-3 mr-0.5" /> APPLIED!
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-600 underline">TAP TO APPLY</span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
