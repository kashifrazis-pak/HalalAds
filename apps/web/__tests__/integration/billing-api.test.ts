/**
 * @jest-environment node
 */
/**
 * TC-I-030 to TC-I-036
 * Integration tests for billing — checkout + webhook end-to-end cycle
 */
import { NextRequest } from "next/server";

const mockAuth = jest.fn();
jest.mock("@/lib/auth", () => ({ auth: (...args: any[]) => mockAuth(...args) }));
jest.mock("@/lib/supabase", () => ({ createServiceClient: jest.fn() }));

const mockConstructEvent = jest.fn();
const mockSessionCreate = jest.fn();
jest.mock("@/lib/stripe", () => ({
  getStripe: jest.fn(() => ({
    checkout: { sessions: { create: mockSessionCreate } },
    webhooks: { constructEvent: mockConstructEvent },
  })),
  CREDIT_PACKAGES: [
    { id: "credits_50",  amount: 5000,  credits: 5000,  label: "$50",  popular: false },
    { id: "credits_200", amount: 20000, credits: 22000, label: "$200", bonus: "+10% bonus", popular: true },
    { id: "credits_500", amount: 50000, credits: 60000, label: "$500", bonus: "+20% bonus", popular: false },
  ],
}));

const { createServiceClient } = require("@/lib/supabase");
import { POST as checkoutPOST } from "@/app/api/billing/checkout/route";
import { POST as webhookPOST } from "@/app/api/billing/webhook/route";

function makeCheckoutDb() {
  return {
    from: jest.fn((table: string) => {
      const chain: any = {
        select: jest.fn(() => chain),
        eq: jest.fn(() => chain),
        maybeSingle: jest.fn(() =>
          Promise.resolve(table === "users" ? { data: { id: "u-1" }, error: null } : { data: null, error: null })
        ),
        single: jest.fn(() =>
          Promise.resolve(table === "advertisers" ? { data: { id: "adv-1" }, error: null } : { data: null, error: null })
        ),
      };
      return chain;
    }),
  };
}

function makeWebhookDb(balance = 5000) {
  return {
    from: jest.fn((table: string) => {
      const chain: any = {
        select: jest.fn(() => chain),
        update: jest.fn(() => chain),
        insert: jest.fn(() => chain),
        eq: jest.fn(() => chain),
        single: jest.fn(() =>
          Promise.resolve(table === "advertisers" ? { data: { balance }, error: null } : { data: null, error: null })
        ),
      };
      return chain;
    }),
  };
}

process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";

describe("Billing — integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.mockResolvedValue({ user: { email: "user@test.com" } });
    mockSessionCreate.mockResolvedValue({ url: "https://checkout.stripe.com/pay/cs_test_xyz" });
    createServiceClient.mockReturnValue(makeCheckoutDb());
  });

  it("TC-I-030: checkout returns 200 with Stripe URL for each valid package", async () => {
    for (const pkg of ["credits_50", "credits_200", "credits_500"]) {
      createServiceClient.mockReturnValue(makeCheckoutDb());
      const req = new NextRequest("http://localhost/api/billing/checkout", {
        method: "POST",
        body: JSON.stringify({ packageId: pkg }),
        headers: { "Content-Type": "application/json" },
      });
      const res = await checkoutPOST(req);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.url).toContain("checkout.stripe.com");
    }
  });

  it("TC-I-031: checkout with invalid packageId returns 400", async () => {
    const req = new NextRequest("http://localhost/api/billing/checkout", {
      method: "POST",
      body: JSON.stringify({ packageId: "credits_9999" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await checkoutPOST(req);
    expect(res.status).toBe(400);
  });

  it("TC-I-032: webhook missing signature returns 400", async () => {
    const req = new NextRequest("http://localhost/api/billing/webhook", {
      method: "POST",
      body: "{}",
    });
    const res = await webhookPOST(req);
    expect(res.status).toBe(400);
  });

  it("TC-I-033: webhook with valid checkout.session.completed returns 200", async () => {
    createServiceClient.mockReturnValue(makeWebhookDb(0));
    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          payment_intent: "pi_abc",
          metadata: { advertiser_id: "adv-1", package_id: "credits_200", credits: "22000", amount_cents: "20000" },
        },
      },
    });
    const req = new NextRequest("http://localhost/api/billing/webhook", {
      method: "POST",
      body: "{}",
      headers: { "stripe-signature": "valid-sig" },
    });
    const res = await webhookPOST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.received).toBe(true);
  });

  it("TC-I-034: webhook with non-checkout event returns 200 received:true (ignored)", async () => {
    mockConstructEvent.mockReturnValue({ type: "customer.created", data: { object: {} } });
    const req = new NextRequest("http://localhost/api/billing/webhook", {
      method: "POST",
      body: "{}",
      headers: { "stripe-signature": "valid-sig" },
    });
    const res = await webhookPOST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.received).toBe(true);
  });

  it("TC-I-035: checkout unauthenticated returns 401; webhook missing sig returns 400", async () => {
    mockAuth.mockResolvedValue(null);
    const checkoutReq = new NextRequest("http://localhost/api/billing/checkout", {
      method: "POST",
      body: JSON.stringify({ packageId: "credits_50" }),
      headers: { "Content-Type": "application/json" },
    });
    const webhookReq = new NextRequest("http://localhost/api/billing/webhook", {
      method: "POST",
      body: "{}",
    });
    const [checkRes, hookRes] = await Promise.all([
      checkoutPOST(checkoutReq),
      webhookPOST(webhookReq),
    ]);
    expect(checkRes.status).toBe(401);
    expect(hookRes.status).toBe(400);
  });

  it("TC-I-036: checkout Stripe metadata contains correct credits and amount", async () => {
    createServiceClient.mockReturnValue(makeCheckoutDb());
    const req = new NextRequest("http://localhost/api/billing/checkout", {
      method: "POST",
      body: JSON.stringify({ packageId: "credits_500" }),
      headers: { "Content-Type": "application/json" },
    });
    await checkoutPOST(req);
    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({
          package_id: "credits_500",
          credits: "60000",
          amount_cents: "50000",
        }),
      })
    );
  });
});
