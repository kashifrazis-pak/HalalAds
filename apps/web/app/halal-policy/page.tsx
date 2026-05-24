import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Halal Advertising Policy",
  description:
    "Our comprehensive Shariah-compliant advertising standards. Every ad on Islamic Ad Network is reviewed for halal compliance.",
  alternates: { canonical: "https://islamicadnetwork.com/halal-policy" },
};

const LAST_UPDATED = "1 January 2025";

const ALLOWED = [
  "Halal food and beverages",
  "Islamic finance products (savings, takaful, equity crowdfunding)",
  "Modest fashion and modest lifestyle brands",
  "Education and online learning",
  "Halal travel and hospitality",
  "Healthcare, supplements, and wellness (halal-certified)",
  "Muslim media, books, and content platforms",
  "Technology, software, and SaaS products",
  "Real estate and property investment",
  "E-commerce (general goods, halal-certified)",
  "Non-profit and charitable organisations",
  "Islamic events, conferences, and community platforms",
];

const PROHIBITED = [
  "Alcohol and alcoholic beverages",
  "Gambling, betting, and casinos (including crypto gambling)",
  "Adult content, dating apps, and escort services",
  "Interest-based (riba) financial products — conventional loans, credit cards, payday lenders",
  "Pork and non-halal meat products",
  "Tobacco, cigarettes, and vaping products",
  "Weapons, firearms, and military recruitment",
  "Recreational drugs and drug paraphernalia",
  "Music streaming primarily promoting haram content",
  "Astrology, fortune-telling, and occult services",
  "Multi-level marketing and pyramid schemes",
  "Misleading health claims or unproven treatments",
];

export default function HalalPolicyPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-gradient-hero pt-32 pb-16">
          <div className="container-brand max-w-3xl">
            <span className="badge-gold mb-4">Policy</span>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mt-4 mb-3">
              Halal Advertising Policy
            </h1>
            <p className="text-white/75 text-lg mt-2 mb-1">
              Every advertisement on our network is reviewed for Shariah compliance.
            </p>
            <p className="text-white/60 text-sm">Last updated: {LAST_UPDATED}</p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container-brand max-w-4xl mx-auto">

            <div className="bg-brand-green/5 border border-brand-green/20 rounded-2xl p-6 mb-12">
              <p className="text-brand-charcoal text-base leading-relaxed">
                <strong>Our commitment:</strong> Islamic Ad Network exists to serve the Muslim community. Halal compliance is not a feature — it is the foundation of everything we do. No advertisement runs on our network without passing our review process. When in doubt, we say no.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 mb-16">
              <div>
                <h2 className="font-display text-2xl font-bold text-brand-charcoal mb-6 flex items-center gap-2">
                  <CheckCircle2 size={22} className="text-brand-green" />
                  Permitted categories
                </h2>
                <ul className="space-y-3">
                  {ALLOWED.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-brand-green flex-shrink-0 mt-0.5" />
                      <span className="text-brand-muted text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-brand-charcoal mb-6 flex items-center gap-2">
                  <XCircle size={22} className="text-red-500" />
                  Prohibited categories
                </h2>
                <ul className="space-y-3">
                  {PROHIBITED.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <XCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <span className="text-brand-muted text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="prose prose-lg prose-headings:font-display prose-headings:text-brand-charcoal prose-p:text-brand-muted prose-a:text-brand-green prose-strong:text-brand-charcoal max-w-none">

              <h2>Review Process</h2>
              <p>Every new campaign submitted to Islamic Ad Network goes through a manual halal compliance review before going live. Our review team checks:</p>
              <ul>
                <li>The product or service being advertised</li>
                <li>Ad creative for language, imagery, and implications</li>
                <li>The landing page and destination URL</li>
                <li>The advertiser&apos;s broader brand and reputation</li>
              </ul>
              <p>Standard review takes up to 24 hours. Growth and Enterprise plans receive priority review within 4 hours.</p>

              <h2>Publisher Content Standards</h2>
              <p>Publishers joining our network must ensure their website content meets halal standards. Sites are reviewed on application. We conduct periodic re-reviews. Publishers found to be hosting haram content will have their accounts suspended and earnings withheld pending investigation.</p>

              <h2>Contextual Sensitivity</h2>
              <p>Beyond explicit prohibitions, we apply contextual judgment. An ad that is technically halal in isolation may be rejected if its placement, timing, or framing creates a misleading or culturally insensitive impression for Muslim audiences.</p>

              <h2>Reporting Violations</h2>
              <p>If you see an advertisement on our network that you believe violates this policy, please report it immediately at{" "}
                <a href="mailto:compliance@islamicadnetwork.com">compliance@islamicadnetwork.com</a>.
                We take all reports seriously and investigate within 48 hours.
              </p>

              <h2>Policy Updates</h2>
              <p>This policy is reviewed quarterly by our Shariah compliance advisors. Updates are published here with the revision date. Advertisers whose campaigns are affected by policy changes will be notified directly.</p>

              <h2>Questions</h2>
              <p>For questions about whether your product or service qualifies, contact us at{" "}
                <Link href="/contact">our contact form</Link>{" "}or{" "}
                <a href="mailto:compliance@islamicadnetwork.com">compliance@islamicadnetwork.com</a>{" "}
                before submitting a campaign.
              </p>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
