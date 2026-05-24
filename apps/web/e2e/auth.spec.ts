/**
 * TC-E-040 to TC-E-045
 * E2E tests for authentication — sign-in page and auth guards
 */
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("TC-E-040: sign-in page renders without error", async ({ page }) => {
    await page.goto("/auth/signin");
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("TC-E-041: sign-in page has Google OAuth button", async ({ page }) => {
    await page.goto("/auth/signin");
    await expect(page.getByRole("button", { name: /google/i })).toBeVisible();
  });

  test("TC-E-042: sign-in page has email magic link input", async ({ page }) => {
    await page.goto("/auth/signin");
    await expect(page.getByPlaceholderText(/email/i)).toBeVisible();
  });

  test("TC-E-043: dashboard redirects unauthenticated users to sign-in", async ({ page }) => {
    await page.goto("/dashboard/advertiser");
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test("TC-E-044: publisher dashboard redirects unauthenticated users to sign-in", async ({ page }) => {
    await page.goto("/dashboard/publisher");
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test("TC-E-045: sign-in page title contains Islamic Ad Network", async ({ page }) => {
    await page.goto("/auth/signin");
    await expect(page).toHaveTitle(/islamic ad network/i);
  });
});
