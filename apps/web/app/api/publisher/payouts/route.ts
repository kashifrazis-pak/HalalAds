import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any;

  const { data: user } = await db.from("users").select("id").eq("email", session.user.email).maybeSingle();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { data: publisher } = await db.from("publishers").select("id").eq("user_id", user.id).single();
  if (!publisher) return NextResponse.json({ error: "Publisher not found" }, { status: 404 });

  const { data: payouts, error } = await db
    .from("publisher_payouts")
    .select("id, amount_cents, currency, method, status, period_start, period_end, failure_reason, created_at")
    .eq("publisher_id", publisher.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ payouts: payouts ?? [] });
}
