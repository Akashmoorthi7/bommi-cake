import React from 'react';
import { Sparkles, ArrowRight, Zap, Award, Clock, Heart } from 'lucide-react';
import { playPowSound, playPopSound } from '../utils/sound';

export const Hero = ({ onOrderNowClick, onSelectCategory }) => {
  return (
    <section className="relative overflow-hidden bg-comic-yellow py-8 md:py-16 border-b-4 border-black">
      {/* Comic Halftone / Ray Background */}
      <div className="absolute inset-0 bg-halftone opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Bold Headline & Comic Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Comic Badges & Speech Bubble */}
            <div className="inline-flex items-center gap-2 flex-wrap justify-center lg:justify-start">
              <span className="starburst bg-comic-red text-white text-xs sm:text-sm font-comic px-4 py-2 border-2 border-black inline-block animate-wiggle">
                BOOM! FRESH DAILY
              </span>
              <div className="relative inline-block bg-white border-3 border-black rounded-2xl px-3 py-1 text-xs sm:text-sm font-bold shadow-comic-sm">
                💬 "The Most Delicious Cake in the Multiverse!"
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-comic tracking-wider text-black leading-none uppercase">
                YOUR SWEET STORY <br />
                <span className="text-comic-red bg-white px-2 py-1 border-3 border-black inline-block transform -rotate-1 shadow-comic mt-1">
                  STARTS HERE!
                </span>
              </h1>
              <p className="text-base sm:text-xl font-body font-bold text-black/90 max-w-xl mx-auto lg:mx-0 pt-2">
                Handcrafted premium artisan cakes baked with super-fresh ingredients, wrapped in vibrant comic magic and delivered in as fast as <span className="underline decoration-comic-red decoration-4 font-marker">2 hours</span>!
              </p>
            </div>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs sm:text-sm font-bold font-comic">
              <div className="bg-white border-2 border-black px-3 py-1.5 rounded-lg shadow-comic-sm flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-comic-red fill-comic-red" />
                <span>2-Hour Express Delivery</span>
              </div>
              <div className="bg-comic-blue text-white border-2 border-black px-3 py-1.5 rounded-lg shadow-comic-sm flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-white fill-white" />
                <span>100% Pure Eggless Options</span>
              </div>
              <div className="bg-comic-green text-black border-2 border-black px-3 py-1.5 rounded-lg shadow-comic-sm flex items-center gap-1.5">
                <Award className="w-4 h-4 text-black" />
                <span>Custom Comic Photo Prints</span>
              </div>
            </div>

            {/* Primary CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => { playPowSound(); onOrderNowClick(); }}
                className="w-full sm:w-auto comic-btn bg-comic-red hover:bg-comic-redDark text-white text-xl sm:text-2xl px-8 py-3.5 rounded-xl shadow-comic-md transform hover:-translate-y-1 transition-all group"
              >
                <Sparkles className="w-6 h-6 mr-2 animate-spin text-comic-yellow" />
                ORDER NOW!
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => { playPopSound(); onSelectCategory('photo'); }}
                className="w-full sm:w-auto comic-btn bg-white hover:bg-comic-yellowLight text-black text-lg px-6 py-3.5 rounded-xl shadow-comic"
              >
                📸 CUSTOM PHOTO CAKES
              </button>
            </div>

            {/* Customer Review Proof Strip */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-3 text-xs font-bold">
              <div className="flex -space-x-2">
                <span className="w-8 h-8 rounded-full border-2 border-black bg-comic-pink flex items-center justify-center text-sm">🦸</span>
                <span className="w-8 h-8 rounded-full border-2 border-black bg-comic-blue flex items-center justify-center text-sm">🦹</span>
                <span className="w-8 h-8 rounded-full border-2 border-black bg-comic-green flex items-center justify-center text-sm">🧙</span>
              </div>
              <div>
                <span className="text-yellow-900 font-black">★★★★★ 4.9/5 Rating</span>
                <span className="text-gray-700 block">Over 25,000+ Happy Celebrations Powered!</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Comic Comic-Panel Visual */}
          <div className="lg:col-span-5 relative">
            
            {/* Pop Art Comic Frame */}
            <div className="relative mx-auto max-w-sm sm:max-w-md">
              
              {/* Backing decorative colored card */}
              <div className="absolute inset-0 bg-comic-blue rounded-2xl border-4 border-black transform rotate-3 shadow-comic-lg"></div>

              {/* Main Comic Panel */}
              <div className="relative bg-white rounded-2xl border-4 border-black p-3 sm:p-4 transform -rotate-1 hover:rotate-0 transition-transform duration-300 shadow-comic-xl">
                
                {/* Comic Panel Header */}
                <div className="flex items-center justify-between pb-2 border-b-3 border-black mb-3">
                  <span className="font-comic text-xs tracking-wider bg-black text-comic-yellow px-2 py-0.5 rounded">
                    ISSUE #1: THE SWEETEST CRIME FIGHTER
                  </span>
                  <span className="font-marker text-xs text-comic-red font-bold">
                    BOMMI SPECIAL
                  </span>
                </div>

                {/* Hero Image Container */}
                <div className="relative rounded-xl overflow-hidden border-3 border-black bg-comic-cream group">
                  <img
                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"
                    alt="Bommi Signature Comic Cake"
                    className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Speech Bubble Overlay */}
                  <div className="absolute top-3 left-3 bg-white border-2 border-black px-3 py-1 rounded-xl text-xs font-comic tracking-wide shadow-comic-sm">
                    💬 "YUUUUM!"
                  </div>

                  {/* Starburst badge overlay */}
                  <div className="absolute -bottom-2 -right-2 starburst-burst bg-comic-red text-white p-4 font-comic text-center border-2 border-black transform rotate-12">
                    <span className="block text-sm leading-none font-bold">BEST</span>
                    <span className="block text-xl leading-none">SELLER!</span>
                  </div>

                  {/* Price Tag Badge */}
                  <div className="absolute bottom-3 left-3 bg-comic-yellow text-black border-2 border-black px-2.5 py-1 rounded-lg font-comic text-sm shadow-comic-sm">
                    STARTING AT ₹699
                  </div>
                </div>

                {/* Comic Caption below panel */}
                <div className="mt-3 bg-comic-yellowLight border-2 border-black rounded-lg p-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-comic text-base sm:text-lg text-black leading-tight">
                      BELGIAN CHOCO OVERLOAD
                    </div>
                    <div className="text-xs font-bold text-gray-700">
                      Layered with silky dark ganache & pop crisps!
                    </div>
                  </div>
                  <button
                    onClick={() => { playPopSound(); onOrderNowClick(); }}
                    className="comic-btn bg-comic-red text-white px-3 py-1.5 text-xs rounded-lg whitespace-nowrap"
                  >
                    GRAB IT!
                  </button>
                </div>

              </div>

              {/* Floating Comic Stickers */}
              <div className="absolute -top-6 -left-6 bg-comic-pink text-white font-comic text-sm px-3 py-1 border-3 border-black rounded-full shadow-comic transform -rotate-12 animate-float pointer-events-none">
                ✨ WOW!
              </div>

              <div className="absolute -bottom-5 -left-4 bg-comic-green text-black font-comic text-xs px-3 py-1.5 border-3 border-black rounded-lg shadow-comic transform rotate-6 pointer-events-none">
                🎉 FREE BIRTHDAY CANDLES!
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
