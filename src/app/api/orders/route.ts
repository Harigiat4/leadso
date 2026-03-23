import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('jobs')
    .select('id, name, date, leads, verified, percent, status')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Normalize date field to YYYY-MM-DD for display
  const jobs = (data ?? []).map(j => ({
    ...j,
    date: j.date ? String(j.date).split('T')[0] : '',
  }));

  return NextResponse.json(jobs);
}
