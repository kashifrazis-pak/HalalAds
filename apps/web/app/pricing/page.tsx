import Link from "next/link";
import type { Metadata } from "next";
import Script from "next/script";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckCircle2, ArrowRight, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for advertisers and publishers. Start free, scale as you grow. No hidden fees.",
  openGraph: {
    title: "Pricing | Islamic Ad Network",
    description: "Transparent halal advertising pricing. Start from $50 with no setup fees.",
    url: "https://islamicadnetwork.com/pricing",
  },
  alternates: { canonical: "https://islamicadnetwork.com/pricing" },
};

const advertiserPlans = [
  {
    name: "Starter",
    desc: "Perfect for small halal businesses testing digital advertising.",
    price: "$50",
    period: "minimum deposit",
    cpc: "From $0.05/click",
    cpm: "From $1.50/CPM",
    color: "cream",
    features: [
      "Self-serve campaign builder",
      "CPC and CPM campaigns",
      "5 active campaigns",
      "Basic geo-targeting (country level)",
      "Standard ad sizes",
      "Email support",
      "7-day reporting",
    ],
    cta: "Get Started",
    href: "/waitlist?type=advertiser&plan=starter",
  },
  {
    name: "Growth",
    desc: "For growing brands ready to scale across Muslim markets.",
    price: "$500",
    period: "minimum deposit",
    cpc: "From $0.04/click",
    cpm: "From $1.20/CPM",
    color: "green",
    badge: "Most Popular",
    features: [
      "Everything in Starter",
      "CPC, CPM, and CPA campaigns",
      "Unlimited active campaigns",
      "City-level geo-targeting",
      "Interest & demographic targeting",
      "Retargeting audiences",
      "Priority review (4h)",
      "Dedicated account manager",
      "Real-time analytics",
      "30-day reporting",
    ],
    cta: "Get Started",
    href: "/waitlist?type=advertiser&plan=growth",
  },
  {
    name: "Enterprise",
    desc: "Full-service managed campaigns for major halal brands.",
    price: "Custom",
    period: "contact us",
    cpc: "Negotiated rates",
    cpm: "Negotiated rates",
    color: "charcoal",
    features: [
      "Everything in Growth",
      "Managed campaign service",
      "Creative production support",
      "Direct brand deals placement",
      "Custom interest segments",
      "Multi-market campaigns",
      "API access",
      "Custom reporting & dashboards",
      "SLA guarantee",
      "Executive business reviews",
    ],
    cta: "Contact Sales",
    href: "/contact",
  },
];

const publisherTiers = [
  {
    name: "Standard Publisher",
    rev: "65%",
    req: "Any halal website",
    perks: [
      "Self-serve ad unit builder",
      "Standard ad inventory",
      "Monthly payouts",
      "Email support",
    ],
  },
  {
    name: "Premium Publisher",
    rev: "70%",
    req: "100K+ monthly pageviews",
    perks: [
      "Everything in Standard",
      "Priority fill rates",
      "Premium advertiser access",
      "Bi-weekly payouts",
      "Dedicated publisher manager",
    ],
    badge: "Best Rates",
  },
];

