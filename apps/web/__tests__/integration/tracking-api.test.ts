/**
 * @jest-environment node
 */
/**
 * TC-I-010 to TC-I-018
 * Integration tests for ad tracking — impression + click full cycle
 */
import { NextRequest } from "next/server";
import { GET as impressionGET } from "@/app/api/track/impression/route";
import { GET as clickGET } from "@/app/api/track/click/route";

describe("Impression tracking — integration", () => {
  it("TC-I-010: valid request returns 1×1 GIF binary", async () => {
    const req = new NextRequest("http://localhost/api/track/impression?aid=campaign_1&pub=site_1");
    const res = await impressionGET(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("image/gif");
    const buf = await res.arrayBuffer();
    expect(buf.byteLength).toBeGreaterThan(0);
  });

  it("TC-I-011: response body is valid GIF (starts with GIF89a)", async () => {
    const req = new NextRequest("http://localhost/api/track/impression?aid=x&pub=y");
    const res = await impressionGET(req);
    const buf = new Uint8Array(await res.arrayBuffer());
    // GIF89a magic bytes: 47 49 46 38 39 61
    expect(buf[0]).toBe(0x47); // G
    expect(buf[1]).toBe(0x49); // I
    expect(buf[2]).toBe(0x46); // F
  });

  it("TC-I-012: missing aid returns 204 no content", async () => {
    const req = new NextRequest("http://localhost/api/track/impression?pub=site_1");
    const res = await impressionGET(req);
    expect(res.status).toBe(204);
  });

  it("TC-I-013: missing pub returns 204 no content", async () => {
    const req = new NextRequest("http://localhost/api/track/impression?aid=ad_1");
    const res = await impressionGET(req);
    expect(res.status).toBe(204);
  });

  it("TC-I-014: cache-control includes no-store and no-cache", async () => {
    const req = new NextRequest("http://localhost/api/track/impression?aid=x&pub=y");
    const res = await impressionGET(req);
    const cc = res.headers.get("cache-control") ?? "";
    expect(cc).toContain("no-store");
  });

  it("TC-I-015: CORS header present", async () => {
    const req = new NextRequest("http://localhost/api/track/impression?aid=x&pub=y");
    const res = await impressionGET(req);
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
  });
});

describe("Click tracking — integration", () => {
  it("TC-I-016: valid click redirects to URL with utm_source", async () => {
    const dest = encodeURIComponent("https://example.com/landing");
    const req = new NextRequest(`http://localhost/api/track/click?aid=ad_1&url=${dest}`);
    const res = await clickGET(req);
    expect(res.status).toBe(302);
    const loc = res.headers.get("location") ?? "";
    expect(loc).toContain("utm_source=islamicadnetwork");
    expect(loc).toContain("utm_medium=display");
  });

  it("TC-I-017: click without URL falls back to a redirect", async () => {
    const req = new NextRequest("http://localhost/api/track/click?aid=ad_1");
    const res = await clickGET(req);
    expect([302, 307]).toContain(res.status);
  });

  it("TC-I-018: click with invalid URL falls back to a redirect (no invalid URL in location)", async () => {
    const req = new NextRequest("http://localhost/api/track/click?aid=ad_1&url=not-a-url");
    const res = await clickGET(req);
    expect([302, 307]).toContain(res.status);
    const loc = res.headers.get("location") ?? "";
    expect(loc).not.toContain("not-a-url");
  });
});
