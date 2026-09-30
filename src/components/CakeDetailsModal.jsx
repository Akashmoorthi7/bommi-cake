import React, { useState } from 'react';
import { X, Plus, Minus, Calendar, Clock, Sparkles, Check, Upload, Flame, Star, ShieldCheck } from 'lucide-react';
import { TIME_SLOTS } from '../data/cakes';
import { playPopSound, playPowSound } from '../utils/sound';

export const CakeDetailsModal = ({
  cake,
  isOpen,
  onClose,
  onAddToCart,
  onDirectOrder,
}) => {
  if (!isOpen || !cake) return null;

  const [selectedSize, setSelectedSize] = useState(cake.sizes[0]);
  const [selectedFlavor, setSelectedFlavor] = useState(cake.flavors[0]);
  const [isEggless, setIsEggless] = useState(true);
  const [cakeMessage, setCakeMessage] = useState('HAPPY BIRTHDAY HERO!');
  const [quantity, setQuantity] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState('Today (Express)');
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0]);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState(['candles', 'knife']);

  // Calculate dynamic price based on size
  const calculatedUnitPrice = Math.round(cake.price * selectedSize.priceMultiplier);
  const addonsTotal = (selectedAddons.includes('popper') ? 49 : 0) + (selectedAddons.includes('sparkler') ? 99 : 0);
  const slotExtra = selectedSlot.id === 'express' ? 49 : selectedSlot.id === 'midnight' ? 99 : 0;
  const totalPrice = (calculatedUnitPrice * quantity) + addonsTotal + slotExtra;

  const handleAddonToggle = (id) => {
    playPopSound();
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter(item => item !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  const handlePhotoUploadSim = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setPhotoUrl(fakeUrl);
      playPowSound();
    }
  };

  const buildCustomizedItem = () => {
    return {
      id: cake.id,
      name: cake.name,
      image: photoUrl || cake.image,
      category: cake.category,
      weight: selectedSize.weight,
      serves: selectedSize.serves,
      flavor: selectedFlavor,
      isEggless,
      cakeMessage: cakeMessage.trim(),
      quantity,
      price: calculatedUnitPrice,
      deliveryDate: deliveryDate === 'Pick Date' ? customDate : deliveryDate,
      deliverySlot: selectedSlot.label,
      addons: selectedAddons,
      photoUrl,
    };
  };

  const handleAddToCart = () => {
    const item = buildCustomizedItem();
    onAddToCart(item);
    onClose();
  };

  const handleOrderNow = () => {
    const item = buildCustomizedItem();
    onDirectOrder(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      {/* Comic Modal Container */}
      <div className="relative w-full max-w-4xl bg-white border-4 border-black rounded-3xl shadow-comic-xl my-6 overflow-hidden animate-pop">
        
        {/* Header Strip */}
        <div className="bg-comic-yellow border-b-4 border-black px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="starburst bg-comic-red text-white text-xs font-comic px-3 py-1 border border-black transform -rotate-3">
              CUSTOMIZE!
            </span>
            <span className="font-comic text-xl sm:text-2xl tracking-wide text-black">
              DESIGN YOUR DREAM CAKE
            </span>
          </div>

          <button
            onClick={() => { playPopSound(); onClose(); }}
            className="w-9 h-9 bg-white hover:bg-comic-red hover:text-white border-3 border-black rounded-full flex items-center justify-center font-black transition-colors shadow-comic-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: 2 Columns */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[80vh] overflow-y-auto">
          
          {/* Left Column: Image, Plaque Preview, Guarantee */}
          <div className="lg:col-span-5 space-y-4">
            {/* Main Image Panel */}
            <div className="relative rounded-2xl border-4 border-black overflow-hidden bg-comic-cream group shadow-comic">
              <img
                src={photoUrl || cake.image}
                alt={cake.name}
                className="w-full h-64 sm:h-72 object-cover"
              />

              {/* Badges on image */}
              <div className="absolute top-3 left-3 starburst bg-comic-red text-white text-xs font-comic px-3 py-1.5 border-2 border-black">
                {cake.badge}
              </div>

              {photoUrl && (
                <div className="absolute top-3 right-3 bg-comic-blue text-white text-xs font-comic px-2.5 py-1 rounded border-2 border-black">
                  📸 PHOTO EDIBLE PRINT READY!
                </div>
              )}

              {/* Live Message On Cake Preview */}
              <div className="absolute bottom-3 inset-x-3 bg-white/95 border-2 border-black rounded-xl p-2 text-center shadow-comic-sm">
                <span className="text-[10px] font-bold text-gray-500 uppercase block leading-none">
                  Fondant Plaque Preview
                </span>
                <span className="font-marker text-sm sm:text-base text-comic-red font-bold tracking-wider block mt-0.5 truncate">
                  "{cakeMessage || 'Your Custom Message Here'}"
                </span>
              </div>
            </div>

            {/* Optional Photo Upload for Photo Cakes */}
            {(cake.category === 'photo' || cake.isPhotoCake) && (
              <div className="bg-comic-blue/10 border-3 border-dashed border-comic-blueDark rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <Upload className="w-5 h-5 text-comic-blueDark" />
                  <span className="font-comic text-base text-black">UPLOAD EDIBLE PHOTO</span>
                </div>
                <p className="text-xs text-gray-600 font-bold mb-2">
                  Our artists print with 100% certified organic food-grade sugar colors.
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUploadSim}
                  id="photo-upload"
                  className="hidden"
                />
                <label
                  htmlFor="photo-upload"
                  className="comic-btn bg-comic-blue text-white px-4 py-1.5 text-xs rounded-lg cursor-pointer"
                >
                  {photoUrl ? 'CHANGE PHOTO' : 'CHOOSE PHOTO FILE'}
                </label>
              </div>
            )}

            {/* Chef Guarantee Card */}
            <div className="bg-comic-yellowLight border-2 border-black rounded-xl p-3 text-xs font-bold space-y-1.5 shadow-comic-sm">
              <div className="flex items-center gap-1.5 text-black font-comic text-sm">
                <ShieldCheck className="w-4 h-4 text-comic-green fill-comic-green" />
                <span>BOMMI CHEF QUALITY PROMISE</span>
              </div>
              <p className="text-gray-700">
                • 100% Fresh sponge baked on the day of delivery.<br />
                • Real dairy cream & premium Belgian cocoa.<br />
                • Sanitized temperature-controlled rocket dispatch box.
              </p>
            </div>
          </div>

          {/* Right Column: Customization Controls */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Title & Price Header */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-marker uppercase text-comic-red font-bold">
                  {cake.category} Collection
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-gray-700">
                  <Star className="w-3.5 h-3.5 fill-comic-yellow text-comic-yellow" />
                  <span>{cake.rating} / 5.0 ({cake.reviewsCount} reviews)</span>
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-comic text-black leading-tight">
                {cake.name}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 font-bold mt-1">
                {cake.description}
              </p>
            </div>

            {/* 1. Size Selection */}
            <div>
              <label className="block text-xs font-comic text-gray-700 uppercase tracking-wider mb-1.5">
                STEP 1: SELECT CAKE WEIGHT / SIZE
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {cake.sizes.map((s) => {
                  const isSelected = selectedSize.weight === s.weight;
                  const itemPrice = Math.round(cake.price * s.priceMultiplier);
                  return (
                    <button
                      key={s.weight}
                      onClick={() => { playPopSound(); setSelectedSize(s); }}
                      className={`comic-box p-2 rounded-xl text-left transition-all ${
                        isSelected
                          ? 'bg-comic-yellow ring-2 ring-black scale-102 shadow-comic'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-comic text-base text-black">{s.weight}</div>
                      <div className="text-[10px] text-gray-600 font-bold">{s.serves}</div>
                      <div className="text-xs font-comic text-comic-red mt-1">₹{itemPrice}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Flavor Selection */}
            <div>
              <label className="block text-xs font-comic text-gray-700 uppercase tracking-wider mb-1.5">
                STEP 2: CHOOSE FLAVOR VARIANT
              </label>
              <div className="flex flex-wrap gap-2">
                {cake.flavors.map((flavor) => {
                  const isSelected = selectedFlavor === flavor;
                  return (
                    <button
                      key={flavor}
                      onClick={() => { playPopSound(); setSelectedFlavor(flavor); }}
                      className={`comic-badge px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-comic-red text-white scale-105'
                          : 'bg-white text-black hover:bg-comic-yellowLight'
                      }`}
                    >
                      {flavor}
                      {isSelected && <Check className="w-3 h-3 inline ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Eggless / Dietary Toggle */}
            <div className="flex items-center justify-between bg-comic-cream border-2 border-black rounded-xl p-3">
              <div>
                <span className="font-comic text-sm text-black block">EGGLESS PREPARATION</span>
                <span className="text-xs text-gray-600 font-bold">100% Vegetarian certified green dot bakery</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { playPopSound(); setIsEggless(true); }}
                  className={`comic-btn px-3 py-1 text-xs rounded-lg ${
                    isEggless ? 'bg-comic-green text-black' : 'bg-white text-gray-700'
                  }`}
                >
                  🌱 Eggless (Veg)
                </button>
                <button
                  onClick={() => { playPopSound(); setIsEggless(false); }}
                  className={`comic-btn px-3 py-1 text-xs rounded-lg ${
                    !isEggless ? 'bg-comic-yellow text-black' : 'bg-white text-gray-700'
                  }`}
                >
                  🥚 With Egg
                </button>
              </div>
            </div>

            {/* 4. Cake Message */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-comic text-gray-700 uppercase tracking-wider">
                  STEP 3: MESSAGE PIPED ON CAKE (MAX 30 CHARS)
                </label>
                <span className="text-[11px] font-bold text-gray-500">
                  {cakeMessage.length}/30
                </span>
              </div>
              <input
                type="text"
                maxLength={30}
                value={cakeMessage}
                onChange={(e) => setCakeMessage(e.target.value.toUpperCase())}
                placeholder="E.g., HAPPY 18TH ANANYA! or WE LOVE YOU DAD"
                className="w-full px-3.5 py-2.5 bg-white border-3 border-black rounded-xl font-bold font-body text-sm uppercase shadow-comic-sm focus:outline-none focus:ring-2 focus:ring-comic-red"
              />
            </div>

            {/* 5. Delivery Schedule: Date & Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-comic text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-comic-red" />
                  <span>DELIVERY DATE</span>
                </label>
                <select
                  value={deliveryDate}
                  onChange={(e) => { playPopSound(); setDeliveryDate(e.target.value); }}
                  className="w-full p-2 bg-white border-2 border-black rounded-xl text-xs font-bold shadow-comic-sm cursor-pointer"
                >
                  <option value="Today (Express)">⚡ Today (Rocket Express)</option>
                  <option value="Tomorrow">📅 Tomorrow</option>
                  <option value="Day After Tomorrow">📅 Day After Tomorrow</option>
                  <option value="Pick Date">Select Custom Date...</option>
                </select>

                {deliveryDate === 'Pick Date' && (
                  <input
                    type="date"
                    value={customDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="w-full mt-2 p-1.5 bg-white border-2 border-black rounded-lg text-xs font-bold"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-comic text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-comic-blueDark" />
                  <span>TIME SLOT</span>
                </label>
                <select
                  value={selectedSlot.id}
                  onChange={(e) => {
                    playPopSound();
                    const slot = TIME_SLOTS.find(s => s.id === e.target.value);
                    if (slot) setSelectedSlot(slot);
                  }}
                  className="w-full p-2 bg-white border-2 border-black rounded-xl text-xs font-bold shadow-comic-sm cursor-pointer"
                >
                  {TIME_SLOTS.map(slot => (
                    <option key={slot.id} value={slot.id}>
                      {slot.label} ({slot.extra})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 6. Free Addons & Party Upgrades */}
            <div>
              <label className="block text-xs font-comic text-gray-700 uppercase tracking-wider mb-1.5">
                PARTY ADD-ONS
              </label>
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                <button
                  onClick={() => handleAddonToggle('candles')}
                  className={`comic-badge px-2.5 py-1 rounded-lg cursor-pointer ${
                    selectedAddons.includes('candles') ? 'bg-comic-yellow text-black' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  🕯️ Comic Candles (FREE) {selectedAddons.includes('candles') && '✓'}
                </button>
                <button
                  onClick={() => handleAddonToggle('knife')}
                  className={`comic-badge px-2.5 py-1 rounded-lg cursor-pointer ${
                    selectedAddons.includes('knife') ? 'bg-comic-yellow text-black' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  🔪 Cake Knife (FREE) {selectedAddons.includes('knife') && '✓'}
                </button>
                <button
                  onClick={() => handleAddonToggle('popper')}
                  className={`comic-badge px-2.5 py-1 rounded-lg cursor-pointer ${
                    selectedAddons.includes('popper') ? 'bg-comic-red text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  🎉 Confetti Popper (+₹49) {selectedAddons.includes('popper') && '✓'}
                </button>
                <button
                  onClick={() => handleAddonToggle('sparkler')}
                  className={`comic-badge px-2.5 py-1 rounded-lg cursor-pointer ${
                    selectedAddons.includes('sparkler') ? 'bg-comic-purple text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  ✨ Sparkler Musical (+₹99) {selectedAddons.includes('sparkler') && '✓'}
                </button>
              </div>
            </div>

            {/* Bottom Actions: Quantity, Total & ORDER NOW */}
            <div className="pt-4 border-t-3 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Qty Selector */}
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white border-2 border-black rounded-xl shadow-comic-sm">
                  <button
                    onClick={() => { playPopSound(); setQuantity(Math.max(1, quantity - 1)); }}
                    className="p-2 hover:bg-comic-yellow text-black rounded-l-lg transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-comic text-lg px-3 py-1">{quantity}</span>
                  <button
                    onClick={() => { playPopSound(); setQuantity(quantity + 1); }}
                    className="p-2 hover:bg-comic-yellow text-black rounded-r-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <span className="text-[10px] text-gray-500 font-bold block uppercase">Grand Total</span>
                  <span className="font-comic text-2xl text-comic-red leading-none">
                    ₹{totalPrice}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 sm:flex-initial comic-btn bg-white hover:bg-comic-yellow text-black px-4 py-3 rounded-xl text-sm"
                >
                  ADD TO CART
                </button>

                <button
                  onClick={handleOrderNow}
                  className="flex-1 sm:flex-initial comic-btn bg-comic-red hover:bg-comic-redDark text-white px-6 py-3 rounded-xl text-base shadow-comic-md transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 mr-1 text-comic-yellow animate-spin" />
                  ORDER NOW!
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
