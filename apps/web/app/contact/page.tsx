"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, MessageSquare, Building2, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

const contactReasons = [
  { value: "advertiser", label: "I want to advertise" },
  { value: "publisher", label: "I want to become a publisher" },
  { value: "enterprise", label: "Enterprise / brand deal inquiry" },
  { value: "press", label: "Press & media inquiry" },
  { value: "partnership", label: "Partnership opportunity" },
  { value: "other", label: "Something else" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", reason: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (field: string, val: string) => setForm((p) => ({ ...p, [field]: val }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-hero pt-32 pb-20">
          <div className="container-brand text-center max-w-2xl mx-auto">
            <h1 className="font-display text-5xl font-bold text-white mb-4">
              Get in <span className="gradient-text">touch</span>
            </h1>
            <p className="text-white/75 text-lg">
              Have a question, partnership idea, or want to discuss enterprise rates?
              Our team typically responds within one business day.
            </p>
          </div>
        </section>

        <section className="py-20 bg-brand-cream">
          <div className="container-brand">
            <div className="grid lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
              {/* Contact info sidebar */}
              <div className="flex flex-col gap-6">
                <div className="card-brand p-6">
                  <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center mb-4">
                    <Mail size={18} className="text-brand-green" />
                  </div>
                  <h3 className="font-semibold text-brand-charcoal mb-1">General enquiries</h3>
                  <a href="mailto:hello@halalads.com" className="text-brand-green text-sm hover:underline">
                    hello@halalads.com
                  </a>
                </div>
                <div className="card-brand p-6">
                  <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center mb-4">
                    <Building2 size={18} className="text-brand-green" />
                  </div>
                  <h3 className="font-semibold text-brand-charcoal mb-1">Enterprise sales</h3>
                  <a href="mailto:sales@halalads.com" className="text-brand-green text-sm hover:underline">
                    sales@halalads.com
                  </a>
                </div>
                <div className="card-brand p-6">
                  <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center mb-4">
                    <MessageSquare size={18} className="text-brand-green" />
                  </div>
                  <h3 className="font-semibold text-brand-charcoal mb-1">Press & media</h3>
                  <a href="mailto:press@halalads.com" className="text-brand-green text-sm hover:underline">
                    press@halalads.com
                  </a>
                </div>

                <div className="bg-brand-charcoal rounded-2xl p-6 text-white">
                  <p className="text-sm text-white/70 leading-relaxed">
                    Want immediate access? Join our waitlist and get priority onboarding
                    from our team.
                  </p>
                  <Link href="/waitlist" className="btn-secondary text-sm mt-4 w-full justify-center">
                    Join Waitlist <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-2">
                {submitted ? (
                  <div className="bg-white rounded-3xl border border-brand-green/20 p-12 text-center shadow-brand-md h-full flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 size={32} className="text-brand-green" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-brand-charcoal mb-3">
                      Message received!
                    </h3>
                    <p className="text-brand-muted max-w-xs">
                      We&apos;ll get back to you within one business day. JazakAllahu Khayran.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-brand-cream-dark p-8 shadow-brand-md">
                    <h2 className="font-display text-2xl font-bold text-brand-charcoal mb-6">
                      Send us a message
                    </h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Name</label>
                          <input
                            required
                            type="text"
                            value={form.name}
                            onChange={(e) => update("name", e.target.value)}
                            placeholder="Your full name"
                            className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Email</label>
                          <input
                            required
                            type="email"
                            value={form.email}
                            onChange={(e) => update("email", e.target.value)}
                            placeholder="you@company.com"
                            className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Company (optional)</label>
                        <input
                          type="text"
                          value={form.company}
                          onChange={(e) => update("company", e.target.value)}
                          placeholder="Your company or website"
                          className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Reason for contact</label>
                        <select
                          required
                          value={form.reason}
                          onChange={(e) => update("reason", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal"
                        >
                          <option value="" disabled>Select a reason…</option>
                          {contactReasons.map((r) => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Message</label>
                        <textarea
                          required
                          rows={5}
                          value={form.message}
                          onChange={(e) => update("message", e.target.value)}
                          placeholder="Tell us more about what you need…"
                          className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary text-base py-4 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {loading ? (
                          <><Loader2 size={18} className="animate-spin" /> Sending…</>
                        ) : (
                          <>Send Message <ArrowRight size={18} /></>
                        )}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
