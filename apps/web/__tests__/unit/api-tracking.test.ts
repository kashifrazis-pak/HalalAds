/**
 * @jest-environment node
 */
/**
 * TC-U-030 to TC-U-036
 * Unit tests for ad tracking API routes — impression pixel and click redirect
 */
import { NextRequest } from "next/server";
import { GET as impressionGET } from "@/app/api/track/impression/route";
import { GET as clickGET } from "@/app/api/track/click/route";

describe("GET /api/track/impression", () => {
  it("TC-U-030: returns 1×1 GIF for valid request", async () => {
    const req = new NextRequest("http://localhost/api/track/impression?aid=ad_001&pub=PUB_001");
    const res = await impressionGET(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("image/gif");
  });

  it("TC-U-031: returns 204 when aid or pub is missing", async () => {
    const req = new NextRequest("http://localhost/api/track/impression");
    const res = await impressionGET(req);
    expect(res.status).toBe(204);
  });

  it("TC-U-032: sets no-cache headers to prevent browser caching", async () => {
    const req = new NextRequest("http://localhost/api/track/impression?aid=ad_001&pub=PUB_001");
    const res = await impressionGET(req);
    expect(res.headers.get("cache-control")).toContain("no-store");
  });

  it("TC-U-033: sets CORS header allowing any origin", async () => {
    const req = new NextRequest("http://localhost/api/track/impression?aid=ad_001&pub=PUB_001");
    const res = await impressionGET(req);
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
  });
});

describe("GET /api/track/click", () => {
  it("TC-U-034: redirects to destination URL with UTM params", async () => {
    const dest = "https://halalfood.com/landing";
    const req = new NextRequest(`http://localhost/api/track/click?aid=ad_001&url=${encodeURIComponent(dest)}`);
    const res = await clickGET(req);
    expect(res.status).toBe(302);
    const location = res.headers.get("location");
    expect(location).toContain("utm_source=islamicadnetwork");
    expect(location).toContain("utm_medium=display");
  });

  it("TC-U-035: redirects when destination URL is missing", async () => {
    const req = new NextRequest("http://localhost/api/track/click?aid=ad_001");
    const res = await clickGET(req);
    expect([302, 307]).toContain(res.status);
  });

  it("TC-U-036: redirects when destination URL is invalid", async () => {
    const req = new NextRequest("http://localhost/api/track/click?aid=ad_001&url=not-a-url");
    const res = await clickGET(req);
    expect([302, 307]).toContain(res.status);
  });
});
