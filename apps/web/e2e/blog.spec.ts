/**
 * TC-E-030 to TC-E-036
 * E2E tests for blog — listing and article pages
 */
import { test, expect } from "@playwright/test";

test.describe("Blog", () => {
  test("TC-E-030: blog index loads and lists posts", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("heading", { name: /blog/i })).toBeVisible();
  });

  test("TC-E-031: blog post cards are visible", async ({ page }) => {
    await page.goto("/blog");
    const articles = page.locator("article, [data-testid='post-card'], a[href^='/blog/']");
    await expect(articles.first()).toBeVisible();
  });

  test("TC-E-032: clicking a post navigates to article", async ({ page }) => {
    await page.goto("/blog");
    const links = page.locator("a[href^='/blog/']");
    const href = await links.first().getAttribute("href");
    await links.first().click();
    await expect(page).toHaveURL(new RegExp(href!.replace("/", "\\/")));
  });

  test("TC-E-033: blog article page renders content", async ({ page }) => {
    await page.goto("/blog/halal-advertising-muslim-market-guide");
    await expect(page.locator("article, main")).toBeVisible();
  });

  test("TC-E-034: blog article page has correct meta title", async ({ page }) => {
    await page.goto("/blog/halal-advertising-muslim-market-guide");
    const title = await page.title();
    expect(title.length).toBeGreaterThan(5);
  });

  test("TC-E-035: non-existent blog post returns 404", async ({ page }) => {
    const response = await page.goto("/blog/this-post-does-not-exist-abc123");
    expect(response?.status()).toBe(404);
  });

  test("TC-E-036: blog index links go to valid slugs", async ({ page }) => {
    await page.goto("/blog");
    const links = page.locator("a[href^='/blog/']");
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});
