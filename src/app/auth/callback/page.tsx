"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Supabase จะจัดการอ่านค่า Token จาก URL ให้ทำงานในเบื้องหลัง
    // หน้าที่ของเราคือดักจับว่าเมื่อมี Session เกิดขึ้น (Login สำเร็จ) ให้เด้งไปหน้าแรก
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || session) {
        router.push('/');
      }
    });

    // Fallback: เผื่อในกรณีที่ Event ไม่ถูก Trigger ทันที
    const timer = setTimeout(() => {
      router.push('/');
    }, 2000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center">
        <Loader2 className="w-12 h-12 animate-spin text-neon mb-6 drop-shadow-[0_0_15px_rgba(0,209,255,0.5)]" />
        <h2 className="text-xl font-bold text-white tracking-wider mb-2">AUTHENTICATING</h2>
        <p className="text-white/40 text-sm font-medium animate-pulse">Securely connecting to BEATVAULT...</p>
      </div>
    </div>
  );
}
