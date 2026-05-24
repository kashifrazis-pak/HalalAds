import { auth } from "@/lib/auth";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import {
  Eye, MousePointerClick, DollarSign, TrendingUp,
  Megaphone, ArrowRight, Plus, AlertCircle,
} from "lucide-react";

const mockCampaigns = [
  { id: "1", name: "Ramadan 2025 — Halal Foods", status: "active", type: "CPC", spend: "$142.50", impressions: "48,200", clicks: "1,240", ctr: "2.57%" },
  { id: "2", name: "Modest Fashion Spring Launch", status: "active", type: "CPM", spend: "$88.00", impressions: "58,700", clicks: "820", ctr: "1.40%" },
  { id: "3", name: "Islamic Finance App Install", status: "paused", type: "CPA", spend: "$310.00", impressions: "92,100", clicks: "3,100", ctr: "3.36%" },
];

const statusStyles: Record<string, string> = {
  active: "bg-brand-green/10 text-brand-green",
  paused: "bg-yellow-50 text-yellow-700",
  review: "bg-blue-50 text-blue-700",
  ended: "bg-gray-100 text-gray-500",
};

export default async function AdvertiserOverviewPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] || "there";

  return (
    <>
      <DashboardHeader
        title={`Assalamu Alaikum, ${firstName}`}
        subtitle="Here's how your campaigns are performing today."
        ctaLabel="New Campaign"
        ctaHref="/dashboard/advertiser/campaigns/new"
      />

      {/* Onboarding banner — shown when no campaigns exist yet */}
      <div className="bg-gradient-brand rounded-2xl p-6 mb-8 flex items-center justify-between gap-6">
        <div>
          <h3 className="font-display text-lg font-bold text-white mb-1">
            Welcome to HalalAds!
          </h3>
          <p className="text-white/75 text-sm">
            You&apos;re in. Create your first campaign and start reaching Muslim audiences today.
          </p>
        </div>
        <Link href="/dashboard/advertiser/campaigns/new" className="btn-secondary text-sm whitespace-nowrap">
          Create Campaign <ArrowRight size={15} />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Total Impressions" value="199,000" change="+12.4%" positive icon={Eye} />
        <StatCard label="Total Clicks" value="5,160" change="+8.1%" positive icon={MousePointerClick} />
        <StatCard label="Total Spend" value="$540.50" change="+22.3%" positive icon={DollarSign} iconColor="gold" />
        <StatCard label="Avg. CTR" value="2.59%" change="+0.3%" positive icon={TrendingUp} />
      </div>

      {/* Campaigns table */}
      <div className="bg-white rounded-2xl border border-brand-cream-dark overflow-hidden shadow-brand-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-cream-dark">
          <h2 className="font-display font-bold text-brand-charcoal">Active Campaigns</h2>
          <Link href="/dashboard/advertiser/campaigns" className="text-brand-green text-sm font-semibold hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-brand-cream text-left">
                {["Campaign", "Status", "Type", "Impressions", "Clicks", "CTR", "Spend", ""].map((h) => (
                  <th key={h} className="px-6 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-cream-dark">
              {mockCampaigns.map((c) => (
                <tr key={c.id} className="hover:bg-brand-cream/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-brand-charcoal text-sm">{c.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-brand-muted text-sm font-mono">{c.type}</td>
                  <td className="px-6 py-4 text-brand-muted text-sm">{c.impressions}</td>
                  <td className="px-6 py-4 text-brand-muted text-sm">{c.clicks}</td>
                  <td className="px-6 py-4 text-brand-green font-semibold text-sm">{c.ctr}</td>
                  <td className="px-6 py-4 font-semibold text-brand-charcoal text-sm">{c.spend}</td>
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/advertiser/campaigns/${c.id}`} className="text-brand-green text-xs font-semibold hover:underline">
                      Manage →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {mockCampaigns.length === 0 && (
          <div className="py-16 text-center">
            <Megaphone size={32} className="text-brand-muted mx-auto mb-3" />
            <p className="text-brand-muted text-sm">No campaigns yet.</p>
            <Link href="/dashboard/advertiser/campaigns/new" className="btn-primary text-sm mt-4 inline-flex">
              <Plus size={15} /> Create your first campaign
            </Link>
          </div>
        )}
      </div>

      {/* Billing alert */}
      <div className="mt-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-amber-800 text-sm font-medium">Add billing to activate campaigns</p>
          <p className="text-amber-700 text-xs mt-0.5">
            Add credits to start running your campaigns.{" "}
            <Link href="/dashboard/advertiser/billing" className="underline font-semibold">
              Add credits →
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
