import React, { useState } from 'react';
import { ShoppingBag, User, Search, Volume2, VolumeX, Menu, X, Sparkles, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toggleSound, isSoundEnabled, playPopSound } from '../utils/sound';

export const Navbar = ({ 
  searchQuery, 
  setSearchQuery, 
  activeTab, 
  setActiveTab,
  onOpenQuickOrder,
  onOpenWhatsApp
}) => {
  const { user, isLoggedIn, logout, openLogin } = useAuth();
  const { totalItemCount, setIsCartOpen } = useCart();
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSoundToggle = () => {
    const newState = toggleSound(!soundOn);
    setSoundOn(newState);
    if (newState) playPopSound();
  };

  const handleCartClick = () => {
    playPopSound();
    setIsCartOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 bg-comic-yellow border-b-4 border-black shadow-[0_5px_0_0_#000]">
      {/* Top comic ticker */}
      <div className="bg-black text-comic-yellow py-1 px-4 text-xs sm:text-sm font-comic tracking-wider flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-3 animate-pulse">
          <span className="bg-comic-red text-white px-2 py-0.5 rounded text-[11px] font-bold">HOT!</span>
          <span>⚡ 2-HOUR SUPERHERO EXPRESS CAKE DELIVERY IN BENGALURU & MUMBAI!</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-white">
          <span className="text-comic-yellow">USE CODE: <strong className="bg-comic-red px-1.5 py-0.5 text-white rounded">POW20</strong> FOR 20% OFF</span>
          <span>•</span>
          <button 
            onClick={onOpenWhatsApp} 
            className="text-comic-green hover:underline flex items-center gap-1 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp: +91 98844 26664
          </button>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand / Logo */}
        <div 
          onClick={() => { setActiveTab('home'); playPopSound(); }}
          className="flex items-center gap-2 cursor-pointer group select-none"
        >
          <div className="relative">
            <div className="w-11 h-11 sm:w-13 sm:h-13 bg-comic-red border-3 border-black rounded-xl flex items-center justify-center text-2xl shadow-comic transform -rotate-3 group-hover:rotate-0 transition-transform">
              🎂
            </div>
            <span className="absolute -top-2 -right-2 bg-comic-blue text-white text-[10px] font-comic px-1.5 py-0.5 rounded border-2 border-black transform rotate-6">
              POW!
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl sm:text-3xl font-comic tracking-wider text-black drop-shadow-[2px_2px_0px_#fff]">
                BOMMI CAKE
              </span>
            </div>
            <span className="text-[11px] sm:text-xs font-marker text-black/80 block -mt-1 tracking-wider">
              Comic Bakery & Sweets
            </span>
          </div>
        </div>

        {/* Live Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-md mx-2 relative">
          <div className="w-full relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chocolate, photo cake, kids theme..."
              className="w-full pl-10 pr-4 py-2 bg-white border-3 border-black rounded-lg text-sm font-body font-bold placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-comic-red shadow-[3px_3px_0_0_#000]"
            />
            <Search className="w-5 h-5 text-gray-700 absolute left-3 top-2.5" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs font-bold bg-comic-red text-white px-1.5 py-0.5 rounded-full border border-black"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound FX Toggle */}
          <button
            onClick={handleSoundToggle}
            title={soundOn ? "Mute Comic Sounds" : "Unmute Comic Sounds"}
            className="p-2 bg-white border-3 border-black rounded-lg shadow-comic hover:bg-comic-yellowLight transition-colors"
          >
            {soundOn ? <Volume2 className="w-5 h-5 text-comic-red" /> : <VolumeX className="w-5 h-5 text-gray-500" />}
          </button>

          {/* Quick Order Now Button */}
          <button
            onClick={onOpenQuickOrder}
            className="hidden sm:inline-flex comic-btn bg-comic-red hover:bg-comic-redDark text-white px-3.5 py-2 text-sm sm:text-base rounded-lg"
          >
            <Sparkles className="w-4 h-4 mr-1 animate-spin" />
            ORDER NOW!
          </button>

          {/* Dashboard / Orders / Home tab switch */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-comic-blue text-white border-3 border-black rounded-lg shadow-comic text-sm font-comic hover:bg-comic-blueDark"
              >
                <span className="text-lg">{user.avatar || '🦸‍♀️'}</span>
                <span className="hidden sm:inline font-bold tracking-wide">{user.name.split(' ')[0]}</span>
              </button>

              {userMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white border-3 border-black rounded-lg shadow-comic-lg py-2 z-50 animate-pop"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b-2 border-black/10 text-xs font-bold text-gray-600">
                    Signed in as <span className="text-comic-red block font-comic text-sm">{user.name}</span>
                  </div>
                  <button
                    onClick={() => { setActiveTab('dashboard'); playPopSound(); }}
                    className="w-full text-left px-3 py-2 text-sm font-bold hover:bg-comic-yellow flex items-center justify-between"
                  >
                    <span>My Comic Dashboard</span>
                    <span className="bg-comic-red text-white text-[10px] px-1.5 py-0.5 rounded-full font-comic">TRACK</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('home'); playPopSound(); }}
                    className="w-full text-left px-3 py-2 text-sm font-bold hover:bg-comic-yellow"
                  >
                    Explore All Cakes
                  </button>
                  <div className="border-t-2 border-black/10 my-1"></div>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 text-sm font-bold text-comic-red hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => openLogin(null, 'login')}
                className="comic-btn bg-white hover:bg-comic-yellowLight text-black px-3 py-1.5 text-xs sm:text-sm rounded-lg"
              >
                <User className="w-3.5 h-3.5 mr-1 text-comic-red" />
                LOGIN
              </button>
              <button
                onClick={() => openLogin(null, 'register')}
                className="hidden md:inline-flex comic-btn bg-comic-yellow hover:bg-comic-yellowLight text-black px-3 py-1.5 text-xs sm:text-sm rounded-lg"
              >
                CREATE ACCOUNT
              </button>
            </div>
          )}

          {/* Cart Icon Button */}
          <button
            onClick={handleCartClick}
            className="relative p-2 sm:px-3 sm:py-2 bg-comic-purple text-white border-3 border-black rounded-lg shadow-comic hover:bg-purple-700 flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline font-comic text-sm">CART</span>
            {totalItemCount > 0 && (
              <span className="absolute -top-2.5 -right-2.5 bg-comic-red text-white border-2 border-black font-comic text-xs px-1.5 py-0.2 rounded-full animate-bounce shadow-comic-sm">
                {totalItemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 bg-white border-3 border-black rounded-lg shadow-comic"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Search Bar */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-comic-cream border-t-3 border-black px-4 py-3 space-y-3 animate-pop">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cakes (chocolate, photo, kids...)"
              className="w-full pl-10 pr-4 py-2 bg-white border-3 border-black rounded-lg text-sm font-bold"
            />
            <Search className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 font-comic text-sm">
            <button
              onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); playPopSound(); }}
              className="comic-btn bg-white py-2 rounded-lg"
            >
              🍰 ALL CAKES
            </button>
            <button
              onClick={() => { 
                if (isLoggedIn) setActiveTab('dashboard'); 
                else openLogin(() => setActiveTab('dashboard'));
                setMobileMenuOpen(false);
                playPopSound(); 
              }}
              className="comic-btn bg-comic-blue text-white py-2 rounded-lg"
            >
              🚀 MY ORDERS
            </button>
            <button
              onClick={() => { onOpenQuickOrder(); setMobileMenuOpen(false); }}
              className="comic-btn bg-comic-red text-white py-2 rounded-lg col-span-2"
            >
              ⚡ INSTANT ORDER NOW
            </button>
            {!isLoggedIn && (
              <>
                <button
                  onClick={() => { openLogin(null, 'login'); setMobileMenuOpen(false); }}
                  className="comic-btn bg-white text-black py-2 rounded-lg"
                >
                  👤 LOGIN
                </button>
                <button
                  onClick={() => { openLogin(null, 'register'); setMobileMenuOpen(false); }}
                  className="comic-btn bg-comic-yellow text-black py-2 rounded-lg"
                >
                  ✨ CREATE ACCOUNT
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
