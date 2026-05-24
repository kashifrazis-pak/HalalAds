# Islamic Ad Network — Claude Project Context

## Mission
Build the world's #1 halal advertising network, serving 1.8 billion Muslims globally. Competing directly with Google AdSense/Ads and Meta Ads by offering a Shariah-compliant, culturally-aware alternative. Think big — this is meant to be the dominant ad network for the entire Muslim world.

## Business Model
All four revenue streams are in scope:
- **CPC/CPA** — pay-per-click and pay-per-action for direct response
- **CPM** — pay-per-impression for brand awareness
- **Publisher Network** — AdSense-style monetisation for halal website owners (70/30 rev share, publisher-favourable)
- **Direct Brand Deals** — premium placements for major halal brands

## Target Markets
- **Phase 1:** Southeast Asia (Indonesia, Malaysia, Pakistan) + Western Muslim diaspora (US, UK)
- **Phase 2:** Middle East (Saudi Arabia, UAE, Egypt) + South Asia (Bangladesh)
- **Future:** Full 57 Muslim-majority country coverage

---

## Brand Identity

### DO NOT deviate from these brand values:
- **Primary colour:** Emerald green `#0A5C36`
- **Light green:** `#0F7A49`
- **Dark green:** `#073D24`
- **Gold accent:** `#C9A84C`
- **Light gold:** `#E2C47A`
- **Dark gold:** `#A8872E`
- **Background:** Off-white cream `#F9F7F2`
- **Text/dark:** Charcoal `#1A1A2E`
- **Heading font:** Playfair Display (serif — authoritative, elegant)
- **Body font:** Inter (sans-serif — clean, modern)
- **Tagline:** *"Reach the Muslim World."*
- **Brand voice:** Confident, trustworthy, premium, growth-oriented. Never patronising. Never stereotyping.

### Halal compliance is non-negotiable
Every feature, ad category, content decision, and UX copy must be Shariah-compliant. No alcohol, gambling, adult content, interest-based financial products (riba), or haram categories — ever. If in doubt, the answer is no.

### Cultural sensitivity
We serve Muslims across very different cultures — Indonesian, Pakistani, Arab, Western diaspora. Avoid generalisations. Copy and design should be inclusive of all Muslim identities.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS (custom brand tokens) |
| Animation | Framer Motion |
| Icons | lucide-react |
| MDX Blog | next-mdx-remote + gray-matter |
| UI utilities | clsx + tailwind-merge + class-variance-authority |
| Auth | NextAuth.js v5 (live) |
| Database | Supabase — PostgreSQL + Storage + Realtime (live) |
| Payments | Stripe (live — prepaid credits) |
| Cache | Upstash Redis (planned Sprint 5) |
| Email | Resend (wired, magic link paused pending Supabase DB adapter) |
| Analytics | PostHog (planned Sprint 6) |
| Deployment | Vercel |

---

## Project Structure

```
Islamic Ad Network/
└── apps/
    └── web/                          ← Next.js 14 App Router project
        ├── app/
        │   ├── layout.tsx            ← Root layout + global metadata
        │   ├── page.tsx              ← Landing page (home)
        │   ├── advertisers/page.tsx  ← Advertiser marketing page
        │   ├── publishers/page.tsx   ← Publisher marketing page
        │   ├── pricing/page.tsx      ← Pricing tiers + FAQ
        │   ├── about/page.tsx        ← Mission, values, team
        │   ├── contact/page.tsx      ← Contact form
        │   ├── waitlist/page.tsx     ← Waitlist signup (advertiser/publisher)
        │   └── blog/
        │       ├── page.tsx          ← Blog listing
        │       └── [slug]/page.tsx   ← MDX post renderer
        ├── components/
        │   ├── layout/
        │   │   ├── Navbar.tsx        ← Sticky nav, scroll-aware, mobile menu
        │   │   └── Footer.tsx        ← Full sitemap footer + CTA strip
        │   └── sections/             ← Landing page section components
        │       ├── HeroSection.tsx
        │       ├── HowItWorks.tsx
        │       ├── FeaturesSection.tsx
        │       ├── MarketSection.tsx
        │       └── WaitlistSection.tsx
        ├── content/
        │   └── blog/                 ← MDX blog posts (frontmatter + content)
        ├── lib/
        │   ├── utils.ts              ← cn() helper (clsx + tailwind-merge)
        │   └── blog.ts               ← getAllPosts() + getPost() MDX helpers
        ├── tailwind.config.ts        ← Brand tokens (colors, fonts, shadows)
        └── app/globals.css           ← CSS variables, component classes, Google Fonts
```

---

## CSS Utility Classes (defined in globals.css)

Always use these instead of raw Tailwind for consistency:

| Class | Use |
|---|---|
| `container-brand` | Max-width centred container |
| `btn-primary` | Green filled button (rounded-full) |
| `btn-secondary` | Gold filled button (rounded-full) |
| `btn-outline` | Green outline button |
| `btn-ghost` | White outline button (for dark backgrounds) |
| `card-brand` | White card with hover lift and brand shadow |
| `badge-green` | Small green pill badge |
| `badge-gold` | Small gold pill badge |
| `gradient-text` | Gold gradient text effect |
| `gradient-text-green` | Green gradient text effect |

