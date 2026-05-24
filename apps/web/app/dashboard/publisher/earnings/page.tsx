"use client";

import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import { DollarSign, TrendingUp, Eye, BarChart2, ArrowRight, Loader2, Check } from "lucide-react";

const MONTHS = [
  { month: "Mar 2025", impressions: "92,400", rpm: "$2.81", earnings: "$259.83", status: "pending" },
  { month: "Feb 2025", impressions: "78,200", rpm: "$2.74", earnings: "$214.27", status: "paid" },
  { month: "Jan 2025", impressions: "61,500", rpm: "$2.65", earnings: "$162.97", status: "paid" },
];

const PAYOUT_METHODS = ["Bank Transfer", "PayPal", "Wise"];

export default function EarningsPage() {
  const [payoutMethod, setPayoutMethod] = useState("PayPal");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <>
      <DashboardHeader title="Earnings" subtitle="Your revenue and payout history" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="This Month" value="$259.83" change="+21.3%" positive icon={DollarSign} iconColor="gold" />
        <StatCard label="Total Earned" value="$637.07" icon={TrendingUp} />
        <StatCard label="Total Impressions" value="232,100" change="+18.2%" positive icon={Eye} />
        <StatCard label="Avg. RPM" value="$2.74" change="+2.6%" positive icon={BarChart2} />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Payout history */}
        <div className="bg-white rounded-2xl border border-brand-cream-dark p-6 shadow-brand-sm">
          <h2 className="font-display font-bold text-brand-charcoal text-lg mb-5">Payout History</h2>
          <div className="divide-y divide-brand-cream-dark">
            {MONTHS.map((m) => (
              <div key={m.month} className="flex items-center justify-between py-4">
                <div>
                  <p className="text-brand-charcoal font-semibold text-sm">{m.month}</p>
                  <p className="text-brand-muted text-xs">{m.impressions} impressions · RPM {m.rpm}</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-brand-charcoal">{m.earnings}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${m.status === "paid" ? "bg-brand-green/10 text-brand-green" : "bg-yellow-50 text-yellow-700"}`}>
                    {m.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-brand-cream-dark">
            <p className="text-brand-muted text-xs">Payouts processed on the 15th of each month. Minimum payout: $25.</p>
          </div>
        </div>

        {/* Payout setup */}
        <div className="bg-white rounded-2xl border border-brand-cream-dark p-6 shadow-brand-sm">
          <h2 className="font-display font-bold text-brand-charcoal text-lg mb-5">Payout Settings</h2>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-2">Payout method</label>
              <div className="flex gap-2">
                {PAYOUT_METHODS.map((m) => (
                  <button type="button" key={m} onClick={() => setPayoutMethod(m)}
                    className={`flex-1 py-2 rounded-xl border-2 text-sm font-medium transition-all ${payoutMethod === m ? "border-brand-green bg-brand-green/5 text-brand-green" : "border-brand-cream-dark text-brand-muted hover:border-brand-green/40"}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            {payoutMethod === "PayPal" && (
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1.5">PayPal email</label>
                <input type="email" placeholder="your@paypal.com"
                  className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted" />
              </div>
            )}
            {payoutMethod === "Wise" && (
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Wise email</label>
                <input type="email" placeholder="your@wise.com"
                  className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted" />
              </div>
            )}
            {payoutMethod === "Bank Transfer" && (
              <div className="flex flex-col gap-3">
                <input type="text" placeholder="Account holder name"
                  className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted" />
                <input type="text" placeholder="IBAN or account number"
                  className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted" />
                <input type="text" placeholder="BIC / SWIFT code"
                  className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted" />
              </div>
            )}
            <button type="submit" disabled={saving} className="btn-primary py-3 disabled:opacity-70">
              {saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : saved ? <><Check size={15} /> Saved!</> : <>Save Payout Settings <ArrowRight size={15} /></>}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
