import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Islamic Ad Network collects, uses, and protects your personal data. We are committed to your privacy and data security.",
  alternates: { canonical: "https://islamicadnetwork.com/privacy" },
};

const LAST_UPDATED = "1 January 2025";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-gradient-hero pt-32 pb-16">
          <div className="container-brand max-w-3xl">
            <span className="badge-gold mb-4">Legal</span>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mt-4 mb-3">
              Privacy Policy
            </h1>
            <p className="text-white/60 text-sm">Last updated: {LAST_UPDATED}</p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container-brand">
            <div className="max-w-3xl mx-auto prose prose-lg prose-headings:font-display prose-headings:text-brand-charcoal prose-p:text-brand-muted prose-a:text-brand-green prose-strong:text-brand-charcoal prose-li:text-brand-muted max-w-none">

              <h2>1. Who We Are</h2>
              <p>
                Islamic Ad Network (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) operates{" "}
                <a href="https://islamicadnetwork.com">islamicadnetwork.com</a> — a halal-certified
                digital advertising network connecting advertisers with Muslim audiences worldwide.
              </p>

              <h2>2. Information We Collect</h2>
              <h3>2.1 Account Data</h3>
              <p>When you create an account we collect your name, email address, and role (advertiser or publisher). If you sign in via Google OAuth, we receive your Google profile name and email.</p>
              <h3>2.2 Campaign & Publisher Data</h3>
              <p>Advertisers provide campaign details including targeting preferences, budgets, and creative assets. Publishers provide their site URL, ad unit configuration, and payout details.</p>
              <h3>2.3 Payment Data</h3>
              <p>Billing is handled by Stripe. We store transaction records (amount, date, type) but never hold raw card numbers. Payout details (PayPal email, bank account) are stored encrypted.</p>
              <h3>2.4 Usage Data</h3>
              <p>We collect anonymised analytics — page views, session duration, and referral source — via PostHog, a privacy-first analytics platform. IP addresses are never stored raw; we store only a salted SHA-256 hash for fraud detection.</p>
              <h3>2.5 Ad Serving Data</h3>
              <p>When an ad is served we record a hashed IP, country (derived from IP), user-agent string, timestamp, and which ad unit and campaign were involved. No cross-site tracking cookies are set.</p>

              <h2>3. How We Use Your Data</h2>
              <ul>
                <li>Provide and operate the advertising platform</li>
                <li>Process payments and publisher payouts</li>
                <li>Detect and prevent ad fraud</li>
                <li>Send transactional emails (campaign approvals, payout notifications)</li>
                <li>Improve our services through aggregated, anonymised analytics</li>
                <li>Comply with legal obligations</li>
              </ul>
              <p>We do <strong>not</strong> sell your personal data to third parties. We do not use your data to build personal profiles for advertising purposes outside our platform.</p>

              <h2>4. Legal Basis for Processing (GDPR)</h2>
              <p>For users in the EEA and UK we rely on: <strong>contract performance</strong> (operating your account), <strong>legitimate interests</strong> (fraud prevention, platform security), and <strong>consent</strong> (marketing emails, where applicable).</p>

              <h2>5. Data Retention</h2>
              <p>Account data is retained while your account is active and for 3 years afterwards for legal compliance. Impression and click logs are retained for 13 months then aggregated. Payment records are retained for 7 years per financial regulations.</p>

              <h2>6. Your Rights</h2>
              <p>You have the right to access, correct, export, or delete your personal data. To exercise any right, contact us at{" "}
                <a href="mailto:privacy@islamicadnetwork.com">privacy@islamicadnetwork.com</a>.
                We will respond within 30 days.
              </p>

              <h2>7. Cookies</h2>
              <p>We use session cookies (necessary for authentication) and a PostHog analytics cookie. We do not use third-party advertising cookies. You can disable non-essential cookies in your browser settings.</p>

              <h2>8. Third-Party Services</h2>
              <p>We share data with: <strong>Supabase</strong> (database hosting), <strong>Vercel</strong> (application hosting), <strong>Stripe</strong> (payments), <strong>PayPal</strong> (publisher payouts), <strong>Resend</strong> (transactional email), <strong>PostHog</strong> (analytics). Each is bound by a data processing agreement and relevant privacy regulations.</p>

              <h2>9. International Transfers</h2>
              <p>Our servers are primarily in the EU (Supabase) and US (Vercel). International transfers are covered by Standard Contractual Clauses where required.</p>

              <h2>10. Changes to This Policy</h2>
              <p>We may update this policy. Material changes will be notified by email. Continued use of the platform after changes constitutes acceptance.</p>

              <h2>11. Contact</h2>
              <p>
                For privacy enquiries:{" "}
                <a href="mailto:privacy@islamicadnetwork.com">privacy@islamicadnetwork.com</a>
                {" "}or via our <Link href="/contact">contact form</Link>.
              </p>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
