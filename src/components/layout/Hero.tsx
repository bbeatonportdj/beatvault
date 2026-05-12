"use client";

import { ArrowRight, Sparkles, TrendingUp, Shield, Zap, PlayCircle } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden px-8 pt-20 pb-16 min-h-[500px] flex items-center"
      aria-label="Hero section"
    >
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-150px] left-[10%] w-[600px] h-[600px] bg-neon/10 rounded-full blur-[140px] animate-pulse-neon" />
        <div className="absolute bottom-[-100px] right-[5%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px]" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-200 contrast-150" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-neon/5 border border-neon/10 backdrop-blur-md mb-8 animate-fade-in">
          <Zap size={14} className="text-neon fill-neon/20" />
          <span className="text-[10px] font-black text-neon tracking-[0.2em] uppercase">
            Exclusive DJ Music Pool — Version 2.0
          </span>
        </div>

        {/* Main heading */}
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter text-white mb-8 animate-slide-in">
          ELEVATE YOUR <br />
          <span className="neon-text filter drop-shadow-[0_0_15px_rgba(0,209,255,0.3)]">MAIN STAGE</span>
        </h1>

        <p className="text-white/50 text-lg sm:text-xl max-w-2xl leading-relaxed mb-10 animate-fade-in delay-100">
          Professional-grade tracks, stems, and exclusive edits curated for elite DJs. 
          The ultimate crate for House, Techno, and Hip-Hop.
        </p>

        {/* CTA group */}
        <div className="flex flex-wrap items-center gap-4 animate-fade-in delay-200">
          <button
            id="cta-start-digging"
            className="btn-neon-solid flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-base uppercase tracking-wider group hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,209,255,0.3)]"
          >
            Start Digging
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            id="cta-preview"
            className="flex items-center gap-3 px-8 py-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold text-base text-white/80 hover:text-white"
          >
            <PlayCircle size={20} />
            Quick Preview
          </button>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-12 mt-16 pt-10 border-t border-white/5 animate-fade-in delay-300">
          {[
            { icon: TrendingUp, label: "Weekly Drops", value: "100+" },
            { icon: Shield, label: "DJ Licensing", value: "Verified" },
            { icon: Sparkles, label: "VIP Content", value: "Exclusive" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="group">
                <div className="text-3xl font-black text-white mb-1 tracking-tight group-hover:text-neon transition-colors">{stat.value}</div>
                <div className="flex items-center gap-2">
                  <Icon size={12} className="text-neon" />
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{stat.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decorative Floating Element */}
      <div className="hidden lg:block absolute right-[-5%] top-[20%] w-[500px] h-[500px] pointer-events-none opacity-20">
         <div className="w-full h-full border-[1px] border-neon/30 rounded-full animate-[spin_20s_linear_infinite]" />
         <div className="absolute inset-20 border-[1px] border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
         <div className="absolute inset-40 border-[1px] border-neon/20 rounded-full animate-[spin_10s_linear_infinite]" />
      </div>
    </section>
  );
}
