import React, { useState } from 'react';
import { Heart, Sparkles, MapPin, Phone, Mail, Share2 } from 'lucide-react';
import { CAKE_CATEGORIES } from '../data/cakes';
import { playPopSound, playPowSound } from '../utils/sound';

export const Footer = ({ onSelectCategory }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    playPowSound();
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-comic-charcoal text-white border-t-5 border-black relative overflow-hidden">
      {/* Top comic pattern border */}
      <div className="h-3 bg-comic-yellow border-b-2 border-black"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-comic-red border-3 border-white rounded-xl flex items-center justify-center text-3xl shadow-comic transform -rotate-3">
                🎂
              </div>
              <span className="text-3xl font-comic text-comic-yellow tracking-wider">
                BOMMI CAKE
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-gray-300 leading-relaxed">
              We turn celebrations into superhero adventures! Handcrafted fresh artisan cakes baked with love, premium ingredients, and a vibrant comic book aesthetic that brings joy to every slice.
            </p>

            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-comic-red border-2 border-black flex items-center justify-center text-white cursor-pointer hover:bg-comic-redDark transition-colors shadow-comic-sm font-comic text-xs">
                IG
              </span>
              <span className="w-9 h-9 rounded-xl bg-comic-blue border-2 border-black flex items-center justify-center text-white cursor-pointer hover:bg-comic-blueDark transition-colors shadow-comic-sm font-comic text-xs">
                FB
              </span>
              <span className="w-9 h-9 rounded-xl bg-comic-yellow border-2 border-black flex items-center justify-center text-black cursor-pointer hover:bg-yellow-400 transition-colors shadow-comic-sm font-comic text-xs">
                YT
              </span>
              <span className="w-9 h-9 rounded-xl bg-comic-green border-2 border-black flex items-center justify-center text-black cursor-pointer hover:bg-green-400 transition-colors shadow-comic-sm font-comic text-xs">
                WA
              </span>
            </div>
          </div>

          {/* Quick Category Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-comic text-xl text-comic-yellow tracking-wide border-b-2 border-white/20 pb-1">
              CAKE REALMS
            </h4>
            <ul className="space-y-1.5 text-xs font-bold text-gray-300">
              {CAKE_CATEGORIES.slice(1).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => { playPopSound(); onSelectCategory(cat.id); }}
                    className="hover:text-comic-yellow hover:translate-x-1 transition-transform flex items-center gap-1.5"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Express Hubs */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-comic text-xl text-comic-yellow tracking-wide border-b-2 border-white/20 pb-1">
              EXPRESS HUBS
            </h4>
            <ul className="space-y-2 text-xs font-bold text-gray-300">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-comic-red shrink-0" />
                <span>Bengaluru Hub (HQ)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-comic-blue shrink-0" />
                <span>Mumbai Coastal Hub</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-comic-green shrink-0" />
                <span>Delhi-NCR Express</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-comic-yellow shrink-0" />
                <span>+91 98844 26664</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-comic-pink shrink-0" />
                <span>orders@bommicake.com</span>
              </li>
            </ul>
          </div>

          {/* Superhero Comic Club Newsletter */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-comic text-xl text-comic-yellow tracking-wide border-b-2 border-white/20 pb-1">
              SUPERHERO CLUB
            </h4>
            <p className="text-xs font-bold text-gray-300">
              Subscribe to get secret superhero discount codes, birthday freebies, and new comic cake drop alerts!
            </p>

            {subscribed ? (
              <div className="bg-comic-green text-black border-2 border-black rounded-xl p-3 font-comic text-sm">
                🎉 YOU ARE NOW A BOMMI HERO! USE CODE: POW20
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your superhero email..."
                  className="w-full px-3 py-2 bg-white text-black border-2 border-black rounded-xl text-xs font-bold"
                />
                <button
                  type="submit"
                  className="w-full comic-btn bg-comic-red hover:bg-comic-redDark text-white py-2 rounded-xl text-sm"
                >
                  <Sparkles className="w-4 h-4 mr-1 text-comic-yellow" />
                  JOIN & GET 20% OFF!
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="mt-10 pt-6 border-t-2 border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-gray-400">
          <div>
            © 2026 Bommi Cake Business. All rights reserved. The sweetest comic bakery in town!
          </div>
          <div className="flex items-center gap-1 text-gray-300">
            <span>Baked with</span>
            <Heart className="w-3.5 h-3.5 text-comic-red fill-comic-red inline mx-0.5" />
            <span>for Super Cake Lovers everywhere.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
