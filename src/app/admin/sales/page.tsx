"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Download, 
  Search, 
  Calendar, 
  ExternalLink,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function AdminSales() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setPurchases(data);
      }
      setLoading(false);
    };

    fetchPurchases();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Sales History</h1>
          <p className="text-white/40 mt-1">Monitor all transactions and track downloads.</p>
        </div>
        <button className="glass-dark px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-sm hover:bg-white/5 transition-all">
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Transaction Table */}
      <div className="glass-dark rounded-[2.5rem] border border-white/5 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              <th className="text-left px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Date</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Transaction ID</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Customer</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Track</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Amount</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-6 py-8 h-16 bg-white/[0.01]" />
                </tr>
              ))
            ) : purchases.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center text-white/20 italic">
                  No transactions found yet.
                </td>
              </tr>
            ) : (
              purchases.map((sale) => (
                <tr key={sale.id} className="group hover:bg-white/[0.02] transition-all">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-white/60 text-xs">
                      <Calendar size={14} />
                      {new Date(sale.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-mono text-white/40 uppercase">#{sale.id.slice(0, 8)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold truncate">{sale.user_id.slice(0, 12)}...</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">Track #{sale.track_id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-neon">฿{sale.amount}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {sale.status === 'completed' ? (
                        <CheckCircle2 size={14} className="text-green-400" />
                      ) : (
                        <Clock size={14} className="text-yellow-400" />
                      )}
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${sale.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {sale.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
