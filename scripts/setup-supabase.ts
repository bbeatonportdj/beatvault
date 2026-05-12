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

async function setup() {
  console.log("🚀 Starting Supabase Setup...");

  // 1. Create Buckets
  console.log("📁 Creating Storage Buckets...");
  
  const buckets = ['covers', 'tracks'];
  
  for (const bucketName of buckets) {
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: bucketName === 'covers' ? ['image/*'] : ['audio/*'],
      fileSizeLimit: bucketName === 'covers' ? 5242880 : 104857600 // 5MB for covers, 100MB for tracks
    });

    if (error) {
      if (error.message.includes('already exists')) {
        console.log(`ℹ️ Bucket '${bucketName}' already exists.`);
      } else {
        console.error(`❌ Error creating bucket '${bucketName}':`, error.message);
      }
    } else {
      console.log(`✅ Bucket '${bucketName}' created successfully!`);
    }
  }

  console.log("\n✨ Setup finished! You can now upload tracks via Admin Dashboard.");
}

setup();
