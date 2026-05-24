import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import { DollarSign, TrendingUp, Eye, BarChart2 } from "lucide-react";
import PayoutSetupForm from "./PayoutSetupForm";

const MONTHS = [
  { month: "Mar 2025", impressions: "92,400", rpm: "$2.81", earnings: "$259.83", status: "pending" },
  { month: "Feb 2025", impressions: "78,200", rpm: "$2.74", earnings: "$214.27", status: "paid" },
  { month: "Jan 2025", impressions: "61,500", rpm: "$2.65", earnings: "$162.97", status: "paid" },
];

export default function EarningsPage() {
  return (
    <>
      <DashboardHeader title="Earnings" subtitle="Your revenue and payout history" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="This Month" value="$259.83" change="+21.3%" positive icon={DollarSign} iconColor="gold" />
        <StatCard label="Total Earned" value="$637.07" icon={TrendingUp} />
        <StatCard label="Total Impressions" value="232,100" change="+18.2%" positive icon={Eye} />
        <StatCard label="Avg. RPM" value="$2.74" change="+2.6%" positive icon={BarChart2} />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-brand-cream-dark p-6 shadow-brand-sm">
          <h2 className="font-display font-bold text-brand-charcoal text-lg mb-5">Payout History</h2>
          <div className="divide-y divide-brand-cream-dark">
            {MONTHS.map((m) => (
              <div key={m.month} className="flex items-center justify-between py-4">
                <div>
                  <p className="text-brand-charcoal font-semibold text-sm">{m.month}</p>
                  <p className="text-brand-muted text-xs">{m.impressions} impressions · RPM {m.rpm}</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-brand-charcoal">{m.earnings}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${m.status === "paid" ? "bg-brand-green/10 text-brand-green" : "bg-yellow-50 text-yellow-700"}`}>
                    {m.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-brand-cream-dark">
            <p className="text-brand-muted text-xs">Payouts processed on the 15th of each month. Minimum payout: $25.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-brand-cream-dark p-6 shadow-brand-sm">
          <h2 className="font-display font-bold text-brand-charcoal text-lg mb-5">Payout Settings</h2>
          <PayoutSetupForm />
        </div>
      </div>
    </>
  );
}
