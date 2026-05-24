"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Loader2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Campaign Type", "Creative", "Targeting", "Budget & Schedule", "Review"];

const CAMPAIGN_TYPES = [
  { id: "cpc", label: "CPC", name: "Cost Per Click", desc: "Pay only when someone clicks your ad. Best for traffic and lead generation.", from: "From $0.05/click" },
  { id: "cpm", label: "CPM", name: "Cost Per Mille", desc: "Pay per 1,000 impressions. Best for brand awareness at scale.", from: "From $1.50 CPM" },
  { id: "cpa", label: "CPA", name: "Cost Per Acquisition", desc: "Pay only for conversions. Maximum ROI for performance advertisers.", from: "Custom pricing" },
];

const COUNTRIES = [
  { code: "ID", name: "Indonesia" }, { code: "MY", name: "Malaysia" },
  { code: "PK", name: "Pakistan" }, { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" }, { code: "SA", name: "Saudi Arabia" },
  { code: "AE", name: "UAE" }, { code: "EG", name: "Egypt" },
  { code: "BD", name: "Bangladesh" }, { code: "TR", name: "Turkey" },
];

const INTERESTS = [
  "Islamic Finance", "Halal Food & Beverage", "Modest Fashion",
  "Islamic Education", "Muslim Travel", "Halal Cosmetics",
  "Real Estate", "Healthcare", "Tech & Apps", "Charity & Zakat",
];

const AD_SIZES = [
  { id: "728x90", label: "Leaderboard", dims: "728 × 90" },
  { id: "300x250", label: "Medium Rectangle", dims: "300 × 250" },
  { id: "160x600", label: "Wide Skyscraper", dims: "160 × 600" },
  { id: "320x50", label: "Mobile Banner", dims: "320 × 50" },
];

type FormState = {
  name: string;
  type: string;
  adSize: string;
  destinationUrl: string;
  headline: string;
  description: string;
  countries: string[];
  interests: string[];
  dailyBudget: string;
  totalBudget: string;
  bidAmount: string;
  startDate: string;
  endDate: string;
};

export default function NewCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "", type: "", adSize: "300x250", destinationUrl: "",
    headline: "", description: "", countries: [], interests: [],
    dailyBudget: "", totalBudget: "", bidAmount: "", startDate: "", endDate: "",
  });

  function update(field: keyof FormState, value: string | string[]) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  function toggleList(field: "countries" | "interests", val: string) {
    setForm((p) => ({
      ...p,
      [field]: p[field].includes(val) ? p[field].filter((v) => v !== val) : [...p[field], val],
    }));
  }

  function canAdvance() {
    if (step === 0) return !!form.name && !!form.type;
    if (step === 1) return !!form.destinationUrl && !!form.headline;
    if (step === 2) return form.countries.length > 0;
    if (step === 3) return !!form.dailyBudget && !!form.totalBudget;
    return true;
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create campaign");
      router.push(`/dashboard/advertiser/campaigns/${data.id}?created=1`);
    } catch (e) {
      console.error(e);
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back */}
      <Link href="/dashboard/advertiser/campaigns" className="inline-flex items-center gap-1.5 text-brand-muted text-sm hover:text-brand-charcoal mb-6 transition-colors">
        <ArrowLeft size={15} /> Back to Campaigns
      </Link>

      <h1 className="font-display text-2xl font-bold text-brand-charcoal mb-8">Create New Campaign</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-10">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                i < step ? "bg-brand-green text-white" :
                i === step ? "bg-brand-green text-white ring-4 ring-brand-green/20" :
                "bg-brand-cream-dark text-brand-muted"
              )}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={cn("text-xs whitespace-nowrap hidden sm:block", i === step ? "text-brand-green font-semibold" : "text-brand-muted")}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("flex-1 h-0.5 mx-2 mb-5", i < step ? "bg-brand-green" : "bg-brand-cream-dark")} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl border border-brand-cream-dark p-8 shadow-brand-sm">

        {/* Step 0: Campaign Type */}
        {step === 0 && (
          <div>
            <h2 className="font-display text-xl font-bold text-brand-charcoal mb-1">Campaign details</h2>
            <p className="text-brand-muted text-sm mb-6">Give your campaign a name and choose how you want to pay.</p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Campaign name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Ramadan 2025 — Halal Foods"
                className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted"
              />
            </div>
            <label className="block text-sm font-medium text-brand-charcoal mb-3">Campaign type</label>
            <div className="grid gap-3">
              {CAMPAIGN_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => update("type", t.id)}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all",
                    form.type === t.id ? "border-brand-green bg-brand-green/5" : "border-brand-cream-dark hover:border-brand-green/40"
                  )}
                >
                  <div className={cn("px-2.5 py-1 rounded-lg text-xs font-bold mt-0.5", form.type === t.id ? "bg-brand-green text-white" : "bg-brand-cream text-brand-muted")}>
                    {t.label}
                  </div>
                  <div>
                    <div className="font-semibold text-brand-charcoal text-sm">{t.name}</div>
                    <div className="text-brand-muted text-xs mt-0.5">{t.desc}</div>
                    <div className={cn("text-xs font-semibold mt-1.5", form.type === t.id ? "text-brand-green" : "text-brand-muted")}>{t.from}</div>
                  </div>
                  {form.type === t.id && <Check size={16} className="text-brand-green ml-auto flex-shrink-0 mt-1" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Creative */}
        {step === 1 && (
          <div>
            <h2 className="font-display text-xl font-bold text-brand-charcoal mb-1">Ad creative</h2>
            <p className="text-brand-muted text-sm mb-6">Upload your banner and set the destination URL.</p>

            <div className="mb-5">
              <label className="block text-sm font-medium text-brand-charcoal mb-2">Ad size</label>
              <div className="grid grid-cols-2 gap-2">
                {AD_SIZES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => update("adSize", s.id)}
                    className={cn("p-3 rounded-xl border-2 text-left transition-all", form.adSize === s.id ? "border-brand-green bg-brand-green/5" : "border-brand-cream-dark hover:border-brand-green/40")}
                  >
                    <div className={cn("text-sm font-semibold", form.adSize === s.id ? "text-brand-green" : "text-brand-charcoal")}>{s.label}</div>
                    <div className="text-brand-muted text-xs font-mono">{s.dims}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-brand-charcoal mb-2">Upload banner</label>
              <div className="border-2 border-dashed border-brand-cream-dark rounded-xl p-8 text-center hover:border-brand-green/40 transition-colors cursor-pointer bg-brand-cream">
                <Upload size={24} className="text-brand-muted mx-auto mb-2" />
                <p className="text-brand-muted text-sm">Drop your image here or <span className="text-brand-green font-semibold">browse</span></p>
                <p className="text-brand-muted text-xs mt-1">PNG, JPG, GIF up to 200KB · Halal content only</p>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Headline <span className="text-brand-muted font-normal">(for native ads)</span></label>
              <input type="text" value={form.headline} onChange={(e) => update("headline", e.target.value)} placeholder="e.g. Discover Halal Finance Solutions" maxLength={60}
                className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted" />
              <p className="text-brand-muted text-xs mt-1">{form.headline.length}/60 characters</p>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Description</label>
              <textarea rows={2} value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Short description of your product or service" maxLength={120}
                className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted resize-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Destination URL</label>
              <input type="url" value={form.destinationUrl} onChange={(e) => update("destinationUrl", e.target.value)} placeholder="https://yourwebsite.com/landing-page"
                className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted" />
            </div>
          </div>
        )}

        {/* Step 2: Targeting */}
        {step === 2 && (
          <div>
            <h2 className="font-display text-xl font-bold text-brand-charcoal mb-1">Targeting</h2>
            <p className="text-brand-muted text-sm mb-6">Choose the countries and interests you want to reach.</p>

            <div className="mb-7">
              <label className="block text-sm font-medium text-brand-charcoal mb-3">
                Countries <span className="text-brand-muted font-normal">({form.countries.length} selected)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {COUNTRIES.map((c) => (
                  <button key={c.code} onClick={() => toggleList("countries", c.code)}
                    className={cn("px-3 py-1.5 rounded-full text-sm font-medium border transition-all", form.countries.includes(c.code) ? "bg-brand-green text-white border-brand-green" : "bg-white border-brand-cream-dark text-brand-muted hover:border-brand-green/50")}>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-3">
                Interest categories <span className="text-brand-muted font-normal">({form.interests.length} selected)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <button key={interest} onClick={() => toggleList("interests", interest)}
                    className={cn("px-3 py-1.5 rounded-full text-sm font-medium border transition-all", form.interests.includes(interest) ? "bg-brand-gold text-brand-charcoal border-brand-gold" : "bg-white border-brand-cream-dark text-brand-muted hover:border-brand-gold/50")}>
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Budget */}
        {step === 3 && (
          <div>
            <h2 className="font-display text-xl font-bold text-brand-charcoal mb-1">Budget & Schedule</h2>
            <p className="text-brand-muted text-sm mb-6">Set how much you want to spend and when.</p>

            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Daily budget (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted font-medium">$</span>
                  <input type="number" min="5" value={form.dailyBudget} onChange={(e) => update("dailyBudget", e.target.value)} placeholder="50"
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Total budget (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted font-medium">$</span>
                  <input type="number" min="50" value={form.totalBudget} onChange={(e) => update("totalBudget", e.target.value)} placeholder="500"
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted" />
                </div>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-brand-charcoal mb-1.5">
                {form.type === "cpc" ? "Max CPC bid (USD)" : form.type === "cpm" ? "Max CPM bid (USD)" : "Target CPA (USD)"}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted font-medium">$</span>
                <input type="number" min="0.01" step="0.01" value={form.bidAmount} onChange={(e) => update("bidAmount", e.target.value)} placeholder={form.type === "cpm" ? "1.50" : "0.05"}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Start date</label>
                <input type="date" value={form.startDate} onChange={(e) => update("startDate", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1.5">End date <span className="text-brand-muted font-normal">(optional)</span></label>
                <input type="date" value={form.endDate} onChange={(e) => update("endDate", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal" />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div>
            <h2 className="font-display text-xl font-bold text-brand-charcoal mb-1">Review & submit</h2>
            <p className="text-brand-muted text-sm mb-6">Our team will review your campaign for Halal compliance within 4 hours.</p>

            <div className="space-y-4">
              {[
                { label: "Campaign name", value: form.name },
                { label: "Type", value: form.type.toUpperCase() },
                { label: "Ad size", value: form.adSize },
                { label: "Destination URL", value: form.destinationUrl },
                { label: "Countries", value: form.countries.join(", ") || "—" },
                { label: "Interests", value: form.interests.join(", ") || "—" },
                { label: "Daily budget", value: form.dailyBudget ? `$${form.dailyBudget}` : "—" },
                { label: "Total budget", value: form.totalBudget ? `$${form.totalBudget}` : "—" },
                { label: "Start date", value: form.startDate || "Immediately" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between py-3 border-b border-brand-cream-dark last:border-0">
                  <span className="text-brand-muted text-sm">{label}</span>
                  <span className="text-brand-charcoal text-sm font-medium text-right max-w-[60%] truncate">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-brand-green/5 border border-brand-green/20 rounded-xl p-4 text-sm text-brand-green">
              Your campaign will be reviewed for Halal compliance and go live within 4 hours of approval.
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-brand-cream-dark bg-white text-sm font-medium text-brand-muted hover:text-brand-charcoal disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft size={15} /> Previous
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance()}
            className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Continue <ArrowRight size={15} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary text-sm disabled:opacity-70"
          >
            {submitting ? <><Loader2 size={15} className="animate-spin" /> Submitting…</> : <>Submit for Review <Check size={15} /></>}
          </button>
        )}
      </div>
    </div>
  );
}
