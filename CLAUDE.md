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
| Auth | NextAuth.js v5 (planned Sprint 3) |
| Database | Supabase — PostgreSQL + Storage + Realtime (planned Sprint 3) |
| Payments | Stripe (planned Sprint 4) |
| Cache | Upstash Redis (planned Sprint 5) |
| Email | Resend (planned Sprint 5) |
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
```

**Always run `npm run build` before marking any sprint complete.** The build must pass with zero errors.

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

### 🔜 Sprint 3 — Auth + Dashboard Shells
- Supabase project setup (env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- NextAuth.js v5 (email magic link + Google OAuth)
- `/dashboard/advertiser` — campaign list, stats overview, create campaign CTA
- `/dashboard/publisher` — earnings overview, ad units list, get snippet CTA
- Protected route middleware

### 🔜 Sprint 4 — Campaign Engine
- Campaign creation wizard (type → creative → targeting → budget → schedule)
- Ad creative upload (Supabase Storage)
- Stripe billing (prepaid credits)
- Ad serving API: `/api/serve/[adunit]`
- Impression pixel: `/api/track/impression`
- Click redirect: `/api/track/click`

### 🔜 Sprint 5 — Publisher Tools
- Publisher site registration + halal content verification
- Ad unit builder + JS snippet generator
- Payout setup (bank transfer / PayPal / Wise)
- Publisher earnings calculation

### 🔜 Sprint 6 — SEO, Performance & Polish
- Metadata + OG tags for all pages
- Sitemap.xml + robots.txt
- Structured data (Organization, FAQPage schema)
- Core Web Vitals audit (Lighthouse 90+ target)
- Arabic RTL support
- PostHog analytics integration

---

## Database Schema (Planned — Supabase PostgreSQL)

```sql
users         (id, email, role: 'advertiser'|'publisher'|'admin', created_at)
advertisers   (id, user_id, company_name, balance, billing_info)
publishers    (id, user_id, site_url, verified, revenue_share)
campaigns     (id, advertiser_id, type, status, budget, spend, targeting_json)
ad_creatives  (id, campaign_id, type, url, dimensions)
ad_units      (id, publisher_id, size, placement)
impressions   (id, campaign_id, ad_unit_id, timestamp, ip_hash, country)
clicks        (id, impression_id, timestamp, ip_hash)
```

---

## Key Decisions & Conventions

- **No comments in code** unless the WHY is non-obvious (a workaround, hidden constraint, subtle invariant)
- **"use client"** only on components that need browser APIs or React hooks — keep server components where possible for SEO
- **Framer Motion** for all scroll-triggered animations — use `whileInView` with `viewport={{ once: true }}`
- **No dark mode** — the brand uses a light cream background; dark mode is not in scope
- **Forms are client-side only** in Sprint 1–2 (simulate submission). Real API endpoints come in Sprint 3+
- **Images** — use `next/image` for all images. External images must be added to `next.config.mjs` domains
- **Lucide icons** — some icon names changed in newer versions. If an import fails, check available exports before guessing
- **MDX blog** — frontmatter fields: `title`, `description`, `date` (YYYY-MM-DD), `author`, `category`, `readTime`, `featured` (boolean)

---

## What Makes Islamic Ad Network Different (Always Keep in Mind)

1. **100% halal inventory** — every publisher manually reviewed, no exceptions
2. **Cultural intelligence** — not just translation, but genuine understanding of Muslim consumer psychology
3. **Publisher-first economics** — 70% revenue share vs Google's ~68% but with full halal guarantee
4. **Muslim market expertise** — targeting categories that don't exist on any other network
5. **Community trust** — building within the ummah, not extracting from it

This is not just a business. It is a service to the Muslim community. Every feature should be built with that responsibility in mind.