const faqs = [
  {
    q: "Is there a minimum spend for advertisers?",
    a: "The minimum deposit is $50 for Starter and $500 for Growth. Enterprise has no minimum — we work to your budget.",
  },
  {
    q: "How do publisher payouts work?",
    a: "Earnings accumulate in your dashboard. We pay out on the 15th of each month for the previous month's earnings. Minimum payout threshold is $25.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Advertisers can pay via credit/debit card or bank transfer. Publishers receive payouts via bank transfer, PayPal, or Wise.",
  },
  {
    q: "Are there any setup fees?",
    a: "None. Creating an account, setting up campaigns, and integrating publisher ad units are all completely free.",
  },
  {
    q: "Can I pause or cancel campaigns at any time?",
    a: "Yes. You have full control over your campaigns — pause, resume, or cancel at any time. Unused balance is refundable.",
  },
  {
    q: "What counts as a conversion for CPA campaigns?",
    a: "You define what a conversion is — a purchase, sign-up, form submission, or any custom event. We track it via a simple pixel.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function PricingPage() {
  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-hero pt-32 pb-20">
          <div className="container-brand text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-sm font-medium mb-8">
              Simple Pricing
            </div>
            <h1 className="font-display text-5xl lg:text-6xl font-bold text-white mb-6">
              Transparent pricing.<br />
              <span className="gradient-text">No surprises.</span>
            </h1>
            <p className="text-white/75 text-xl max-w-xl mx-auto">
              Start with as little as $50. Scale to millions of impressions. No setup fees, no contracts.
            </p>
          </div>
        </section>

        {/* Toggle note */}
        <section className="py-20 bg-brand-cream">
          <div className="container-brand">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-brand-charcoal">For Advertisers</h2>
              <p className="text-brand-muted mt-2">Choose the plan that fits your scale. All plans include fraud protection and halal-certified inventory.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {advertiserPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-3xl overflow-hidden flex flex-col ${
                    plan.color === "green"
                      ? "bg-brand-green text-white shadow-brand-lg ring-2 ring-brand-green"
                      : plan.color === "charcoal"
                      ? "bg-brand-charcoal text-white shadow-brand-lg"
                      : "bg-white border border-brand-cream-dark shadow-brand-sm"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute top-5 right-5">
                      <span className="badge-gold text-xs">{plan.badge}</span>
                    </div>
                  )}
                  <div className="p-8 flex-1">
                    <h3 className={`font-display text-2xl font-bold mb-2 ${
                      plan.color === "cream" ? "text-brand-charcoal" : "text-white"
                    }`}>{plan.name}</h3>
                    <p className={`text-sm mb-6 ${
                      plan.color === "cream" ? "text-brand-muted" : "text-white/70"
                    }`}>{plan.desc}</p>

                    <div className="mb-2">
                      <span className={`font-display text-4xl font-bold ${
                        plan.color === "cream" ? "text-brand-charcoal" : "text-white"
                      }`}>{plan.price}</span>
                    </div>
                    <p className={`text-xs mb-1 ${plan.color === "cream" ? "text-brand-muted" : "text-white/50"}`}>
                      {plan.period}
                    </p>
                    <p className={`text-xs font-medium mb-8 ${
                      plan.color === "green" ? "text-brand-gold-light" : plan.color === "charcoal" ? "text-brand-gold" : "text-brand-green"
                    }`}>
                      {plan.cpc} · {plan.cpm}
                    </p>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((f) => (
                        <li key={f} className={`flex items-start gap-2.5 text-sm ${
                          plan.color === "cream" ? "text-brand-muted" : "text-white/80"
                        }`}>
                          <CheckCircle2 size={15} className={`flex-shrink-0 mt-0.5 ${
                            plan.color === "green" ? "text-brand-gold-light"
                            : plan.color === "charcoal" ? "text-brand-gold"
                            : "text-brand-green"
                          }`} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="px-8 pb-8">
                    <Link
                      href={plan.href}
                      className={`w-full text-center py-3.5 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                        plan.color === "green"
                          ? "bg-white text-brand-green hover:bg-brand-cream"
                          : plan.color === "charcoal"
                          ? "bg-brand-gold text-brand-charcoal hover:bg-brand-gold-light"
                          : "bg-brand-green text-white hover:bg-brand-green-light"
                      }`}
                    >
                      {plan.cta} <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Publisher tiers */}
        <section className="py-20 bg-white">
          <div className="container-brand">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-brand-charcoal">For Publishers</h2>
              <p className="text-brand-muted mt-2">Higher traffic means higher revenue share. Simple.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {publisherTiers.map((tier) => (
                <div key={tier.name} className={`card-brand p-8 relative ${tier.badge ? "ring-2 ring-brand-gold" : ""}`}>
                  {tier.badge && (
                    <span className="absolute top-5 right-5 badge-gold text-xs">{tier.badge}</span>
                  )}
                  <h3 className="font-display text-xl font-bold text-brand-charcoal mb-1">{tier.name}</h3>
                  <p className="text-brand-muted text-sm mb-5">{tier.req}</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="font-display text-5xl font-bold gradient-text-green">{tier.rev}</span>
                    <span className="text-brand-muted text-sm">revenue share</span>
                  </div>
                  <ul className="space-y-2.5">
                    {tier.perks.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm text-brand-muted">
                        <CheckCircle2 size={14} className="text-brand-green flex-shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/waitlist?type=publisher"
                    className="btn-outline w-full text-center mt-7 text-sm"
                  >
                    Apply Free
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-brand-cream">
          <div className="container-brand max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="badge-green mb-4">FAQ</span>
              <h2 className="font-display text-3xl font-bold text-brand-charcoal mt-4">
                Frequently asked questions
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              {faqs.map(({ q, a }) => (
                <div key={q} className="bg-white rounded-2xl border border-brand-cream-dark p-6">
                  <div className="flex items-start gap-3">
                    <HelpCircle size={18} className="text-brand-green flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-brand-charcoal mb-2">{q}</h4>
                      <p className="text-brand-muted text-sm leading-relaxed">{a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <p className="text-brand-muted text-sm">
                Still have questions?{" "}
                <Link href="/contact" className="text-brand-green font-semibold hover:underline">
                  Contact our team →
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
