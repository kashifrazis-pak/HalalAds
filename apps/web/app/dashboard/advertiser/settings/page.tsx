"use client";

import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Save, Loader2, Check } from "lucide-react";

export default function AdvertiserSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ companyName: "", website: "", industry: "", notifyEmail: true, notifyLowBalance: true });

  const update = (f: string, v: string | boolean) => setForm((p) => ({ ...p, [f]: v }));

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
      <DashboardHeader title="Settings" subtitle="Manage your advertiser account" />
      <div className="max-w-xl">
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-brand-cream-dark p-8 shadow-brand-sm flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Company name</label>
            <input type="text" value={form.companyName} onChange={(e) => update("companyName", e.target.value)} placeholder="Your company"
              className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Website</label>
            <input type="url" value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="https://yourcompany.com"
              className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal placeholder:text-brand-muted" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-1.5">Industry</label>
            <select value={form.industry} onChange={(e) => update("industry", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-brand-cream-dark bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green text-brand-charcoal">
              <option value="">Select industry…</option>
              {["Islamic Finance", "Halal Food & Beverage", "Modest Fashion", "Islamic Education", "Muslim Travel", "Halal Cosmetics", "Real Estate", "Healthcare", "Tech & Apps"].map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>
          <div className="border-t border-brand-cream-dark pt-4">
            <p className="text-sm font-medium text-brand-charcoal mb-3">Notifications</p>
            {[
              { key: "notifyEmail", label: "Campaign performance reports (weekly)" },
              { key: "notifyLowBalance", label: "Low balance alerts (below $20)" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 mb-2.5 cursor-pointer">
                <input type="checkbox" checked={form[key as keyof typeof form] as boolean} onChange={(e) => update(key, e.target.checked)}
                  className="w-4 h-4 rounded border-brand-cream-dark text-brand-green focus:ring-brand-green/30 accent-brand-green" />
                <span className="text-sm text-brand-muted">{label}</span>
              </label>
            ))}
          </div>
          <button type="submit" disabled={saving} className="btn-primary py-3.5 disabled:opacity-70">
            {saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Settings</>}
          </button>
        </form>
      </div>
    </>
  );
}
