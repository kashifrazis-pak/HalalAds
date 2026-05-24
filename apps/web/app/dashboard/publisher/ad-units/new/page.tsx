"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const AD_SIZES = [
  { id: "728x90", label: "Leaderboard", dims: "728 × 90", best: "Header / footer" },
  { id: "300x250", label: "Medium Rectangle", dims: "300 × 250", best: "Sidebar / in-content" },
  { id: "160x600", label: "Wide Skyscraper", dims: "160 × 600", best: "Sidebar" },
  { id: "320x50", label: "Mobile Banner", dims: "320 × 50", best: "Mobile top / bottom" },
  { id: "336x280", label: "Large Rectangle", dims: "336 × 280", best: "In-content" },
  { id: "300x600", label: "Half Page", dims: "300 × 600", best: "Premium sidebar" },
];

export default function NewAdUnitPage() {
  const [name, setName] = useState("");
  const [site, setSite] = useState("");
  const [size, setSize] = useState("300x250");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const snippet = `<!-- Islamic Ad Network: ${name || "My Ad Unit"} -->
<div
  id="ha-ad-unit"
  data-unit="${createdId ?? "UNIT_ID"}"
  data-size="${size}"
></div>
<script src="//cdn.islamicadnetwork.com/a.js" async></script>`;

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/ad-units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, siteUrl: site, size }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create ad unit");
      setCreatedId(data.id);
      setCreated(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function copySnippet() {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/dashboard/publisher/ad-units" className="inline-flex items-center gap-1.5 text-brand-muted text-sm hover:text-brand-charcoal mb-6 transition-colors">
        <ArrowLeft size={15} /> Back to Ad Units
      </Link>
      <h1 className="font-display text-2xl font-bold text-brand-charcoal mb-8">Create Ad Unit</h1>

      {created ? (
        <div className="bg-white rounded-2xl border border-brand-cream-dark p-8 shadow-brand-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center">
              <Check size={20} className="text-brand-green" />
            </div>
            <div>
              <h2 className="font-display font-bold text-brand-charcoal">Ad unit created!</h2>
              <p className="text-brand-muted text-sm">Paste this snippet before the closing &lt;/body&gt; tag.</p>
            </div>
          </div>

          <div className="bg-brand-charcoal rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
              <span className="text-white/40 text-xs font-mono">embed code</span>
              <button onClick={copySnippet} className="flex items-center gap-1.5 text-xs text-white/60 hover:text-brand-gold transition-colors">
                {copied ? <><Check size={12} className="text-brand-green" /> Copied!</> : <><Copy size={12} /> Copy</>}
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-white/80 overflow-x-auto whitespace-pre-wrap">{snippet}</pre>
          </div>

          <div className="mt-6 flex gap-3">
            <Link href="/dashboard/publisher/ad-units" className="btn-outline flex-1 text-sm text-center">
              View all ad units
            </Link>
            {createdId && (
              <Link href={`/dashboard/publisher/ad-units/${createdId}`} className="btn-primary flex-1 text-sm text-center">
                View ad unit
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-brand-cream-dark p-8 shadow-brand-sm">
          <form onSubmit={handleCreate} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Ad unit name</label>
              <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Header Leaderboard"
                className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted" />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Website URL</label>
              <input required type="url" value={site} onChange={(e) => setSite(e.target.value)} placeholder="https://yoursite.com"
                className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted" />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-3">Ad size</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {AD_SIZES.map((s) => (
                  <button type="button" key={s.id} onClick={() => setSize(s.id)}
                    className={cn("p-3 rounded-xl border-2 text-left transition-all", size === s.id ? "border-brand-green bg-brand-green/5" : "border-brand-cream-dark hover:border-brand-green/40")}>
                    <div className={cn("text-sm font-semibold", size === s.id ? "text-brand-green" : "text-brand-charcoal")}>{s.label}</div>
                    <div className="text-brand-muted text-xs font-mono">{s.dims}</div>
                    <div className="text-brand-muted text-xs mt-0.5">{s.best}</div>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary py-3.5 mt-2 disabled:opacity-70">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Creating…</> : <>Create Ad Unit <Check size={16} /></>}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
