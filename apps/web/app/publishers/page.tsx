import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  DollarSign, Code2, Globe, ShieldCheck, BarChart2,
  Wallet, ArrowRight, CheckCircle2, Clock, Layers
} from "lucide-react";

export const metadata: Metadata = {
  title: "Publisher Network — Monetize Your Muslim Audience",
  description:
    "Join the Islamic Ad Network publisher network. Earn up to 70% revenue share by showing halal-compliant ads on your website. No alcohol, no gambling — ever.",
};

const benefits = [
  {
    icon: DollarSign,
    title: "70% Revenue Share",
    desc: "One of the highest publisher payouts in the industry. We keep 30%, you keep 70%.",
  },
  {
    icon: ShieldCheck,
    title: "100% Islamic Ad Network",
    desc: "Every ad on our network is manually reviewed. No alcohol, gambling, adult content, or riba-based financial products.",
  },
  {
    icon: BarChart2,
    title: "Real-Time Dashboard",
    desc: "Track impressions, clicks, RPM, and earnings live. Daily and monthly breakdowns.",
  },
  {
    icon: Wallet,
    title: "Flexible Payouts",
    desc: "Get paid via bank transfer, PayPal, or Wise. Minimum payout $25. Monthly payments.",
  },
  {
    icon: Code2,
    title: "One-Line Integration",
    desc: "Copy-paste our JavaScript snippet. Works on any site, CMS, or WordPress with no plugins needed.",
  },
  {
    icon: Layers,
    title: "Multiple Ad Sizes",
    desc: "Leaderboard, rectangle, skyscraper, and mobile banner. Responsive units that fit any layout.",
  },
];

const adSizes = [
  { name: "Leaderboard", dims: "728 × 90", best: "Header / footer" },
  { name: "Medium Rectangle", dims: "300 × 250", best: "Sidebar / in-content" },
  { name: "Wide Skyscraper", dims: "160 × 600", best: "Sidebar" },
  { name: "Mobile Banner", dims: "320 × 50", best: "Mobile top / bottom" },
  { name: "Large Rectangle", dims: "336 × 280", best: "In-content" },
  { name: "Half Page", dims: "300 × 600", best: "Sidebar premium" },
];

const steps = [
  {
    icon: Globe,
    n: "01",
    title: "Submit your site",
    desc: "Register your website and provide basic details. Our team reviews for Halal content compliance within 24 hours.",
  },
  {
    icon: Code2,
    n: "02",
    title: "Add the snippet",
    desc: "Once approved, copy your unique JavaScript tag and paste it before </body>. Takes under 5 minutes.",
  },
  {
    icon: BarChart2,
    n: "03",
    title: "Ads go live",
    desc: "Relevant halal ads from our advertiser network start appearing on your site immediately.",
  },
  {
    icon: DollarSign,
    n: "04",
    title: "Get paid monthly",
    desc: "Earnings accumulate in your dashboard. We pay out on the 15th of every month.",
  },
];

const requirements = [
  "Content must be halal — no alcohol, gambling, adult, or haram topics",
  "Minimum 500 monthly pageviews (waived for founding publishers)",
  "Site must be in English, Arabic, Malay, Urdu, or Indonesian",
  "No click fraud or artificial traffic",
  "Publisher must own or have rights to the domain",
];

