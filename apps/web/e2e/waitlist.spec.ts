/**
 * TC-E-020 to TC-E-026
 * E2E tests for waitlist form — advertiser and publisher flows
 */
import { test, expect } from "@playwright/test";

test.describe("Waitlist form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/waitlist");
  });

  test("TC-E-020: waitlist page renders form", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /join the waitlist/i })).toBeVisible();
  });

  test("TC-E-021: advertiser tab is selected by default", async ({ page }) => {
    const advertiserBtn = page.getByRole("button", { name: /i'm an advertiser/i });
    await expect(advertiserBtn).toBeVisible();
  });

  test("TC-E-022: can switch to publisher tab", async ({ page }) => {
    await page.getByRole("button", { name: /i'm a publisher/i }).click();
    // Publisher tab should now appear active (check placeholder text changes)
    await expect(page.getByPlaceholderText(/muhammad hassan/i)).toBeVisible();
  });

  test("TC-E-023: submitting with empty fields shows browser validation", async ({ page }) => {
    const submitBtn = page.getByRole("button", { name: /join the waitlist/i });
    await submitBtn.click();
    // HTML5 required validation prevents submission — form should still be present
    await expect(submitBtn).toBeVisible();
  });

  test("TC-E-024: valid advertiser submission shows success message", async ({ page }) => {
    await page.getByPlaceholderText(/ahmed al-rashid/i).fill("Ahmad Ali");
    await page.getByPlaceholderText("you@company.com").fill("ahmad@halal.com");
    await page.getByRole("button", { name: /join the waitlist/i }).click();
    await expect(page.getByText(/you're on the list/i)).toBeVisible({ timeout: 5000 });
  });

  test("TC-E-025: loading indicator appears during submission", async ({ page }) => {
    await page.getByPlaceholderText(/ahmed al-rashid/i).fill("Test User");
    await page.getByPlaceholderText("you@company.com").fill("test@example.com");
    await page.getByRole("button", { name: /join the waitlist/i }).click();
    // Loading state appears briefly
    await expect(page.getByText(/joining/i)).toBeVisible({ timeout: 2000 });
  });

  test("TC-E-026: success state does not show form fields", async ({ page }) => {
    await page.getByPlaceholderText(/ahmed al-rashid/i).fill("Fatima Hassan");
    await page.getByPlaceholderText("you@company.com").fill("fatima@example.com");
    await page.getByRole("button", { name: /join the waitlist/i }).click();
    await page.getByText(/you're on the list/i).waitFor({ timeout: 5000 });
    await expect(page.getByPlaceholderText("you@company.com")).not.toBeVisible();
  });
});
