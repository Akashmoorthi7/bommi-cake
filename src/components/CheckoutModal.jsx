import React, { useState } from 'react';
import { X, MapPin, Phone, User, Calendar, Clock, CreditCard, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { playPopSound, playPowSound } from '../utils/sound';

export const CheckoutModal = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cartItems,
    subtotal,
    discountAmount,
    deliveryFee,
    grandTotal,
    coupon,
    placeOrder,
  } = useCart();

  const { user } = useAuth();

  // Prefilled address from user profile or fallback
  const defaultAddress = user?.addresses?.find(a => a.isDefault) || user?.addresses?.[0] || {
    receiver: user?.name || 'Superhero Baker',
    phone: user?.phone || '9876543210',
    addressLine: 'Flat 402, Krypton Heights, Indiranagar',
    city: 'Bengaluru',
    pincode: '560038',
    landmark: 'Near Comic Con Central',
  };

  const [receiver, setReceiver] = useState(defaultAddress.receiver || user?.name || '');
  const [phone, setPhone] = useState(defaultAddress.phone || user?.phone || '');
  const [addressLine, setAddressLine] = useState(defaultAddress.addressLine || '');
  const [city, setCity] = useState(defaultAddress.city || 'Bengaluru');
  const [pincode, setPincode] = useState(defaultAddress.pincode || '560038');
  const [landmark, setLandmark] = useState(defaultAddress.landmark || '');

  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'Card' | 'COD'
  const [upiApp, setUpiApp] = useState('GPay');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleSelectSavedAddress = (addr) => {
    playPopSound();
    setReceiver(addr.receiver);
    setPhone(addr.phone);
    setAddressLine(addr.addressLine);
    setCity(addr.city);
    setPincode(addr.pincode);
    setLandmark(addr.landmark || '');
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!addressLine.trim() || !phone.trim()) {
      alert('Please fill in your delivery address and phone number!');
      return;
    }

    setIsSubmitting(true);
    playPowSound();

    setTimeout(() => {
      const orderPayload = {
        deliveryDetails: {
          receiver,
          phone,
          address: `${addressLine}, ${landmark ? landmark + ', ' : ''}${city} - ${pincode}`,
          date: cartItems[0]?.deliveryDate || 'Today (Rocket Express)',
          slot: cartItems[0]?.deliverySlot || '⚡ Rocket Express (Next 2 Hours)',
        },
        paymentMethod: paymentMethod === 'UPI' ? `UPI (${upiApp})` : paymentMethod === 'Card' ? 'Credit/Debit Card' : 'Cash on Delivery (COD)',
      };

      placeOrder(orderPayload);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-3xl bg-white border-4 border-black rounded-3xl shadow-comic-xl my-6 overflow-hidden animate-pop">
        
        {/* Header */}
        <div className="bg-comic-yellow border-b-4 border-black px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="starburst bg-comic-red text-white text-xs font-comic px-3 py-1 border border-black">
              CHECKOUT!
            </span>
            <h2 className="font-comic text-2xl text-black tracking-wide">
              SUPER FAST ROCKET CHECKOUT
            </h2>
          </div>

          <button
            onClick={() => { playPopSound(); setIsCheckoutOpen(false); }}
            className="w-8 h-8 bg-white hover:bg-comic-red hover:text-white border-2 border-black rounded-full flex items-center justify-center font-black transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmitOrder} className="p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Saved Addresses Shortcut */}
          {user?.addresses && user.addresses.length > 0 && (
            <div>
              <span className="text-xs font-comic text-gray-700 uppercase tracking-wider block mb-2">
                FAST FILL FROM SAVED HEADQUARTERS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {user.addresses.map((addr) => (
                  <button
                    type="button"
                    key={addr.id}
                    onClick={() => handleSelectSavedAddress(addr)}
                    className="comic-box p-2.5 rounded-xl text-left bg-comic-cream/60 hover:bg-comic-yellow transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs font-comic text-comic-red">
                      <span>{addr.tag}</span>
                      <span className="text-[10px] text-gray-600 font-bold">CLICK TO SELECT</span>
                    </div>
                    <div className="text-xs font-bold text-black truncate">{addr.addressLine}</div>
                    <div className="text-[11px] text-gray-600">{addr.city} • {addr.phone}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Delivery Address & Contact */}
          <div className="space-y-3 bg-gray-50 border-3 border-black rounded-2xl p-4 shadow-comic-sm">
            <div className="flex items-center gap-2 font-comic text-lg text-black border-b-2 border-black/10 pb-1.5">
              <MapPin className="w-5 h-5 text-comic-red" />
              <span>STEP 1: DELIVERY ADDRESS & SUPERHERO CONTACT</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  required
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                  placeholder="e.g. Captain Priya"
                  className="w-full px-3 py-2 bg-white border-2 border-black rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Phone Number (For Delivery Hero Call) *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2 bg-white border-2 border-black rounded-lg text-xs font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Complete Delivery Address (House / Flat, Building, Street) *
                </label>
                <input
                  type="text"
                  required
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="e.g. Flat 402, Krypton Heights, 100ft Road"
                  className="w-full px-3 py-2 bg-white border-2 border-black rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  City & State *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-black rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-black rounded-lg text-xs font-bold"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="space-y-3 bg-gray-50 border-3 border-black rounded-2xl p-4 shadow-comic-sm">
            <div className="flex items-center gap-2 font-comic text-lg text-black border-b-2 border-black/10 pb-1.5">
              <CreditCard className="w-5 h-5 text-comic-blueDark" />
              <span>STEP 2: SELECT SECURE PAYMENT METHOD</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* UPI Option */}
              <button
                type="button"
                onClick={() => { playPopSound(); setPaymentMethod('UPI'); }}
                className={`comic-box p-3 rounded-xl text-left transition-all ${
                  paymentMethod === 'UPI' ? 'bg-comic-yellow ring-2 ring-black scale-102' : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-comic text-base text-black">⚡ UPI INSTANT</span>
                  {paymentMethod === 'UPI' && <CheckCircle2 className="w-4 h-4 text-black fill-black" />}
                </div>
                <p className="text-[11px] text-gray-600 font-bold mt-1">
                  GPay, PhonePe, Paytm, QR
                </p>
              </button>

              {/* Card Option */}
              <button
                type="button"
                onClick={() => { playPopSound(); setPaymentMethod('Card'); }}
                className={`comic-box p-3 rounded-xl text-left transition-all ${
                  paymentMethod === 'Card' ? 'bg-comic-yellow ring-2 ring-black scale-102' : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-comic text-base text-black">💳 CARDS / NET</span>
                  {paymentMethod === 'Card' && <CheckCircle2 className="w-4 h-4 text-black fill-black" />}
                </div>
                <p className="text-[11px] text-gray-600 font-bold mt-1">
                  Visa, Mastercard, RuPay
                </p>
              </button>

              {/* COD Option */}
              <button
                type="button"
                onClick={() => { playPopSound(); setPaymentMethod('COD'); }}
                className={`comic-box p-3 rounded-xl text-left transition-all ${
                  paymentMethod === 'COD' ? 'bg-comic-yellow ring-2 ring-black scale-102' : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-comic text-base text-black">💵 CASH ON DELIV</span>
                  {paymentMethod === 'COD' && <CheckCircle2 className="w-4 h-4 text-black fill-black" />}
                </div>
                <p className="text-[11px] text-gray-600 font-bold mt-1">
                  Pay at doorstep upon cake arrival
                </p>
              </button>
            </div>

            {/* UPI Sub-selector */}
            {paymentMethod === 'UPI' && (
              <div className="pt-2 flex items-center gap-2">
                <span className="text-xs font-bold text-gray-600">Preferred App:</span>
                {['GPay', 'PhonePe', 'Paytm', 'Any UPI QR'].map((app) => (
                  <button
                    type="button"
                    key={app}
                    onClick={() => setUpiApp(app)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border border-black ${
                      upiApp === app ? 'bg-comic-blue text-white' : 'bg-white text-black'
                    }`}
                  >
                    {app}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary & Final Total */}
          <div className="bg-comic-yellowLight border-3 border-black rounded-2xl p-4 space-y-2.5">
            <div className="flex justify-between text-xs font-bold text-gray-700">
              <span>Selected Cakes ({cartItems.length} items)</span>
              <span>₹{subtotal}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-xs font-bold text-green-700">
                <span>Comic Coupon ({coupon?.code})</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-xs font-bold text-gray-700">
              <span>Super Express Delivery Fee</span>
              <span>{deliveryFee === 0 ? <strong className="text-green-700">FREE</strong> : `₹${deliveryFee}`}</span>
            </div>
            <div className="flex justify-between text-lg font-comic text-black pt-2 border-t-2 border-black">
              <span>FINAL AMOUNT PAYABLE</span>
              <span className="text-2xl text-comic-red">₹{grandTotal}</span>
            </div>
          </div>

          {/* Place Order CTA Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full comic-btn bg-comic-red hover:bg-comic-redDark text-white py-3.5 rounded-2xl text-xl sm:text-2xl shadow-comic-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>BAKING YOUR ORDER...</span>
            ) : (
              <>
                <span className="text-comic-yellow">POW!</span>
                <span>PLACE ORDER (₹{grandTotal})</span>
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </button>

          <p className="text-center text-[11px] font-bold text-gray-500">
            🔒 256-Bit SSL Encrypted • 100% On-Time Delivery Guarantee by Bommi Cake
          </p>

        </form>

      </div>
    </div>
  );
};
