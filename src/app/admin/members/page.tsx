"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  User, 
  Mail, 
  Shield, 
  ShieldCheck, 
  Search,
  MoreVertical,
  Calendar
} from 'lucide-react';
import Image from 'next/image';

export default function AdminMembers() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (!error && data) {
        setMembers(data);
      }
      setLoading(false);
    };

    fetchMembers();
  }, []);

  const filteredMembers = members.filter(m => 
    m.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Member Management</h1>
        <p className="text-white/40 mt-1">Manage registered users and their permissions.</p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-neon/50 focus:bg-white/8 transition-all text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-48 glass-dark rounded-[2rem] border border-white/5 animate-pulse" />
          ))
        ) : filteredMembers.length === 0 ? (
          <div className="col-span-full py-20 text-center text-white/20 italic">
            No members found.
          </div>
        ) : (
          filteredMembers.map((member) => (
            <div key={member.id} className="glass-dark p-6 rounded-[2rem] border border-white/5 hover:border-neon/20 transition-all group relative overflow-hidden">
              {/* Role Badge */}
              <div className="absolute top-6 right-6">
                {member.role === 'admin' ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon/10 border border-neon/20 text-neon text-[10px] font-bold uppercase tracking-widest">
                    <ShieldCheck size={12} /> Admin
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                    <User size={12} /> Member
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full border-2 border-white/10 p-0.5 overflow-hidden">
                  {member.avatar_url ? (
                    <Image 
                      src={member.avatar_url} 
                      alt={member.full_name || 'User'} 
                      width={56} 
                      height={56} 
                      className="rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center rounded-full">
                      <User size={24} className="text-white/20" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-lg truncate">{member.full_name || 'Anonymous DJ'}</h3>
                  <p className="text-xs text-white/40 flex items-center gap-1">
                    <Calendar size={12} />
                    Joined {new Date(member.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-white/60">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Mail size={14} />
                  </div>
                  <span className="truncate">User ID: {member.id.slice(0, 16)}...</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 flex gap-2">
                <button className="flex-1 py-2.5 rounded-xl bg-white/5 text-xs font-bold hover:bg-white/10 transition-all">
                  View Profile
                </button>
                <button className="px-3 py-2.5 rounded-xl bg-white/5 text-white/40 hover:text-white transition-all">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
