/**
 * @jest-environment node
 */
/**
 * TC-U-077 to TC-U-083
 * Unit tests for POST /api/billing/webhook — Stripe webhook handler
 */
import { NextRequest } from "next/server";

const mockConstructEvent = jest.fn();
jest.mock("@/lib/stripe", () => ({
  getStripe: () => ({ webhooks: { constructEvent: mockConstructEvent } }),
  CREDIT_PACKAGES: [],
}));

jest.mock("@/lib/supabase", () => ({ createServiceClient: jest.fn() }));
const { createServiceClient } = require("@/lib/supabase");
import { POST } from "@/app/api/billing/webhook/route";

function makeDb(balance = 0) {
  return {
    from: jest.fn((table: string) => {
      const chain: any = {
        select: jest.fn(() => chain),
        update: jest.fn(() => chain),
        insert: jest.fn(() => chain),
        eq: jest.fn(() => chain),
        single: jest.fn(() =>
          Promise.resolve(
            table === "advertisers"
              ? { data: { balance }, error: null }
              : { data: { id: "txn-uuid" }, error: null }
          )
        ),
      };
      return chain;
    }),
  };
}

function makeReq(body = "{}", sig = "valid-sig") {
  return new NextRequest("http://localhost/api/billing/webhook", {
    method: "POST",
    body,
    headers: { "stripe-signature": sig },
  });
}

const completedEvent = {
  type: "checkout.session.completed",
  data: {
    object: {
      payment_intent: "pi_123",
      metadata: { advertiser_id: "adv-uuid", package_id: "credits_200", credits: "22000", amount_cents: "20000" },
    },
  },
};

beforeEach(() => {
  jest.clearAllMocks();
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
  createServiceClient.mockReturnValue(makeDb(10000));
  mockConstructEvent.mockReturnValue(completedEvent);
});

describe("POST /api/billing/webhook", () => {
  it("TC-U-077: returns 400 when stripe-signature header is missing", async () => {
    const req = new NextRequest("http://localhost/api/billing/webhook", {
      method: "POST",
      body: "{}",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("TC-U-078: returns 400 when signature verification throws (invalid signature)", async () => {
    mockConstructEvent.mockImplementation(() => { throw new Error("Signature mismatch"); });
    const res = await POST(makeReq());
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid signature");
  });

  it("TC-U-079: returns 200 received:true for non-checkout event types", async () => {
    mockConstructEvent.mockReturnValue({ type: "payment_intent.created", data: { object: {} } });
    const res = await POST(makeReq());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.received).toBe(true);
  });

  it("TC-U-080: returns 200 for checkout.session.completed with valid metadata", async () => {
    const res = await POST(makeReq());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.received).toBe(true);
  });

  it("TC-U-081: returns 400 when checkout metadata is incomplete", async () => {
    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: { object: { metadata: {} } }, // missing advertiser_id, credits, amount_cents
    });
    const res = await POST(makeReq());
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Missing metadata");
  });

  it("TC-U-082: returns 404 when advertiser not found in DB after valid event", async () => {
    createServiceClient.mockReturnValue({
      from: jest.fn((table: string) => {
        const chain: any = {
          select: jest.fn(() => chain),
          update: jest.fn(() => chain),
          insert: jest.fn(() => chain),
          eq: jest.fn(() => chain),
          single: jest.fn(() =>
            Promise.resolve(table === "advertisers" ? { data: null, error: null } : { data: null, error: null })
          ),
        };
        return chain;
      }),
    });
    const res = await POST(makeReq());
    expect(res.status).toBe(404);
  });

  it("TC-U-083: response is always application/json", async () => {
    const res = await POST(makeReq());
    expect(res.headers.get("content-type")).toContain("application/json");
  });
});
