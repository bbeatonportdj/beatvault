"use client";

import { useState } from "react";
import { Search, Menu, X, ShoppingBag, Globe, ChevronDown } from "lucide-react";
import AuthSection from "@/components/auth/AuthSection";
import { useCart } from "@/lib/CartContext";
import CrateDrawer from "./CrateDrawer";

interface NavbarProps {
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

import { useSearch } from "@/lib/SearchContext";

export default function Navbar({ onMenuToggle, isMobileMenuOpen }: NavbarProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const { searchQuery, setSearchQuery } = useSearch();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-base/80 backdrop-blur-2xl border-b border-white/5">
      <div className="flex items-center justify-between gap-4 px-4 sm:px-8 h-20">
        
        {/* Left: Mobile Menu & Logo */}
        <div className="flex items-center gap-4">
          <button
            id="mobile-menu-btn"
            onClick={onMenuToggle}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
            aria-label="Toggle sidebar menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <a href="/" id="logo" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-neon flex items-center justify-center shadow-neon group-hover:scale-110 transition-transform">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                <path d="M12 2v20M2 12h20M12 12l8-8M12 12l-8 8M12 12l8 8M12 12l-8-8" />
              </svg>
            </div>
            <span className="text-xl font-black tracking-tighter text-white hidden sm:block">
              BEAT<span className="neon-text">VAULT</span>
            </span>
          </a>
          
          <nav className="hidden lg:flex items-center gap-6 ml-8">
            <a href="/pricing" className="text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-neon transition-colors flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-neon animate-pulse" />
              Membership
            </a>
          </nav>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-2xl hidden md:block">
          <div className={`relative flex items-center transition-all duration-300 ${searchFocused ? "scale-[1.02]" : ""}`}>
            <Search
              size={18}
              className={`absolute left-4 transition-colors duration-200 ${searchFocused ? "text-neon" : "text-white/20"}`}
            />
            <input
              id="search-input"
              type="text"
              placeholder="Search tracks, artists, BPM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-3.5 rounded-2xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-neon/50 focus:bg-white/10 transition-all font-medium"
            />
          </div>
        </div>

        {/* Right: Actions (Language, Cart, Auth) */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Language / Currency Selector (Shopify Style) */}
          <div className="hidden lg:flex items-center gap-1 px-3 py-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors text-[11px] font-bold text-white/40 hover:text-white uppercase tracking-wider">
            <Globe size={14} className="text-neon/60" />
            <span>TH / THB</span>
            <ChevronDown size={12} />
          </div>

          <div className="w-px h-6 bg-white/10 hidden lg:block" />

          {/* Cart Icon (Crate) */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 hover:bg-neon hover:text-black transition-all group shadow-lg"
          >
            <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-neon text-black text-[10px] font-black rounded-full flex items-center justify-center shadow-neon ring-4 ring-base">
                {totalItems}
              </span>
            )}
          </button>

          <div className="w-px h-6 bg-white/10 hidden sm:block" />

          {/* Auth Section */}
          <AuthSection />
        </div>
      </div>

      {/* Crate Drawer Overlay */}
      <CrateDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