---

## Dev Commands

All commands run from `apps/web/`:

```bash
npm run dev      # Start dev server → http://localhost:3000
npm run build    # Production build (always verify this passes before finishing)
npm run lint     # ESLint check
npm test         # Jest unit + integration tests (167 tests across 23 suites)
npm run test:coverage   # Test run with coverage report
npm run test:e2e        # Playwright end-to-end tests
```

**Always run `npm run build` before marking any sprint complete.** The build must pass with zero errors.
**Always run `npm test` after adding new API routes or components.** All 149 tests must stay green.

---

## Sprint Progress

### ✅ Sprint 1 — Brand & Landing Page (COMPLETE)
- Design system (Tailwind config, CSS variables, Google Fonts)
- Core CSS utility classes (buttons, cards, badges)
- Navbar + Footer components
- Full landing page: Hero, HowItWorks, FeaturesSection, MarketSection, WaitlistSection

### ✅ Sprint 2 — Marketing Site (COMPLETE)
- `/advertisers` — campaign types, targeting capabilities, industry list
- `/publishers` — benefits, ad sizes, code snippet preview
- `/pricing` — 3 advertiser plans (Starter/Growth/Enterprise) + 2 publisher tiers + FAQ
- `/about` — mission statement, market stats, values, company timeline
- `/contact` — contact form with reason selector
- `/waitlist` — advertiser/publisher toggle with founding member perks
- `/blog` — MDX blog: listing page + dynamic `[slug]` pages
- 2 SEO blog posts: halal advertising guide + publisher monetisation guide

### ✅ Sprint 3 — Auth + Dashboard Shells (COMPLETE)
- Supabase schema: 9 tables, 20 RLS policies, auth trigger auto-creates user rows
- NextAuth.js v5 — Google OAuth live (`AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` set on Vercel)
- Magic link (Resend) wired but temporarily removed — requires Supabase DB adapter in NextAuth v5
- `/auth/signin` — Google sign-in page (clean, branded)
- `/auth/error` — error page with human-readable NextAuth error messages
- `/onboarding` — new user role selection (Advertiser / Publisher), writes to Supabase
- `/api/onboarding` — POST route that saves role + creates advertiser/publisher profile row
- Middleware — protects `/dashboard/*`, redirects roleless users to `/onboarding`
- `/dashboard/advertiser` — campaign list, stats overview, create campaign CTA
- `/dashboard/publisher` — earnings overview, ad units list, get snippet CTA

**Key auth decisions:**
- NextAuth v5 uses `AUTH_SECRET` (not `NEXTAUTH_SECRET`) — both are set for compatibility
- `NEXTAUTH_URL` on Vercel production must be `https://islamicadnetwork.com` — was previously `https://halalads.com` (pre-rebrand, caused domain squatter redirect)
- Email providers in NextAuth v5 require a DB adapter — Supabase adapter needed before re-enabling Resend
- Google OAuth redirect URI: `https://islamicadnetwork.com/api/auth/callback/google`

### ✅ Sprint 4 — Campaign Engine (COMPLETE)
- Campaign creation wizard live — multi-step UI (type → creative → targeting → budget → schedule)
- `/api/campaigns` POST — creates campaign + ad_creative rows in Supabase
- `/api/campaigns/[id]` PATCH — pause/activate campaign; restricted to "active"/"paused" only
- `/dashboard/advertiser/campaigns/[id]` — detail page: stats, budget, targeting, creative preview, pause/activate button
- Stripe prepaid credit top-ups — `/api/billing/checkout` (Stripe Checkout) + `/api/billing/webhook` (balance update)
- `billing_transactions` table for full payment audit trail
- Ad unit creation live — `/api/ad-units` POST, `/dashboard/publisher/ad-units/[id]` detail page with real embed snippet
- Embed code uses real DB unit UUID (not random placeholder)
- Stub API routes in place: `/api/serve/[adunit]`, `/api/track/impression`, `/api/track/click`

**Key bugs fixed in Sprint 4:**
- NextAuth v5 JWT/session callbacks must NEVER call Supabase — they run in Edge runtime which lacks Node.js APIs
- All dashboard DB lookups use `session.user.email` → `users.id` → `advertisers/publishers.id` (never `session.user.id` which is a non-UUID string)
- Campaigns SELECT used non-existent `budget` column — corrected to `total_budget`
- `revenue_share` is stored as decimal (0.700) not integer percentage — fixed all calculations and displays

### ✅ Sprint 5 — Publisher Tools (partially complete)
- ✅ Ad unit creation + detail page with embed code (done in Sprint 4)
- ✅ Publisher payout setup — `/api/publisher/payout` GET + POST, `publisher_payout_methods` table, `PayoutSetupForm` client component in earnings page. Supports PayPal, Wise, Bank Transfer. Upserts on conflict so publishers can update their payout method at any time.
- Publisher site registration + halal content verification (pending)

