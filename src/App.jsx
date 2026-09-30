import React, { useState, useMemo } from 'react';
import { CAKES } from './data/cakes';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { OffersBanner } from './components/OffersBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { CakeGrid } from './components/CakeGrid';
import { CakeDetailsModal } from './components/CakeDetailsModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AuthModal } from './components/AuthModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Footer } from './components/Footer';
import { playPowSound } from './utils/sound';

function MainApp() {
  const { isLoggedIn, openLogin } = useAuth();
  const { addToCart, setIsCheckoutOpen } = useCart();

  // Navigation & filter state
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'dashboard'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [egglessOnly, setEgglessOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  // Customizer modal state
  const [activeCakeForCustomization, setActiveCakeForCustomization] = useState(null);
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);

  // Filtered & sorted cakes
  const filteredCakes = useMemo(() => {
    return CAKES.filter((cake) => {
      // Category filter
      if (selectedCategory !== 'all' && cake.category !== selectedCategory) {
        return false;
      }
      // Eggless filter
      if (egglessOnly && !cake.isEgglessAvailable) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = cake.name.toLowerCase().includes(query);
        const matchesDesc = cake.description.toLowerCase().includes(query);
        const matchesCategory = cake.category.toLowerCase().includes(query);
        const matchesFlavor = cake.flavors.some((f) => f.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesFlavor) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // default featured
    });
  }, [selectedCategory, egglessOnly, searchQuery, sortBy]);

  // Handlers for quick order / customize
  const handleSelectCake = (cake) => {
    setActiveCakeForCustomization(cake);
  };

  const handleQuickOrder = (cake) => {
    // Direct order path
    setActiveCakeForCustomization(cake);
  };

  const handleAddToCartFromModal = (customizedItem) => {
    addToCart(customizedItem);
  };

  const handleDirectOrderFromModal = (customizedItem) => {
    addToCart(customizedItem);
    if (!isLoggedIn) {
      openLogin(() => {
        setIsCheckoutOpen(true);
      });
    } else {
      setIsCheckoutOpen(true);
    }
  };

  const handleOpenQuickOrderHero = () => {
    // Scroll to cake grid or select first featured cake
    const firstFeatured = CAKES.find(c => c.isFeatured) || CAKES[0];
    setActiveCakeForCustomization(firstFeatured);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setEgglessOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen flex flex-col bg-comic-cream">
      {/* Comic Sticky Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickOrder={handleOpenQuickOrderHero}
        onOpenWhatsApp={() => setWhatsAppModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' ? (
          <>
            {/* Superhero Comic Hero */}
            <Hero
              onOrderNowClick={handleOpenQuickOrderHero}
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Discount Vault / Comic Coupons Banner */}
            <OffersBanner />

            {/* Category Filter & Catalog */}
            <div id="catalog-section">
              <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                egglessOnly={egglessOnly}
                setEgglessOnly={setEgglessOnly}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />

              <CakeGrid
                cakes={filteredCakes}
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
                onSelectCake={handleSelectCake}
                onQuickOrder={handleQuickOrder}
                onResetFilters={handleResetFilters}
              />
            </div>
          </>
        ) : (
          /* Customer Dashboard View */
          <CustomerDashboard
            onExploreCakes={() => setActiveTab('home')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={(catId) => {
          setActiveTab('home');
          setSelectedCategory(catId);
          window.scrollTo({ top: 500, behavior: 'smooth' });
        }}
      />

      {/* Modals & Slide-overs */}
      <CakeDetailsModal
        cake={activeCakeForCustomization}
        isOpen={!!activeCakeForCustomization}
        onClose={() => setActiveCakeForCustomization(null)}
        onAddToCart={handleAddToCartFromModal}
        onDirectOrder={handleDirectOrderFromModal}
      />

      <CartDrawer />

      <CheckoutModal />

      <OrderConfirmationModal
        onViewDashboard={() => setActiveTab('dashboard')}
        onKeepShopping={() => setActiveTab('home')}
      />

      <AuthModal />

      <WhatsAppButton
        isOpenOverride={whatsAppModalOpen}
        onCloseOverride={() => setWhatsAppModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
