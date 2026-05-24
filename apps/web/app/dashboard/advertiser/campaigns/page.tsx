import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Search, Filter } from "lucide-react";

const campaigns = [
  { id: "1", name: "Ramadan 2025 — Halal Foods", status: "active", type: "CPC", budget: "$500", spend: "$142.50", impressions: "48,200", clicks: "1,240", ctr: "2.57%", created: "Jan 15, 2025" },
  { id: "2", name: "Modest Fashion Spring Launch", status: "active", type: "CPM", budget: "$300", spend: "$88.00", impressions: "58,700", clicks: "820", ctr: "1.40%", created: "Feb 1, 2025" },
  { id: "3", name: "Islamic Finance App Install", status: "paused", type: "CPA", budget: "$1,000", spend: "$310.00", impressions: "92,100", clicks: "3,100", ctr: "3.36%", created: "Jan 28, 2025" },
  { id: "4", name: "Halal Travel — Umrah Packages", status: "review", type: "CPC", budget: "$200", spend: "$0", impressions: "—", clicks: "—", ctr: "—", created: "Mar 2, 2025" },
];

const statusStyles: Record<string, string> = {
  active: "bg-brand-green/10 text-brand-green",
  paused: "bg-yellow-50 text-yellow-700",
  review: "bg-blue-50 text-blue-700",
  ended: "bg-gray-100 text-gray-500",
};

export default function CampaignsPage() {
  return (
    <>
      <DashboardHeader
        title="Campaigns"
        subtitle="Manage all your advertising campaigns"
        ctaLabel="New Campaign"
        ctaHref="/dashboard/advertiser/campaigns/new"
      />

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            placeholder="Search campaigns…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-brand-cream-dark bg-white text-sm text-brand-charcoal placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-cream-dark bg-white text-sm font-medium text-brand-muted hover:text-brand-charcoal transition-colors">
          <Filter size={14} /> Filter
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-brand-cream-dark overflow-hidden shadow-brand-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-brand-cream text-left">
                {["Campaign", "Status", "Type", "Budget", "Spend", "Impressions", "Clicks", "CTR", "Created", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-cream-dark">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-brand-cream/40 transition-colors">
                  <td className="px-5 py-4 font-medium text-brand-charcoal text-sm max-w-[200px] truncate">{c.name}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[c.status]}`}>{c.status}</span>
                  </td>
                  <td className="px-5 py-4 text-brand-muted text-sm font-mono">{c.type}</td>
                  <td className="px-5 py-4 text-brand-muted text-sm">{c.budget}</td>
                  <td className="px-5 py-4 text-brand-charcoal font-semibold text-sm">{c.spend}</td>
                  <td className="px-5 py-4 text-brand-muted text-sm">{c.impressions}</td>
                  <td className="px-5 py-4 text-brand-muted text-sm">{c.clicks}</td>
                  <td className="px-5 py-4 text-brand-green font-semibold text-sm">{c.ctr}</td>
                  <td className="px-5 py-4 text-brand-muted text-xs">{c.created}</td>
                  <td className="px-5 py-4">
                    <Link href={`/dashboard/advertiser/campaigns/${c.id}`} className="text-brand-green text-xs font-semibold hover:underline whitespace-nowrap">
                      Manage →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
