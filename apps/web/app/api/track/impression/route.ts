import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const adId = searchParams.get("aid");
  const pubId = searchParams.get("pub");

  if (!adId || !pubId) {
    return new NextResponse(null, { status: 204 });
  }

  const ua = req.headers.get("user-agent") || "";
  const isBot = /bot|crawler|spider/i.test(ua);
  const country = req.headers.get("x-vercel-ip-country") || "XX";

  if (!isBot) {
    // In production: write impression to Supabase, update campaign spend,
    // credit publisher earnings via async queue
    console.log("impression", { adId, pubId, country, ts: Date.now() });
  }

  // Return 1×1 transparent pixel
  const pixel = Buffer.from(
    "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    "base64"
  );

  return new NextResponse(pixel, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
