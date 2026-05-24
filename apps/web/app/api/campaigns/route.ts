/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, type, adSize, destinationUrl, headline, description,
    countries, interests, dailyBudget, totalBudget, bidAmount, startDate, endDate } = body;

  if (!name || !type || !destinationUrl || !headline) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const db = createServiceClient() as any;

  const { data: userRow } = await db
    .from("users").select("id").eq("email", session.user.email).maybeSingle();

  if (!userRow) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { data: advertiser } = await db
    .from("advertisers").select("id").eq("user_id", userRow.id).single();

  if (!advertiser) return NextResponse.json({ error: "Advertiser not found" }, { status: 404 });

  const { data: campaign, error: campaignErr } = await db
    .from("campaigns")
    .insert({
      advertiser_id: advertiser.id,
      name,
      type,
      status: "pending_review",
      daily_budget: Math.round(parseFloat(dailyBudget || "0") * 100),
      total_budget: Math.round(parseFloat(totalBudget || "0") * 100),
      bid_amount: Math.round(parseFloat(bidAmount || "0") * 100),
      targeting_json: { countries: countries ?? [], interests: interests ?? [] },
      start_date: startDate || null,
      end_date: endDate || null,
    })
    .select("id")
    .single();

  if (campaignErr || !campaign) {
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
  }

  await db.from("ad_creatives").insert({
    campaign_id: campaign.id,
    headline,
    description: description || null,
    destination_url: destinationUrl,
    size: adSize || "300x250",
  });

  return NextResponse.json({ id: campaign.id });
}
