import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { playPopSound, playPowSound } from '../utils/sound';

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
    deliveryFee,
    grandTotal,
    coupon,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen,
  } = useCart();

  const { isLoggedIn, openLogin } = useAuth();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    if (!res.success) {
      setCouponError(res.message);
      setTimeout(() => setCouponError(''), 3000);
    } else {
      setCouponInput('');
      setCouponError('');
    }
  };

  const handleProceedCheckout = () => {
    playPowSound();
    setIsCartOpen(false);
    if (!isLoggedIn) {
      openLogin(() => {
        setIsCheckoutOpen(true);
      });
    } else {
      setIsCheckoutOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-xs flex justify-end">
      {/* Drawer Panel */}
      <div className="w-full max-w-md bg-white border-l-4 border-black h-full flex flex-col justify-between shadow-comic-xl animate-pop">
        
        {/* Header */}
        <div className="bg-comic-yellow border-b-4 border-black p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛍️</span>
            <div>
              <h2 className="font-comic text-2xl text-black leading-none">YOUR COMIC CART</h2>
              <span className="text-xs font-bold text-gray-700">
                {cartItems.length} items ready for hero delivery
              </span>
            </div>
          </div>

          <button
            onClick={() => { playPopSound(); setIsCartOpen(false); }}
            className="w-8 h-8 bg-white hover:bg-comic-red hover:text-white border-2 border-black rounded-full flex items-center justify-center font-black transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="text-6xl animate-bounce">🍰</div>
              <h3 className="font-comic text-2xl text-black">YOUR CART IS HUNGRY!</h3>
              <p className="text-xs sm:text-sm font-bold text-gray-600 max-w-xs mx-auto">
                No cakes added yet! Even superheroes need cake to recharge their powers.
              </p>
              <button
                onClick={() => { playPopSound(); setIsCartOpen(false); }}
                className="comic-btn bg-comic-red text-white px-6 py-2.5 rounded-xl text-sm"
              >
                BROWSE SUPER CAKES!
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.cartItemId}
                className="comic-box p-3 rounded-2xl flex gap-3 relative bg-comic-cream/40"
              >
                {/* Cake Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover border-2 border-black bg-white"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-comic text-base text-black truncate leading-tight">
                      {item.name}
                    </h4>
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-gray-400 hover:text-comic-red p-0.5"
                      title="Remove Cake"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Pills */}
                  <div className="flex flex-wrap gap-1 my-1">
                    <span className="bg-comic-yellow text-black text-[10px] font-comic px-1.5 py-0.2 rounded border border-black">
                      {item.weight}
                    </span>
                    <span className="bg-white text-gray-700 text-[10px] font-bold px-1.5 py-0.2 rounded border border-black/30">
                      {item.flavor}
                    </span>
                    {item.isEggless && (
                      <span className="bg-comic-green text-black text-[10px] font-comic px-1.5 py-0.2 rounded border border-black">
                        🌱 Veg
                      </span>
                    )}
                  </div>

                  {/* Cake Message */}
                  {item.cakeMessage && (
                    <div className="text-[11px] font-marker text-comic-red truncate">
                      "{item.cakeMessage}"
                    </div>
                  )}

                  {/* Price & Quantity Controls */}
                  <div className="flex items-center justify-between pt-1.5">
                    <span className="font-comic text-lg text-comic-red">
                      ₹{item.price * item.quantity}
                    </span>

                    <div className="flex items-center bg-white border border-black rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="px-2 py-0.5 hover:bg-comic-yellow text-black rounded-l"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-comic text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="px-2 py-0.5 hover:bg-comic-yellow text-black rounded-r"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Trigger */}
        {cartItems.length > 0 && (
          <div className="bg-comic-cream border-t-4 border-black p-4 space-y-3">
            
            {/* Coupon Code Box */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="ENTER COUPON (e.g. POW20)"
                className="flex-1 px-3 py-1.5 bg-white border-2 border-black rounded-lg text-xs font-bold uppercase"
              />
              <button
                type="submit"
                className="comic-btn bg-comic-yellow text-black px-3 py-1.5 text-xs rounded-lg whitespace-nowrap"
              >
                APPLY
              </button>
            </form>

            {couponError && (
              <p className="text-[11px] font-bold text-comic-red">{couponError}</p>
            )}

            {coupon && (
              <div className="flex items-center justify-between bg-comic-green/20 border border-green-800 rounded-lg px-2.5 py-1 text-xs font-bold text-green-900">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Coupon {coupon.code} Applied!</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-red-600 underline font-bold"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1 text-xs font-bold pt-1 border-t border-black/10">
              <div className="flex justify-between text-gray-700">
                <span>Items Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Comic Discount</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-700">
                <span>Express Delivery</span>
                <span>{deliveryFee === 0 ? <strong className="text-green-700">FREE</strong> : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-comic text-black pt-1.5 border-t border-black">
                <span>GRAND TOTAL</span>
                <span className="text-xl text-comic-red">₹{grandTotal}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleProceedCheckout}
              className="w-full comic-btn bg-comic-red hover:bg-comic-redDark text-white py-3 rounded-xl text-lg flex items-center justify-center gap-2 shadow-comic"
            >
              <Sparkles className="w-5 h-5 text-comic-yellow animate-spin" />
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-5 h-5" />
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
