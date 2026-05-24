/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { ArrowLeft, Eye, MousePointerClick, DollarSign, Globe, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import CampaignControls from "./CampaignControls";

const statusStyles: Record<string, string> = {
  active: "bg-brand-green/10 text-brand-green",
  paused: "bg-yellow-50 text-yellow-700",
  pending_review: "bg-blue-50 text-blue-700",
  draft: "bg-gray-100 text-gray-500",
  completed: "bg-gray-100 text-gray-500",
  rejected: "bg-red-50 text-red-600",
};

function fmtUsd(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function CampaignDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.email) redirect("/auth/signin");

  const db = createServiceClient() as any;

  const { data: userRow } = await db.from("users").select("id").eq("email", session.user.email).maybeSingle();
  const { data: advertiser } = await db.from("advertisers").select("id").eq("user_id", userRow?.id ?? "").single();
  if (!advertiser) redirect("/onboarding");

  const { data: campaign } = await db
    .from("campaigns")
    .select("id, name, status, type, total_budget, daily_budget, spend, bid_amount, targeting_json, start_date, end_date, created_at")
    .eq("id", params.id)
    .eq("advertiser_id", advertiser.id)
    .single();

  if (!campaign) notFound();

  const { data: creative } = await db
    .from("ad_creatives")
    .select("headline, description, destination_url, size, image_url")
    .eq("campaign_id", campaign.id)
    .maybeSingle();

  const { count: impressions = 0 } = await db
    .from("impressions")
    .select("id", { count: "exact", head: true })
    .eq("campaign_id", campaign.id);

  const { count: clicks = 0 } = await db
    .from("clicks")
    .select("id", { count: "exact", head: true })
    .eq("campaign_id", campaign.id);

  const ctr = impressions && clicks ? ((clicks / impressions) * 100).toFixed(2) + "%" : "—";
  const targeting = (campaign.targeting_json ?? {}) as { countries?: string[]; interests?: string[] };

  return (
    <>
      <div className="mb-6">
        <Link href="/dashboard/advertiser/campaigns" className="inline-flex items-center gap-1.5 text-brand-muted text-sm hover:text-brand-charcoal transition-colors">
          <ArrowLeft size={15} /> Back to Campaigns
        </Link>
      </div>

      <DashboardHeader
        title={campaign.name || `Campaign #${campaign.id.slice(0, 8)}`}
        subtitle={`Created ${fmtDate(campaign.created_at)}`}
      />

      <div className="flex items-center gap-3 mb-8">
        <span className={cn("px-3 py-1.5 rounded-full text-sm font-semibold capitalize", statusStyles[campaign.status] ?? "bg-gray-100 text-gray-500")}>
          {campaign.status.replace("_", " ")}
        </span>
        <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-sm font-mono uppercase">{campaign.type}</span>
        <CampaignControls campaignId={campaign.id} status={campaign.status} />
      </div>

      {campaign.status === "pending_review" && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <p className="text-blue-800 text-sm font-medium">Under review</p>
          <p className="text-blue-700 text-xs mt-0.5">Our team is reviewing your campaign for Halal compliance. This usually takes up to 4 hours.</p>
        </div>
      )}
      {campaign.status === "rejected" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
          <p className="text-red-800 text-sm font-medium">Campaign rejected</p>
          <p className="text-red-700 text-xs mt-0.5">Contact support to understand why and resubmit after making the required changes.</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: "Impressions", value: (impressions ?? 0).toLocaleString(), icon: Eye },
          { label: "Clicks", value: (clicks ?? 0).toLocaleString(), icon: MousePointerClick },
          { label: "CTR", value: ctr, icon: Target },
          { label: "Spend", value: fmtUsd(campaign.spend ?? 0), icon: DollarSign },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-brand-cream-dark p-5 shadow-brand-sm">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={16} className="text-brand-muted" />
              <p className="text-brand-muted text-xs font-medium uppercase tracking-wide">{label}</p>
            </div>
            <p className="font-display text-2xl font-bold text-brand-charcoal">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Budget & Schedule */}
        <div className="bg-white rounded-2xl border border-brand-cream-dark p-6 shadow-brand-sm">
          <h2 className="font-display font-bold text-brand-charcoal text-lg mb-5">Budget & Schedule</h2>
          <div className="space-y-3">
            {[
              { label: "Total budget", value: fmtUsd(campaign.total_budget ?? 0) },
              { label: "Daily budget", value: fmtUsd(campaign.daily_budget ?? 0) },
              { label: "Bid amount", value: campaign.type === "cpc" ? `${fmtUsd(campaign.bid_amount ?? 0)}/click` : campaign.type === "cpm" ? `${fmtUsd(campaign.bid_amount ?? 0)}/1K imps` : fmtUsd(campaign.bid_amount ?? 0) },
              { label: "Start date", value: fmtDate(campaign.start_date) },
              { label: "End date", value: fmtDate(campaign.end_date) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-2 border-b border-brand-cream-dark last:border-0">
                <span className="text-brand-muted text-sm">{label}</span>
                <span className="text-brand-charcoal text-sm font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Targeting */}
        <div className="bg-white rounded-2xl border border-brand-cream-dark p-6 shadow-brand-sm">
          <h2 className="font-display font-bold text-brand-charcoal text-lg mb-5 flex items-center gap-2">
            <Globe size={17} className="text-brand-green" /> Targeting
          </h2>
          <div className="mb-4">
            <p className="text-brand-muted text-xs font-semibold uppercase tracking-wide mb-2">Countries</p>
            <div className="flex flex-wrap gap-1.5">
              {(targeting.countries?.length ?? 0) > 0
                ? targeting.countries!.map((c) => (
                    <span key={c} className="px-2.5 py-1 bg-brand-green/10 text-brand-green text-xs font-semibold rounded-full">{c}</span>
                  ))
                : <span className="text-brand-muted text-sm">All countries</span>
              }
            </div>
          </div>
          <div>
            <p className="text-brand-muted text-xs font-semibold uppercase tracking-wide mb-2">Interests</p>
            <div className="flex flex-wrap gap-1.5">
              {(targeting.interests?.length ?? 0) > 0
                ? targeting.interests!.map((i) => (
                    <span key={i} className="px-2.5 py-1 bg-brand-gold/10 text-brand-gold-dark text-xs font-semibold rounded-full">{i}</span>
                  ))
                : <span className="text-brand-muted text-sm">All interests</span>
              }
            </div>
          </div>
        </div>

        {/* Creative */}
        {creative && (
          <div className="bg-white rounded-2xl border border-brand-cream-dark p-6 shadow-brand-sm lg:col-span-2">
            <h2 className="font-display font-bold text-brand-charcoal text-lg mb-5">Ad Creative</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                {[
                  { label: "Headline", value: creative.headline },
                  { label: "Description", value: creative.description || "—" },
                  { label: "Destination URL", value: creative.destination_url },
                  { label: "Ad size", value: creative.size },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-brand-muted text-xs font-semibold uppercase tracking-wide mb-1">{label}</p>
                    <p className="text-brand-charcoal text-sm font-medium break-all">{value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-brand-cream rounded-xl border border-brand-cream-dark flex items-center justify-center p-6 min-h-[140px]">
                {creative.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={creative.image_url} alt="Ad creative" className="max-w-full max-h-full object-contain" />
                ) : (
                  <div className="text-center">
                    <p className="text-brand-muted text-xs mb-1">No image uploaded</p>
                    <p className="text-brand-charcoal text-sm font-medium">{creative.headline}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
