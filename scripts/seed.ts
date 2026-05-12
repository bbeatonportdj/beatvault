import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const SEED_TRACKS = [
  { 
    title: "Neon Horizon", 
    artist: "VAULT001", 
    bpm: 126, 
    key: "4A", 
    genre: "house", 
    duration: "6:22", 
    cover_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800", 
    label: "BEATVAULT", 
    is_new: true, 
    price: 99 
  },
  { 
    title: "Acid Rain Protocol", 
    artist: "DJ Phantom", 
    bpm: 138, 
    key: "7B", 
    genre: "techno", 
    duration: "7:45", 
    cover_url: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800", 
    label: "VAULT REC", 
    is_hot: true, 
    price: 129 
  },
  { 
    title: "Midnight Frequency", 
    artist: "LXST SOUL", 
    bpm: 128, 
    key: "2A", 
    genre: "house", 
    duration: "5:58", 
    cover_url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800", 
    label: "BEATVAULT", 
    price: 89 
  }
];

async function seed() {
  console.log("🚀 Starting seed process...");
  
  const { data, error } = await supabase
    .from('tracks')
    .insert(SEED_TRACKS)
    .select();

  if (error) {
    console.error("❌ Seed error:", error.message);
  } else {
    console.log("✅ Successfully seeded", data?.length, "tracks!");
  }
}

seed();
