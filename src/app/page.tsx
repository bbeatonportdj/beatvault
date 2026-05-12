"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Headphones, Download, Sparkles, ShoppingBag, PlayCircle, SearchX, Radio, Loader2 } from 'lucide-react';
import { usePlayer } from '@/lib/PlayerContext';
import { useCart } from '@/lib/CartContext';
import { useSearch } from '@/lib/SearchContext';
import { TRACKS, GENRES } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Hero from '@/components/layout/Hero';

export default function Dashboard() {
  const { currentTrack, playTrack } = usePlayer();
  const { addToCart, removeFromCart, cart } = useCart();
  const { searchQuery } = useSearch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeGenre, setActiveGenre] = useState('all');
  const [liveTracks, setLiveTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const { data, error } = await supabase
          .from('tracks')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) {
          setLiveTracks(data);
        } else {
          // Fallback to static data if DB is empty
          setLiveTracks(TRACKS);
        }
      } catch (err) {
        console.error("Error fetching tracks:", err);
        setLiveTracks(TRACKS);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  const isInCart = (trackId: string) => cart.some(item => item.id === trackId);

  const filteredTracks = useMemo(() => {
    let result = liveTracks;
    if (activeGenre !== 'all') {
      result = result.filter(t => t.genre === activeGenre);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.artist.toLowerCase().includes(q) ||
        (t.bpm && t.bpm.toString().includes(q))
      );
    }
    return result;
  }, [activeGenre, searchQuery, liveTracks]);

  return (
    <div className="flex flex-col h-screen bg-base text-white overflow-hidden font-sans">
      <Navbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} isMobileMenuOpen={isSidebarOpen} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activeGenre={activeGenre} 
          onGenreChange={setActiveGenre} 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        <main className="flex-1 flex flex-col overflow-y-auto relative pb-32 scroll-smooth">
          <Hero />

          {/* Featured Genres Grid */}
          <section className="px-8 mb-20 animate-fade-in delay-500">
            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-10 text-center lg:text-left">Trending Genres</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {GENRES.filter(g => g.id !== 'all').map((genre) => (
                <button 
                  key={genre.id}
                  onClick={() => setActiveGenre(genre.id)}
                  className={`group relative overflow-hidden rounded-3xl aspect-[4/3] border transition-all duration-500
                    ${activeGenre === genre.id ? 'border-neon ring-2 ring-neon/20 shadow-neon-sm' : 'border-white/5 hover:border-white/20 bg-white/[0.02]'}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-neon/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <div className={`p-4 rounded-2xl bg-surface/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ${activeGenre === genre.id ? 'text-neon shadow-neon-sm' : 'text-white/20'}`}>
                       <Sparkles size={28} className={activeGenre === genre.id ? "animate-pulse" : ""} />
                    </div>
                    <span className={`text-xs font-black uppercase tracking-[0.15em] ${activeGenre === genre.id ? 'text-neon' : 'text-white/40 group-hover:text-white'}`}>{genre.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Tracklist Section */}
          <section className="px-8 pb-12 animate-fade-in delay-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-white/5 gap-4">
              <div className="flex items-center gap-5">
                <h3 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-none">
                  {activeGenre === 'all' ? 'Fresh Drops' : activeGenre}
                </h3>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neon/10 border border-neon/20">
                   <div className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" />
                   <span className="text-[9px] font-black text-neon uppercase tracking-widest">{filteredTracks.length} Tracks</span>
                </div>
              </div>
              <div className="flex gap-2">
                 <button className="px-4 py-2 rounded-xl bg-white/5 text-[10px] font-bold uppercase hover:bg-white/10 transition-all">Sort by: Date</button>
                 <button className="px-4 py-2 rounded-xl bg-white/5 text-[10px] font-bold uppercase hover:bg-white/10 transition-all">BPM Range</button>
              </div>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="py-32 flex flex-col items-center justify-center">
                  <Loader2 className="w-12 h-12 text-neon animate-spin mb-4" />
                  <p className="text-white/20 font-black uppercase tracking-widest text-[10px]">Syncing with Vault...</p>
                </div>
              ) : filteredTracks.length === 0 ? (
                <div className="py-32 text-center flex flex-col items-center justify-center animate-fade-in">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <SearchX size={40} className="text-white/20" />
                  </div>
                  <h4 className="text-xl font-black uppercase tracking-tighter mb-2">No Tracks Found</h4>
                  <p className="text-white/40 max-w-xs mx-auto">We couldn&apos;t find any tracks matching your search or selected genre.</p>
                  <button 
                    onClick={() => { setActiveGenre('all'); }}
                    className="mt-6 text-neon text-xs font-black uppercase tracking-widest hover:underline"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                filteredTracks.map((track, idx) => (
                <div 
                  key={track.id} 
                  className={`group flex items-center gap-6 p-4 rounded-[2rem] border border-transparent hover:border-white/10 hover:bg-white/[0.03] transition-all duration-300 cursor-pointer
                    ${currentTrack?.id === track.id ? 'bg-neon/5 border-neon/20 shadow-neon-sm' : ''}`}
                >
                  <div 
                    className="flex flex-1 items-center gap-6"
                    onClick={() => playTrack(track)}
                  >
                    <div className="w-6 text-center text-[10px] font-black text-white/10 group-hover:text-neon transition-colors">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-surface flex-shrink-0 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                      <Image src={track.cover_url || track.coverUrl} alt={track.title} fill className="object-cover" unoptimized />
                      <div className={`absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity ${currentTrack?.id === track.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <PlayCircle size={32} className="text-neon" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-black text-xl lg:text-2xl truncate uppercase tracking-tighter group-hover:text-neon transition-colors leading-none">
                          {track.title}
                        </span>
                        {track.isNew && <span className="px-2 py-0.5 rounded-lg bg-neon/10 text-neon text-[9px] font-black uppercase tracking-widest border border-neon/20">NEW</span>}
                      </div>
                      <div className="text-sm font-bold text-white/30 truncate flex items-center gap-2 uppercase tracking-wide">
                        <span className="text-white/60">{track.artist}</span>
                        <span className="w-1 h-1 rounded-full bg-white/10" />
                        <span>{track.label || 'BEATVAULT EXCLUSIVE'}</span>
                      </div>
                    </div>

                    <div className="hidden lg:flex flex-col items-center gap-1.5 w-24">
                      <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.2em] leading-none">Tempo</span>
                      <span className="text-base font-black text-white/70 group-hover:text-white font-mono">{track.bpm} <span className="text-[10px] text-white/20">BPM</span></span>
                    </div>

                    <div className="hidden lg:flex flex-col items-center gap-1.5 w-20">
                      <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.2em] leading-none text-center">Harmonic</span>
                      <span className="text-base font-black text-neon/60 group-hover:text-neon text-center font-mono">{track.key}</span>
                    </div>

                    <div className="hidden xl:block w-20 text-right">
                      <span className="text-xs font-mono text-white/20">{track.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      className="hidden md:flex p-4 rounded-2xl bg-white/5 border border-white/5 text-white/30 hover:text-white hover:border-white/20 transition-all"
                      title="Share Track"
                    >
                      <Radio size={18} />
                    </button>
                    
                    <button 
                      className="hidden lg:flex px-4 py-4 rounded-2xl bg-purple-600/10 border border-purple-600/20 text-purple-400 text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-lg shadow-purple-900/20"
                      title="Pro Feature: Download Stems"
                    >
                      Stems
                    </button>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        isInCart(track.id) ? removeFromCart(track.id) : addToCart(track);
                      }}
                      className={`p-5 rounded-2xl transition-all relative z-10 hover:scale-110 active:scale-95 shadow-2xl border
                        ${isInCart(track.id) ? 'bg-neon border-neon text-black shadow-neon' : 'bg-white/5 border-white/5 hover:border-neon/50 hover:text-neon'}`}
                    >
                      <ShoppingBag size={22} />
                    </button>
                  </div>
                </div>
              )))}
            </div>
          </section>

          {/* Newsletter / CTA Section */}
          <section className="px-8 mt-24 mb-32">
            <div className="relative rounded-[4rem] p-16 overflow-hidden bg-surface border border-white/5 shadow-2xl">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon/5 rounded-full blur-[120px] -mr-60 -mt-60" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] -ml-40 -mb-40" />
              
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="text-center lg:text-left">
                  <h4 className="text-5xl lg:text-6xl font-black tracking-tighter uppercase mb-6 leading-none">Join the <br/><span className="neon-text">Collective</span></h4>
                  <p className="text-white/40 text-lg max-w-md leading-relaxed">Get exclusive early access to secret drops, sample packs, and VIP member events.</p>
                </div>
                <div className="w-full max-w-xl">
                  <div className="flex flex-col sm:flex-row gap-3 p-2 bg-black/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10">
                    <input type="text" placeholder="Enter your email" className="flex-1 bg-transparent border-none rounded-[2rem] px-8 py-5 text-sm focus:outline-none focus:ring-1 focus:ring-neon/30 transition-all" />
                    <button className="px-12 py-5 bg-white text-black rounded-[2rem] font-black uppercase text-xs hover:bg-neon hover:shadow-neon transition-all duration-500">Subscribe</button>
                  </div>
                  <p className="text-[10px] text-white/20 mt-4 text-center uppercase tracking-widest font-bold">Join 15,000+ Professional DJs Worldwide</p>
                </div>
              </div>
            </div>
          </section>

          <footer className="px-8 py-20 border-t border-white/5 bg-black/20 text-center">
            <div className="mb-8 flex justify-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-neon flex items-center justify-center">
                 <Headphones size={22} className="text-black" />
               </div>
               <span className="text-2xl font-black tracking-tighter">BEAT<span className="neon-text">VAULT</span></span>
            </div>
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.5em]">The ultimate DJ music pool &copy; 2026</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
