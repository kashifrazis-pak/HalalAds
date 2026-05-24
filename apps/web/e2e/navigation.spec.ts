/**
 * TC-E-010 to TC-E-018
 * E2E tests for site navigation — all public pages reachable
 */
import { test, expect } from "@playwright/test";

const publicPages = [
  { path: "/", title: /islamic ad network/i },
  { path: "/advertisers", title: /advertis/i },
  { path: "/publishers", title: /publish/i },
  { path: "/pricing", title: /pricing/i },
  { path: "/about", title: /about/i },
  { path: "/blog", title: /blog/i },
  { path: "/waitlist", title: /waitlist/i },
];

test.describe("Navigation — all public pages", () => {
  publicPages.forEach(({ path, title }, idx) => {
    test(`TC-E-0${10 + idx}: ${path} loads without error`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBeLessThan(400);
      await expect(page).toHaveTitle(title);
    });
  });

  test("TC-E-018: 404 page for unknown route", async ({ page }) => {
    const response = await page.goto("/this-does-not-exist-xyz");
    expect(response?.status()).toBe(404);
  });
});
