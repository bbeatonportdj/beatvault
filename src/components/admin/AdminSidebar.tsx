"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Music, 
  DollarSign, 
  Users, 
  Settings, 
  ChevronLeft,
  LogOut,
  Headphones
} from 'lucide-react';

const MENU_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { label: 'Tracks', icon: Music, href: '/admin/tracks' },
  { label: 'Sales', icon: DollarSign, href: '/admin/sales' },
  { label: 'Members', icon: Users, href: '/admin/members' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-[#0A0A0A] border-r border-white/5 flex flex-col sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-neon flex items-center justify-center shadow-neon">
          <Headphones size={18} className="text-black" />
        </div>
        <span className="text-xl font-black tracking-tighter">ADMIN<span className="neon-text">PANEL</span></span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <p className="text-[10px] font-bold tracking-[0.2em] text-white/20 uppercase px-2 mb-4">Management</p>
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${isActive 
                  ? 'bg-neon/10 text-neon shadow-[inset_0_0_10px_rgba(0,209,255,0.05)]' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'}
              `}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <Link 
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          <ChevronLeft size={20} />
          Back to Store
        </Link>
        <button 
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all mt-2"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
