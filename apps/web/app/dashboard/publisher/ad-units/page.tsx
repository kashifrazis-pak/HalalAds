/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Code2, Globe, Plus } from "lucide-react";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function AdUnitsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/auth/signin");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any;

  const { data: userRow } = await db.from("users").select("id").eq("email", session.user.email).maybeSingle();

  const { data: publisher } = await db
    .from("publishers")
    .select("id, site_url, revenue_share")
    .eq("user_id", userRow?.id ?? "")
    .single();

  if (!publisher) redirect("/onboarding");

  const { data: adUnits = [] } = await db
    .from("ad_units")
    .select("id, name, size, placement, created_at")
    .eq("publisher_id", publisher.id)
    .order("created_at", { ascending: false });

  const adUnitIds = (adUnits as any[]).map((u: any) => u.id);

  const impressionCounts: Record<string, number> = {};
  if (adUnitIds.length) {
    const { data: imps = [] } = await db
      .from("impressions")
      .select("ad_unit_id")
      .in("ad_unit_id", adUnitIds);
    for (const imp of imps as any[]) {
      impressionCounts[imp.ad_unit_id] = (impressionCounts[imp.ad_unit_id] ?? 0) + 1;
    }
  }

  const revenueShare = (publisher.revenue_share ?? 70) / 100;
  const RPM_CENTS = 250;

  function unitEarnings(unitId: string) {
    const imps = impressionCounts[unitId] ?? 0;
    return Math.floor((imps / 1000) * RPM_CENTS * revenueShare);
  }

  function fmtUsd(cents: number) {
    return `$${(cents / 100).toFixed(2)}`;
  }

  function fmtNum(n: number) {
    return n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : String(n);
  }

  const hasNoUnits = (adUnits as any[]).length === 0;

  return (
    <>
      <DashboardHeader
        title="Ad Units"
        subtitle="Manage your ad placements and get embed codes"
        ctaLabel="New Ad Unit"
        ctaHref="/dashboard/publisher/ad-units/new"
      />

      <div className="bg-white rounded-2xl border border-brand-cream-dark overflow-hidden shadow-brand-sm">
        {hasNoUnits ? (
          <div className="py-20 text-center">
            <Globe size={36} className="text-brand-muted mx-auto mb-4" />
            <p className="text-brand-charcoal font-display font-bold text-lg mb-1">No ad units yet</p>
            <p className="text-brand-muted text-sm mb-6">Create an ad unit and embed it on your site to start earning.</p>
            <Link href="/dashboard/publisher/ad-units/new" className="btn-primary inline-flex items-center gap-2">
              <Plus size={16} /> Create Ad Unit
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-brand-cream text-left">
                  {["Ad Unit", "Size", "Placement", "Impressions", "RPM", "Earnings", "Created", ""].map((h) => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream-dark">
                {(adUnits as any[]).map((u) => {
                  const imps = impressionCounts[u.id] ?? 0;
                  const earnings = unitEarnings(u.id);
                  const rpm = imps > 0 ? fmtUsd(Math.round((earnings / imps) * 1000)) : "—";
                  return (
                    <tr key={u.id} className="hover:bg-brand-cream/40 transition-colors">
                      <td className="px-5 py-4 font-medium text-brand-charcoal text-sm max-w-[200px] truncate">
                        {u.name || `Ad Unit #${u.id.slice(0, 8)}`}
                      </td>
                      <td className="px-5 py-4 text-brand-muted text-sm font-mono">{u.size}</td>
                      <td className="px-5 py-4 text-brand-muted text-sm capitalize">{u.placement?.replace("_", " ") || "—"}</td>
                      <td className="px-5 py-4 text-brand-muted text-sm">{fmtNum(imps)}</td>
                      <td className="px-5 py-4 text-brand-green font-semibold text-sm">{rpm}</td>
                      <td className="px-5 py-4 font-semibold text-brand-charcoal text-sm">{fmtUsd(earnings)}</td>
                      <td className="px-5 py-4 text-brand-muted text-xs">{fmtDate(u.created_at)}</td>
                      <td className="px-5 py-4">
                        <Link href={`/dashboard/publisher/ad-units/${u.id}`} className="inline-flex items-center gap-1 text-brand-green text-xs font-semibold hover:underline whitespace-nowrap">
                          <Code2 size={12} /> Get code
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
