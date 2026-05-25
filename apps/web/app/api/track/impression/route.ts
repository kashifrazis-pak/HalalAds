import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export const runtime = "edge";

const PIXEL_B64 = "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const PIXEL_HEADERS = {
  "Content-Type": "image/gif",
  "Cache-Control": "no-store, no-cache",
  "Access-Control-Allow-Origin": "*",
};

async function hashIP(ip: string): Promise<string> {
  const salt = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const data = new TextEncoder().encode(ip + salt);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function pixel() {
  return new NextResponse(Buffer.from(PIXEL_B64, "base64"), {
    status: 200,
    headers: PIXEL_HEADERS,
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const campaignId = searchParams.get("cid");
  const creativeId = searchParams.get("crid");
  const adUnitId = searchParams.get("auid");
  const impressionId = searchParams.get("iid");

  if (!campaignId || !creativeId || !adUnitId) return pixel();

  const ua = req.headers.get("user-agent") || "";
  if (/bot|crawler|spider/i.test(ua)) return pixel();

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const country = req.headers.get("x-vercel-ip-country") || "XX";
  const ipHash = await hashIP(ip);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any;

  // Record impression (use pre-generated ID from serve route so click can reference it)
  await db.from("impressions").insert({
    ...(impressionId ? { id: impressionId } : {}),
    campaign_id: campaignId,
    creative_id: creativeId,
    ad_unit_id: adUnitId,
    ip_hash: ipHash,
    country,
    user_agent: ua.slice(0, 250),
  });

  // CPM billing: deduct cost from campaign spend + advertiser balance
  const { data: campaign } = await db
    .from("campaigns")
    .select("type, bid_amount, spend, advertiser_id")
    .eq("id", campaignId)
    .single();

  if (campaign?.type === "cpm" && campaign.bid_amount > 0) {
    const costCents = Math.ceil(campaign.bid_amount / 1000);

    await db
      .from("campaigns")
      .update({ spend: (campaign.spend ?? 0) + costCents })
      .eq("id", campaignId);

    const { data: advertiser } = await db
      .from("advertisers")
      .select("balance")
      .eq("id", campaign.advertiser_id)
      .single();

    if (advertiser) {
      await db
        .from("advertisers")
        .update({ balance: Math.max((advertiser.balance ?? 0) - costCents, 0) })
        .eq("id", campaign.advertiser_id);
    }
  }

  return pixel();
}