export default function PublishersPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative bg-gradient-hero pt-32 pb-24 overflow-hidden">
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-gold/8 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          <div className="container-brand relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-sm font-medium mb-8">
                <DollarSign size={14} />
                For Publishers
              </div>
              <h1 className="font-display text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Monetize your{" "}
                <span className="gradient-text">halal audience</span>
              </h1>
              <p className="text-white/75 text-xl leading-relaxed mb-8 max-w-2xl">
                Turn your Muslim audience into revenue — with ads that match your values.
                Earn up to 70% revenue share with zero compromise on halal content.
              </p>
              <div className="flex flex-wrap gap-4 mb-12">
                <Link href="/waitlist?type=publisher" className="btn-secondary text-base px-8 py-4">
                  Apply as Publisher <ArrowRight size={18} />
                </Link>
                <Link href="#how-it-works" className="btn-ghost text-base px-8 py-4">
                  How It Works
                </Link>
              </div>
              {/* Quick stats */}
              <div className="flex flex-wrap gap-6">
                {[
                  { v: "70%", l: "Revenue share" },
                  { v: "$25", l: "Min. payout" },
                  { v: "24h", l: "Review time" },
                  { v: "1 line", l: "To integrate" },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="font-display text-2xl font-bold gradient-text">{s.v}</div>
                    <div className="text-white/60 text-xs">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-24 bg-white">
          <div className="container-brand">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="badge-green mb-4">Why Islamic Ad Network</span>
              <h2 className="font-display text-4xl font-bold text-brand-charcoal mt-4 mb-4">
                Built for Muslim publishers
              </h2>
              <p className="text-brand-muted">
                Generic ad networks serve your audience ads for alcohol, betting, and worse.
                Islamic Ad Network guarantees every ad placement is 100% halal.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="card-brand p-7">
                  <div className="w-11 h-11 rounded-xl bg-brand-green/10 flex items-center justify-center mb-5">
                    <Icon size={20} className="text-brand-green" />
                  </div>
                  <h3 className="font-display font-bold text-brand-charcoal text-lg mb-2">{title}</h3>
                  <p className="text-brand-muted text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ad Sizes */}
        <section className="py-24 bg-brand-cream">
          <div className="container-brand">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div>
                <span className="badge-gold mb-6">Ad Formats</span>
                <h2 className="font-display text-4xl font-bold text-brand-charcoal mt-4 mb-6">
                  Fits any layout
                </h2>
                <p className="text-brand-muted leading-relaxed mb-8">
                  From mobile banners to large rectangles, our responsive ad units blend
                  naturally into your content — maximising viewability without ruining
                  the reader experience.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {adSizes.map((s) => (
                    <div key={s.name} className="bg-white rounded-xl border border-brand-cream-dark p-4">
                      <div className="font-semibold text-brand-charcoal text-sm">{s.name}</div>
                      <div className="font-mono text-brand-green text-xs mt-0.5">{s.dims}</div>
                      <div className="text-brand-muted text-xs mt-1">{s.best}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code snippet preview */}
              <div>
                <span className="badge-green mb-6">Integration</span>
                <h2 className="font-display text-4xl font-bold text-brand-charcoal mt-4 mb-6">
                  One snippet.<br />That&apos;s it.
                </h2>
                <div className="bg-brand-charcoal rounded-2xl overflow-hidden shadow-brand-lg">
                  <div className="flex items-center gap-2 px-5 py-3 bg-white/5 border-b border-white/10">
                    <div className="w-3 h-3 rounded-full bg-red-400/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                    <div className="w-3 h-3 rounded-full bg-green-400/60" />
                    <span className="text-white/30 text-xs ml-3">index.html</span>
                  </div>
                  <div className="p-6 font-mono text-sm">
                    <div className="text-white/40">{`<!-- Islamic Ad Network Ad Unit -->`}</div>
                    <div className="text-white/70 mt-1">{`<`}<span className="text-brand-gold">div</span></div>
                    <div className="text-white/70 ml-4">
                      <span className="text-brand-gold-light">id</span>=<span className="text-green-400">&quot;ha-ad-unit&quot;</span>
                    </div>
                    <div className="text-white/70 ml-4">
                      <span className="text-brand-gold-light">data-pub</span>=<span className="text-green-400">&quot;YOUR_PUB_ID&quot;</span>
                    </div>
                    <div className="text-white/70 ml-4">
                      <span className="text-brand-gold-light">data-size</span>=<span className="text-green-400">&quot;300x250&quot;</span>
                    </div>
                    <div className="text-white/70">{`>`}{`</`}<span className="text-brand-gold">div</span>{`>`}</div>
                    <div className="mt-3 text-white/70">
                      {`<`}<span className="text-brand-gold">script</span>
                      <span className="text-brand-gold-light"> src</span>=
                      <span className="text-green-400">&quot;//cdn.islamicadnetwork.com/a.js&quot;</span>
                      {`>`}{`</`}<span className="text-brand-gold">script</span>{`>`}
                    </div>
                  </div>
                </div>
                <p className="text-brand-muted text-sm mt-4">
                  Works with WordPress, Webflow, Ghost, custom HTML — any platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-24 bg-white">
          <div className="container-brand">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="badge-gold mb-4">Getting Started</span>
              <h2 className="font-display text-4xl font-bold text-brand-charcoal mt-4">
                From signup to earnings in 4 steps
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
              {steps.map(({ icon: Icon, n, title, desc }) => (
                <div key={n} className="card-brand p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-brand-green text-white font-display font-bold text-lg flex items-center justify-center mx-auto mb-4">
                    {n}
                  </div>
                  <Icon size={18} className="text-brand-green mx-auto mb-3" />
                  <h3 className="font-display font-bold text-brand-charcoal mb-2">{title}</h3>
                  <p className="text-brand-muted text-sm">{desc}</p>
                </div>
              ))}
            </div>

            {/* Requirements */}
            <div className="max-w-2xl mx-auto bg-brand-cream rounded-2xl border border-brand-cream-dark p-8">
              <h3 className="font-display font-bold text-brand-charcoal text-xl mb-5 flex items-center gap-2">
                <Clock size={18} className="text-brand-green" />
                Publisher requirements
              </h3>
              <ul className="space-y-3">
                {requirements.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-sm text-brand-muted">
                    <CheckCircle2 size={16} className="text-brand-green flex-shrink-0 mt-0.5" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-brand">
          <div className="container-brand text-center">
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Start earning with halal ads
            </h2>
            <p className="text-white/75 mb-8 max-w-xl mx-auto">
              Founding publishers get premium placement priority and dedicated account management.
            </p>
            <Link href="/waitlist?type=publisher" className="btn-secondary text-base px-10 py-4 inline-flex">
              Apply Now — Free <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
