# Islamic Ad Network — Supabase Setup Guide

## Step 1 — Create two Supabase projects

Go to https://supabase.com/dashboard → New project.

Create **two** projects — one for staging, one for production:

| Project | Name suggestion | Region |
|---|---|---|
| Staging | `halalads-staging` | Singapore (ap-southeast-1) |
| Production | `halalads-prod` | Singapore (ap-southeast-1) |

Singapore is chosen for proximity to the Phase 1 target markets (Indonesia, Malaysia, Pakistan).

---

## Step 2 — Run migrations

For **each** project (staging first, then production):

1. Open your Supabase project dashboard
2. Go to **SQL Editor** → **New query**
3. Paste and run the migrations **in order**:

```
supabase/migrations/001_initial_schema.sql   ← Tables, indexes, updated_at trigger
supabase/migrations/002_rls_policies.sql     ← Row Level Security policies
supabase/migrations/003_auth_trigger.sql     ← Auto-creates public.users on signup
```

Run them one at a time. Each should complete with no errors.

---

## Step 3 — Get your credentials

In each project dashboard → **Settings → API**:

| Variable | Where it is |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon / public key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key (keep secret) |

Copy these into your `.env.local` (local dev) and into Vercel environment variables (staging/production).

---

## Step 4 — Enable Google Auth provider (for NextAuth)

In Supabase dashboard → **Authentication → Providers → Google**:

- Enable it
- Add your Google OAuth Client ID and Secret

This is separate from the `AUTH_GOOGLE_ID` in NextAuth — Supabase needs its own OAuth app, or you can share the same one.

---

## Step 5 — Verify RLS is working

In Supabase dashboard → **Authentication → Policies**, confirm every table shows RLS as **Enabled** and the policies from `002_rls_policies.sql` are listed.

To test: create a user, sign in, and confirm they cannot read another user's campaigns via the Supabase JS client.

---

## Step 6 — Storage bucket (for ad creatives)

1. Go to **Storage → New bucket**
2. Name: `ad-creatives`
3. Public: **No** (we serve via signed URLs)
4. Set a 10MB file size limit
5. Allow MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`

---

## Schema overview

```
users           ← one row per auth user, stores role (advertiser|publisher|admin)
advertisers     ← one per advertiser, stores balance (USD cents)
publishers      ← one per publisher, stores revenue share and payout info
campaigns       ← advertiser campaigns with targeting JSON and budget
ad_creatives    ← creative assets linked to campaigns
ad_units        ← publisher ad placement slots
impressions     ← one row per ad served (high volume)
clicks          ← one row per click (linked to impression)
waitlist        ← pre-launch email signups (not linked to auth)
```

All amounts are stored in **USD cents** (integer). $1.00 = 100. This avoids floating point rounding errors.

IP addresses are **never stored raw**. The impression and click tables store `ip_hash = SHA-256(ip + YYYYMMDD)` for deduplication without personal data retention.
