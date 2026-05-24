/**
 * @jest-environment node
 */
/**
 * TC-U-090 to TC-U-097
 * Unit tests for GET /api/serve/[adunit] — ad decision + serving
 */
import { NextRequest } from "next/server";
import { GET } from "@/app/api/serve/[adunit]/route";

function makeReq(params: Record<string, string> = {}, headers: Record<string, string> = {}) {
  const qs = new URLSearchParams({ pub: "site_001", size: "300x250", ...params }).toString();
  const req = new NextRequest(`http://localhost/api/serve/test-unit?${qs}`);
  Object.entries(headers).forEach(([k, v]) => req.headers.set(k, v));
  return req;
}

describe("GET /api/serve/[adunit]", () => {
  it("TC-U-090: returns 200 with an ad object", async () => {
    const res = await GET(makeReq(), { params: { adunit: "unit-abc" } } as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ad).toBeDefined();
  });

  it("TC-U-091: response includes creative headline and CTA", async () => {
    const res = await GET(makeReq(), { params: { adunit: "unit-abc" } } as any);
    const body = await res.json();
    expect(body.ad.creative.headline).toBeTruthy();
    expect(body.ad.creative.ctaText).toBeTruthy();
  });

  it("TC-U-092: response includes tracking impression and click URLs", async () => {
    const res = await GET(makeReq(), { params: { adunit: "unit-abc" } } as any);
    const body = await res.json();
    expect(body.ad.tracking.impressionUrl).toContain("/api/track/impression");
    expect(body.ad.tracking.clickUrl).toContain("/api/track/click");
  });

  it("TC-U-093: returns ad:null with reason:bot for known bot user-agents", async () => {
    const res = await GET(
      makeReq({}, { "user-agent": "Googlebot/2.1 (+http://www.google.com/bot.html)" }),
      { params: { adunit: "unit-abc" } } as any
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ad).toBeNull();
    expect(body.reason).toBe("bot");
  });

  it("TC-U-094: cache-control header prevents caching", async () => {
    const res = await GET(makeReq(), { params: { adunit: "unit-abc" } } as any);
    const cc = res.headers.get("cache-control") ?? "";
    expect(cc).toContain("no-store");
  });

  it("TC-U-095: CORS header allows any origin", async () => {
    const res = await GET(makeReq(), { params: { adunit: "unit-abc" } } as any);
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
  });

  it("TC-U-096: requested size is reflected in the creative", async () => {
    const res = await GET(makeReq({ size: "728x90" }), { params: { adunit: "unit-abc" } } as any);
    const body = await res.json();
    expect(body.ad.creative.size).toBe("728x90");
  });

  it("TC-U-097: spider user-agent is treated as bot", async () => {
    const res = await GET(
      makeReq({}, { "user-agent": "AhrefsBot/7.0" }),
      { params: { adunit: "unit-abc" } } as any
    );
    const body = await res.json();
    expect(body.ad).toBeNull();
  });
});
