/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCard from "@/components/dashboard/StatCard";
import {
  Eye, MousePointerClick, DollarSign, TrendingUp,
  Megaphone, ArrowRight, Plus, AlertCircle,
} from "lucide-react";

const statusStyles: Record<string, string> = {
  active: "bg-brand-green/10 text-brand-green",
  paused: "bg-yellow-50 text-yellow-700",
  pending_review: "bg-blue-50 text-blue-700",
  draft: "bg-gray-100 text-gray-500",
  completed: "bg-gray-100 text-gray-500",
  rejected: "bg-red-50 text-red-600",
};

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

export default async function AdvertiserOverviewPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/auth/signin");

  const db = createServiceClient() as any;

  // Resolve DB user ID from email (stable across all auth providers)
  const { data: userRow } = await db.from("users").select("id").eq("email", session.user.email).maybeSingle();

  // Advertiser profile
  const { data: advertiser } = await db
    .from("advertisers")
    .select("id, balance")
    .eq("user_id", userRow?.id ?? "")
    .single();

  if (!advertiser) redirect("/onboarding");

  // Campaigns
  const { data: campaigns = [] } = await db
    .from("campaigns")
    .select("id, name, status, type, total_budget, spend")
    .eq("advertiser_id", advertiser.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // Aggregate stats from campaigns
  const campaignIds = (campaigns as any[]).map((c: any) => c.id);
  const totalSpend = (campaigns as any[]).reduce((s: number, c: any) => s + (c.spend ?? 0), 0);
  const activeCampaigns = (campaigns as any[]).filter((c: any) => c.status === "active").length;

  // Impression / click counts (will be 0 until ad serving is live)
  const { count: totalImpressions = 0 } = campaignIds.length
    ? await db.from("impressions").select("id", { count: "exact", head: true }).in("campaign_id", campaignIds)
    : { count: 0 };

  const { count: totalClicks = 0 } = campaignIds.length
    ? await db.from("clicks").select("id", { count: "exact", head: true }).in("campaign_id", campaignIds)
    : { count: 0 };

  const ctr =
    totalImpressions && totalClicks
      ? ((totalClicks / totalImpressions) * 100).toFixed(2) + "%"
      : "—";

  const firstName = session.user.name?.split(" ")[0] || session.user.email?.split("@")[0] || "there";
  const hasNoCampaigns = (campaigns as any[]).length === 0;
  const lowBalance = (advertiser.balance ?? 0) < 1000; // < $10

  return (
    <>
      <DashboardHeader
        title={`Assalamu Alaikum, ${firstName}`}
        subtitle="Here's how your campaigns are performing."
        ctaLabel="New Campaign"
        ctaHref="/dashboard/advertiser/campaigns/new"
      />

      {hasNoCampaigns && (
        <div className="bg-gradient-brand rounded-2xl p-6 mb-8 flex items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-lg font-bold text-white mb-1">Welcome to Islamic Ad Network!</h3>
            <p className="text-white/75 text-sm">Create your first campaign and start reaching Muslim audiences today.</p>
          </div>
          <Link href="/dashboard/advertiser/campaigns/new" className="btn-secondary text-sm whitespace-nowrap">
            Create Campaign <ArrowRight size={15} />
          </Link>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Total Impressions" value={fmt(totalImpressions ?? 0)} icon={Eye} />
        <StatCard label="Total Clicks" value={fmt(totalClicks ?? 0)} icon={MousePointerClick} />
        <StatCard label="Total Spend" value={fmtUsd(totalSpend)} icon={DollarSign} iconColor="gold" />
        <StatCard label="Avg. CTR" value={ctr} icon={TrendingUp} />
      </div>

      <div className="bg-white rounded-2xl border border-brand-cream-dark overflow-hidden shadow-brand-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-cream-dark">
          <h2 className="font-display font-bold text-brand-charcoal">
            Campaigns {activeCampaigns > 0 && <span className="text-sm text-brand-muted font-normal ml-1">({activeCampaigns} active)</span>}
          </h2>
          <Link href="/dashboard/advertiser/campaigns" className="text-brand-green text-sm font-semibold hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {hasNoCampaigns ? (
          <div className="py-16 text-center">
            <Megaphone size={32} className="text-brand-muted mx-auto mb-3" />
            <p className="text-brand-muted text-sm">No campaigns yet.</p>
            <Link href="/dashboard/advertiser/campaigns/new" className="btn-primary text-sm mt-4 inline-flex items-center gap-2">
              <Plus size={15} /> Create your first campaign
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-brand-cream text-left">
                  {["Campaign", "Status", "Type", "Budget", "Spend", ""].map((h) => (
                    <th key={h} className="px-6 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream-dark">
                {(campaigns as any[]).map((c) => (
                  <tr key={c.id} className="hover:bg-brand-cream/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-brand-charcoal text-sm">{c.name || `Campaign #${c.id.slice(0, 8)}`}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[c.status] ?? "bg-gray-100 text-gray-500"}`}>
                        {c.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-brand-muted text-sm font-mono uppercase">{c.type}</td>
                    <td className="px-6 py-4 text-brand-muted text-sm">{fmtUsd(c.total_budget ?? 0)}</td>
                    <td className="px-6 py-4 font-semibold text-brand-charcoal text-sm">{fmtUsd(c.spend ?? 0)}</td>
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
        )}
      </div>

      {lowBalance && (
        <div className="mt-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-800 text-sm font-medium">
              {advertiser.balance === 0 ? "Add credits to activate campaigns" : "Your balance is running low"}
            </p>
            <p className="text-amber-700 text-xs mt-0.5">
              Current balance: <strong>{fmtUsd(advertiser.balance ?? 0)}</strong>.{" "}
              <Link href="/dashboard/advertiser/billing" className="underline font-semibold">Add credits →</Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
