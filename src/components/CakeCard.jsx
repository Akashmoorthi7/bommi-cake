import React from 'react';
import { Star, Sparkles, Heart, Zap, ArrowRight } from 'lucide-react';
import { playPopSound, playPowSound } from '../utils/sound';

export const CakeCard = ({ cake, onSelectCake, onQuickOrder }) => {
  return (
    <div className="comic-card bg-white rounded-2xl overflow-hidden flex flex-col justify-between group relative">
      
      {/* Top Image Panel */}
      <div className="relative overflow-hidden bg-comic-cream border-b-4 border-black aspect-[4/3]">
        <img
          src={cake.image}
          alt={cake.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Comic Sound Burst (e.g. "BOOM!", "YUM!", "POW!") */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className={`starburst ${cake.badgeColor || 'bg-comic-red text-white'} text-[11px] sm:text-xs font-comic px-3 py-1.5 border-2 border-black inline-block transform -rotate-6 shadow-comic-sm group-hover:rotate-0 transition-transform`}>
            {cake.badge}
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2.5 right-2.5 bg-black text-comic-yellow font-comic text-xs px-2 py-1 rounded-md border-2 border-white flex items-center gap-1 shadow-comic-sm">
          <Star className="w-3.5 h-3.5 fill-comic-yellow text-comic-yellow" />
          <span>{cake.rating}</span>
          <span className="text-[10px] text-gray-300">({cake.reviewsCount})</span>
        </div>

        {/* Eggless Available Badge */}
        {cake.isEgglessAvailable && (
          <div className="absolute bottom-2 left-2 bg-comic-green text-black text-[10px] font-comic px-2 py-0.5 rounded border border-black shadow-comic-sm">
            🌱 100% EGGLESS
          </div>
        )}

        {/* Prep Time */}
        <div className="absolute bottom-2 right-2 bg-white/95 text-black text-[10px] font-bold px-2 py-0.5 rounded border border-black shadow-comic-sm flex items-center gap-1">
          <Zap className="w-3 h-3 text-comic-red" />
          <span>2-Hr Rocket</span>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Cake Category Tag & Comic Title */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] font-marker uppercase tracking-wider text-comic-red font-bold">
              {cake.category} Special
            </span>
            <span className="text-xs font-comic text-gray-500">
              {cake.sound}
            </span>
          </div>

          <h3 className="font-comic text-lg sm:text-xl text-black leading-tight group-hover:text-comic-red transition-colors line-clamp-1">
            {cake.name}
          </h3>

          <p className="text-xs font-bold text-gray-600 line-clamp-2 mt-1">
            {cake.description}
          </p>
        </div>

        {/* Sizes & Flavors Pill Preview */}
        <div className="space-y-1.5 pt-1 border-t-2 border-dashed border-gray-300">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-gray-500">Sizes Available:</span>
            <span className="text-black font-comic">
              {cake.sizes.map(s => s.weight).slice(0, 3).join(', ')}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-gray-500">Flavors:</span>
            <span className="text-black bg-comic-yellowLight px-1.5 py-0.5 rounded border border-black/40 text-[11px]">
              {cake.flavors.length} Delicious Flavors
            </span>
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-2 border-t-3 border-black">
          <div className="flex items-baseline justify-between mb-2.5">
            <div>
              <span className="text-xs font-bold text-gray-500 block leading-none">Starting from</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-comic text-comic-red">₹{cake.price}</span>
                {cake.originalPrice && (
                  <span className="text-xs text-gray-400 line-through font-bold">
                    ₹{cake.originalPrice}
                  </span>
                )}
              </div>
            </div>

            <span className="bg-comic-yellow text-black border border-black text-[10px] font-comic px-2 py-0.5 rounded">
              SAVE ₹{cake.originalPrice ? cake.originalPrice - cake.price : 150}!
            </span>
          </div>

          {/* Buttons: Customize & Direct Order */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                playPopSound();
                onSelectCake(cake);
              }}
              className="comic-btn bg-white hover:bg-comic-yellow text-black py-2 px-2 text-xs sm:text-sm rounded-lg border-2"
            >
              CUSTOMIZE
            </button>

            <button
              onClick={() => {
                playPowSound();
                onQuickOrder(cake);
              }}
              className="comic-btn bg-comic-red hover:bg-comic-redDark text-white py-2 px-2 text-xs sm:text-sm rounded-lg flex items-center justify-center gap-1 border-2"
            >
              <span>ORDER NOW</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
