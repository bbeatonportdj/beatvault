"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, Loader2, AlertCircle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function SetupAdmin() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handleUpgrade = async () => {
    if (!user) return;
    setLoading(true);
    setStatus('idle');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id);

      if (error) throw error;
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full glass-dark p-12 rounded-[3rem] border border-white/10 text-center relative overflow-hidden">
        {/* Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-neon/20 rounded-full blur-[80px] -mt-24" />
        
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-neon/10 flex items-center justify-center mx-auto mb-8 border border-neon/20">
            <ShieldCheck size={40} className="text-neon" />
          </div>

          <h1 className="text-3xl font-black mb-4">Admin Setup</h1>
          
          {!user ? (
            <div className="space-y-6">
              <p className="text-white/40">Please login first to upgrade your account to Admin.</p>
              <Link href="/login" className="btn-neon-solid block w-full py-4 rounded-2xl font-bold uppercase tracking-wider">
                Go to Login
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-white/5 rounded-2xl text-left border border-white/5">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Current User</p>
                <p className="text-sm font-bold truncate">{user.email}</p>
              </div>

              {status === 'success' ? (
                <div className="space-y-6 animate-fade-in">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-sm font-bold">
                    Successfully upgraded to Admin!
                  </div>
                  <Link href="/admin" className="btn-neon-solid block w-full py-4 rounded-2xl font-bold uppercase tracking-wider">
                    Go to Admin Panel
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-white/40 text-sm leading-relaxed">
                    Click the button below to grant <b>Admin Privileges</b> to this account.
                  </p>
                  <button 
                    onClick={handleUpgrade}
                    disabled={loading}
                    className="w-full btn-neon-solid py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Upgrade to Admin'}
                  </button>
                  {status === 'error' && (
                    <p className="text-red-400 text-xs flex items-center justify-center gap-2">
                      <AlertCircle size={14} /> Failed to update profile. Make sure the &apos;profiles&apos; table exists.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <Link href="/" className="inline-flex items-center gap-2 text-white/20 hover:text-white transition-all text-xs font-bold uppercase mt-8 tracking-widest">
            <ChevronLeft size={16} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
