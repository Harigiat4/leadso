import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(_req: Request, { params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: job } = await supabaseAdmin
    .from('jobs')
    .select('id, enriched_results')
    .eq('id', jobId)
    .eq('user_id', user.id)
    .single();

  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  if (!job.enriched_results || job.enriched_results.length === 0) {
    return NextResponse.json({ error: 'No results for this job' }, { status: 404 });
  }

  const leads = job.enriched_results;

  // Collect all unique keys across all leads, put priority columns first
  const priorityKeys = [
    'firstName', 'lastName', 'fullName', 'title', 'companyName',
    'location', 'email', 'linkedInUrl', 'personalization',
    'shortenedCompanyName', 'icebreakerVerdict'
  ];
  const allKeys = new Set<string>();
  leads.forEach((lead: any) => Object.keys(lead).forEach(k => allKeys.add(k)));
  const extraKeys = [...allKeys].filter(k => !priorityKeys.includes(k));
  const columns = [...priorityKeys.filter(k => allKeys.has(k)), ...extraKeys];

  const escape = (val: any) => {
    if (val == null) return '';
    const str = String(val).replace(/"/g, '""');
    return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str}"` : str;
  };

  const header = columns.join(',');
  const rows = leads.map((lead: any) => columns.map(col => escape(lead[col])).join(','));
  const csv = [header, ...rows].join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="leadso-${jobId}.csv"`,
    },
  });
}
