import { auth } from "@/lib/auth";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import { Eye, DollarSign, BarChart2, Globe, ArrowRight, AlertCircle } from "lucide-react";

const adUnits = [
  { id: "1", name: "Header Leaderboard", size: "728×90", site: "islamicfinancehub.com", impressions: "48,200", rpm: "$2.84", earnings: "$136.90", status: "active" },
  { id: "2", name: "Sidebar Rectangle", size: "300×250", site: "islamicfinancehub.com", impressions: "31,400", rpm: "$3.12", earnings: "$97.97", status: "active" },
  { id: "3", name: "Mobile Banner", size: "320×50", site: "halalfoodblog.com", impressions: "12,800", rpm: "$1.95", earnings: "$24.96", status: "pending" },
];

export default async function PublisherOverviewPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] || "there";

  return (
    <>
      <DashboardHeader
        title={`Assalamu Alaikum, ${firstName}`}
        subtitle="Your publisher earnings overview"
        ctaLabel="New Ad Unit"
        ctaHref="/dashboard/publisher/ad-units/new"
      />

      {/* Onboarding banner */}
      <div className="bg-gradient-to-r from-brand-charcoal to-brand-charcoal-light rounded-2xl p-6 mb-8 flex items-center justify-between gap-6">
        <div>
          <h3 className="font-display text-lg font-bold text-white mb-1">Add your first ad unit</h3>
          <p className="text-white/70 text-sm">Create an ad unit and embed it on your site to start earning.</p>
        </div>
        <Link href="/dashboard/publisher/ad-units/new" className="btn-secondary text-sm whitespace-nowrap">
          Create Ad Unit <ArrowRight size={15} />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Total Impressions" value="92,400" change="+15.2%" positive icon={Eye} />
        <StatCard label="Total Earnings" value="$259.83" change="+18.7%" positive icon={DollarSign} iconColor="gold" />
        <StatCard label="Avg. RPM" value="$2.81" change="+2.4%" positive icon={BarChart2} />
        <StatCard label="Active Sites" value="2" icon={Globe} />
      </div>

      {/* Ad units table */}
      <div className="bg-white rounded-2xl border border-brand-cream-dark overflow-hidden shadow-brand-sm mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-cream-dark">
          <h2 className="font-display font-bold text-brand-charcoal">Ad Units</h2>
          <Link href="/dashboard/publisher/ad-units" className="text-brand-green text-sm font-semibold hover:underline flex items-center gap-1">
            Manage all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-brand-cream text-left">
                {["Ad Unit", "Size", "Site", "Impressions", "RPM", "Earnings", "Status", ""].map((h) => (
                  <th key={h} className="px-6 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-cream-dark">
              {adUnits.map((u) => (
                <tr key={u.id} className="hover:bg-brand-cream/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-brand-charcoal text-sm">{u.name}</td>
                  <td className="px-6 py-4 text-brand-muted text-sm font-mono">{u.size}</td>
                  <td className="px-6 py-4 text-brand-muted text-sm">{u.site}</td>
                  <td className="px-6 py-4 text-brand-muted text-sm">{u.impressions}</td>
                  <td className="px-6 py-4 text-brand-green font-semibold text-sm">{u.rpm}</td>
                  <td className="px-6 py-4 font-semibold text-brand-charcoal text-sm">{u.earnings}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${u.status === "active" ? "bg-brand-green/10 text-brand-green" : "bg-yellow-50 text-yellow-700"}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/publisher/ad-units/${u.id}`} className="text-brand-green text-xs font-semibold hover:underline">
                      Get code →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout notice */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-amber-800 text-sm font-medium">Set up your payout method</p>
          <p className="text-amber-700 text-xs mt-0.5">
            Add a payout method to receive your earnings on the 15th of each month.{" "}
            <Link href="/dashboard/publisher/settings" className="underline font-semibold">Set up now →</Link>
          </p>
        </div>
      </div>
    </>
  );
}
