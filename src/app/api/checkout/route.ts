import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!secretKey) {
    return NextResponse.json({ error: "STRIPE_SECRET_KEY is not defined in .env" }, { status: 500 });
  }
  if (!siteUrl) {
    return NextResponse.json({ error: "NEXT_PUBLIC_SITE_URL is not defined in .env" }, { status: 500 });
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: "2024-04-10" as any, 
  });
  
  try {
    const { tracks: cartTracks, userId } = await req.json();

    if (!cartTracks || cartTracks.length === 0) {
      return NextResponse.json({ error: "ตะกร้าสินค้าว่างเปล่า (Cart is empty)" }, { status: 400 });
    }

    // 1. Fetch real track data from DB to verify prices (Security check)
    const trackIds = cartTracks.map((t: any) => t.id);
    const { data: dbTracks, error: dbError } = await supabaseAdmin
      .from('tracks')
      .select('id, title, price')
      .in('id', trackIds);

    if (dbError) {
      console.error("DB Error:", dbError.message);
      return NextResponse.json({ error: "Failed to fetch track data" }, { status: 500 });
    }

    // Use DB data if found, fallback to client data for demo/mock purposes
    const verifiedTracks = dbTracks && dbTracks.length > 0 ? dbTracks : cartTracks;

    const line_items = verifiedTracks.map((track: any) => ({
      price_data: {
        currency: "thb",
        product_data: {
          name: track.title,
          description: `Track ID: ${track.id} — Exclusive DJ Edit`,
        },
        unit_amount: (track.price || 99) * 100, // Price in satang (THB * 100)
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["promptpay", "card"], 
      line_items,
      mode: "payment",
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/`,
      metadata: {
        userId: userId,
        trackIds: trackIds.join(","),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Error:", err);
    return NextResponse.json({ error: `Stripe API Error: ${err.message}` }, { status: 500 });
  }
}
