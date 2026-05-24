import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const { advertiser_id, credits, amount_cents } = session.metadata ?? {};

  if (!advertiser_id || !credits || !amount_cents) {
    return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
  }

  const creditsInt = parseInt(credits, 10);
  const amountInt = parseInt(amount_cents, 10);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any;

  const { data: advertiser } = await db
    .from("advertisers")
    .select("balance")
    .eq("id", advertiser_id)
    .single();

  if (!advertiser) {
    return NextResponse.json({ error: "Advertiser not found" }, { status: 404 });
  }

  await db
    .from("advertisers")
    .update({ balance: (advertiser.balance ?? 0) + amountInt })
    .eq("id", advertiser_id);

  await db.from("billing_transactions").insert({
    advertiser_id,
    type: "topup",
    amount_cents: amountInt,
    credits: creditsInt,
    description: `Credit top-up — ${creditsInt.toLocaleString()} credits`,
    stripe_payment_intent_id: session.payment_intent as string | null,
  });

  return NextResponse.json({ received: true });
}
