"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Loader2, Check, AlertCircle } from "lucide-react";

type Method = "paypal" | "wise" | "bank";

const METHODS: { id: Method; label: string }[] = [
  { id: "paypal", label: "PayPal" },
  { id: "wise", label: "Wise" },
  { id: "bank", label: "Bank Transfer" },
];

export default function PayoutSetupForm() {
  const [method, setMethod] = useState<Method>("paypal");
  const [email, setEmail] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [swiftBic, setSwiftBic] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/publisher/payout")
      .then((r) => r.json())
      .then(({ payout }) => {
        if (payout) {
          setMethod(payout.method ?? "paypal");
          setEmail(payout.email ?? "");
          setAccountHolder(payout.account_holder ?? "");
          setAccountNumber(payout.account_number ?? "");
          setSwiftBic(payout.swift_bic ?? "");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/publisher/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          email: method !== "bank" ? email : undefined,
          account_holder: method === "bank" ? accountHolder : undefined,
          account_number: method === "bank" ? accountNumber : undefined,
          swift_bic: method === "bank" ? swiftBic : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save payout settings");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={20} className="animate-spin text-brand-green" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-brand-charcoal mb-2">Payout method</label>
        <div className="flex gap-2">
          {METHODS.map((m) => (
            <button
              type="button"
              key={m.id}
              onClick={() => { setMethod(m.id); setError(""); }}
              className={`flex-1 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                method === m.id
                  ? "border-brand-green bg-brand-green/5 text-brand-green"
                  : "border-brand-cream-dark text-brand-muted hover:border-brand-green/40"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {(method === "paypal" || method === "wise") && (
        <div>
          <label className="block text-sm font-medium text-brand-charcoal mb-1.5">
            {method === "paypal" ? "PayPal" : "Wise"} email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={`your@${method}.com`}
            className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted"
          />
        </div>
      )}

      {method === "bank" && (
        <div className="flex flex-col gap-3">
          <input
            type="text"
            required
            value={accountHolder}
            onChange={(e) => setAccountHolder(e.target.value)}
            placeholder="Account holder name"
            className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted"
          />
          <input
            type="text"
            required
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="IBAN or account number"
            className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted"
          />
          <input
            type="text"
            value={swiftBic}
            onChange={(e) => setSwiftBic(e.target.value)}
            placeholder="BIC / SWIFT code (optional)"
            className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted"
          />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl text-sm">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      <button type="submit" disabled={saving} className="btn-primary py-3 disabled:opacity-70">
        {saving ? (
          <><Loader2 size={15} className="animate-spin" /> Saving…</>
        ) : saved ? (
          <><Check size={15} /> Saved!</>
        ) : (
          <>Save Payout Settings <ArrowRight size={15} /></>
        )}
      </button>
    </form>
  );
}
