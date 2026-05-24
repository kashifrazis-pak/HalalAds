import { auth } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase";
import { getStripe, CREDIT_PACKAGES } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { packageId } = await req.json();
  const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId);
  if (!pkg) {
    return NextResponse.json({ error: "Invalid package" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any;
  const { data: advertiser } = await db
    .from("advertisers")
    .select("id")
    .eq("user_id", session.user.id)
    .single();

  if (!advertiser) {
    return NextResponse.json({ error: "Advertiser not found" }, { status: 404 });
  }

  const origin = req.headers.get("origin") ?? process.env.NEXTAUTH_URL ?? "https://islamicadnetwork.com";

  const checkoutSession = await getStripe().checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: pkg.amount,
          product_data: {
            name: `Islamic Ad Network — ${pkg.label} Credits`,
            description: `${pkg.credits.toLocaleString()} ad credits${"bonus" in pkg && pkg.bonus ? ` (${pkg.bonus})` : ""}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      advertiser_id: advertiser.id,
      package_id: pkg.id,
      credits: String(pkg.credits),
      amount_cents: String(pkg.amount),
    },
    success_url: `${origin}/dashboard/advertiser/billing?success=1`,
    cancel_url: `${origin}/dashboard/advertiser/billing`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
