# Leadso

B2B lead generation SaaS that scrapes, enriches, and verifies leads using AI.

## Stack

- **Framework** — Next.js 15 (App Router)
- **Auth & Database** — Supabase (PostgreSQL + RLS)
- **Scraping** — Apify
- **Email enrichment** — AnyMailFinder
- **AI enrichment** — Anthropic Claude
- **Styling** — Tailwind CSS v4
- **Deployment** — Netlify

## Features

- Scrape leads by keyword/location via Apify actors
- AI-powered lead enrichment with custom prompts
- Email verification via AnyMailFinder
- Orders history with CSV download
- Supabase auth — signup, login, forgot/reset password
- Per-user API key configuration
- Fully responsive dashboard + landing page

## Local Development

```bash
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ANTHROPIC_API_KEY=your_anthropic_key
APIFY_API_KEY=your_apify_key
ANYMAILFINDER_API_KEY=your_anymailfinder_key
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

Run the following in Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS app_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  apify_key TEXT NOT NULL DEFAULT '',
  anthropic_key TEXT NOT NULL DEFAULT '',
  anymailfinder_key TEXT NOT NULL DEFAULT '',
  custom_prompt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW(),
  leads INTEGER DEFAULT 0,
  verified INTEGER DEFAULT 0,
  percent TEXT DEFAULT '0%',
  status TEXT CHECK (status IN ('Pending','Completed','Failed')) DEFAULT 'Pending',
  persona TEXT DEFAULT 'default',
  raw_results JSONB,
  enriched_results JSONB,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users manage own config" ON app_config FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users manage own jobs" ON jobs FOR ALL USING (auth.uid() = user_id);
```

## Deployment

Deployed on Netlify with GitHub CI. Push to `main` triggers a new deploy.
