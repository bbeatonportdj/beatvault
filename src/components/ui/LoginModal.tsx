"use client";

import { X, Github, Mail, Chrome } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-[400px] glass-dark border border-white/10 rounded-[2rem] p-8 shadow-neon-lg animate-fade-in">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-neon rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-neon">
            <svg width="32" height="32" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" fill="#0A0A0A"/>
              <rect x="9" y="2" width="5" height="5" rx="1" fill="#0A0A0A"/>
              <rect x="2" y="9" width="5" height="5" rx="1" fill="#0A0A0A"/>
              <rect x="9" y="9" width="5" height="5" rx="1" fill="#0A0A0A" opacity="0.5"/>
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Welcome Back</h2>
          <p className="text-white/40 text-sm">Join the vault and start digging</p>
        </div>

        <div className="space-y-3">
          <button className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3.5 rounded-xl hover:bg-white/90 transition-all active:scale-[0.98]">
            <Chrome size={20} />
            Continue with Google
          </button>
          
          <button className="w-full flex items-center justify-center gap-3 bg-[#181818] text-white font-bold py-3.5 rounded-xl border border-white/5 hover:bg-[#222] transition-all active:scale-[0.98]">
            <Github size={20} />
            Continue with GitHub
          </button>

          <button className="w-full flex items-center justify-center gap-3 bg-neon/10 text-neon font-bold py-3.5 rounded-xl border border-neon/20 hover:bg-neon/20 transition-all active:scale-[0.98]">
            <Mail size={20} />
            Use Email Address
          </button>
        </div>

        <p className="mt-8 text-center text-[11px] text-white/20 px-4">
          By continuing, you agree to BEATVAULT&apos;s <br />
          <span className="text-white/40 cursor-pointer hover:text-neon transition-colors">Terms of Service</span> and <span className="text-white/40 cursor-pointer hover:text-neon transition-colors">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
