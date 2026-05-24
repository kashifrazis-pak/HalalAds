import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const adId = searchParams.get("aid");
  const pubId = searchParams.get("pub");
  const dest = searchParams.get("url");

  if (!adId || !dest) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const ua = req.headers.get("user-agent") || "";
  const isBot = /bot|crawler|spider/i.test(ua);

  if (!isBot) {
    // In production: record click, check velocity limits (fraud detection),
    // deduct from advertiser balance, credit publisher
    console.log("click", { adId, pubId, ts: Date.now() });
  }

  // Redirect to destination with cache-bust
  try {
    const url = new URL(dest);
    url.searchParams.set("utm_source", "islamicadnetwork");
    url.searchParams.set("utm_medium", "display");
    return NextResponse.redirect(url.toString(), {
      status: 302,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.redirect(new URL("/", req.url));
  }
}
