"use client";

import { LayoutGrid, Waves, Zap, Mic2, Radio, TrendingUp, Clock, Star, ChevronRight, ShieldCheck } from "lucide-react";
import { GENRES } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

const iconMap: Record<string, React.ComponentType<{ size?: string | number; className?: string }>> = {
  LayoutGrid,
  Waves,
  Zap,
  Mic2,
  Drum: Waves,
  Radio,
};

interface SidebarProps {
  activeGenre: string;
  onGenreChange: (genre: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_LINKS = [
  { id: "new", label: "New Releases", icon: TrendingUp },
  { id: "recent", label: "Recently Added", icon: Clock },
  { id: "top", label: "Top Charts", icon: Star },
];

export default function Sidebar({ activeGenre, onGenreChange, isOpen, onClose }: SidebarProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handleGenreClick = (genre: string) => {
    onGenreChange(genre);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-20 bottom-[88px] z-30 w-72 flex flex-col
          bg-[#0A0A0A] border-r border-white/5 overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:sticky lg:top-20 lg:z-auto
        `}
        id="sidebar"
      >
        <div className="p-6 space-y-8">
          
          {/* Member Status */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon/10 flex items-center justify-center">
              <ShieldCheck size={20} className="text-neon" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Membership</p>
              <p className="text-xs font-bold text-white uppercase">{user ? "PRO MEMBER" : "FREE ACCOUNT"}</p>
            </div>
          </div>

          {/* Genres */}
          <div>
            <p className="text-[10px] font-black tracking-[0.2em] text-white/10 uppercase mb-4 px-2">
              Discover Heat
            </p>
            <nav className="space-y-1">
              {GENRES.map((genre) => {
                const Icon = iconMap[genre.icon] || LayoutGrid;
                const isActive = activeGenre === genre.id;
                return (
                  <button
                    key={genre.id}
                    id={`genre-${genre.id}`}
                    onClick={() => handleGenreClick(genre.id)}
                    className={`group w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm transition-all
                      ${isActive ? "text-neon bg-neon/5 font-black" : "text-white/40 hover:text-white/80 hover:bg-white/[0.03]"}`}
                  >
                    <span className="flex items-center gap-4">
                      <Icon size={18} className={isActive ? "text-neon" : "text-white/20 group-hover:text-white/40"} />
                      <span className="uppercase tracking-tight">{genre.label}</span>
                    </span>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-neon shadow-neon animate-pulse" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/5 mx-2" />

          {/* Quick links */}
          <div>
            <p className="text-[10px] font-black tracking-[0.2em] text-white/10 uppercase mb-4 px-2">
              Collections
            </p>
            <nav className="space-y-1">
              {QUICK_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.id}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold text-white/40 hover:text-white hover:bg-white/[0.03] transition-all uppercase tracking-tight"
                  >
                    <Icon size={18} className="text-white/20" />
                    {link.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Upgrade Card */}
          <div className="relative overflow-hidden rounded-[2rem] p-6 bg-gradient-to-br from-neon/10 to-transparent border border-neon/10 group cursor-pointer">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
              <Zap size={48} className="text-neon" />
            </div>
            <h4 className="text-sm font-black text-white uppercase mb-1 tracking-tight">Main Stage Access</h4>
            <p className="text-[10px] text-white/30 leading-relaxed mb-4 uppercase font-bold">
              Unlock unlimited stems & packs
            </p>
            <button className="btn-neon-solid w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
