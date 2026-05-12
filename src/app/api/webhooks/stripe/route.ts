import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2024-04-10" as any,
  });
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // 1. ตรวจสอบเมื่อการชำระเงินสำเร็จ
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const trackIds = session.metadata?.trackIds?.split(",");
    const userId = session.metadata?.userId;

    if (trackIds && userId) {
      console.log(`💰 Payment success for Tracks ${trackIds.join(", ")} by User ${userId}`);

      // 2. อัปเดตฐานข้อมูลตาราง purchases เพื่อปลดล็อกสิทธิ์
      const purchaseRecords = trackIds.map((tid: string) => ({
        user_id: userId,
        track_id: tid,
        amount: (session.amount_total! / 100) / trackIds.length,
        status: 'completed'
      }));

      const { error } = await supabaseAdmin
        .from('purchases')
        .insert(purchaseRecords);

      if (error) {
        console.error("❌ Database Error:", error.message);
        return NextResponse.json({ error: "DB Update failed" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