**Key payout decisions:**
- `publisher_payout_methods` has a UNIQUE constraint on `publisher_id` — one active payout method per publisher, upserted on save
- `method` is validated server-side: must be `paypal`, `wise`, or `bank`
- Email required for paypal/wise; account_holder + account_number required for bank
- Earnings page (`/dashboard/publisher/earnings`) loads existing payout config on mount, pre-fills the form

### 🔜 Sprint 6 — SEO, Performance & Polish
- Metadata + OG tags for all pages
- Sitemap.xml + robots.txt
- Structured data (Organization, FAQPage schema)
- Core Web Vitals audit (Lighthouse 90+ target)
- Arabic RTL support
- PostHog analytics integration

---

## Database Schema (Live — Supabase PostgreSQL)

```sql
users                (id uuid PK default gen_random_uuid(), email unique, role, nextauth_sub, created_at)
advertisers          (id uuid PK, user_id FK→users, company_name, balance bigint cents, created_at)
publishers           (id uuid PK, user_id FK→users, display_name, site_name, site_url, verified bool, revenue_share numeric(4,3) DEFAULT 0.700)
campaigns            (id uuid PK, advertiser_id FK, name, type CPC|CPM|CPA, status, daily_budget cents, total_budget cents, spend cents, bid_amount cents, targeting_json, start_date, end_date)
ad_creatives         (id uuid PK, campaign_id FK, headline, description, destination_url, cta_text, image_url, size)
ad_units             (id uuid PK, publisher_id FK, name, site_url, size, placement, active bool)
impressions          (id uuid PK, campaign_id FK, ad_unit_id FK, creative_id FK, ip_hash, country, user_agent, timestamp)
clicks               (id uuid PK, impression_id FK, campaign_id FK, ip_hash, timestamp)
billing_transactions      (id uuid PK, advertiser_id FK, type topup|spend, amount_cents, credits, description, stripe_payment_intent_id)
publisher_payout_methods  (id uuid PK, publisher_id FK UNIQUE, method paypal|wise|bank, email, account_holder, account_number, swift_bic, updated_at)
verification_tokens  (identifier, token, expires — for NextAuth magic link)
waitlist             (id uuid PK, name, email unique, type, company, source, created_at)
```

**Schema notes:**
- `users.id` is a standalone UUID (gen_random_uuid()) — NOT linked to Supabase auth.users. Migration 007 decoupled these.
- `revenue_share` is a decimal fraction (0.700 = 70%), NOT an integer percentage. Multiply by 100 for display.
- `campaigns` uses `daily_budget` and `total_budget` columns — there is NO `budget` column.
- All IP storage uses SHA-256(ip + YYYYMMDD salt) — never raw IPs.

---

## Key Decisions & Conventions

- **No comments in code** unless the WHY is non-obvious (a workaround, hidden constraint, subtle invariant)
- **"use client"** only on components that need browser APIs or React hooks — keep server components where possible for SEO
- **Framer Motion** for all scroll-triggered animations — use `whileInView` with `viewport={{ once: true }}`
- **No dark mode** — the brand uses a light cream background; dark mode is not in scope
- **Images** — use `next/image` for all images. External images must be added to `next.config.mjs` domains
- **Lucide icons** — some icon names changed in newer versions. If an import fails, check available exports before guessing
- **MDX blog** — frontmatter fields: `title`, `description`, `date` (YYYY-MM-DD), `author`, `category`, `readTime`, `featured` (boolean)

### Auth & Session Rules (CRITICAL)
- **NEVER call Supabase inside `jwt` or `session` NextAuth callbacks** — they run in Edge runtime (no Node.js APIs)
- Only the `signIn` callback (Node.js `/api/auth/*` route) is safe for DB calls
- **User identity**: always use `session.user.email` to look up `users.id`, then join to `advertisers`/`publishers`
- `session.user.id` = `token.sub` = NextAuth provider ID (NOT a UUID) — never use it as a DB UUID
- `SUPABASE_SERVICE_ROLE_KEY` server-only; never in client components or Edge runtime

### Test Suite
- 149 tests across 21 suites: unit, integration, component — all must stay green
- API route tests use `@jest-environment node` and mock `@/lib/auth`, `@/lib/supabase`, `@/lib/stripe`
- Component tests use jsdom (default); mock `next/navigation`, `next-auth/react` via `jest.setup.ts`
- Do NOT try to `delete window.location` or `Object.defineProperty(window, 'location', ...)` — non-configurable in jsdom

---

## What Makes Islamic Ad Network Different (Always Keep in Mind)

1. **100% halal inventory** — every publisher manually reviewed, no exceptions
2. **Cultural intelligence** — not just translation, but genuine understanding of Muslim consumer psychology
3. **Publisher-first economics** — 70% revenue share vs Google's ~68% but with full halal guarantee
4. **Muslim market expertise** — targeting categories that don't exist on any other network
5. **Community trust** — building within the ummah, not extracting from it

This is not just a business. It is a service to the Muslim community. Every feature should be built with that responsibility in mind.
