"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

export default function WaitlistSection() {
  const [type, setType] = useState<"advertiser" | "publisher">("advertiser");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Simulate API call — replace with real endpoint
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <section id="waitlist" className="py-24 bg-brand-cream">
      <div className="container-brand">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="badge-green mb-4">Early Access</span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-brand-charcoal mt-4 mb-4">
              Join the waitlist
            </h2>
            <p className="text-brand-muted">
              Be among the first to access Islamic Ad Network. Founding members get exclusive
              rates and priority onboarding.
            </p>
          </motion.div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl border border-brand-green/20 p-12 text-center shadow-brand-md"
            >
              <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} className="text-brand-green" />
              </div>
              <h3 className="font-display text-2xl font-bold text-brand-charcoal mb-3">
                You&apos;re on the list!
              </h3>
              <p className="text-brand-muted">
                We&apos;ll be in touch soon. Follow us on LinkedIn and Twitter for updates.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl border border-brand-cream-dark p-8 sm:p-10 shadow-brand-md"
            >
              {/* Type toggle */}
              <div className="flex rounded-xl bg-brand-cream p-1 mb-8">
                {(["advertiser", "publisher"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize ${
                      type === t
                        ? "bg-brand-green text-white shadow-brand-sm"
                        : "text-brand-muted hover:text-brand-charcoal"
                    }`}
                  >
                    I&apos;m an {t}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-1.5">
                    Your name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={type === "advertiser" ? "Ahmed Al-Rashid" : "Muhammad Hassan"}
                    className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-1.5">
                    Work email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary text-base py-4 mt-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Joining…
                    </>
                  ) : (
                    <>
                      Join the Waitlist
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-brand-muted text-xs mt-5">
                No spam. Unsubscribe anytime. Your data is never sold.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
