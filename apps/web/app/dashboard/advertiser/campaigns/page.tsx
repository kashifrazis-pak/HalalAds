/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Megaphone, Plus } from "lucide-react";

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

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function CampaignsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/auth/signin");

  const db = createServiceClient() as any;

  const { data: userRow } = await db.from("users").select("id").eq("email", session.user.email).maybeSingle();

  const { data: advertiser } = await db
    .from("advertisers")
    .select("id")
    .eq("user_id", userRow?.id ?? "")
    .single();

  if (!advertiser) redirect("/onboarding");

  const { data: campaigns = [] } = await db
    .from("campaigns")
    .select("id, name, status, type, budget, spend, created_at")
    .eq("advertiser_id", advertiser.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <DashboardHeader
        title="Campaigns"
        subtitle="Manage all your advertising campaigns"
        ctaLabel="New Campaign"
        ctaHref="/dashboard/advertiser/campaigns/new"
      />

      <div className="bg-white rounded-2xl border border-brand-cream-dark overflow-hidden shadow-brand-sm">
        {(campaigns as any[]).length === 0 ? (
          <div className="py-20 text-center">
            <Megaphone size={36} className="text-brand-muted mx-auto mb-4" />
            <p className="text-brand-charcoal font-display font-bold text-lg mb-1">No campaigns yet</p>
            <p className="text-brand-muted text-sm mb-6">Create your first campaign to start reaching Muslim audiences.</p>
            <Link href="/dashboard/advertiser/campaigns/new" className="btn-primary inline-flex items-center gap-2">
              <Plus size={16} /> Create Campaign
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-brand-cream text-left">
                  {["Campaign", "Status", "Type", "Budget", "Spend", "Created", ""].map((h) => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-cream-dark">
                {(campaigns as any[]).map((c) => (
                  <tr key={c.id} className="hover:bg-brand-cream/40 transition-colors">
                    <td className="px-5 py-4 font-medium text-brand-charcoal text-sm max-w-[220px] truncate">
                      {c.name || `Campaign #${c.id.slice(0, 8)}`}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[c.status] ?? "bg-gray-100 text-gray-500"}`}>
                        {c.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-brand-muted text-sm font-mono uppercase">{c.type}</td>
                    <td className="px-5 py-4 text-brand-muted text-sm">{fmtUsd(c.budget ?? 0)}</td>
                    <td className="px-5 py-4 text-brand-charcoal font-semibold text-sm">{fmtUsd(c.spend ?? 0)}</td>
                    <td className="px-5 py-4 text-brand-muted text-xs">{fmtDate(c.created_at)}</td>
                    <td className="px-5 py-4">
                      <Link href={`/dashboard/advertiser/campaigns/${c.id}`} className="text-brand-green text-xs font-semibold hover:underline whitespace-nowrap">
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
    </>
  );
}
