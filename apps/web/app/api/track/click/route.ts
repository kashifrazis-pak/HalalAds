import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export const runtime = "edge";

async function hashIP(ip: string): Promise<string> {
  const salt = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const data = new TextEncoder().encode(ip + salt);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const campaignId = searchParams.get("cid");
  const impressionId = searchParams.get("iid");
  const dest = searchParams.get("url");

  if (!campaignId || !dest) {
    return NextResponse.redirect(new URL("/", req.url), { status: 302 });
  }

  const ua = req.headers.get("user-agent") || "";
  const isBot = /bot|crawler|spider/i.test(ua);

  if (!isBot) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const ipHash = await hashIP(ip);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = createServiceClient() as any;

    // Record click, linking back to impression for fraud analysis
    await db.from("clicks").insert({
      campaign_id: campaignId,
      ...(impressionId ? { impression_id: impressionId } : {}),
      ip_hash: ipHash,
    });

    // CPC billing: deduct bid_amount from campaign spend + advertiser balance
    const { data: campaign } = await db
      .from("campaigns")
      .select("type, bid_amount, spend, advertiser_id")
      .eq("id", campaignId)
      .single();

    if (campaign?.type === "cpc" && campaign.bid_amount > 0) {
      await db
        .from("campaigns")
        .update({ spend: (campaign.spend ?? 0) + campaign.bid_amount })
        .eq("id", campaignId);

      const { data: advertiser } = await db
        .from("advertisers")
        .select("balance")
        .eq("id", campaign.advertiser_id)
        .single();

      if (advertiser) {
        await db
          .from("advertisers")
          .update({
            balance: Math.max((advertiser.balance ?? 0) - campaign.bid_amount, 0),
          })
          .eq("id", campaign.advertiser_id);
      }
    }
  }

  try {
    const url = new URL(dest);
    url.searchParams.set("utm_source", "islamicadnetwork");
    url.searchParams.set("utm_medium", "display");
    return NextResponse.redirect(url.toString(), {
      status: 302,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.redirect(new URL("/", req.url), { status: 302 });
  }
}
