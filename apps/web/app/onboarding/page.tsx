"use client";

import { useState } from "react";
import Link from "next/link";
import { BarChart3, Globe, Loader2, CheckCircle2 } from "lucide-react";

const roles = [
  {
    id: "advertiser",
    icon: BarChart3,
    title: "I want to Advertise",
    description:
      "Run halal-certified campaigns across 1.8 billion Muslims. CPC, CPM, and CPA campaigns with precise geo and interest targeting.",
    features: ["Campaign management dashboard", "Real-time analytics", "Fraud protection", "Multiple ad formats"],
    cta: "Start as Advertiser",
    gradient: "from-brand-green/10 to-brand-green/5",
    border: "border-brand-green/30",
    selectedBorder: "border-brand-green",
    selectedBg: "bg-brand-green/5",
    iconColor: "text-brand-green",
    iconBg: "bg-brand-green/10",
  },
  {
    id: "publisher",
    icon: Globe,
    title: "I want to Monetize",
    description:
      "Earn from your Muslim audience. Publisher-first 70/30 revenue share with 100% halal ad inventory guaranteed.",
    features: ["70% revenue share", "Simple JS snippet", "Earnings dashboard", "Weekly payouts"],
    cta: "Start as Publisher",
    gradient: "from-brand-gold/10 to-brand-gold/5",
    border: "border-brand-gold/30",
    selectedBorder: "border-brand-gold",
    selectedBg: "bg-brand-gold/5",
    iconColor: "text-brand-gold",
    iconBg: "bg-brand-gold/10",
  },
];

export default function OnboardingPage() {
  const [selected, setSelected] = useState<"advertiser" | "publisher" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleContinue() {
    if (!selected) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selected }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      // Hard navigate so the dashboard server component re-runs with the new profile
      window.location.href = selected === "advertiser" ? "/dashboard/advertiser" : "/dashboard/publisher";
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center px-4 py-16">
      <Link href="/" className="flex items-center gap-2.5 justify-center mb-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
            <path d="M10 2C8.5 2 7.1 2.4 5.9 3.1C8.7 4.2 10.7 6.9 10.7 10C10.7 13.1 8.7 15.8 5.9 16.9C7.1 17.6 8.5 18 10 18C14.4 18 18 14.4 18 10C18 5.6 14.4 2 10 2Z" fill="#C9A84C" />
          </svg>
        </div>
        <span className="font-display font-bold text-2xl text-brand-charcoal">
          Islamic<span className="text-brand-gold">AdNetwork</span>
        </span>
      </Link>

      <div className="w-full max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-brand-charcoal mb-3">
            How will you use Islamic Ad Network?
          </h1>
          <p className="text-brand-muted">Choose your account type to get started. You can always add the other later.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selected === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelected(role.id as "advertiser" | "publisher")}
                className={`text-left rounded-2xl border-2 p-6 transition-all bg-gradient-to-br ${role.gradient} ${isSelected ? `${role.selectedBorder} ${role.selectedBg} shadow-brand-md` : `${role.border} bg-white hover:shadow-brand`}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${role.iconBg} flex items-center justify-center`}>
                    <Icon size={24} className={role.iconColor} />
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? `${role.selectedBorder} bg-brand-green` : "border-brand-cream-dark bg-white"}`}>
                    {isSelected && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                </div>
                <h3 className="font-display text-xl font-bold text-brand-charcoal mb-2">{role.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed mb-4">{role.description}</p>
                <ul className="space-y-1.5">
                  {role.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-brand-muted">
                      <span className={`w-1.5 h-1.5 rounded-full ${role.iconColor.replace("text-", "bg-")} flex-shrink-0`} />
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <button
          onClick={handleContinue}
          disabled={!selected || loading}
          className="btn-primary w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 size={18} className="animate-spin" /> Setting up your account…</>
          ) : (
            selected
              ? roles.find((r) => r.id === selected)?.cta ?? "Continue"
              : "Select an account type to continue"
          )}
        </button>
      </div>
    </div>
  );
}
