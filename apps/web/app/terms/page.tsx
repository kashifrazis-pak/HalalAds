import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms and conditions governing use of Islamic Ad Network by advertisers, publishers, and visitors.",
  alternates: { canonical: "https://islamicadnetwork.com/terms" },
};

const LAST_UPDATED = "1 January 2025";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-gradient-hero pt-32 pb-16">
          <div className="container-brand max-w-3xl">
            <span className="badge-gold mb-4">Legal</span>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mt-4 mb-3">
              Terms of Service
            </h1>
            <p className="text-white/60 text-sm">Last updated: {LAST_UPDATED}</p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container-brand">
            <div className="max-w-3xl mx-auto prose prose-lg prose-headings:font-display prose-headings:text-brand-charcoal prose-p:text-brand-muted prose-a:text-brand-green prose-strong:text-brand-charcoal prose-li:text-brand-muted max-w-none">

              <h2>1. Agreement to Terms</h2>
              <p>
                By accessing or using Islamic Ad Network (&ldquo;Platform&rdquo;), you agree to be bound by these Terms of Service and our{" "}
                <Link href="/privacy">Privacy Policy</Link>. If you do not agree, do not use the Platform.
              </p>

              <h2>2. Eligibility</h2>
              <p>You must be at least 18 years old and have the legal authority to enter a binding contract to use the Platform. By registering, you represent that you meet these requirements.</p>

              <h2>3. Advertiser Terms</h2>
              <h3>3.1 Halal Content Requirement</h3>
              <p>All advertising content must comply with our <Link href="/halal-policy">Halal Advertising Policy</Link>. Advertisements promoting alcohol, gambling, adult content, interest-based financial products (riba), pork products, or any Islamically prohibited content are strictly forbidden and will result in immediate account suspension.</p>
              <h3>3.2 Prepaid Credits</h3>
              <p>Advertising is prepaid. Credits added to your account are consumed as your campaigns run. Unused credits are refundable upon written request within 12 months of purchase, minus a 5% processing fee.</p>
              <h3>3.3 Campaign Approval</h3>
              <p>All campaigns are reviewed before going live. We reserve the right to reject any campaign that violates our Halal Policy, contains misleading claims, or is otherwise inconsistent with our brand values.</p>
              <h3>3.4 Click Fraud</h3>
              <p>Any attempt to generate fraudulent clicks or impressions — including the use of bots, click farms, or incentivised traffic schemes — will result in immediate account termination and forfeiture of remaining credits.</p>

              <h2>4. Publisher Terms</h2>
              <h3>4.1 Site Eligibility</h3>
              <p>Publisher sites must contain predominantly halal content. Sites with adult content, gambling, alcohol, or other haram material are ineligible. We conduct periodic reviews and may remove publishers at any time.</p>
              <h3>4.2 Revenue Share</h3>
              <p>Publishers receive a revenue share of 65% (Standard) or 70% (Premium, 100K+ monthly pageviews) of net revenue attributable to their ad units. Revenue share may be adjusted with 30 days&apos; notice.</p>
              <h3>4.3 Minimum Payout</h3>
              <p>The minimum payout threshold is $25. Payouts are processed on the 15th of each month for the prior month&apos;s earnings. Accounts below threshold carry earnings forward.</p>
              <h3>4.4 Invalid Traffic</h3>
              <p>Publishers must not generate invalid traffic to their ad units. We use automated systems to detect fraud. Earnings generated from invalid traffic will be reversed.</p>

              <h2>5. Prohibited Uses</h2>
              <p>You may not use the Platform to: scrape or harvest data without permission; reverse-engineer the ad serving technology; attempt to circumvent rate limits or access controls; impersonate another person or entity; or violate any applicable law or regulation.</p>

              <h2>6. Intellectual Property</h2>
              <p>Islamic Ad Network owns all intellectual property in the Platform. You retain ownership of your creative assets and grant us a licence to display them for the purpose of running your campaigns.</p>

              <h2>7. Disclaimers</h2>
              <p>The Platform is provided &ldquo;as is&rdquo; without warranty of any kind. We do not guarantee specific campaign performance, impressions, or earnings. Ad inventory may vary.</p>

              <h2>8. Limitation of Liability</h2>
              <p>To the maximum extent permitted by law, Islamic Ad Network shall not be liable for indirect, incidental, or consequential damages. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.</p>

              <h2>9. Termination</h2>
              <p>We may suspend or terminate your account at any time for breach of these Terms. You may close your account at any time by contacting support. Termination does not affect accrued obligations.</p>

              <h2>10. Governing Law</h2>
              <p>These Terms are governed by the laws of England and Wales. Disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.</p>

              <h2>11. Changes</h2>
              <p>We may update these Terms. Material changes will be notified by email at least 14 days in advance. Continued use after the effective date constitutes acceptance.</p>

              <h2>12. Contact</h2>
              <p>
                Legal enquiries: <a href="mailto:legal@islamicadnetwork.com">legal@islamicadnetwork.com</a>
              </p>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
