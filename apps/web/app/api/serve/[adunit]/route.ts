import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export const runtime = "edge";

const BOT_RE = /bot|crawler|spider|scraper|headless/i;

type Creative = {
  id: string;
  headline: string;
  description: string | null;
  destination_url: string;
  cta_text: string | null;
  image_url: string | null;
  size: string;
};

type Campaign = {
  id: string;
  type: string;
  bid_amount: number;
  spend: number;
  total_budget: number;
  targeting_json: { countries?: string[]; interests?: string[] } | null;
  start_date: string | null;
  end_date: string | null;
  ad_creatives: Creative[];
};

export async function GET(
  req: NextRequest,
  { params }: { params: { adunit: string } }
) {
  const ua = req.headers.get("user-agent") || "";
  const country = req.headers.get("x-vercel-ip-country") || "XX";
  const { searchParams } = req.nextUrl;
  const sizeParam = searchParams.get("size") || "300x250";

  const headers = {
    "Cache-Control": "no-store, no-cache",
    "Access-Control-Allow-Origin": "*",
  };

  if (BOT_RE.test(ua)) {
    return NextResponse.json({ ad: null, reason: "bot" }, { status: 200, headers });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any;

  const { data: adUnit } = await db
    .from("ad_units")
    .select("id, publisher_id, size, active")
    .eq("id", params.adunit)
    .single();

  if (!adUnit?.active) {
    return NextResponse.json({ ad: null, reason: "no_unit" }, { status: 200, headers });
  }

  const targetSize = (adUnit.size as string) || sizeParam;
  const today = new Date().toISOString().slice(0, 10);

  const { data: campaigns } = await db
    .from("campaigns")
    .select(`
      id, type, bid_amount, spend, total_budget, targeting_json, start_date, end_date,
      ad_creatives(id, headline, description, destination_url, cta_text, image_url, size)
    `)
    .eq("status", "active");

  if (!campaigns?.length) {
    return NextResponse.json({ ad: null, reason: "no_fill" }, { status: 200, headers });
  }

  // Waterfall: filter eligible campaigns then sort by highest bid
  const eligible = (campaigns as Campaign[]).filter((c) => {
    if (c.spend >= c.total_budget) return false;
    if (c.start_date && c.start_date > today) return false;
    if (c.end_date && c.end_date < today) return false;
    const t = c.targeting_json;
    if (t?.countries?.length && !t.countries.includes(country)) return false;
    return c.ad_creatives.some((cr) => cr.size === targetSize);
  });

  if (!eligible.length) {
    return NextResponse.json({ ad: null, reason: "no_fill" }, { status: 200, headers });
  }

  eligible.sort((a, b) => (b.bid_amount ?? 0) - (a.bid_amount ?? 0));
  const winner = eligible[0];
  const creative = winner.ad_creatives.find((cr) => cr.size === targetSize)!;

  // Pre-generate impression ID so click can reference it
  const impressionId = crypto.randomUUID();
  const base = req.nextUrl.origin;

  return NextResponse.json(
    {
      ad: {
        campaignId: winner.id,
        creative: {
          id: creative.id,
          type: "banner",
          size: creative.size,
          headline: creative.headline,
          description: creative.description,
          ctaText: creative.cta_text || "Learn More",
          imageUrl: creative.image_url,
          destinationUrl: creative.destination_url,
        },
        tracking: {
          impressionUrl: `${base}/api/track/impression?cid=${winner.id}&crid=${creative.id}&auid=${adUnit.id}&iid=${impressionId}`,
          clickUrl: `${base}/api/track/click?cid=${winner.id}&auid=${adUnit.id}&iid=${impressionId}&url=${encodeURIComponent(creative.destination_url)}`,
        },
      },
    },
    { status: 200, headers }
  );
}
