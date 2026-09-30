import React from 'react';
import { Check, Sparkles, ArrowRight, Truck, Cake, MapPin, Calendar } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { playPopSound } from '../utils/sound';

export const OrderConfirmationModal = ({ onViewDashboard, onKeepShopping }) => {
  const { confirmedOrder, setConfirmedOrder } = useCart();

  if (!confirmedOrder) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-white border-4 border-black rounded-3xl shadow-comic-xl my-6 overflow-hidden animate-pop">
        
        {/* Comic Action Splash Header */}
        <div className="bg-comic-red p-6 text-center text-white relative border-b-4 border-black overflow-hidden">
          {/* Halftone BG */}
          <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none"></div>

          {/* Burst */}
          <div className="relative z-10 space-y-2">
            <div className="starburst bg-comic-yellow text-black text-2xl sm:text-3xl font-comic px-6 py-3 border-3 border-black inline-block shadow-comic transform -rotate-3 animate-wiggle">
              POW! ORDER PLACED!
            </div>
            <h2 className="text-xl sm:text-2xl font-comic tracking-wide text-white drop-shadow-[2px_2px_0px_#000]">
              YOUR SWEET MISSION HAS BEGUN!
            </h2>
            <p className="text-xs sm:text-sm font-bold text-white/90">
              Chef Bommi and the cake team have preheated the ovens!
            </p>
          </div>
        </div>

        {/* Order Details Body */}
        <div className="p-5 sm:p-6 space-y-4">
          
          {/* Order ID & Status Banner */}
          <div className="comic-box p-3 rounded-xl bg-comic-yellowLight flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-600 font-bold uppercase block">Comic Order ID</span>
              <span className="font-comic text-xl text-black">{confirmedOrder.id}</span>
            </div>
            <span className="bg-comic-green text-black border border-black font-comic text-xs px-2.5 py-1 rounded-lg">
              STATUS: {confirmedOrder.status}
            </span>
          </div>

          {/* Delivery Snapshot */}
          <div className="space-y-2 bg-gray-50 border-2 border-black rounded-xl p-3 text-xs font-bold">
            <div className="flex items-center gap-2 text-gray-800">
              <Calendar className="w-4 h-4 text-comic-red" />
              <span>Delivery: {confirmedOrder.deliveryDetails.date} • {confirmedOrder.deliveryDetails.slot}</span>
            </div>
            <div className="flex items-start gap-2 text-gray-800">
              <MapPin className="w-4 h-4 text-comic-blueDark shrink-0 mt-0.5" />
              <span className="truncate">{confirmedOrder.deliveryDetails.address}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-800">
              <Truck className="w-4 h-4 text-comic-green" />
              <span>Recipient: {confirmedOrder.deliveryDetails.receiver} ({confirmedOrder.deliveryDetails.phone})</span>
            </div>
          </div>

          {/* Cakes Summary Preview */}
          <div className="space-y-2">
            <span className="text-xs font-comic text-gray-700 uppercase tracking-wider block">
              ITEMS IN THIS MISSION ({confirmedOrder.items.length})
            </span>
            <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
              {confirmedOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 bg-comic-cream/50 p-2 rounded-lg border border-black/20">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-md object-cover border border-black"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <div className="font-comic text-sm text-black truncate">{item.name}</div>
                    <div className="text-[11px] text-gray-600 font-bold">
                      {item.weight} • {item.flavor} {item.cakeMessage && `• "${item.cakeMessage}"`}
                    </div>
                  </div>
                  <div className="font-comic text-sm text-comic-red">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Paid */}
          <div className="flex items-center justify-between pt-2 border-t-2 border-black font-comic text-base">
            <span>TOTAL PAID ({confirmedOrder.paymentMethod})</span>
            <span className="text-2xl text-comic-red">₹{confirmedOrder.total}</span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => {
                playPopSound();
                setConfirmedOrder(null);
                onViewDashboard();
              }}
              className="comic-btn bg-comic-blue hover:bg-comic-blueDark text-white py-3 rounded-xl text-sm shadow-comic"
            >
              🚀 TRACK IN DASHBOARD
            </button>

            <button
              onClick={() => {
                playPopSound();
                setConfirmedOrder(null);
                onKeepShopping();
              }}
              className="comic-btn bg-comic-yellow hover:bg-comic-yellowLight text-black py-3 rounded-xl text-sm shadow-comic"
            >
              🍰 ORDER ANOTHER CAKE
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
