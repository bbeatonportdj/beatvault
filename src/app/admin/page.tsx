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
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
        <p className="text-white/40 mt-1">Welcome back, here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-dark p-6 rounded-[2rem] border border-white/5 hover:border-neon/20 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-neon/10 transition-colors">
                  <Icon size={24} className="text-white group-hover:text-neon transition-colors" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change}
                  {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                </div>
              </div>
              <div>
                <p className="text-white/40 text-sm font-medium">{stat.label}</p>
                <h3 className="text-2xl font-black mt-1">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity / Chart Placeholder */}
        <div className="lg:col-span-2 glass-dark p-8 rounded-[2.5rem] border border-white/5 h-[400px] flex items-center justify-center">
          <div className="text-center">
            <TrendingUp size={48} className="text-white/10 mx-auto mb-4" />
            <p className="text-white/20 font-bold uppercase tracking-widest text-xs">Revenue Analytics Chart</p>
          </div>
        </div>

        {/* Top Tracks / Mini List */}
        <div className="glass-dark p-8 rounded-[2.5rem] border border-white/5">
          <h3 className="text-lg font-bold mb-6">Top Selling Tracks</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex-shrink-0 overflow-hidden">
                   <div className="w-full h-full bg-gradient-to-br from-neon/20 to-purple-500/20" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">Neon Horizon #{item}</p>
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-wider">House • VAULT001</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-neon">฿499</p>
                  <p className="text-[10px] text-white/20">12 sales</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
