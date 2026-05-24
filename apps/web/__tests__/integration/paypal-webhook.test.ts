/**
 * @jest-environment node
 */
/**
 * TC-I-062 to TC-I-066
 * Integration tests for POST /api/billing/paypal-webhook
 */
import { NextRequest } from "next/server";

jest.mock("@/lib/supabase", () => ({ createServiceClient: jest.fn() }));
jest.mock("@/lib/paypal", () => ({
  verifyWebhookSignature: jest.fn(),
}));

const { createServiceClient } = require("@/lib/supabase");
const { verifyWebhookSignature } = require("@/lib/paypal");

import { POST } from "@/app/api/billing/paypal-webhook/route";

function makeDb() {
  return {
    from: jest.fn(() => {
      const chain: any = {};
      chain.update = jest.fn(() => chain);
      chain.eq = jest.fn(() => chain);
      // Makes `await db.from(...).update(...).eq(...).eq(...)` resolve to { error: null }
      chain.then = (resolve: any) => Promise.resolve({ error: null }).then(resolve);
      return chain;
    }),
  };
}

function makeEvent(eventType: string, resource: object = {}) {
  return JSON.stringify({ event_type: eventType, resource });
}

function makeRequest(body: string) {
  return new NextRequest("http://localhost/api/billing/paypal-webhook", {
    method: "POST",
    body,
    headers: {
      "paypal-transmission-id": "tx-id",
      "paypal-transmission-sig": "sig",
      "paypal-transmission-time": "2025-01-01T00:00:00Z",
      "paypal-auth-algo": "SHA256withRSA",
      "paypal-cert-url": "https://api.paypal.com/cert",
    },
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  createServiceClient.mockReturnValue(makeDb());
  verifyWebhookSignature.mockResolvedValue(true);
});

describe("POST /api/billing/paypal-webhook", () => {
  it("TC-I-062: returns 400 when signature verification fails", async () => {
    verifyWebhookSignature.mockResolvedValue(false);
    const res = await POST(makeRequest(makeEvent("PAYMENT.PAYOUTS-ITEM.SUCCEEDED")));
    expect(res.status).toBe(400);
  });

  it("TC-I-063: returns 200 for PAYMENT.PAYOUTS-ITEM.SUCCEEDED", async () => {
    const res = await POST(makeRequest(makeEvent("PAYMENT.PAYOUTS-ITEM.SUCCEEDED", {
      payout_batch_id: "batch-1", payout_item_id: "item-1",
    })));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.received).toBe(true);
  });

  it("TC-I-064: returns 200 for PAYMENT.PAYOUTS-ITEM.FAILED", async () => {
    const res = await POST(makeRequest(makeEvent("PAYMENT.PAYOUTS-ITEM.FAILED", {
      payout_batch_id: "batch-1", payout_item_id: "item-1",
      errors: { message: "Receiver account is invalid" },
    })));
    expect(res.status).toBe(200);
  });

  it("TC-I-065: returns 200 for PAYMENT.PAYOUTS-ITEM.UNCLAIMED", async () => {
    const res = await POST(makeRequest(makeEvent("PAYMENT.PAYOUTS-ITEM.UNCLAIMED", {
      payout_batch_id: "batch-1", payout_item_id: "item-1",
    })));
    expect(res.status).toBe(200);
  });

  it("TC-I-066: returns 200 for unknown event types (graceful ignore)", async () => {
    const res = await POST(makeRequest(makeEvent("SOME.OTHER.EVENT")));
    expect(res.status).toBe(200);
  });
});
