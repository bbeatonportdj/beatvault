"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      // ตรวจสอบ Role จากตาราง profiles
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          // ถ้าไม่เจอ profile อาจเป็นเพราะเพิ่งสมัครและ trigger ยังไม่ทำงาน
          // หรือยังไม่ได้รัน SQL สำหรับตาราง profiles
          alert("ไม่พบข้อมูลบัญชีของคุณในตาราง profiles กรุณาตรวจสอบว่าได้รัน SQL ใน Supabase หรือยัง");
          router.push('/');
          return;
        }

        if (profile?.role !== 'admin') {
          alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้ (Admin Only)");
          router.push('/');
          return;
        }

        setAuthorized(true);
      } catch (err: any) {
        console.error("Auth check crash:", err);
        alert("เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์: " + err.message);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-base">
        <Loader2 className="w-10 h-10 animate-spin text-neon" />
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="flex min-h-screen bg-base text-white">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
