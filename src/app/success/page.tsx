"use client";

import React, { useEffect } from 'react';
import { CheckCircle2, Download, Home, Music, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart after successful purchase
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-base text-white flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-xl w-full text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-neon/10 border border-neon/20 mb-8 animate-bounce-subtle">
          <CheckCircle2 size={48} className="text-neon shadow-neon-sm" />
        </div>

        <h1 className="text-5xl font-black tracking-tighter uppercase mb-6 leading-none">
          Payment <br/>
          <span className="neon-text">Successful!</span>
        </h1>

        <p className="text-white/40 text-lg mb-12 leading-relaxed">
          Your crate has been processed. The tracks are now unlocked and ready for your next set. 
          Check your email for the download links.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 px-8 py-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold text-sm uppercase tracking-widest"
          >
            <Home size={18} />
            Back to Library
          </Link>
          
          <button 
            onClick={() => window.location.href = '/profile'} // Assuming there is a profile page with downloads
            className="btn-neon-solid flex items-center justify-center gap-2 px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest group"
          >
            <Download size={18} />
            Go to Downloads
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="mt-16 p-8 rounded-3xl bg-surface/50 border border-white/5 backdrop-blur-md">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Music size={20} className="text-neon" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Next Step</span>
          </div>
          <p className="text-sm font-medium text-white/60">
            It may take a few minutes for the download links to appear in your account while our servers process the high-quality files.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
