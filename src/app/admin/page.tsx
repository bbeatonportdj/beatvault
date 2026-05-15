"use client";

import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Music, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { label: 'Total Revenue', value: '฿0', change: '+0%', icon: DollarSign, trend: 'up' },
    { label: 'Total Tracks', value: '0', change: '+0', icon: Music, trend: 'up' },
    { label: 'New Members', value: '0', change: '+0', icon: Users, trend: 'up' },
    { label: 'Conversion Rate', value: '0%', change: '0%', icon: TrendingUp, trend: 'up' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      // 1. Fetch Total Tracks
      const { count: trackCount } = await supabase.from('tracks').select('*', { count: 'exact', head: true });
      
      // 2. Fetch Total Members
      const { count: memberCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

      // 3. Fetch Total Revenue
      const { data: salesData } = await supabase.from('purchases').select('amount');
      const totalRevenue = salesData?.reduce((sum, sale) => sum + Number(sale.amount), 0) || 0;

      setStats([
        { label: 'Total Revenue', value: `฿${totalRevenue.toLocaleString()}`, change: '+100%', icon: DollarSign, trend: 'up' },
        { label: 'Total Tracks', value: String(trackCount || 0), change: `+${trackCount}`, icon: Music, trend: 'up' },
        { label: 'New Members', value: String(memberCount || 0), change: `+${memberCount}`, icon: Users, trend: 'up' },
        { label: 'Conversion Rate', value: '3.2%', change: '+0.5%', icon: TrendingUp, trend: 'up' },
      ]);
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-12 animate-fade-in max-w-6xl mx-auto">
      {/* Brutalist Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-white/5 pb-8">
        <div>
          <h1 className="text-6xl font-black tracking-tighter uppercase leading-none">Command <br/><span className="text-neon">Center</span></h1>
          <p className="text-white/40 mt-4 text-xs font-bold uppercase tracking-[0.3em]">System Health: Optimal • Vault Sync: Live</p>
        </div>
        <div className="flex gap-4 mt-6 md:mt-0">
          <button className="px-6 py-3 bg-neon text-black font-black uppercase text-xs rounded-xl hover:scale-105 transition-all">Quick Export</button>
          <button className="px-6 py-3 bg-white/5 text-white font-black uppercase text-xs rounded-xl border border-white/10">Logs</button>
        </div>
      </div>

      {/* High-Impact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
        {stats.slice(0, 3).map((stat, idx) => {
          return (
            <div key={idx} className="bg-white/[0.02] p-8 border border-white/5 hover:bg-white/[0.04] transition-all">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4">{stat.label}</p>
              <div className="flex items-baseline gap-4">
                <h3 className="text-5xl font-black tracking-tighter">{stat.value}</h3>
                <span className="text-xs font-bold text-green-400">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12">
        {/* Simple Activity Table */}
        <div className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/20">Critical Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 group hover:px-4 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" />
                  <span className="text-xs font-bold text-white/60">New sale: Track #029384</span>
                </div>
                <span className="text-[10px] font-mono text-white/20 uppercase">2m ago</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Launch Panel */}
        <div className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/20">System Access</h3>
          <div className="grid grid-cols-2 gap-4">
            <a href="/admin/tracks" className="p-8 rounded-3xl bg-surface border border-white/5 hover:border-neon/40 hover:bg-neon/5 transition-all text-center group">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:text-neon">
                <Music size={24} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Library</span>
            </a>
            <a href="/admin/members" className="p-8 rounded-3xl bg-surface border border-white/5 hover:border-neon/40 hover:bg-neon/5 transition-all text-center group">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:text-neon">
                <Users size={24} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Members</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
