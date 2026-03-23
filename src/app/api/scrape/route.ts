import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { generateApifyPayload, generateIcebreaker } from '@/lib/ai';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { jobName, maxLeads, persona } = await request.json();

    if (!jobName) {
      return NextResponse.json({ error: 'Job name is required' }, { status: 400 });
    }

    const { APIFY_API_KEY } = process.env;
    if (!APIFY_API_KEY) {
      return NextResponse.json({ error: 'Apify API key is missing' }, { status: 400 });
    }

    const jobId = 'JOB-' + crypto.randomUUID().split('-')[0].toUpperCase();

    await supabaseAdmin.from('jobs').insert({
      id: jobId,
      user_id: user.id,
      name: jobName,
      date: new Date().toISOString(),
      leads: 0,
      verified: 0,
      percent: '0%',
      status: 'Pending',
      persona: persona || 'default',
    });

    // Run async background — pass userId so the background job can write back
    processBackgroundJob(jobId, user.id, jobName, parseInt(maxLeads) || 20, APIFY_API_KEY, persona || 'default');

    return NextResponse.json({ success: true, jobId, status: 'Pending' });
  } catch (error) {
    console.error('Error starting scrape job:', error);
    return NextResponse.json({ error: 'Failed to start scrape' }, { status: 500 });
  }
}

async function processBackgroundJob(jobId: string, userId: string, jobName: string, maxLeads: number, apifyKey: string, persona: string) {
  try {
    const payload = await generateApifyPayload(jobName, maxLeads);

    const actorId = 'kVYdvNOefemtiDXO5';
    console.log(`Starting Apify Actor ${actorId} for ${jobId}...`);

    const apifyUrl = `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${apifyKey}`;

    const apifyRes = await fetch(apifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!apifyRes.ok) {
      const errText = await apifyRes.text();
      throw new Error(`Apify returned ${apifyRes.status}: ${errText}`);
    }

    const rawLeads = await apifyRes.json();

    if (rawLeads.length > 0 && rawLeads[0].error) {
      throw new Error(`Apify Actor Error: ${rawLeads[0].error}`);
    }

    const validLeads = rawLeads.filter((l: any) => l.email || l.linkedinUrl || l.orgName || l.firstName);

    if (validLeads.length === 0) {
      await supabaseAdmin.from('jobs').update({
        status: 'Completed',
        leads: 0,
        verified: 0,
        percent: '0%',
        raw_results: [],
        enriched_results: [],
      }).eq('id', jobId);
      return;
    }

    const targetLeads = validLeads.slice(0, maxLeads);
    const enrichedLeads: any[] = [];
    let validIcebreakers = 0;

    for (const lead of targetLeads) {
      const normalizedLead = {
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

      const icebreakerRes = await generateIcebreaker(normalizedLead, persona);

      enrichedLeads.push({
        ...normalizedLead,
        icebreakerVerdict: icebreakerRes.verdict,
        personalization: icebreakerRes.icebreaker,
        shortenedCompanyName: icebreakerRes.shortenedCompanyName,
      });

      if (String(icebreakerRes.verdict).toLowerCase() === 'true') validIcebreakers++;
    }

    await supabaseAdmin.from('jobs').update({
      status: 'Completed',
      leads: enrichedLeads.length,
      verified: validIcebreakers,
      percent: enrichedLeads.length > 0
        ? Math.round((validIcebreakers / enrichedLeads.length) * 100) + '%'
        : '0%',
      raw_results: targetLeads,
      enriched_results: enrichedLeads,
    }).eq('id', jobId);

    console.log(`Job ${jobId} completed: ${enrichedLeads.length} leads`);

  } catch (error: any) {
    console.error(`Job ${jobId} failed:`, error);
    await supabaseAdmin.from('jobs').update({
      status: 'Failed',
      error: error?.message || 'Unknown error',
    }).eq('id', jobId);
  }
}
