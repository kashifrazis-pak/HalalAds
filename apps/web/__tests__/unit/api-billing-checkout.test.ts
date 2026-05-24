/**
 * @jest-environment node
 */
/**
 * TC-U-071 to TC-U-076
 * Unit tests for POST /api/billing/checkout — Stripe checkout session creation
 */
import { NextRequest } from "next/server";

const mockAuth = jest.fn();
jest.mock("@/lib/auth", () => ({ auth: (...args: any[]) => mockAuth(...args) }));
jest.mock("@/lib/supabase", () => ({ createServiceClient: jest.fn() }));

const mockCheckoutCreate = jest.fn();
jest.mock("@/lib/stripe", () => ({
  getStripe: () => ({ checkout: { sessions: { create: mockCheckoutCreate } } }),
  CREDIT_PACKAGES: [
    { id: "credits_50",  amount: 5000,  credits: 5000,  label: "$50",  popular: false },
    { id: "credits_200", amount: 20000, credits: 22000, label: "$200", bonus: "+10% bonus", popular: true },
    { id: "credits_500", amount: 50000, credits: 60000, label: "$500", bonus: "+20% bonus", popular: false },
  ],
}));

const { createServiceClient } = require("@/lib/supabase");
import { POST } from "@/app/api/billing/checkout/route";

function makeDb(userError = false, advertiserError = false) {
  return {
    from: jest.fn((table: string) => {
      const chain: any = {
        select: jest.fn(() => chain),
        eq: jest.fn(() => chain),
        maybeSingle: jest.fn(() =>
          Promise.resolve(
            table === "users"
              ? userError ? { data: null, error: { message: "Not found" } } : { data: { id: "user-uuid" }, error: null }
              : { data: null, error: null }
          )
        ),
        single: jest.fn(() =>
          Promise.resolve(
            table === "advertisers"
              ? advertiserError ? { data: null, error: { message: "Not found" } } : { data: { id: "adv-uuid" }, error: null }
              : { data: null, error: null }
          )
        ),
      };
      return chain;
    }),
  };
}

function makeReq(body: object) {
  return new NextRequest("http://localhost/api/billing/checkout", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json", origin: "https://islamicadnetwork.com" },
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockAuth.mockResolvedValue({ user: { email: "user@test.com" } });
  createServiceClient.mockReturnValue(makeDb());
  mockCheckoutCreate.mockResolvedValue({ url: "https://checkout.stripe.com/pay/cs_test_abc" });
});

describe("POST /api/billing/checkout", () => {
  it("TC-U-071: returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await POST(makeReq({ packageId: "credits_50" }));
    expect(res.status).toBe(401);
  });

  it("TC-U-072: returns 400 for an unrecognised package id", async () => {
    const res = await POST(makeReq({ packageId: "credits_9999" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid package");
  });

  it("TC-U-073: returns 404 when advertiser profile not found", async () => {
    createServiceClient.mockReturnValue(makeDb(false, true));
    const res = await POST(makeReq({ packageId: "credits_50" }));
    expect(res.status).toBe(404);
  });

  it("TC-U-074: returns 200 with Stripe checkout URL for credits_50", async () => {
    const res = await POST(makeReq({ packageId: "credits_50" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.url).toContain("checkout.stripe.com");
  });

  it("TC-U-075: returns 200 with Stripe checkout URL for credits_200", async () => {
    const res = await POST(makeReq({ packageId: "credits_200" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.url).toBeTruthy();
  });

  it("TC-U-076: Stripe checkout is called with correct advertiser metadata", async () => {
    await POST(makeReq({ packageId: "credits_50" }));
    expect(mockCheckoutCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({ advertiser_id: "adv-uuid", package_id: "credits_50" }),
      })
    );
  });
});
