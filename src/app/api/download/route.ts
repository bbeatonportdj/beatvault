import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trackId = searchParams.get('trackId');
  const version = searchParams.get('version') || 'audio_url'; // Default to main

  if (!trackId) {
    return NextResponse.json({ error: 'Track ID is required' }, { status: 400 });
  }

  const supabase = createRouteHandlerClient({ cookies });

  // 1. Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  // 2. Check for Active Subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  const isPro = !!subscription;

  // 3. If not Pro, check for Individual Purchase
  if (!isPro) {
    const { data: purchase } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', userId)
      .eq('track_id', trackId)
      .single();

    if (!purchase) {
      return NextResponse.json({ error: 'Purchase or Subscription required' }, { status: 403 });
    }
  }

  // 4. Fetch the track URL
  const { data: track, error: trackError } = await supabase
    .from('tracks')
    .select('*')
    .eq('id', trackId)
    .single();

  if (trackError || !track) {
    return NextResponse.json({ error: 'Track not found' }, { status: 404 });
  }

  const downloadUrl = track[version];

  if (!downloadUrl) {
    return NextResponse.json({ error: 'Requested version not available' }, { status: 404 });
  }

  // 5. Log the download (Optional)
  await supabase.from('downloads').insert([{
    user_id: userId,
    track_id: trackId,
    version: version,
    is_subscription: isPro
  }]);

  // 6. Redirect to the file (or serve it)
  // In a real app, you might use storage.createSignedUrl for private buckets
  return NextResponse.redirect(downloadUrl);
}
