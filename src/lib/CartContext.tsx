"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Track } from './PlayerContext';

interface CartContextType {
  cart: Track[];
  addToCart: (track: Track) => void;
  removeFromCart: (trackId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Track[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('beatvault-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('beatvault-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (track: Track) => {
    setCart((prev) => {
      if (prev.find((item) => item.id === track.id)) return prev;
      return [...prev, track];
    });
  };

  const removeFromCart = (trackId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== trackId));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.length;
  const totalPrice = cart.reduce((sum, item) => sum + (item.price || 99), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
