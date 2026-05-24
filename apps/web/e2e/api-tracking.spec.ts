/**
 * TC-E-050 to TC-E-054
 * E2E tests for ad tracking API — via real HTTP requests
 */
import { test, expect } from "@playwright/test";

test.describe("Ad Tracking API", () => {
  test("TC-E-050: impression pixel returns 200 with GIF content-type", async ({ request }) => {
    const res = await request.get("/api/track/impression?aid=test_ad&pub=test_pub");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/gif");
  });

  test("TC-E-051: impression pixel with missing params returns 204", async ({ request }) => {
    const res = await request.get("/api/track/impression");
    expect(res.status()).toBe(204);
  });

  test("TC-E-052: impression pixel has no-store cache-control", async ({ request }) => {
    const res = await request.get("/api/track/impression?aid=a&pub=b");
    expect(res.headers()["cache-control"]).toContain("no-store");
  });

  test("TC-E-053: click redirect returns 302 with UTM params", async ({ request }) => {
    const dest = encodeURIComponent("https://example.com");
    const res = await request.get(`/api/track/click?aid=ad_1&url=${dest}`, { maxRedirects: 0 });
    expect(res.status()).toBe(302);
    const loc = res.headers()["location"] ?? "";
    expect(loc).toContain("utm_source=islamicadnetwork");
  });

  test("TC-E-054: click with no URL redirects to home", async ({ request }) => {
    const res = await request.get("/api/track/click?aid=ad_1", { maxRedirects: 0 });
    expect(res.status()).toBe(302);
  });
});
