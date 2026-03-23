import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data } = await supabase
    .from('app_config')
    .select('apify_key, anthropic_key, anymailfinder_key, custom_prompt')
    .eq('user_id', user.id)
    .single();

  if (!data) {
    return NextResponse.json({ apifyKey: '', anthropicKey: '', anymailfinderKey: '', customPrompt: '' });
  }

  return NextResponse.json({
    apifyKey: data.apify_key ?? '',
    anthropicKey: data.anthropic_key ?? '',
    anymailfinderKey: data.anymailfinder_key ?? '',
    customPrompt: data.custom_prompt ?? '',
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();

  const { error } = await supabase
    .from('app_config')
    .upsert({
      user_id: user.id,
      apify_key: body.apifyKey ?? '',
      anthropic_key: body.anthropicKey ?? '',
      anymailfinder_key: body.anymailfinderKey ?? '',
      custom_prompt: body.customPrompt ?? null,
    }, { onConflict: 'user_id' });

  if (error) {
    console.error('Error saving config:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
