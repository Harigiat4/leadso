import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { generateIcebreaker } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });

    const body = await request.json().catch(() => ({}));

    // Apify default webhook payload: { eventType, resource: { status, defaultDatasetId, ... } }
    const resource = body.resource ?? {};
    const runStatus: string = resource.status ?? body.eventType ?? '';
    const datasetId: string = resource.defaultDatasetId ?? '';

    // Handle non-success outcomes
    if (runStatus !== 'SUCCEEDED') {
      await supabaseAdmin.from('jobs').update({
        status: 'Failed',
        error: `Apify run ${runStatus.toLowerCase() || 'failed'}`,
      }).eq('id', jobId);
      return NextResponse.json({ ok: true });
    }

    if (!datasetId) {
      await supabaseAdmin.from('jobs').update({ status: 'Failed', error: 'No dataset ID from Apify' }).eq('id', jobId);
      return NextResponse.json({ error: 'Missing datasetId' }, { status: 400 });
    }

    // Fetch job record to get userId + persona
    const { data: job } = await supabaseAdmin
      .from('jobs')
      .select('user_id, persona')
      .eq('id', jobId)
      .single();

    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

    // Get user API keys from app_config
    const { data: config } = await supabaseAdmin
      .from('app_config')
      .select('apify_key, anthropic_key')
      .eq('user_id', job.user_id)
      .single();

    const apifyKey = config?.apify_key || process.env.APIFY_API_KEY || '';
    const anthropicKey = config?.anthropic_key || process.env.ANTHROPIC_API_KEY || '';

    // Fetch raw results from Apify dataset
    const datasetRes = await fetch(
      `https://api.apify.com/v2/datasets/${datasetId}/items?token=${apifyKey}&clean=true`
    );

    if (!datasetRes.ok) {
      await supabaseAdmin.from('jobs').update({
        status: 'Failed',
        error: `Failed to fetch Apify dataset: ${datasetRes.status}`,
      }).eq('id', jobId);
      return NextResponse.json({ ok: true });
    }

    const rawLeads = await datasetRes.json();
    const validLeads = rawLeads.filter(
      (l: any) => l.email || l.linkedinUrl || l.orgName || l.firstName
    );

    if (validLeads.length === 0) {
      await supabaseAdmin.from('jobs').update({
        status: 'Completed',
        leads: 0,
        verified: 0,
        percent: '0%',
        raw_results: [],
        enriched_results: [],
      }).eq('id', jobId);
      return NextResponse.json({ ok: true });
    }

    const persona = job.persona || 'default';

    // Normalize + enrich all leads in PARALLEL (fast even for large batches)
    const enrichedLeads = await Promise.all(
      validLeads.map(async (lead: any) => {
        const normalized = {
          firstName:      lead.firstName || '',
          lastName:       lead.lastName || '',
          fullName:       `${lead.firstName || ''} ${lead.lastName || ''}`.trim(),
          title:          lead.position || '',
          companyName:    lead.orgName || '',
          location:       [lead.city, lead.state, lead.country].filter(Boolean).join(', ') || '',
          email:          lead.email || 'N/A',
          linkedInUrl:    lead.linkedinUrl || '',
          industry:       lead.orgIndustry || '',
          companySize:    lead.orgSize || '',
          companyWebsite: lead.orgWebsite || '',
          phone:          lead.phone || '',
          emailStatus:    lead.emailStatus || '',
          seniority:      lead.seniority || '',
          city:           lead.city || '',
          state:          lead.state || '',
          country:        lead.country || '',
        };

        const icebreakerRes = await generateIcebreaker(normalized, persona, anthropicKey);

        return {
          ...normalized,
          icebreakerVerdict: icebreakerRes.verdict,
          personalization: icebreakerRes.icebreaker,
          shortenedCompanyName: icebreakerRes.shortenedCompanyName,
        };
      })
    );

    const validIcebreakers = enrichedLeads.filter(
      (l) => String(l.icebreakerVerdict).toLowerCase() === 'true'
    ).length;

    await supabaseAdmin.from('jobs').update({
      status: 'Completed',
      leads: enrichedLeads.length,
      verified: validIcebreakers,
      percent: enrichedLeads.length > 0
        ? Math.round((validIcebreakers / enrichedLeads.length) * 100) + '%'
        : '0%',
      raw_results: validLeads,
      enriched_results: enrichedLeads,
    }).eq('id', jobId);

    console.log(`Job ${jobId} completed: ${enrichedLeads.length} leads, ${validIcebreakers} valid`);
    return NextResponse.json({ ok: true });

  } catch (error: any) {
    console.error('Webhook handler error:', error);
    // Try to mark job as failed if we have a jobId
    try {
      const { searchParams } = new URL(request.url);
      const jobId = searchParams.get('jobId');
      if (jobId) {
        await supabaseAdmin.from('jobs').update({
          status: 'Failed',
          error: error?.message || 'Webhook processing error',
        }).eq('id', jobId);
      }
    } catch {}
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
