"use client";

import { useState } from "react";
import { CREDIT_PACKAGES } from "@/lib/stripe";
import { cn } from "@/lib/utils";
import { CheckCircle2, CreditCard, ArrowRight, Loader2, Plus } from "lucide-react";

export default function AddCreditsForm() {
  const [selected, setSelected] = useState<string>(CREDIT_PACKAGES[1].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleTopUp() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: selected }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start checkout");
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-brand-cream-dark p-6 shadow-brand-sm">
      <h2 className="font-display font-bold text-brand-charcoal text-lg mb-5 flex items-center gap-2">
        <Plus size={18} className="text-brand-green" /> Add Credits
      </h2>

      <div className="flex flex-col gap-3 mb-6">
        {CREDIT_PACKAGES.map((pkg) => (
          <button
            key={pkg.id}
            onClick={() => setSelected(pkg.id)}
            className={cn(
              "relative flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left",
              selected === pkg.id
                ? "border-brand-green bg-brand-green/5"
                : "border-brand-cream-dark hover:border-brand-green/40"
            )}
          >
            {pkg.popular && (
              <span className="absolute -top-2.5 right-4 badge-gold text-xs">Most Popular</span>
            )}
            <div>
              <span className={cn("font-display text-2xl font-bold", selected === pkg.id ? "text-brand-green" : "text-brand-charcoal")}>
                {pkg.label}
              </span>
              <span className="text-brand-muted text-sm ml-2">{pkg.credits.toLocaleString()} credits</span>
            </div>
            <div className="flex items-center gap-2">
              {"bonus" in pkg && pkg.bonus && (
                <span className="text-brand-gold-dark text-xs font-bold bg-brand-gold/10 px-2 py-1 rounded-full">
                  {pkg.bonus}
                </span>
              )}
              {selected === pkg.id && <CheckCircle2 size={16} className="text-brand-green" />}
            </div>
          </button>
        ))}
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-3 p-3 rounded-xl border border-brand-cream-dark bg-brand-cream">
          <CreditCard size={18} className="text-brand-muted" />
          <span className="text-brand-muted text-sm">Pay securely with card via Stripe</span>
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-sm mb-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}

      <button
        onClick={handleTopUp}
        disabled={loading}
        className="btn-primary w-full py-3.5 disabled:opacity-70 flex items-center justify-center gap-2"
      >
        {loading ? (
          <><Loader2 size={16} className="animate-spin" /> Redirecting to Stripe…</>
        ) : (
          <>Add Credits <ArrowRight size={16} /></>
        )}
      </button>
      <p className="text-brand-muted text-xs text-center mt-3">Secure payment via Stripe. Credits never expire.</p>
    </div>
  );
}
