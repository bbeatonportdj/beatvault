"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  MoreVertical,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { TRACKS } from '@/lib/data';
import Image from 'next/image';
import TrackForm from '@/components/admin/TrackForm';

export default function AdminTracks() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTracks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTracks(data || []);
    } catch (err) {
      console.error("Error fetching tracks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {isFormOpen && (
        <TrackForm 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={() => {
            setIsFormOpen(false);
            fetchTracks();
          }} 
        />
      )}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Manage Tracks</h1>
          <p className="text-white/40 mt-1">Add, edit, or remove tracks from the store.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="btn-neon-solid px-6 py-3 rounded-2xl flex items-center gap-2 font-bold uppercase tracking-wider text-sm"
        >
          <Plus size={18} />
          Add New Track
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            type="text" 
            placeholder="Search by title, artist, or tag..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-neon/50 focus:bg-white/8 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="glass-dark px-6 rounded-2xl border border-white/10 flex items-center gap-2 text-sm font-bold text-white/60 hover:text-white transition-all">
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* Track Table */}
      <div className="glass-dark rounded-[2.5rem] border border-white/5 overflow-hidden min-h-[400px] relative">
        {loading && (
          <div className="absolute inset-0 bg-base/50 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <Loader2 size={32} className="text-neon animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Syncing with Vault...</p>
          </div>
        )}
        
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              <th className="text-left px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Track Info</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Genre</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Technical</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Price</th>
              <th className="text-left px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Status</th>
              <th className="text-right px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {tracks.length === 0 && !loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <p className="text-white/20 font-bold uppercase tracking-widest">No tracks found. Upload your first drop!</p>
                </td>
              </tr>
            ) : (
              tracks.map((track) => (
                <tr key={track.id} className="group hover:bg-white/[0.02] transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 relative flex-shrink-0">
                        <Image src={track.cover_url || track.coverUrl} alt={track.title} fill className="object-cover" unoptimized />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate uppercase tracking-tight">{track.title}</p>
                        <p className="text-xs text-white/40 truncate uppercase font-bold">{track.artist}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-black text-white/40 uppercase tracking-widest">
                       {track.genre}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-xs font-black text-white/60">{track.bpm} BPM</p>
                      <p className="text-[10px] font-mono text-neon/60 uppercase font-black">{track.key}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-neon">฿{track.price || '499'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                      <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Live</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end items-center gap-2">
                      <button className="p-3 rounded-xl hover:bg-white/5 text-white/20 hover:text-white transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete this track?')) {
                            const { error } = await supabase.from('tracks').delete().eq('id', track.id);
                            if (!error) fetchTracks();
                          }
                        }}
                        className="p-3 rounded-xl hover:bg-red-500/10 text-white/20 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
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
