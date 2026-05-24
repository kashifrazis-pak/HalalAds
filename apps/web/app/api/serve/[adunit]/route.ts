import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const pubId = searchParams.get("pub") || "unknown";
  const size = searchParams.get("size") || "300x250";
  const country = req.headers.get("x-vercel-ip-country") || "US";

  // Bot detection — reject known crawlers
  const ua = req.headers.get("user-agent") || "";
  const isBot = /bot|crawler|spider|scraper/i.test(ua);
  if (isBot) {
    return NextResponse.json({ ad: null, reason: "bot" }, { status: 200 });
  }

  // Ad decision (waterfall: direct deals → CPM → CPC floor)
  // In production this queries the campaigns DB filtered by country + targeting
  const mockAd = {
    id: "ad_mock_001",
    campaignId: "camp_001",
    advertiserId: "adv_001",
    creative: {
      type: "banner",
      imageUrl: null,
      headline: "Discover Halal Finance",
      description: "Shariah-compliant investment solutions",
      ctaText: "Learn More",
      destinationUrl: "https://halalads.com",
      size,
    },
    tracking: {
      impressionUrl: `${req.nextUrl.origin}/api/track/impression?aid=ad_mock_001&pub=${pubId}`,
      clickUrl: `${req.nextUrl.origin}/api/track/click?aid=ad_mock_001&pub=${pubId}`,
    },
    type: "cpm",
    bidValue: 2.50,
    country,
  };

  return NextResponse.json({ ad: mockAd }, {
    headers: {
      "Cache-Control": "no-store, no-cache",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
