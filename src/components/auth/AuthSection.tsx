"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LogIn, LogOut, User, Facebook } from "lucide-react";
import Image from "next/image";

export default function AuthSection() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithProvider = async (provider: 'google' | 'facebook') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: typeof window !== 'undefined' 
            ? `${window.location.origin}/auth/callback` 
            : '',
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("Auth Error:", error.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div className="w-8 h-8 rounded-full border-2 border-neon/20 border-t-neon animate-spin" />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-3 animate-fade-in">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-[13px] font-bold text-white leading-none">
            {user.user_metadata?.full_name || user.email?.split('@')[0]}
          </span>
          <span className="text-[10px] text-neon/60 font-mono">PRO MEMBER</span>
        </div>
        
        <div className="group relative">
          {/* User Avatar with Neon Glow */}
          <div className="w-10 h-10 rounded-full border-2 border-neon/50 p-0.5 shadow-neon-sm group-hover:shadow-neon transition-all cursor-pointer overflow-hidden">
            {user.user_metadata?.avatar_url ? (
              <Image 
                src={user.user_metadata.avatar_url} 
                alt="Profile" 
                width={40} 
                height={40} 
                className="rounded-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-surface flex items-center justify-center rounded-full">
                <User size={18} className="text-neon" />
              </div>
            )}
          </div>

          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-48 glass-dark border border-white/10 rounded-xl p-1 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all z-50">
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <LogOut size={16} className="text-red-400" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Social Login Buttons */}
      <button
        onClick={() => signInWithProvider('google')}
        className="btn-neon flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
        style={{ boxShadow: '0 0 15px rgba(0, 209, 255, 0.1)' }}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        <span className="hidden lg:inline">Google</span>
      </button>

      <button
        onClick={() => signInWithProvider('facebook')}
        className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#1877F2]/10 border border-[#1877F2]/30 text-[#1877F2] rounded-xl text-sm font-semibold hover:bg-[#1877F2]/20 transition-all"
      >
        <Facebook size={16} fill="currentColor" />
        <span className="hidden lg:inline">Facebook</span>
      </button>
    </div>
  );
}
