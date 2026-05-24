import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { verifyWebhookSignature } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  const body = await req.text();

  const headers: Record<string, string> = {
    "paypal-auth-algo": req.headers.get("paypal-auth-algo") ?? "",
    "paypal-cert-url": req.headers.get("paypal-cert-url") ?? "",
    "paypal-transmission-id": req.headers.get("paypal-transmission-id") ?? "",
    "paypal-transmission-sig": req.headers.get("paypal-transmission-sig") ?? "",
    "paypal-transmission-time": req.headers.get("paypal-transmission-time") ?? "",
  };

  // Verify webhook authenticity with PayPal
  const valid = await verifyWebhookSignature(headers, body).catch(() => false);
  if (!valid) return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });

  const event = JSON.parse(body);
  const eventType: string = event.event_type ?? "";
  const resource = event.resource ?? {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any;

  if (eventType === "PAYMENT.PAYOUTS-ITEM.SUCCEEDED") {
    const batchId: string = resource.payout_batch_id ?? "";
    const itemId: string = resource.payout_item_id ?? "";

    await db
      .from("publisher_payouts")
      .update({ status: "paid", updated_at: new Date().toISOString() })
      .eq("paypal_batch_id", batchId)
      .eq("paypal_item_id", itemId);
  }

  if (eventType === "PAYMENT.PAYOUTS-ITEM.FAILED" || eventType === "PAYMENT.PAYOUTS-ITEM.RETURNED") {
    const batchId: string = resource.payout_batch_id ?? "";
    const itemId: string = resource.payout_item_id ?? "";
    const reason: string = resource.errors?.message ?? eventType;

    await db
      .from("publisher_payouts")
      .update({
        status: "failed",
        failure_reason: reason,
        updated_at: new Date().toISOString(),
      })
      .eq("paypal_batch_id", batchId)
      .eq("paypal_item_id", itemId);
  }

  if (eventType === "PAYMENT.PAYOUTS-ITEM.UNCLAIMED") {
    // Recipient hasn't claimed — keep as processing, admin can decide to cancel or retry
    const batchId: string = resource.payout_batch_id ?? "";
    const itemId: string = resource.payout_item_id ?? "";

    await db
      .from("publisher_payouts")
      .update({
        failure_reason: "Unclaimed — recipient has not accepted the payment",
        updated_at: new Date().toISOString(),
      })
      .eq("paypal_batch_id", batchId)
      .eq("paypal_item_id", itemId);
  }

  return NextResponse.json({ received: true });
}
