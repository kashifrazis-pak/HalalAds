/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import { Eye, DollarSign, BarChart2, Globe, ArrowRight, AlertCircle, Plus } from "lucide-react";

function fmt(n: number) {
  return n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `${(n / 1_000).toFixed(1)}K`
    : String(n);
}

function fmtUsd(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function PublisherOverviewPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/auth/signin");

  const db = createServiceClient() as any;

  const { data: userRow } = await db.from("users").select("id").eq("email", session.user.email).maybeSingle();

  // Publisher profile
  const { data: publisher } = await db
    .from("publishers")
    .select("id, site_url, site_name, verified, revenue_share")
    .eq("user_id", userRow?.id ?? "")
    .single();

  if (!publisher) redirect("/onboarding");

  // Ad units
  const { data: adUnits = [] } = await db
    .from("ad_units")
    .select("id, name, size, placement")
    .eq("publisher_id", publisher.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // Impression counts per ad unit (will be 0 until ad serving is live)
  const adUnitIds = (adUnits as any[]).map((u: any) => u.id);
  const { count: totalImpressions = 0 } = await db
    .from("impressions")
    .select("id", { count: "exact", head: true })
    .in("ad_unit_id", adUnitIds.length ? adUnitIds : ["00000000-0000-0000-0000-000000000000"]);

  // Earnings estimate: impressions × $2.50 RPM × publisher revenue share
  const revenueShare = (publisher.revenue_share ?? 70) / 100;
  const RPM_CENTS = 250; // $2.50 default RPM in cents
  const estimatedEarningsCents = Math.floor(((totalImpressions ?? 0) / 1000) * RPM_CENTS * revenueShare);

  const firstName = session.user.name?.split(" ")[0] || session.user.email?.split("@")[0] || "there";
  const hasNoUnits = (adUnits as any[]).length === 0;

  return (
    <>
      <DashboardHeader
        title={`Assalamu Alaikum, ${firstName}`}
        subtitle="Your publisher earnings overview"
        ctaLabel="New Ad Unit"
        ctaHref="/dashboard/publisher/ad-units/new"
      />

      {hasNoUnits && (
        <div className="bg-gradient-to-r from-brand-charcoal to-[#2a2a4a] rounded-2xl p-6 mb-8 flex items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-lg font-bold text-white mb-1">Add your first ad unit</h3>
            <p className="text-white/70 text-sm">Create an ad unit and embed it on your site to start earning.</p>
          </div>
          <Link href="/dashboard/publisher/ad-units/new" className="btn-secondary text-sm whitespace-nowrap">
            Create Ad Unit <ArrowRight size={15} />
          </Link>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Total Impressions" value={fmt(totalImpressions ?? 0)} icon={Eye} />
        <StatCard label="Est. Earnings" value={fmtUsd(estimatedEarningsCents)} icon={DollarSign} iconColor="gold" />
        <StatCard label="Revenue Share" value={`${publisher.revenue_share ?? 70}%`} icon={BarChart2} />
        <StatCard label="Ad Units" value={String((adUnits as any[]).length)} icon={Globe} />
      </div>

      <div className="bg-white rounded-2xl border border-brand-cream-dark overflow-hidden shadow-brand-sm mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-cream-dark">
          <h2 className="font-display font-bold text-brand-charcoal">Ad Units</h2>
          <Link href="/dashboard/publisher/ad-units" className="text-brand-green text-sm font-semibold hover:underline flex items-center gap-1">
            Manage all <ArrowRight size={14} />
          </Link>
        </div>

        {hasNoUnits ? (
          <div className="py-16 text-center">
            <Globe size={32} className="text-brand-muted mx-auto mb-3" />
            <p className="text-brand-muted text-sm">No ad units yet.</p>
            <Link href="/dashboard/publisher/ad-units/new" className="btn-primary text-sm mt-4 inline-flex items-center gap-2">
              <Plus size={15} /> Create your first ad unit
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-brand-cream text-left">
                  {["Ad Unit", "Size", "Placement", ""].map((h) => (
                    <th key={h} className="px-6 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream-dark">
                {(adUnits as any[]).map((u) => (
                  <tr key={u.id} className="hover:bg-brand-cream/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-brand-charcoal text-sm">{u.name || `Ad Unit #${u.id.slice(0, 8)}`}</td>
                    <td className="px-6 py-4 text-brand-muted text-sm font-mono">{u.size}</td>
                    <td className="px-6 py-4 text-brand-muted text-sm capitalize">{u.placement?.replace("_", " ") || "—"}</td>
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
        )}
      </div>

      {!publisher.verified && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-800 text-sm font-medium">Your site is pending verification</p>
            <p className="text-amber-700 text-xs mt-0.5">
              Our team reviews publisher sites for halal compliance. You&apos;ll be notified once approved.{" "}
              <Link href="/dashboard/publisher/settings" className="underline font-semibold">Add your site details →</Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
