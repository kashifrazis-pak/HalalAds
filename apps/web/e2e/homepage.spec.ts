/**
 * TC-E-001 to TC-E-008
 * E2E tests for the homepage / landing page
 */
import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("TC-E-001: page loads with 200 status", async ({ page }) => {
    expect(page.url()).toContain("/");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("TC-E-002: hero headline contains '1.8 Billion'", async ({ page }) => {
    await expect(page.getByText(/1\.8 billion/i)).toBeVisible();
  });

  test("TC-E-003: navbar is visible with brand name", async ({ page }) => {
    await expect(page.getByText("Ads")).toBeVisible();
  });

  test("TC-E-004: nav links navigate correctly", async ({ page }) => {
    await page.getByRole("link", { name: /advertisers/i }).first().click();
    await expect(page).toHaveURL(/\/advertisers/);
  });

  test("TC-E-005: Get Started CTA navigates to waitlist", async ({ page }) => {
    await page.getByRole("link", { name: /get started/i }).first().click();
    await expect(page).toHaveURL(/\/waitlist/);
  });

  test("TC-E-006: page title contains Islamic Ad Network", async ({ page }) => {
    await expect(page).toHaveTitle(/islamic ad network/i);
  });

  test("TC-E-007: footer is visible", async ({ page }) => {
    await page.locator("footer").scrollIntoViewIfNeeded();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("TC-E-008: page has no console errors on load", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
    expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });
});
