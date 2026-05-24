import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import { DollarSign, TrendingUp, Eye, BarChart2 } from "lucide-react";
import PayoutSetupForm from "./PayoutSetupForm";
import PayoutHistory from "./PayoutHistory";

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
          <PayoutHistory />
        </div>

        <div className="bg-white rounded-2xl border border-brand-cream-dark p-6 shadow-brand-sm">
          <h2 className="font-display font-bold text-brand-charcoal text-lg mb-5">Payout Settings</h2>
          <PayoutSetupForm />
        </div>
      </div>
    </>
  );
}
