import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Heart, Globe2, ShieldCheck, TrendingUp, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Islamic Ad Network",
  description:
    "Our mission is to build the world's largest halal-certified advertising network — empowering Muslim businesses and publishers globally.",
};

const values = [
  {
    icon: ShieldCheck,
    title: "Halal First",
    desc: "We will never compromise on Shariah compliance. Every advertiser, ad creative, and publisher on our network is manually reviewed.",
  },
  {
    icon: Globe2,
    title: "Global Muslim Community",
    desc: "We serve 1.8 billion Muslims across 190+ countries. Our platform is built to be multilingual, multicultural, and truly global.",
  },
  {
    icon: Heart,
    title: "Empowering Muslim Businesses",
    desc: "We level the playing field for halal brands, Muslim entrepreneurs, and publishers who have been ignored by mainstream ad networks.",
  },
  {
    icon: TrendingUp,
    title: "Transparency",
    desc: "No hidden fees, no opaque algorithms. Advertisers see exactly where their ads run. Publishers see exactly how their revenue is calculated.",
  },
];

const milestones = [
  { year: "2024", event: "Islamic Ad Network founded with a mission to serve the global Muslim economy" },
  { year: "2025", event: "Beta platform launched — first advertisers and publishers onboarded" },
  { year: "2025", event: "Expanded to Southeast Asia and Western Muslim diaspora markets" },
  { year: "2026", event: "Arabic, Malay, and Urdu language support launched" },
  { year: "2026+", event: "Middle East and South Asia expansion" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-hero pt-32 pb-24">
          <div className="container-brand max-w-3xl text-center mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-sm font-medium mb-8">
              Our Mission
            </div>
            <h1 className="font-display text-5xl lg:text-6xl font-bold text-white mb-6">
              Advertising built for the{" "}
              <span className="gradient-text">Muslim World</span>
            </h1>
            <p className="text-white/75 text-xl leading-relaxed">
              We believe Muslim consumers deserve better than ads for alcohol, gambling,
              and haram products. Islamic Ad Network was built to fix that — creating a space where
              halal brands and halal audiences find each other.
            </p>
          </div>
        </section>

        {/* Mission statement */}
        <section className="py-24 bg-white">
          <div className="container-brand">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="badge-green mb-6">Why We Exist</span>
                <h2 className="font-display text-4xl font-bold text-brand-charcoal mt-4 mb-6">
                  The Muslim market is the world&apos;s biggest untapped opportunity
                </h2>
                <p className="text-brand-muted leading-relaxed mb-5">
                  The global halal economy is worth <strong className="text-brand-charcoal">$2.6 trillion</strong> — covering
                  food, finance, fashion, travel, and more. Yet Muslim consumers
                  are routinely targeted by ads for products that violate their values.
                </p>
                <p className="text-brand-muted leading-relaxed mb-5">
                  For Muslim website owners, the situation is worse. Ad networks like
                  Google AdSense regularly serve haram content on Islamic websites —
                  forcing publishers to either tolerate it or lose their revenue stream entirely.
                </p>
                <p className="text-brand-muted leading-relaxed">
                  Islamic Ad Network changes that. We&apos;re building the infrastructure for a
                  Shariah-compliant digital advertising ecosystem — one that works for
                  advertisers, publishers, and the Muslim community alike.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { v: "1.8B", l: "Muslim consumers worldwide" },
                  { v: "$2.6T", l: "Global halal economy" },
                  { v: "57", l: "Muslim-majority countries" },
                  { v: "5.3%", l: "Annual halal economy growth" },
                ].map((s) => (
                  <div key={s.l} className="card-brand p-6 text-center">
                    <div className="font-display text-4xl font-bold gradient-text-green mb-2">{s.v}</div>
                    <div className="text-brand-muted text-sm">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 bg-brand-cream">
          <div className="container-brand">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="badge-gold mb-4">Our Values</span>
              <h2 className="font-display text-4xl font-bold text-brand-charcoal mt-4">
                What we stand for
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {values.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="card-brand p-8">
                  <div className="w-12 h-12 rounded-xl bg-brand-green/10 flex items-center justify-center mb-5">
                    <Icon size={22} className="text-brand-green" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-brand-charcoal mb-3">{title}</h3>
                  <p className="text-brand-muted leading-relaxed text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-24 bg-brand-charcoal text-white">
          <div className="container-brand max-w-2xl mx-auto">
            <div className="text-center mb-16">
              <span className="badge-gold mb-4">Our Journey</span>
              <h2 className="font-display text-4xl font-bold text-white mt-4">
                Building the future of halal advertising
              </h2>
            </div>
            <div className="relative">
              <div className="absolute left-16 top-0 bottom-0 w-px bg-white/10" />
              <div className="flex flex-col gap-8">
                {milestones.map((m) => (
                  <div key={m.event} className="flex items-start gap-6">
                    <div className="w-14 text-right flex-shrink-0">
                      <span className="text-brand-gold font-bold text-sm">{m.year}</span>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[25px] top-1.5 w-3 h-3 rounded-full bg-brand-gold border-2 border-brand-charcoal" />
                      <p className="text-white/70 text-sm leading-relaxed">{m.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-brand">
          <div className="container-brand text-center">
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Join the movement
            </h2>
            <p className="text-white/75 mb-8 max-w-lg mx-auto">
              Whether you&apos;re a brand, a publisher, or a Muslim entrepreneur — there&apos;s a place for you on Islamic Ad Network.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/waitlist?type=advertiser" className="btn-secondary text-base px-8 py-4">
                Start Advertising <ArrowRight size={18} />
              </Link>
              <Link href="/waitlist?type=publisher" className="btn-ghost text-base px-8 py-4">
                Become a Publisher
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
