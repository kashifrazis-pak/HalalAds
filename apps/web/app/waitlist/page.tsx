"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, CheckCircle2, Loader2, Star } from "lucide-react";

const perks = {
  advertiser: [
    "Locked-in founding advertiser rates (never increase)",
    "Priority campaign review — live within 2 hours",
    "First access to new ad formats and targeting options",
    "Dedicated onboarding call with our team",
    "Free first $50 in ad credits",
  ],
  publisher: [
    "Founding publisher badge on your profile",
    "70% revenue share (standard is 65%)",
    "Priority fill rates — higher RPM from day one",
    "Dedicated publisher success manager",
    "Early access to premium advertiser inventory",
  ],
};

function WaitlistForm() {
  const params = useSearchParams();
  const defaultType = params.get("type") === "publisher" ? "publisher" : "advertiser";
  const [type, setType] = useState<"advertiser" | "publisher">(defaultType);
  const [form, setForm] = useState({ name: "", email: "", company: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <section className="py-20 bg-brand-cream min-h-[80vh] flex items-center">
      <div className="container-brand w-full">
        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green text-sm font-medium mb-8">
              <Star size={13} />
              Limited Early Access
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-brand-charcoal mb-5">
              Join the HalalAds waitlist
            </h1>
            <p className="text-brand-muted leading-relaxed mb-8">
              Be among the first to access the world&apos;s leading halal ad network.
              Founding members receive exclusive rates and priority access that are
              locked in forever.
            </p>

            {/* Toggle */}
            <div className="flex rounded-xl bg-white border border-brand-cream-dark p-1 mb-8 w-fit">
              {(["advertiser", "publisher"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                    type === t
                      ? "bg-brand-green text-white shadow-brand-sm"
                      : "text-brand-muted hover:text-brand-charcoal"
                  }`}
                >
                  {t === "advertiser" ? "Advertiser" : "Publisher"}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {perks[type].map((perk) => (
                <div key={perk} className="flex items-start gap-3">
                  <CheckCircle2 size={17} className="text-brand-green flex-shrink-0 mt-0.5" />
                  <span className="text-brand-charcoal text-sm">{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div>
            {submitted ? (
              <div className="bg-white rounded-3xl border border-brand-green/20 p-10 text-center shadow-brand-md">
                <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={32} className="text-brand-green" />
                </div>
                <h3 className="font-display text-2xl font-bold text-brand-charcoal mb-3">
                  You&apos;re on the list!
                </h3>
                <p className="text-brand-muted text-sm max-w-xs mx-auto">
                  Alhamdulillah! We&apos;ll be in touch soon. Follow us on LinkedIn for updates on our launch.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-brand-cream-dark p-8 shadow-brand-md">
                <h2 className="font-display text-xl font-bold text-brand-charcoal mb-6">
                  Sign up as {type === "advertiser" ? "an Advertiser" : "a Publisher"}
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Full name</label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Work email</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@company.com"
                      className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-charcoal mb-1.5">
                      {type === "advertiser" ? "Company name" : "Website URL"}
                    </label>
                    <input
                      required
                      type={type === "publisher" ? "url" : "text"}
                      value={form.company}
                      onChange={(e) => update("company", e.target.value)}
                      placeholder={type === "advertiser" ? "Acme Halal Foods" : "https://yoursite.com"}
                      className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary text-base py-4 mt-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <><Loader2 size={18} className="animate-spin" /> Joining…</>
                    ) : (
                      <>Join the Waitlist <ArrowRight size={18} /></>
                    )}
                  </button>
                </form>
                <p className="text-center text-brand-muted text-xs mt-4">
                  No spam. Unsubscribe anytime.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function WaitlistPage() {
  return (
    <>
      <Navbar />
      <main>
        <Suspense fallback={<div className="min-h-screen bg-brand-cream" />}>
          <WaitlistForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
