"use client";

import React, { useEffect, useState } from 'react';
import { User, Package, Download, Music, ShieldCheck, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Image from 'next/image';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        
        // Fetch purchase history with track details
        const { data: purchaseData, error } = await supabase
          .from('purchases')
          .select(`
            *,
            tracks (*)
          `)
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (!error) setPurchases(purchaseData || []);
        
        // Check subscription
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('status', 'active')
          .single();
        
        if (sub) {
          setUser((prev: any) => ({ ...prev, isPro: true, planId: sub.plan_id }));
        }
      }
      setLoading(false);
    };

    getProfile();
  }, []);

  if (loading) return <div className="min-h-screen bg-base flex items-center justify-center"><div className="w-12 h-12 border-4 border-neon/20 border-t-neon animate-spin rounded-full" /></div>;

  if (!user) return (
    <div className="min-h-screen bg-base text-white flex flex-col items-center justify-center p-6 text-center">
      <ShieldCheck size={64} className="text-white/10 mb-6" />
      <h1 className="text-3xl font-black uppercase mb-4 tracking-tighter">Access Denied</h1>
      <p className="text-white/40 mb-8 max-w-sm">Please login to view your profile and download your tracks.</p>
      <a href="/" className="btn-neon-solid px-10 py-4 rounded-2xl font-black uppercase text-xs">Return Home</a>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-base text-white overflow-hidden font-sans">
      <Navbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} isMobileMenuOpen={isSidebarOpen} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeGenre="" onGenreChange={() => {}} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 overflow-y-auto p-8 pb-32">
          {/* Header Profile */}
          <div className="relative rounded-[3rem] p-12 bg-surface border border-white/5 overflow-hidden mb-12 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-neon/10 rounded-full blur-[100px] -mr-32 -mt-32" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 rounded-[2.5rem] border-4 border-neon/30 p-1 shadow-neon">
                {user.user_metadata?.avatar_url ? (
                  <Image src={user.user_metadata.avatar_url} alt="Profile" width={128} height={128} className="rounded-[2.2rem] object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full bg-base rounded-[2.2rem] flex items-center justify-center">
                    <User size={48} className="text-white/20" />
                  </div>
                )}
              </div>
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 className="text-4xl font-black tracking-tighter uppercase">{user.user_metadata?.full_name || 'DJ Member'}</h1>
                  {user.isPro && (
                    <div className="bg-neon text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest animate-pulse">PRO</div>
                  )}
                </div>
                <p className="text-white/40 font-medium mb-6">{user.email}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest ${user.isPro ? 'bg-neon/10 border-neon/20 text-neon' : 'bg-white/5 border-white/5 text-white/40'}`}>
                    {user.isPro ? `DJ PRO: ${user.planId}` : 'Free Account'}
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest">{purchases.length} Tracks Owned</div>
                </div>
              </div>
            </div>
          </div>

          {/* Purchases Grid */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <Package size={20} className="text-neon" />
              <h2 className="text-xl font-black uppercase tracking-tight">Your Crate History</h2>
            </div>

            {purchases.length === 0 ? (
              <div className="py-20 text-center rounded-[3rem] border-2 border-dashed border-white/5 bg-white/[0.01]">
                <Music size={48} className="mx-auto text-white/10 mb-4" />
                <p className="text-white/40 font-medium">You haven&apos;t purchased any tracks yet.</p>
                <a href="/" className="text-neon text-sm font-black mt-4 block hover:underline">Start Digging</a>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {purchases.map((item: any) => {
                  const track = item.tracks;
                  return (
                    <div key={item.id} className="group flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-[2.5rem] bg-surface border border-white/5 hover:border-neon/20 transition-all">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-base flex-shrink-0 relative">
                        {track?.cover_url ? (
                          <Image src={track.cover_url} alt={track.title} fill className="object-cover" unoptimized />
                        ) : (
                          <Music size={32} className="absolute inset-0 m-auto text-white/10" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-black text-lg truncate uppercase tracking-tighter">{track?.title || 'Unknown Track'}</h4>
                          <span className="text-[10px] font-mono text-neon/60">{track?.bpm} BPM</span>
                        </div>
                        <p className="text-xs text-white/40 uppercase font-bold tracking-wide mb-3">{track?.artist || 'Unknown Artist'}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {[
                            { label: 'Main', key: 'audio_url' },
                            { label: 'Clean', key: 'clean_url' },
                            { label: 'Dirty', key: 'dirty_url' },
                            { label: 'Inst', key: 'instrumental_url' },
                            { label: 'Acap', key: 'acapella_url' },
                            { label: 'Intro', key: 'intro_url' },
                          ].filter(v => track?.[v.key]).map(v => (
                            <a 
                              key={v.label}
                              href={`/api/download?trackId=${track.id}&version=${v.key}`}
                              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-neon hover:text-black hover:border-neon transition-all"
                            >
                              {v.label}
                            </a>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-white/20 uppercase tracking-widest font-black mb-2">Purchased {new Date(item.created_at).toLocaleDateString()}</p>
                        <a 
                          href={`/api/download?trackId=${track?.id}`}
                          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-neon text-black font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-neon"
                        >
                          <Download size={16} />
                          Download All
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
