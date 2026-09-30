import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playPopSound, playPowSound, playSuccessFanfare } from '../utils/sound';
import { DISCOUNT_COUPONS } from '../data/cakes';

const CartContext = createContext();

const INITIAL_ORDERS = [
  {
    id: 'BOMMI-9821',
    createdAt: '2026-09-28T14:30:00Z',
    items: [
      {
        id: 'ord-item-1',
        name: 'Comic Hero Belgian Truffle',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80',
        weight: '1.0 kg',
        flavor: 'Belgian Chocolate Ganache',
        isEggless: true,
        cakeMessage: 'HAPPY BIRTHDAY KABIR!',
        price: 1188,
        quantity: 1,
      }
    ],
    deliveryDetails: {
      receiver: 'Captain Priya',
      phone: '9876543210',
      address: 'Flat 402, Krypton Heights, Indiranagar, Bengaluru - 560038',
      date: '2026-09-29',
      slot: '🌅 Morning Rush (9:00 AM - 12:00 PM)',
    },
    subtotal: 1188,
    discount: 100,
    deliveryFee: 0,
    total: 1088,
    paymentMethod: 'UPI (GPay / PhonePe)',
    status: 'Delivered',
    trackingStep: 4,
  },
  {
    id: 'BOMMI-9942',
    createdAt: '2026-09-30T10:15:00Z',
    items: [
      {
        id: 'ord-item-2',
        name: 'Superhero Comic Comic-Book 3D Cake',
        image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=400&q=80',
        weight: '1.0 kg',
        flavor: 'Funfetti Rainbow Vanilla',
        isEggless: true,
        cakeMessage: 'YOU ARE OUR SUPERHERO!',
        price: 949,
        quantity: 1,
      }
    ],
    deliveryDetails: {
      receiver: 'Captain Priya',
      phone: '9876543210',
      address: 'Flat 402, Krypton Heights, Indiranagar, Bengaluru - 560038',
      date: 'Today (Rocket Delivery)',
      slot: '⚡ Rocket Express (Next 2 Hours)',
    },
    subtotal: 949,
    discount: 189,
    deliveryFee: 49,
    total: 809,
    paymentMethod: 'Credit / Debit Card',
    status: 'In the Oven!',
    trackingStep: 2,
  }
];

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('bommi_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('bommi_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch (e) {
      return INITIAL_ORDERS;
    }
  });

  const [coupon, setCoupon] = useState({ code: 'POW20', discountPercent: 20 });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('bommi_cart', JSON.stringify(cartItems));
    } catch (e) {}
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('bommi_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  const addToCart = (customizedCake) => {
    playPopSound();
    const itemKey = `${customizedCake.id}-${customizedCake.weight}-${customizedCake.flavor}-${customizedCake.isEggless ? 'eggl' : 'egg'}-${customizedCake.cakeMessage}`;
    
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.itemKey === itemKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += (customizedCake.quantity || 1);
        return updated;
      } else {
        return [...prev, { ...customizedCake, itemKey, cartItemId: 'cart-' + Date.now() + Math.random().toString(36).substr(2, 4) }];
      }
    });
  };

  const updateQuantity = (cartItemId, newQty) => {
    playPopSound();
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item)
    );
  };

  const removeFromCart = (cartItemId) => {
    playPopSound();
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const applyCoupon = (code) => {
    const found = DISCOUNT_COUPONS.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (found) {
      setCoupon(found);
      playPowSound();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      return { success: true, message: `POW! Code ${found.code} applied successfully!` };
    }
    return { success: false, message: 'Invalid code! Try "POW20" or "BOMMI100"!' };
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  let discountAmount = 0;
  if (coupon) {
    if (coupon.discountPercent) {
      discountAmount = Math.round((subtotal * coupon.discountPercent) / 100);
    } else if (coupon.discountAmount) {
      discountAmount = Math.min(subtotal, coupon.discountAmount);
    }
  }

  const deliveryFee = subtotal > 0 ? (cartItems.some(i => i.deliverySlot?.includes('Rocket')) ? 49 : 0) : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);
  const totalItemCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  const placeOrder = (orderDetails) => {
    playSuccessFanfare();
    
    // Confetti explosion
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 }
    });

    const newOrder = {
      id: 'BOMMI-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
      items: [...cartItems],
      deliveryDetails: orderDetails.deliveryDetails,
      subtotal,
      discount: discountAmount,
      deliveryFee,
      total: grandTotal,
      paymentMethod: orderDetails.paymentMethod,
      status: 'Order Placed & Baking!',
      trackingStep: 1,
    };

    setOrders([newOrder, ...orders]);
    clearCart();
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setConfirmedOrder(newOrder);

    return newOrder;
  };

  const reorder = (pastOrder) => {
    playPowSound();
    pastOrder.items.forEach(item => {
      addToCart({
        ...item,
        quantity: 1,
      });
    });
    setIsCartOpen(true);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItemCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        discountAmount,
        deliveryFee,
        grandTotal,
        coupon,
        applyCoupon,
        removeCoupon,
        orders,
        placeOrder,
        reorder,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        confirmedOrder,
        setConfirmedOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
