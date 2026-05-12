"use client";

import React from 'react';
import { X, ShoppingBag, Trash2, ChevronRight, Music, CreditCard } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface CrateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CrateDrawer({ isOpen, onClose }: CrateDrawerProps) {
  const { cart, removeFromCart, totalPrice, totalItems, clearCart } = useCart();

  const handleCheckout = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Please login to checkout");
        return;
      }

      // Sample checkout logic for multiple items
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tracks: cart.map(t => ({ id: t.id, title: t.title })),
          total: totalPrice,
          userId: session.user.id,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Checkout failed");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside className={`
        fixed top-0 right-0 h-full w-full max-w-md bg-[#0A0A0A] border-l border-white/5 z-[70] shadow-2xl
        transition-transform duration-500 ease-in-out transform
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neon/10 flex items-center justify-center text-neon">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight">Your Crate</h2>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{totalItems} Items Selected</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all"
            >
              <X size={24} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                <Music size={48} strokeWidth={1} />
                <p className="text-sm font-medium">Your crate is empty.<br/>Start digging for some heat!</p>
                <button 
                  onClick={onClose}
                  className="text-neon text-xs font-bold hover:underline"
                >
                  BROWSE TRACKS
                </button>
              </div>
            ) : (
              cart.map((track) => (
                <div key={track.id} className="group flex items-center gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-neon/20 transition-all">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={track.coverUrl} alt={track.title} fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate uppercase tracking-tight">{track.title}</h4>
                    <p className="text-xs text-white/30 truncate">{track.artist}</p>
                    <p className="text-xs text-neon mt-1 font-mono font-bold">฿{track.price || 99}.00</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(track.id)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-white/5 bg-surface/50 backdrop-blur-md">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Subtotal</span>
                  <span className="font-mono font-bold">฿{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">VAT (7%)</span>
                  <span className="font-mono font-bold text-white/20">Included</span>
                </div>
                <div className="h-px bg-white/5 my-2" />
                <div className="flex justify-between items-end">
                  <span className="text-base font-black uppercase">Total</span>
                  <span className="text-2xl font-black text-neon shadow-neon-sm">฿{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={clearCart}
                  className="py-4 rounded-2xl border border-white/10 text-white/40 text-xs font-bold uppercase hover:bg-white/5 transition-all"
                >
                  Clear All
                </button>
                <button 
                  onClick={handleCheckout}
                  className="btn-neon-solid flex items-center justify-center gap-2 py-4 rounded-2xl text-xs font-black uppercase group"
                >
                  <CreditCard size={16} />
                  Checkout
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              <p className="text-center text-[10px] text-white/20 mt-4 font-medium uppercase tracking-widest">
                Secure checkout powered by Stripe
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
