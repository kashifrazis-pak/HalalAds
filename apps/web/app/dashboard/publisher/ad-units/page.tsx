import Link from "next/link";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Code2 } from "lucide-react";

const adUnits = [
  { id: "1", name: "Header Leaderboard", size: "728×90", site: "islamicfinancehub.com", impressions: "48,200", rpm: "$2.84", earnings: "$136.90", status: "active", created: "Jan 10, 2025" },
  { id: "2", name: "Sidebar Rectangle", size: "300×250", site: "islamicfinancehub.com", impressions: "31,400", rpm: "$3.12", earnings: "$97.97", status: "active", created: "Jan 10, 2025" },
  { id: "3", name: "Mobile Banner", size: "320×50", site: "halalfoodblog.com", impressions: "12,800", rpm: "$1.95", earnings: "$24.96", status: "pending", created: "Feb 20, 2025" },
];

export default function AdUnitsPage() {
  return (
    <>
      <DashboardHeader title="Ad Units" subtitle="Manage your ad placements and get embed codes" ctaLabel="New Ad Unit" ctaHref="/dashboard/publisher/ad-units/new" />
      <div className="bg-white rounded-2xl border border-brand-cream-dark overflow-hidden shadow-brand-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-brand-cream text-left">
                {["Ad Unit", "Size", "Site", "Impressions", "RPM", "Earnings", "Status", "Created", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-cream-dark">
              {adUnits.map((u) => (
                <tr key={u.id} className="hover:bg-brand-cream/40 transition-colors">
                  <td className="px-5 py-4 font-medium text-brand-charcoal text-sm">{u.name}</td>
                  <td className="px-5 py-4 text-brand-muted text-sm font-mono">{u.size}</td>
                  <td className="px-5 py-4 text-brand-muted text-sm">{u.site}</td>
                  <td className="px-5 py-4 text-brand-muted text-sm">{u.impressions}</td>
                  <td className="px-5 py-4 text-brand-green font-semibold text-sm">{u.rpm}</td>
                  <td className="px-5 py-4 font-semibold text-brand-charcoal text-sm">{u.earnings}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.status === "active" ? "bg-brand-green/10 text-brand-green" : "bg-yellow-50 text-yellow-700"}`}>{u.status}</span>
                  </td>
                  <td className="px-5 py-4 text-brand-muted text-xs">{u.created}</td>
                  <td className="px-5 py-4">
                    <Link href={`/dashboard/publisher/ad-units/${u.id}`} className="inline-flex items-center gap-1 text-brand-green text-xs font-semibold hover:underline">
                      <Code2 size={12} /> Get code
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
