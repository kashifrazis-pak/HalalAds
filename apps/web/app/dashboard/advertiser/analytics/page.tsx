import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import { Eye, MousePointerClick, DollarSign, TrendingUp } from "lucide-react";

const topCampaigns = [
  { name: "Ramadan 2025 — Halal Foods", impressions: "48,200", clicks: "1,240", ctr: "2.57%", spend: "$142.50" },
  { name: "Islamic Finance App Install", impressions: "92,100", clicks: "3,100", ctr: "3.36%", spend: "$310.00" },
  { name: "Modest Fashion Spring Launch", impressions: "58,700", clicks: "820", ctr: "1.40%", spend: "$88.00" },
];

const topCountries = [
  { country: "Indonesia", flag: "🇮🇩", impressions: "82,400", pct: "41%" },
  { country: "Malaysia", flag: "🇲🇾", impressions: "44,200", pct: "22%" },
  { country: "United Kingdom", flag: "🇬🇧", impressions: "38,100", pct: "19%" },
  { country: "Pakistan", flag: "🇵🇰", impressions: "23,700", pct: "12%" },
  { country: "United States", flag: "🇺🇸", impressions: "11,600", pct: "6%" },
];

export default function AnalyticsPage() {
  return (
    <>
      <DashboardHeader title="Analytics" subtitle="Performance breakdown across all campaigns" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Total Impressions" value="199,000" change="+12.4%" positive icon={Eye} />
        <StatCard label="Total Clicks" value="5,160" change="+8.1%" positive icon={MousePointerClick} />
        <StatCard label="Total Spend" value="$540.50" change="+22.3%" positive icon={DollarSign} iconColor="gold" />
        <StatCard label="Avg. CTR" value="2.59%" change="+0.3%" positive icon={TrendingUp} />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Top campaigns */}
        <div className="bg-white rounded-2xl border border-brand-cream-dark p-6 shadow-brand-sm">
          <h2 className="font-display font-bold text-brand-charcoal text-lg mb-5">Top Campaigns</h2>
          <div className="flex flex-col gap-3">
            {topCampaigns.map((c, i) => (
              <div key={c.name} className="flex items-center gap-4 p-3 rounded-xl bg-brand-cream">
                <div className="w-7 h-7 rounded-lg bg-brand-green/10 flex items-center justify-center text-xs font-bold text-brand-green flex-shrink-0">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-brand-charcoal text-sm font-medium truncate">{c.name}</p>
                  <p className="text-brand-muted text-xs">{c.impressions} impressions · {c.clicks} clicks</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-brand-green text-sm font-bold">{c.ctr} CTR</p>
                  <p className="text-brand-muted text-xs">{c.spend}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top countries */}
        <div className="bg-white rounded-2xl border border-brand-cream-dark p-6 shadow-brand-sm">
          <h2 className="font-display font-bold text-brand-charcoal text-lg mb-5">Top Countries</h2>
          <div className="flex flex-col gap-3">
            {topCountries.map((c) => (
              <div key={c.country} className="flex items-center gap-3">
                <span className="text-2xl">{c.flag}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-brand-charcoal text-sm font-medium">{c.country}</span>
                    <span className="text-brand-muted text-xs">{c.impressions}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-brand-cream-dark overflow-hidden">
                    <div className="h-full bg-brand-green rounded-full" style={{ width: c.pct }} />
                  </div>
                </div>
                <span className="text-brand-muted text-xs w-8 text-right">{c.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
