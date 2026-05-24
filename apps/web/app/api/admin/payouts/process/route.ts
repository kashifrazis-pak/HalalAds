import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { createPayoutBatch } from "@/lib/paypal";

// Protected by ADMIN_SECRET header — never expose this key publicly
export async function POST(req: NextRequest) {
  const adminSecret = req.headers.get("x-admin-secret");
  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { publisher_id, amount_cents, period_start, period_end } = body;

  if (!publisher_id || !amount_cents || amount_cents < 2500) {
    return NextResponse.json(
      { error: "publisher_id and amount_cents (min 2500 = $25) are required" },
      { status: 400 }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any;

  // Get publisher + payout method
  const { data: publisher } = await db
    .from("publishers")
    .select("id")
    .eq("id", publisher_id)
    .single();

  if (!publisher) return NextResponse.json({ error: "Publisher not found" }, { status: 404 });

  const { data: payoutMethod } = await db
    .from("publisher_payout_methods")
    .select("method, email")
    .eq("publisher_id", publisher_id)
    .maybeSingle();

  if (!payoutMethod) {
    return NextResponse.json({ error: "Publisher has no payout method configured" }, { status: 422 });
  }

  if (payoutMethod.method !== "paypal") {
    return NextResponse.json(
      { error: `Payout method '${payoutMethod.method}' is not yet supported via this endpoint` },
      { status: 422 }
    );
  }

  if (!payoutMethod.email) {
    return NextResponse.json({ error: "Publisher has no PayPal email on file" }, { status: 422 });
  }

  // Create a pending payout record first
  const { data: payoutRecord, error: insertError } = await db
    .from("publisher_payouts")
    .insert({
      publisher_id,
      amount_cents,
      currency: "USD",
      method: "paypal",
      status: "processing",
      period_start: period_start ?? null,
      period_end: period_end ?? null,
    })
    .select("id")
    .single();

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  // Send via PayPal
  try {
    const period =
      period_start && period_end ? `${period_start} to ${period_end}` : undefined;

    const result = await createPayoutBatch([
      {
        publisherId: publisher_id,
        email: payoutMethod.email,
        amountCents: amount_cents,
        period,
      },
    ]);

    const itemId = result.items.find((i) => i.senderId === publisher_id)?.itemId ?? null;

    await db
      .from("publisher_payouts")
      .update({
        paypal_batch_id: result.batchId,
        paypal_item_id: itemId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payoutRecord.id);

    return NextResponse.json({
      ok: true,
      payout_id: payoutRecord.id,
      paypal_batch_id: result.batchId,
      status: result.status,
    });
  } catch (err) {
    // Mark payout as failed so it can be retried
    await db
      .from("publisher_payouts")
      .update({
        status: "failed",
        failure_reason: err instanceof Error ? err.message : "Unknown PayPal error",
        updated_at: new Date().toISOString(),
      })
      .eq("id", payoutRecord.id);

    return NextResponse.json(
      { error: err instanceof Error ? err.message : "PayPal payout failed" },
      { status: 502 }
    );
  }
}
