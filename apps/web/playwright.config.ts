import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["junit", { outputFile: "playwright-results.xml" }],
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3001",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
  // When running locally against Docker, no webServer needed.
  // In CI, start the app fresh:
  webServer: process.env.CI
    ? {
        command: "npm run start",
        url: "http://localhost:3000",
        reuseExistingServer: false,
        env: {
          NEXT_PUBLIC_SUPABASE_URL: "https://placeholder.supabase.co",
          NEXT_PUBLIC_SUPABASE_ANON_KEY: "placeholder",
          SUPABASE_SERVICE_ROLE_KEY: "placeholder",
          AUTH_SECRET: "islamicadnetwork-test-secret-32char",
          AUTH_URL: "http://localhost:3000",
          AUTH_TRUST_HOST: "true",
          STRIPE_SECRET_KEY: "sk_test_placeholder",
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_placeholder",
          RESEND_API_KEY: "re_placeholder",
        },
      }
    : undefined,
});
