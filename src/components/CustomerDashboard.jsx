import React, { useState } from 'react';
import { Package, Clock, MapPin, RotateCcw, User, Plus, CheckCircle, Sparkles, AlertCircle, Phone, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { playPopSound, playPowSound } from '../utils/sound';

export const CustomerDashboard = ({ onExploreCakes }) => {
  const { user, addAddress } = useAuth();
  const { orders, reorder } = useCart();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'addresses' | 'profile'

  // New address form state
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [tag, setTag] = useState('HOME HQ');
  const [addrReceiver, setAddrReceiver] = useState(user?.name || '');
  const [addrPhone, setAddrPhone] = useState(user?.phone || '');
  const [addrLine, setAddrLine] = useState('');
  const [addrCity, setAddrCity] = useState('Bengaluru');
  const [addrPincode, setAddrPincode] = useState('560038');

  // Tracking step titles
  const TRACKING_STEPS = [
    { step: 1, title: 'Batter Whisked!', icon: '🥣', desc: 'Sponge whipped & prepped' },
    { step: 2, title: 'In the Oven!', icon: '🔥', desc: 'Baking to golden perfection' },
    { step: 3, title: 'Comic Icing & Art!', icon: '🎂', desc: 'Hand-piped custom message' },
    { step: 4, title: 'Rocket Delivery!', icon: '🚀', desc: 'Superhero driver en route' },
  ];

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addrLine.trim()) return;
    playPopSound();
    addAddress({
      tag,
      receiver: addrReceiver,
      phone: addrPhone,
      addressLine: addrLine,
      city: addrCity,
      pincode: addrPincode,
    });
    setAddrLine('');
    setShowAddAddr(false);
  };

  const currentOrders = orders.filter(o => o.status !== 'Delivered');
  const pastOrders = orders.filter(o => o.status === 'Delivered');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Dashboard Top Banner */}
      <div className="comic-box bg-comic-yellow p-6 rounded-3xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 z-10">
          <div className="w-18 h-18 bg-white border-4 border-black rounded-2xl flex items-center justify-center text-4xl shadow-comic transform -rotate-3">
            {user?.avatar || '🦸‍♀️'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="starburst bg-comic-red text-white text-xs font-comic px-2.5 py-0.5 border border-black">
                LEVEL 5 HERO
              </span>
              <span className="text-xs font-bold text-gray-800">BOMMI VIP CLUB</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-comic text-black mt-0.5">
              WELCOME BACK, {user?.name?.toUpperCase() || 'SUPERHERO'}!
            </h1>
            <p className="text-xs sm:text-sm font-bold text-gray-800">
              📞 {user?.phone || '9876543210'} • ✉️ {user?.email || 'hero@bommi.com'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 z-10 w-full md:w-auto">
          <button
            onClick={() => { playPopSound(); onExploreCakes(); }}
            className="comic-btn bg-comic-red text-white px-5 py-2.5 rounded-xl text-base w-full md:w-auto shadow-comic"
          >
            <Sparkles className="w-4 h-4 mr-1 text-comic-yellow animate-spin" />
            ORDER NEW CAKE
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-3 mb-6 border-b-3 border-black pb-3 overflow-x-auto">
        <button
          onClick={() => { playPopSound(); setActiveTab('orders'); }}
          className={`comic-btn px-5 py-2 rounded-xl text-sm sm:text-base font-comic ${
            activeTab === 'orders' ? 'bg-comic-red text-white shadow-comic' : 'bg-white text-black'
          }`}
        >
          📦 ORDERS & TRACKING ({orders.length})
        </button>

        <button
          onClick={() => { playPopSound(); setActiveTab('addresses'); }}
          className={`comic-btn px-5 py-2 rounded-xl text-sm sm:text-base font-comic ${
            activeTab === 'addresses' ? 'bg-comic-blue text-white shadow-comic' : 'bg-white text-black'
          }`}
        >
          📍 SAVED ADDRESSES ({user?.addresses?.length || 0})
        </button>

        <button
          onClick={() => { playPopSound(); setActiveTab('profile'); }}
          className={`comic-btn px-5 py-2 rounded-xl text-sm sm:text-base font-comic ${
            activeTab === 'profile' ? 'bg-comic-purple text-white shadow-comic' : 'bg-white text-black'
          }`}
        >
          ⚙️ PROFILE SETTINGS
        </button>
      </div>

      {/* TAB 1: ORDERS & TRACKING */}
      {activeTab === 'orders' && (
        <div className="space-y-8">
          
          {/* Section A: Live / Current Active Orders */}
          <div>
            <h2 className="text-2xl font-comic text-black flex items-center gap-2 mb-4">
              <span>ACTIVE COMIC MISSIONS ({currentOrders.length})</span>
              <span className="w-2.5 h-2.5 rounded-full bg-comic-red animate-ping" />
            </h2>

            {currentOrders.length === 0 ? (
              <div className="comic-box p-6 rounded-2xl bg-white text-center">
                <p className="text-sm font-bold text-gray-600">
                  No active cake missions right now. Time to satisfy your sweet tooth!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {currentOrders.map((order) => (
                  <div key={order.id} className="comic-card bg-white rounded-3xl p-5 sm:p-6 space-y-5">
                    
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-comic text-2xl text-black">MISSION #{order.id}</span>
                          <span className="bg-comic-yellow text-black font-comic text-xs px-2 py-0.5 rounded border border-black">
                            {order.status}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-gray-500">
                          Scheduled for {order.deliveryDetails.date} • {order.deliveryDetails.slot}
                        </span>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs font-bold text-gray-500 block">Total Amount</span>
                        <span className="font-comic text-2xl text-comic-red">₹{order.total}</span>
                      </div>
                    </div>

                    {/* Comic Strip 4-Stage Visual Tracker */}
                    <div>
                      <span className="text-xs font-comic text-gray-700 uppercase tracking-wider block mb-3">
                        ⚡ LIVE COMIC PROGRESS TRACKER
                      </span>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {TRACKING_STEPS.map((step) => {
                          const isCompleted = order.trackingStep >= step.step;
                          const isCurrent = order.trackingStep === step.step;

                          return (
                            <div
                              key={step.step}
                              className={`p-3 rounded-2xl border-3 border-black text-center transition-all ${
                                isCurrent
                                  ? 'bg-comic-yellow shadow-comic scale-102 ring-2 ring-comic-red'
                                  : isCompleted
                                  ? 'bg-green-100 shadow-comic-sm'
                                  : 'bg-gray-100 opacity-60'
                              }`}
                            >
                              <div className="text-3xl mb-1">{step.icon}</div>
                              <div className="font-comic text-sm text-black leading-tight">
                                {step.title}
                              </div>
                              <div className="text-[10px] font-bold text-gray-600 mt-1">
                                {step.desc}
                              </div>
                              {isCompleted && (
                                <span className="inline-block mt-1.5 text-[10px] font-bold text-green-800 bg-white px-1.5 py-0.2 rounded border border-green-800">
                                  ✓ COMPLETED
                                </span>
                              )}
                              {isCurrent && (
                                <span className="inline-block mt-1.5 text-[10px] font-bold text-black bg-comic-red text-white px-2 py-0.2 rounded animate-pulse">
                                  IN ACTION NOW
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      <span className="text-xs font-comic text-gray-700 uppercase tracking-wider block">
                        ITEMS IN THIS ORDER
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="comic-box p-2.5 rounded-xl flex items-center gap-3 bg-comic-cream/40">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-14 h-14 rounded-lg object-cover border-2 border-black"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-comic text-base text-black truncate leading-tight">
                                {item.name}
                              </h4>
                              <p className="text-xs font-bold text-gray-600">
                                {item.weight} • {item.flavor}
                              </p>
                              {item.cakeMessage && (
                                <p className="text-xs font-marker text-comic-red truncate">
                                  "{item.cakeMessage}"
                                </p>
                              )}
                            </div>
                            <span className="font-comic text-base text-comic-red">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Address & Driver Contact */}
                    <div className="bg-gray-50 border-2 border-black rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold">
                      <div className="flex items-center gap-2 text-gray-800">
                        <MapPin className="w-4 h-4 text-comic-red shrink-0" />
                        <span className="truncate">{order.deliveryDetails.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-comic-blueDark">Driver: Swift Hero Ravi</span>
                        <a
                          href="tel:9876543210"
                          className="comic-btn bg-comic-green text-black px-2.5 py-1 rounded text-[11px]"
                        >
                          <Phone className="w-3 h-3 mr-1" /> CALL DRIVER
                        </a>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section B: Previous Delivered Orders */}
          <div>
            <h2 className="text-2xl font-comic text-black mb-4">
              PAST SWEET CELEBRATIONS ({pastOrders.length})
            </h2>

            {pastOrders.length === 0 ? (
              <div className="comic-box p-6 rounded-2xl bg-white text-center">
                <p className="text-sm font-bold text-gray-600">
                  No previous delivered orders yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pastOrders.map((order) => (
                  <div key={order.id} className="comic-box p-4 rounded-2xl bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <img
                        src={order.items[0]?.image}
                        alt="Cake"
                        className="w-16 h-16 rounded-xl object-cover border-2 border-black"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-comic text-lg text-black">{order.id}</span>
                          <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded border border-green-800">
                            DELIVERED
                          </span>
                        </div>
                        <h4 className="font-comic text-sm text-gray-800">
                          {order.items.map(i => i.name).join(', ')}
                        </h4>
                        <span className="text-xs text-gray-500 font-bold">
                          Paid ₹{order.total} on {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Instant Reorder Button */}
                    <button
                      onClick={() => reorder(order)}
                      className="comic-btn bg-comic-red hover:bg-comic-redDark text-white px-5 py-2.5 rounded-xl text-sm flex items-center gap-1.5 w-full sm:w-auto justify-center shadow-comic"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>REORDER NOW</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: SAVED ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-comic text-black">SAVED HEADQUARTERS & VENUES</h2>
            <button
              onClick={() => { playPopSound(); setShowAddAddr(!showAddAddr); }}
              className="comic-btn bg-comic-blue text-white px-4 py-2 rounded-xl text-sm flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>ADD NEW ADDRESS</span>
            </button>
          </div>

          {/* Add Address Form Drawer/Box */}
          {showAddAddr && (
            <form onSubmit={handleSaveAddress} className="comic-box p-5 rounded-2xl bg-comic-yellowLight space-y-4 animate-pop">
              <h3 className="font-comic text-lg text-black">ADD NEW DELIVERY LOCATION</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold">
                <div>
                  <label className="block mb-1">Tag (e.g. HOME HQ, OFFICE, PARTY)</label>
                  <input
                    type="text"
                    required
                    value={tag}
                    onChange={(e) => setTag(e.target.value.toUpperCase())}
                    className="w-full p-2 bg-white border-2 border-black rounded-lg uppercase"
                  />
                </div>
                <div>
                  <label className="block mb-1">Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={addrReceiver}
                    onChange={(e) => setAddrReceiver(e.target.value)}
                    className="w-full p-2 bg-white border-2 border-black rounded-lg"
                  />
                </div>
                <div>
                  <label className="block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={addrPhone}
                    onChange={(e) => setAddrPhone(e.target.value)}
                    className="w-full p-2 bg-white border-2 border-black rounded-lg"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block mb-1">Address Details (Door, Flat, Street)</label>
                  <input
                    type="text"
                    required
                    value={addrLine}
                    onChange={(e) => setAddrLine(e.target.value)}
                    placeholder="e.g. 104 Marvel Towers, Outer Ring Road"
                    className="w-full p-2 bg-white border-2 border-black rounded-lg"
                  />
                </div>
                <div>
                  <label className="block mb-1">City & Pincode</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      className="w-1/2 p-2 bg-white border-2 border-black rounded-lg"
                    />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={addrPincode}
                      onChange={(e) => setAddrPincode(e.target.value)}
                      className="w-1/2 p-2 bg-white border-2 border-black rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAddr(false)}
                  className="comic-btn bg-white text-black px-4 py-1.5 text-xs rounded-lg"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="comic-btn bg-comic-red text-white px-5 py-1.5 text-xs rounded-lg"
                >
                  SAVE ADDRESS
                </button>
              </div>
            </form>
          )}

          {/* Addresses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user?.addresses?.map((addr) => (
              <div key={addr.id} className="comic-box p-4 rounded-2xl bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-comic text-base text-comic-red bg-comic-yellowLight px-2 py-0.5 rounded border border-black">
                    {addr.tag}
                  </span>
                  {addr.isDefault && (
                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                      PRIMARY HQ
                    </span>
                  )}
                </div>

                <div className="font-bold text-sm text-black">
                  {addr.receiver} ({addr.phone})
                </div>

                <p className="text-xs font-bold text-gray-600">
                  {addr.addressLine}, {addr.landmark ? addr.landmark + ', ' : ''}{addr.city} - {addr.pincode}
                </p>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 3: PROFILE SETTINGS */}
      {activeTab === 'profile' && (
        <div className="comic-box p-6 rounded-3xl bg-white max-w-xl mx-auto space-y-5">
          <h2 className="text-2xl font-comic text-black border-b-2 border-black pb-2">
            SUPERHERO PROFILE SETTINGS
          </h2>

          <div className="flex items-center gap-4">
            <div className="text-5xl p-2 bg-comic-yellow rounded-2xl border-3 border-black">
              {user?.avatar || '🦸‍♀️'}
            </div>
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase">Avatar Badge</span>
              <div className="flex gap-2 mt-1">
                {['🦸‍♂️', '🦸‍♀️', '🦹', '🧙', '👑', '🎂'].map((av) => (
                  <button
                    key={av}
                    onClick={() => playPopSound()}
                    className="text-xl p-1 bg-gray-100 hover:bg-comic-yellow rounded-lg border border-black"
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3 text-xs font-bold">
            <div>
              <label className="block mb-1 text-gray-700">Display Name</label>
              <input
                type="text"
                readOnly
                value={user?.name || ''}
                className="w-full p-2.5 bg-gray-100 border-2 border-black rounded-lg cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700">Mobile Phone</label>
              <input
                type="tel"
                readOnly
                value={user?.phone || ''}
                className="w-full p-2.5 bg-gray-100 border-2 border-black rounded-lg cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700">Email Address</label>
              <input
                type="email"
                readOnly
                value={user?.email || ''}
                className="w-full p-2.5 bg-gray-100 border-2 border-black rounded-lg cursor-not-allowed"
              />
            </div>
          </div>

          <div className="bg-comic-cream p-3 rounded-xl border border-black text-xs font-bold text-gray-700">
            🔒 Account protected with Bommi Multi-Layer Comic Auth.
          </div>
        </div>
      )}

    </div>
  );
};
