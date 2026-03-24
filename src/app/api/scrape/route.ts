import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { generateApifyPayload } from '@/lib/ai';
import crypto from 'crypto';
import { z } from 'zod';

const scrapeSchema = z.object({
  jobName: z.string().min(1, 'Job name is required').max(100),
  maxLeads: z.coerce.number().int().min(1).max(500).default(20),
  persona: z.string().optional().default('default')
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const parseResult = scrapeSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: parseResult.error.issues[0].message }, { status: 400 });
    }

    const { jobName, maxLeads, persona } = parseResult.data;

    // Rate limit: max 5 jobs per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: rlError } = await supabaseAdmin
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('date', oneHourAgo);

    if (rlError) return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    if (count !== null && count >= 5) {
      return NextResponse.json({ error: 'Rate limit exceeded. Maximum 5 jobs per hour.' }, { status: 429 });
    }

    // Get user API keys
    const { data: configData } = await supabaseAdmin
      .from('app_config')
      .select('apify_key, anthropic_key')
      .eq('user_id', user.id)
      .single();

    const apifyKey = configData?.apify_key || process.env.APIFY_API_KEY;
    const anthropicKey = configData?.anthropic_key || process.env.ANTHROPIC_API_KEY;

    if (!apifyKey) return NextResponse.json({ error: 'Apify API key is missing. Please add it in Config.' }, { status: 400 });
    if (!anthropicKey) return NextResponse.json({ error: 'Anthropic API key is missing. Please add it in Config.' }, { status: 400 });

    // Generate AI search payload
    const payload = await generateApifyPayload(jobName, maxLeads, anthropicKey);

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

    // Start Apify actor run asynchronously + configure webhook for completion
    const actorId = 'kVYdvNOefemtiDXO5';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://leadso-app.netlify.app';

    const webhookConfig = JSON.stringify([{
      eventTypes: ['ACTOR.RUN.SUCCEEDED', 'ACTOR.RUN.FAILED', 'ACTOR.RUN.TIMED_OUT', 'ACTOR.RUN.ABORTED'],
      requestUrl: `${siteUrl}/api/webhook/apify?jobId=${jobId}`,
      // No payloadTemplate — use Apify's default payload which includes body.resource.status + body.resource.defaultDatasetId
    }]);

    const webhooksParam = Buffer.from(webhookConfig).toString('base64');
    const apifyUrl = `https://api.apify.com/v2/acts/${actorId}/runs?token=${apifyKey}&webhooks=${encodeURIComponent(webhooksParam)}`;

    const apifyRes = await fetch(apifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!apifyRes.ok) {
      const errText = await apifyRes.text();
      await supabaseAdmin.from('jobs').update({
        status: 'Failed',
        error: `Apify error ${apifyRes.status}: ${errText}`,
      }).eq('id', jobId);
      return NextResponse.json({ error: 'Failed to start Apify run' }, { status: 500 });
    }

    return NextResponse.json({ success: true, jobId, status: 'Pending' });

  } catch (error: any) {
    console.error('Error starting scrape job:', error);
    return NextResponse.json({ error: error?.message || 'Failed to start scrape' }, { status: 500 });
  }
}
