import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase";

async function getPublisherId(email: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any;
  const { data: user } = await db.from("users").select("id").eq("email", email).maybeSingle();
  if (!user) return null;
  const { data: publisher } = await db.from("publishers").select("id").eq("user_id", user.id).single();
  return publisher?.id ?? null;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const publisherId = await getPublisherId(session.user.email);
  if (!publisherId) return NextResponse.json({ error: "Publisher not found" }, { status: 404 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any;
  const { data, error } = await db
    .from("publisher_payout_methods")
    .select("method, email, account_holder, account_number, swift_bic")
    .eq("publisher_id", publisherId)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ payout: data ?? null });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const publisherId = await getPublisherId(session.user.email);
  if (!publisherId) return NextResponse.json({ error: "Publisher not found" }, { status: 404 });

  const body = await req.json();
  const { method, email, account_holder, account_number, swift_bic } = body;

  const VALID_METHODS = ["paypal", "wise", "bank"];
  if (!method || !VALID_METHODS.includes(method)) {
    return NextResponse.json({ error: "Invalid payout method" }, { status: 400 });
  }

  if ((method === "paypal" || method === "wise") && !email) {
    return NextResponse.json({ error: "Email is required for this payout method" }, { status: 400 });
  }

  if (method === "bank" && (!account_holder || !account_number)) {
    return NextResponse.json({ error: "Account holder and account number are required for bank transfer" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any;
  const { error } = await db.from("publisher_payout_methods").upsert(
    {
      publisher_id: publisherId,
      method,
      email: email ?? null,
      account_holder: account_holder ?? null,
      account_number: account_number ?? null,
      swift_bic: swift_bic ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "publisher_id" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
