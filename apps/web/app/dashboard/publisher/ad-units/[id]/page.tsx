/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { ArrowLeft, Eye, DollarSign } from "lucide-react";
import AdUnitCodePanel from "./AdUnitCodePanel";

function fmtUsd(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function AdUnitDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.email) redirect("/auth/signin");

  const db = createServiceClient() as any;

  const { data: userRow } = await db.from("users").select("id").eq("email", session.user.email).maybeSingle();
  const { data: publisher } = await db
    .from("publishers")
    .select("id, revenue_share")
    .eq("user_id", userRow?.id ?? "")
    .single();
  if (!publisher) redirect("/onboarding");

  const { data: unit } = await db
    .from("ad_units")
    .select("id, name, site_url, size, placement, active, created_at")
    .eq("id", params.id)
    .eq("publisher_id", publisher.id)
    .single();

  if (!unit) notFound();

  const { count: impressions = 0 } = await db
    .from("impressions")
    .select("id", { count: "exact", head: true })
    .eq("ad_unit_id", unit.id);

  const revenueShare = publisher.revenue_share ?? 0.70;
  const RPM_CENTS = 250;
  const earnings = Math.floor(((impressions ?? 0) / 1000) * RPM_CENTS * revenueShare);

  return (
    <>
      <div className="mb-6">
        <Link href="/dashboard/publisher/ad-units" className="inline-flex items-center gap-1.5 text-brand-muted text-sm hover:text-brand-charcoal transition-colors">
          <ArrowLeft size={15} /> Back to Ad Units
        </Link>
      </div>

      <DashboardHeader
        title={unit.name || `Ad Unit #${unit.id.slice(0, 8)}`}
        subtitle={`Created ${fmtDate(unit.created_at)} · ${unit.size} · ${(unit.placement ?? "").replace("_", " ")}`}
      />

      {/* Stats */}
      <div className="grid sm:grid-cols-2 gap-5 mb-8">
        <div className="bg-white rounded-2xl border border-brand-cream-dark p-5 shadow-brand-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center">
            <Eye size={18} className="text-brand-green" />
          </div>
          <div>
            <p className="text-brand-muted text-xs font-medium uppercase tracking-wide">Impressions</p>
            <p className="font-display text-2xl font-bold text-brand-charcoal">{(impressions ?? 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-brand-cream-dark p-5 shadow-brand-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center">
            <DollarSign size={18} className="text-brand-gold" />
          </div>
          <div>
            <p className="text-brand-muted text-xs font-medium uppercase tracking-wide">Est. Earnings</p>
            <p className="font-display text-2xl font-bold text-brand-charcoal">{fmtUsd(earnings)}</p>
          </div>
        </div>
      </div>

      {/* Embed code */}
      <AdUnitCodePanel unitId={unit.id} size={unit.size} name={unit.name} />
    </>
  );
}
