"use client";

import { useState, useEffect } from "react";
import { Loader2, ReceiptText } from "lucide-react";

interface Payout {
  id: string;
  amount_cents: number;
  currency: string;
  method: string;
  status: "pending" | "processing" | "paid" | "failed";
  period_start: string | null;
  period_end: string | null;
  failure_reason: string | null;
  created_at: string;
}

const STATUS_STYLES: Record<string, string> = {
  paid:       "bg-brand-green/10 text-brand-green",
  processing: "bg-blue-50 text-blue-700",
  pending:    "bg-yellow-50 text-yellow-700",
  failed:     "bg-red-50 text-red-700",
};

function formatAmount(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

function formatPeriod(start: string | null, end: string | null) {
  if (!start && !end) return null;
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  if (start && end) return `${fmt(start)} – ${fmt(end)}`;
  return fmt(start ?? end ?? "");
}

export default function PayoutHistory() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/publisher/payouts")
      .then((r) => r.json())
      .then(({ payouts }) => setPayouts(payouts ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 size={20} className="animate-spin text-brand-green" />
      </div>
    );
  }

  if (payouts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <ReceiptText size={32} className="text-brand-muted mb-3 opacity-40" />
        <p className="text-brand-muted text-sm">No payouts yet.</p>
        <p className="text-brand-muted text-xs mt-1">Payouts are processed on the 15th of each month. Minimum: $25.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-brand-cream-dark">
      {payouts.map((p) => {
        const period = formatPeriod(p.period_start, p.period_end);
        const date = new Date(p.created_at).toLocaleDateString("en-US", {
          day: "numeric", month: "short", year: "numeric",
        });
        return (
          <div key={p.id} className="flex items-center justify-between py-4">
            <div>
              <p className="text-brand-charcoal font-semibold text-sm">{period ?? date}</p>
              <p className="text-brand-muted text-xs capitalize">
                {p.method}{period ? ` · ${date}` : ""}
                {p.status === "failed" && p.failure_reason && (
                  <span className="text-red-500 ml-1">— {p.failure_reason}</span>
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="font-display font-bold text-brand-charcoal">
                {formatAmount(p.amount_cents, p.currency)}
              </p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[p.status] ?? ""}`}>
                {p.status}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
