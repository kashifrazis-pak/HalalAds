"use client";

import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { CreditCard, Plus, ArrowRight, CheckCircle2, Loader2, History } from "lucide-react";
import { cn } from "@/lib/utils";

const PACKAGES = [
  { id: "credits_50", label: "$50", credits: "5,000 credits", bonus: null, popular: false },
  { id: "credits_200", label: "$200", credits: "22,000 credits", bonus: "+10% bonus", popular: true },
  { id: "credits_500", label: "$500", credits: "60,000 credits", bonus: "+20% bonus", popular: false },
];

const TRANSACTIONS = [
  { date: "Mar 1, 2025", desc: "Campaign: Ramadan 2025", amount: "-$45.00", type: "debit" },
  { date: "Feb 28, 2025", desc: "Credit top-up", amount: "+$200.00", type: "credit" },
  { date: "Feb 15, 2025", desc: "Campaign: Modest Fashion", amount: "-$88.00", type: "debit" },
  { date: "Feb 1, 2025", desc: "Credit top-up", amount: "+$500.00", type: "credit" },
];

export default function BillingPage() {
  const [selected, setSelected] = useState("credits_200");
  const [loading, setLoading] = useState(false);

  async function handleTopUp() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
  }

  return (
    <>
      <DashboardHeader title="Billing & Credits" subtitle="Manage your ad credits and payment history" />

      {/* Balance card */}
      <div className="bg-gradient-brand rounded-2xl p-6 mb-8 flex items-center justify-between">
        <div>
          <p className="text-white/60 text-sm mb-1">Available balance</p>
          <p className="font-display text-4xl font-bold text-white">$567.50</p>
          <p className="text-white/60 text-xs mt-1">≈ 56,750 credits remaining</p>
        </div>
        <div className="text-right">
          <p className="text-white/60 text-sm mb-1">Total spent</p>
          <p className="font-display text-2xl font-bold text-brand-gold">$540.50</p>
          <p className="text-white/60 text-xs mt-1">This month</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Top-up */}
        <div className="bg-white rounded-2xl border border-brand-cream-dark p-6 shadow-brand-sm">
          <h2 className="font-display font-bold text-brand-charcoal text-lg mb-5 flex items-center gap-2">
            <Plus size={18} className="text-brand-green" /> Add Credits
          </h2>

          <div className="flex flex-col gap-3 mb-6">
            {PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelected(pkg.id)}
                className={cn(
                  "relative flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left",
                  selected === pkg.id ? "border-brand-green bg-brand-green/5" : "border-brand-cream-dark hover:border-brand-green/40"
                )}
              >
                {pkg.popular && (
                  <span className="absolute -top-2.5 right-4 badge-gold text-xs">Most Popular</span>
                )}
                <div>
                  <span className={cn("font-display text-2xl font-bold", selected === pkg.id ? "text-brand-green" : "text-brand-charcoal")}>{pkg.label}</span>
                  <span className="text-brand-muted text-sm ml-2">{pkg.credits}</span>
                </div>
                {pkg.bonus && (
                  <span className="text-brand-gold-dark text-xs font-bold bg-brand-gold/10 px-2 py-1 rounded-full">{pkg.bonus}</span>
                )}
                {selected === pkg.id && <CheckCircle2 size={16} className="text-brand-green ml-2" />}
              </button>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-brand-charcoal mb-2">Payment method</label>
            <div className="flex items-center gap-3 p-3 rounded-xl border border-brand-cream-dark bg-brand-cream">
              <CreditCard size={18} className="text-brand-muted" />
              <span className="text-brand-muted text-sm">Add a credit or debit card</span>
              <ArrowRight size={14} className="text-brand-muted ml-auto" />
            </div>
          </div>

          <button
            onClick={handleTopUp}
            disabled={loading}
            className="btn-primary w-full py-3.5 disabled:opacity-70"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Processing…</> : <>Add Credits <ArrowRight size={16} /></>}
          </button>
          <p className="text-brand-muted text-xs text-center mt-3">Secure payment via Stripe. Credits never expire.</p>
        </div>

        {/* Transaction history */}
        <div className="bg-white rounded-2xl border border-brand-cream-dark p-6 shadow-brand-sm">
          <h2 className="font-display font-bold text-brand-charcoal text-lg mb-5 flex items-center gap-2">
            <History size={18} className="text-brand-green" /> Transaction History
          </h2>
          <div className="divide-y divide-brand-cream-dark">
            {TRANSACTIONS.map((t, i) => (
              <div key={i} className="flex items-center justify-between py-3.5">
                <div>
                  <p className="text-brand-charcoal text-sm font-medium">{t.desc}</p>
                  <p className="text-brand-muted text-xs">{t.date}</p>
                </div>
                <span className={cn("font-semibold text-sm", t.type === "credit" ? "text-brand-green" : "text-brand-charcoal")}>
                  {t.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
