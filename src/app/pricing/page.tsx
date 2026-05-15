"use client";

import React from 'react';
import { Check, Zap, Crown, Star } from 'lucide-react';
import Link from 'next/link';

const PLANS = [
  {
    name: "Standard",
    price: "0",
    description: "Pay per track with preview access",
    features: [
      "High quality audio previews",
      "Pay-per-track downloads",
      "Standard quality (128kbps)",
      "Public playlists access",
    ],
    cta: "Get Started",
    icon: Star,
    popular: false,
  },
  {
    name: "DJ PRO",
    price: "990",
    period: "/mo",
    description: "For professional DJs needing unlimited access",
    features: [
      "Unlimited High-Quality Downloads",
      "320kbps MP3 + WAV access",
      "All track versions (Clean, Dirty, etc.)",
      "Early access to new drops",
      "Advanced BPM & Key metadata",
    ],
    cta: "Upgrade to PRO",
    icon: Zap,
    popular: true,
  },
  {
    name: "V.I.P Vault",
    price: "2490",
    period: "/mo",
    description: "The ultimate experience with priority support",
    features: [
      "Everything in DJ PRO",
      "Exclusive V.I.P Only Tracks",
      "Priority Download Speeds",
      "Personalized recommendations",
      "Request specific tracks/remixes",
    ],
    cta: "Join the Vault",
    icon: Crown,
    popular: false,
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-base pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
            CHOOSE YOUR <span className="text-neon drop-shadow-[0_0_15px_rgba(0,255,145,0.5)]">ACCESS</span>
          </h1>
          <p className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Elevate your sets with unlimited access to the world's most exclusive DJ vault.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div 
              key={plan.name}
              className={`relative group ${plan.popular ? 'md:-mt-4' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-neon text-base text-[10px] font-black px-4 py-1 rounded-full z-10 uppercase tracking-widest animate-pulse">
                  Most Popular
                </div>
              )}
              
              <div className={`h-full glass-dark border rounded-[2.5rem] p-8 transition-all duration-500 hover:scale-[1.02] ${plan.popular ? 'border-neon/30 bg-neon/5 shadow-[0_0_40px_rgba(0,255,145,0.1)]' : 'border-white/10 hover:border-white/20'}`}>
                <div className="flex justify-between items-start mb-8">
                  <div className={`p-4 rounded-2xl ${plan.popular ? 'bg-neon text-base' : 'bg-white/5 text-white'}`}>
                    <plan.icon size={28} />
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-black tracking-tight">
                      ฿{plan.price}
                      <span className="text-sm text-white/40 font-bold uppercase tracking-widest">{plan.period}</span>
                    </p>
                  </div>
                </div>

                <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">{plan.name}</h3>
                <p className="text-white/40 text-sm mb-8 font-bold leading-relaxed">{plan.description}</p>

                <div className="space-y-4 mb-10">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? 'bg-neon/20 text-neon' : 'bg-white/5 text-white/40'}`}>
                        <Check size={12} />
                      </div>
                      <span className="text-sm font-bold text-white/80">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all duration-300 ${plan.popular ? 'btn-neon-solid shadow-[0_0_20px_rgba(0,255,145,0.3)]' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'}`}>
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 glass-dark border border-white/5 rounded-[3rem] p-12 text-center overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-neon/10 via-transparent to-purple-500/10 opacity-30" />
          <h2 className="text-3xl font-black mb-4 relative z-10">NEED A CUSTOM ENTERPRISE SOLUTION?</h2>
          <p className="text-white/40 max-w-xl mx-auto mb-8 relative z-10 font-bold">
            For radio stations, record labels, and large media organizations, we offer tailored licensing and multi-user access.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 text-neon font-black uppercase tracking-widest hover:gap-4 transition-all relative z-10">
            Contact Sales Department <Zap size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
