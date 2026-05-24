import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Target, BarChart3, Zap, Shield, Globe2, Users,
  ArrowRight, TrendingUp
} from "lucide-react";

export const metadata: Metadata = {
  title: "Advertise to Muslims",
  description:
    "Reach 1.8 billion Muslim consumers with precision-targeted, Shariah-compliant ad campaigns. CPC, CPM, and CPA models available.",
};

const campaignTypes = [
  {
    type: "CPC",
    name: "Cost Per Click",
    description: "Pay only when someone clicks your ad. Ideal for driving traffic to your site, app, or landing page.",
    from: "$0.05",
    unit: "per click",
    color: "green",
    best: "Lead generation, app installs, website traffic",
  },
  {
    type: "CPM",
    name: "Cost Per Thousand Impressions",
    description: "Build brand awareness at scale. Perfect for new product launches or brand campaigns across Muslim markets.",
    from: "$1.50",
    unit: "per 1,000 impressions",
    color: "gold",
    best: "Brand awareness, product launches, Ramadan campaigns",
  },
  {
    type: "CPA",
    name: "Cost Per Acquisition",
    description: "Pay only for results — purchases, sign-ups, or any conversion you define. Maximum ROI.",
    from: "Custom",
    unit: "per conversion",
    color: "green",
    best: "E-commerce, subscriptions, financial products",
  },
];

const targeting = [
  { icon: Globe2, label: "50+ Countries", desc: "From Indonesia to the UK" },
  { icon: Users, label: "Interest Categories", desc: "Islamic finance, halal food, modest fashion & more" },
  { icon: Target, label: "Demographic Targeting", desc: "Age, gender, income bracket" },
  { icon: Zap, label: "Device & Platform", desc: "Mobile, desktop, tablet" },
  { icon: BarChart3, label: "Retargeting", desc: "Re-engage past visitors" },
  { icon: Shield, label: "Brand Safety", desc: "Blocklists & content controls" },
];

const industries = [
  "Islamic Finance & Banking", "Halal Food & Beverage", "Modest Fashion",
  "Islamic Education", "Muslim Travel & Tourism", "Halal Cosmetics & Beauty",
  "Real Estate", "Healthcare & Wellness", "Tech & Mobile Apps",
  "Charitable Giving & Zakat", "Islamic Insurance (Takaful)", "Luxury Goods",
];

const steps = [
  { n: "01", title: "Create your account", desc: "Sign up in minutes. No contracts, no minimum spend." },
  { n: "02", title: "Build your campaign", desc: "Choose your campaign type, upload creatives, set targeting and budget." },
  { n: "03", title: "Review & launch", desc: "Our team reviews for Halal compliance within 4 hours, then you go live." },
  { n: "04", title: "Optimise with data", desc: "Real-time analytics dashboard. Scale what performs." },
];

export default function AdvertisersPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative bg-gradient-hero pt-32 pb-24 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="container-brand relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-sm font-medium mb-8">
                <TrendingUp size={14} />
                For Advertisers
              </div>
              <h1 className="font-display text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Advertise to the{" "}
                <span className="gradient-text">Muslim World</span>
              </h1>
              <p className="text-white/75 text-xl leading-relaxed mb-10 max-w-2xl">
                Reach 1.8 billion Muslim consumers across Southeast Asia, the Middle East,
                and Western diaspora markets with ads that respect their values.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/waitlist?type=advertiser" className="btn-secondary text-base px-8 py-4">
                  Start Your Campaign <ArrowRight size={18} />
                </Link>
                <Link href="#how-it-works" className="btn-ghost text-base px-8 py-4">
                  See How It Works
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Campaign Types */}
        <section className="py-24 bg-white">
          <div className="container-brand">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="badge-green mb-4">Campaign Types</span>
              <h2 className="font-display text-4xl font-bold text-brand-charcoal mt-4 mb-4">
                Choose how you pay
              </h2>
              <p className="text-brand-muted">
                Three flexible models to match every goal — from brand awareness to direct response.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {campaignTypes.map((ct) => (
                <div key={ct.type} className="card-brand p-8 flex flex-col">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mb-6 self-start ${
                    ct.color === "green"
                      ? "bg-brand-green text-white"
                      : "bg-brand-gold text-brand-charcoal"
                  }`}>
                    {ct.type}
                  </div>
                  <h3 className="font-display text-2xl font-bold text-brand-charcoal mb-3">{ct.name}</h3>
                  <p className="text-brand-muted text-sm leading-relaxed mb-6 flex-1">{ct.description}</p>
                  <div className="border-t border-brand-cream-dark pt-5">
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="font-display text-3xl font-bold text-brand-green">{ct.from}</span>
                      <span className="text-brand-muted text-sm">{ct.unit}</span>
                    </div>
                    <p className="text-xs text-brand-muted">
                      <span className="font-semibold text-brand-charcoal">Best for:</span> {ct.best}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Targeting */}
        <section className="py-24 bg-brand-cream">
          <div className="container-brand">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="badge-green mb-6">Precision Targeting</span>
                <h2 className="font-display text-4xl font-bold text-brand-charcoal mt-4 mb-6">
                  Reach the right Muslim audience
                </h2>
                <p className="text-brand-muted leading-relaxed mb-8">
                  Generic ad networks treat Muslim consumers as an afterthought. HalalAds was
                  built from the ground up with the targeting categories that matter most to
                  halal brands — from Islamic finance to modest fashion.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {targeting.map(({ icon: Icon, label, desc }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-brand-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon size={16} className="text-brand-green" />
                      </div>
                      <div>
                        <div className="font-semibold text-brand-charcoal text-sm">{label}</div>
                        <div className="text-brand-muted text-xs mt-0.5">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-brand-charcoal rounded-3xl p-8 text-white">
                <h3 className="font-display text-xl font-bold mb-6 text-brand-gold">Industries We Serve</h3>
                <div className="flex flex-wrap gap-2">
                  {industries.map((ind) => (
                    <span
                      key={ind}
                      className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs hover:bg-brand-gold/10 hover:border-brand-gold/30 hover:text-brand-gold transition-colors"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-white/60 text-sm">
                    Don&apos;t see your industry?{" "}
                    <Link href="/contact" className="text-brand-gold hover:underline">
                      Talk to our team →
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-24 bg-white">
          <div className="container-brand">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="badge-gold mb-4">How It Works</span>
              <h2 className="font-display text-4xl font-bold text-brand-charcoal mt-4 mb-4">
                Live in under an hour
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {steps.map((s, i) => (
                <div key={s.n} className="relative">
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[calc(100%-16px)] w-8 h-px bg-brand-cream-dark z-10" />
                  )}
                  <div className="card-brand p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-brand-green text-white font-display font-bold text-lg flex items-center justify-center mx-auto mb-4">
                      {s.n}
                    </div>
                    <h3 className="font-display font-bold text-brand-charcoal mb-2">{s.title}</h3>
                    <p className="text-brand-muted text-sm">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-brand">
          <div className="container-brand text-center">
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Ready to reach the Muslim World?
            </h2>
            <p className="text-white/75 mb-8 max-w-xl mx-auto">
              Join our waitlist and get founding advertiser rates — locked in for life.
            </p>
            <Link href="/waitlist?type=advertiser" className="btn-secondary text-base px-10 py-4 inline-flex">
              Apply for Early Access <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
