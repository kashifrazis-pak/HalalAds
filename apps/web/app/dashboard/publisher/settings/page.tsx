"use client";

import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Save, Loader2, Check } from "lucide-react";

export default function PublisherSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ name: "", site: "", blockCategories: [] as string[], notifyPayout: true });

  const BLOCK_CATEGORIES = ["Dating", "Politics", "Competitor Ads"];
  const update = (f: string, v: unknown) => setForm((p) => ({ ...p, [f]: v }));

  function toggleBlock(cat: string) {
    setForm((p) => ({
      ...p,
      blockCategories: p.blockCategories.includes(cat)
        ? p.blockCategories.filter((c) => c !== cat)
        : [...p.blockCategories, cat],
    }));
  }

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
      <DashboardHeader title="Settings" subtitle="Manage your publisher account" />
      <div className="max-w-xl">
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-brand-cream-dark p-8 shadow-brand-sm flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Display name</label>
            <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name or publisher handle"
              className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Primary website</label>
            <input type="url" value={form.site} onChange={(e) => update("site", e.target.value)} placeholder="https://yoursite.com"
              className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted" />
          </div>
          <div className="border-t border-brand-cream-dark pt-4">
            <p className="text-sm font-medium text-brand-charcoal mb-1">Ad category blocklist</p>
            <p className="text-brand-muted text-xs mb-3">Block specific ad categories from appearing on your site. All haram content is already blocked by default.</p>
            <div className="flex flex-wrap gap-2">
              {BLOCK_CATEGORIES.map((cat) => (
                <button type="button" key={cat} onClick={() => toggleBlock(cat)}
                  className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${form.blockCategories.includes(cat) ? "bg-red-50 border-red-300 text-red-700" : "bg-white border-brand-cream-dark text-brand-muted hover:border-red-300"}`}>
                  {form.blockCategories.includes(cat) ? "✕ " : "+ "}{cat}
                </button>
              ))}
            </div>
          </div>
          <div className="border-t border-brand-cream-dark pt-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.notifyPayout} onChange={(e) => update("notifyPayout", e.target.checked)}
                className="w-4 h-4 rounded border-brand-cream-dark accent-brand-green" />
              <span className="text-sm text-brand-muted">Email me when a payout is processed</span>
            </label>
          </div>
          <button type="submit" disabled={saving} className="btn-primary py-3.5 disabled:opacity-70">
            {saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Settings</>}
          </button>
        </form>
      </div>
    </>
  );
}
