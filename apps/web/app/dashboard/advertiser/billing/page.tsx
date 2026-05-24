/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AddCreditsForm from "./AddCreditsForm";
import { History, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

function fmtUsd(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function BillingPage({ searchParams }: { searchParams: { success?: string } }) {
  const session = await auth();
  if (!session?.user?.email) redirect("/auth/signin");

  const db = createServiceClient() as any;

  const { data: userRow } = await db.from("users").select("id").eq("email", session.user.email).maybeSingle();

  const { data: advertiser } = await db
    .from("advertisers")
    .select("id, balance")
    .eq("user_id", userRow?.id ?? "")
    .single();

  if (!advertiser) redirect("/onboarding");

  const { data: transactions = [] } = await db
    .from("billing_transactions")
    .select("id, type, amount_cents, credits, description, created_at")
    .eq("advertiser_id", advertiser.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const totalSpent = (transactions as any[])
    .filter((t) => t.type === "spend")
    .reduce((s: number, t: any) => s + (t.amount_cents ?? 0), 0);

  const showSuccess = searchParams.success === "1";

  return (
    <>
      <DashboardHeader title="Billing & Credits" subtitle="Manage your ad credits and payment history" />

      {showSuccess && (
        <div className="flex items-center gap-3 bg-brand-green/10 border border-brand-green/30 rounded-xl p-4 mb-6">
          <CheckCircle2 size={18} className="text-brand-green flex-shrink-0" />
          <p className="text-brand-green font-medium text-sm">Payment successful — your credits have been added to your account.</p>
        </div>
      )}

      <div className="bg-gradient-brand rounded-2xl p-6 mb-8 flex items-center justify-between">
        <div>
          <p className="text-white/60 text-sm mb-1">Available balance</p>
          <p className="font-display text-4xl font-bold text-white">{fmtUsd(advertiser.balance ?? 0)}</p>
          <p className="text-white/60 text-xs mt-1">≈ {(advertiser.balance ?? 0).toLocaleString()} credits remaining</p>
        </div>
        <div className="text-right">
          <p className="text-white/60 text-sm mb-1">Total spent</p>
          <p className="font-display text-2xl font-bold text-brand-gold">{fmtUsd(totalSpent)}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <AddCreditsForm />

        <div className="bg-white rounded-2xl border border-brand-cream-dark p-6 shadow-brand-sm">
          <h2 className="font-display font-bold text-brand-charcoal text-lg mb-5 flex items-center gap-2">
            <History size={18} className="text-brand-green" /> Transaction History
          </h2>
          {(transactions as any[]).length === 0 ? (
            <p className="text-brand-muted text-sm py-8 text-center">No transactions yet.</p>
          ) : (
            <div className="divide-y divide-brand-cream-dark">
              {(transactions as any[]).map((t) => (
                <div key={t.id} className="flex items-center justify-between py-3.5">
                  <div>
                    <p className="text-brand-charcoal text-sm font-medium">{t.description || (t.type === "topup" ? "Credit top-up" : "Campaign spend")}</p>
                    <p className="text-brand-muted text-xs">{fmtDate(t.created_at)}</p>
                  </div>
                  <span className={cn("font-semibold text-sm", t.type === "topup" ? "text-brand-green" : "text-brand-charcoal")}>
                    {t.type === "topup" ? "+" : "-"}{fmtUsd(t.amount_cents)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
