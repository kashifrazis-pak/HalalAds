/**
 * TC-U-040 to TC-U-046
 * Unit tests for lib/stripe.ts — CREDIT_PACKAGES structure and getStripe() guard
 */
import { CREDIT_PACKAGES, getStripe } from "@/lib/stripe";

// Reset the lazy singleton between tests
beforeEach(() => {
  jest.resetModules();
  delete process.env.STRIPE_SECRET_KEY;
});

describe("CREDIT_PACKAGES", () => {
  it("TC-U-040: exports exactly 3 packages", () => {
    expect(CREDIT_PACKAGES).toHaveLength(3);
  });

  it("TC-U-041: $50 package has correct amount and credits", () => {
    const pkg = CREDIT_PACKAGES.find((p) => p.id === "credits_50");
    expect(pkg).toBeDefined();
    expect(pkg!.amount).toBe(5000);   // $50 in cents
    expect(pkg!.credits).toBe(5000);
    expect(pkg!.label).toBe("$50");
    expect(pkg!.popular).toBe(false);
  });

  it("TC-U-042: $200 package is marked popular and has 10% bonus credits", () => {
    const pkg = CREDIT_PACKAGES.find((p) => p.id === "credits_200");
    expect(pkg).toBeDefined();
    expect(pkg!.amount).toBe(20000);  // $200 in cents
    expect(pkg!.credits).toBe(22000); // 10% bonus
    expect(pkg!.popular).toBe(true);
    expect((pkg as any).bonus).toBe("+10% bonus");
  });

  it("TC-U-043: $500 package has 20% bonus credits", () => {
    const pkg = CREDIT_PACKAGES.find((p) => p.id === "credits_500");
    expect(pkg).toBeDefined();
    expect(pkg!.amount).toBe(50000);  // $500 in cents
    expect(pkg!.credits).toBe(60000); // 20% bonus
    expect((pkg as any).bonus).toBe("+20% bonus");
  });

  it("TC-U-044: all packages have positive amounts and credits", () => {
    CREDIT_PACKAGES.forEach((pkg) => {
      expect(pkg.amount).toBeGreaterThan(0);
      expect(pkg.credits).toBeGreaterThan(0);
    });
  });

  it("TC-U-045: credit value equals or exceeds dollar amount for each package", () => {
    CREDIT_PACKAGES.forEach((pkg) => {
      expect(pkg.credits).toBeGreaterThanOrEqual(pkg.amount / 100);
    });
  });

  it("TC-U-046: exactly one package is marked popular", () => {
    const popular = CREDIT_PACKAGES.filter((p) => p.popular);
    expect(popular).toHaveLength(1);
  });
});

describe("getStripe()", () => {
  it("TC-U-047: throws when STRIPE_SECRET_KEY is not set", () => {
    // Ensure env var is absent
    delete process.env.STRIPE_SECRET_KEY;
    // Re-require to get a fresh module with no cached singleton
    jest.isolateModules(() => {
      const { getStripe: freshGetStripe } = require("@/lib/stripe");
      expect(() => freshGetStripe()).toThrow("STRIPE_SECRET_KEY is not set");
    });
  });
});
