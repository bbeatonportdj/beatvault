"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const ANNOUNCEMENTS = [
  {
    id: 1,
    text: "FREE EXCLUSIVE PACK FOR NEW MEMBERS — รับฟรีชุดแต่งเพลงพิเศษสำหรับสมาชิกใหม่",
    icon: <Sparkles size={14} className="text-neon" />,
    link: "/membership",
    cta: "CLAIM"
  },
  {
    id: 2,
    text: "NEW TECH-HOUSE DROPS FROM BERLIN SESSIONS — เพลง TECH-HOUSE ใหม่ล่าสุดจากเบอร์ลิน",
    icon: <Zap size={14} className="text-neon" />,
    link: "/genre/tech-house",
    cta: "BROWSE"
  },
  {
    id: 3,
    text: "UNLIMITED DOWNLOADS WITH THE PRO VIP PLAN — ดาวน์โหลดไม่จำกัดกับแพ็กเกจ PRO VIP",
    icon: <ShieldCheck size={14} className="text-neon" />,
    link: "/upgrade",
    cta: "UPGRADE"
  }
];

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-black border-b border-neon/20 h-9 overflow-hidden flex items-center group">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(0,209,255,0.15),transparent)] pointer-events-none" />
      
      {/* Marquee Container */}
      <div className="flex whitespace-nowrap animate-marquee hover:pause-marquee">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center">
            {ANNOUNCEMENTS.map((item) => (
              <div key={`${i}-${item.id}`} className="flex items-center px-12">
                <span className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-white/90">
                  <span className="text-neon shadow-neon-sm">{item.icon}</span>
                  <span className="uppercase">{item.text}</span>
                  <Link 
                    href={item.link}
                    className="ml-2 text-neon hover:text-white transition-colors flex items-center gap-1 group/link"
                  >
                    {item.cta}
                    <ChevronRight size={10} className="group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                </span>
                {/* Separator */}
                <div className="mx-12 w-1.5 h-1.5 rounded-full bg-neon/30 animate-pulse" />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Close Button */}
      <div className="absolute right-0 inset-y-0 flex items-center px-4 bg-gradient-to-l from-black via-black/80 to-transparent z-10">
        <button 
          onClick={() => setIsVisible(false)}
          className="p-1 hover:text-white transition-colors text-white/20 hover:bg-white/5 rounded-md"
        >
          <X size={14} />
        </button>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .pause-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
