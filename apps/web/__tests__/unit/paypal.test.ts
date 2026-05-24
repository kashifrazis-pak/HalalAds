/**
 * @jest-environment node
 */
/**
 * TC-U-100 to TC-U-107
 * Unit tests for lib/paypal.ts — OAuth token fetch + Payouts API + webhook verification
 */

const mockFetch = jest.fn();
global.fetch = mockFetch;

// Must import AFTER patching fetch
import { createPayoutBatch, verifyWebhookSignature } from "@/lib/paypal";

function mockTokenResponse() {
  return { ok: true, text: () => Promise.resolve(""), json: () => Promise.resolve({ access_token: "test-token-abc" }) };
}

function mockPayoutResponse(items: object[] = []) {
  return {
    ok: true,
    text: () => Promise.resolve(""),
    json: () =>
      Promise.resolve({
        batch_header: { payout_batch_id: "BATCH123", batch_status: "PENDING" },
        items,
      }),
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  process.env.PAYPAL_CLIENT_ID = "test-client-id";
  process.env.PAYPAL_CLIENT_SECRET = "test-client-secret";
  process.env.PAYPAL_MODE = "sandbox";
  process.env.PAYPAL_WEBHOOK_ID = "WH-ID-123";
});

describe("createPayoutBatch", () => {
  it("TC-U-100: fetches OAuth token before calling Payouts API", async () => {
    mockFetch
      .mockResolvedValueOnce(mockTokenResponse())
      .mockResolvedValueOnce(mockPayoutResponse());

    await createPayoutBatch([{ publisherId: "pub-1", email: "p@paypal.com", amountCents: 5000 }]);

    const tokenCall = mockFetch.mock.calls[0];
    expect(tokenCall[0]).toContain("oauth2/token");
    expect(tokenCall[1].headers.Authorization).toMatch(/^Basic /);
  });

  it("TC-U-101: calls Payouts API with correct endpoint (sandbox)", async () => {
    mockFetch
      .mockResolvedValueOnce(mockTokenResponse())
      .mockResolvedValueOnce(mockPayoutResponse());

    await createPayoutBatch([{ publisherId: "pub-1", email: "p@paypal.com", amountCents: 5000 }]);

    const payoutCall = mockFetch.mock.calls[1];
    expect(payoutCall[0]).toContain("sandbox.paypal.com");
    expect(payoutCall[0]).toContain("payouts");
  });

  it("TC-U-102: converts amount_cents to dollars correctly in payload", async () => {
    mockFetch
      .mockResolvedValueOnce(mockTokenResponse())
      .mockResolvedValueOnce(mockPayoutResponse());

    await createPayoutBatch([{ publisherId: "pub-1", email: "p@paypal.com", amountCents: 7500 }]);

    const payoutBody = JSON.parse(mockFetch.mock.calls[1][1].body);
    expect(payoutBody.items[0].amount.value).toBe("75.00");
  });

  it("TC-U-103: returns batchId and status from PayPal response", async () => {
    mockFetch
      .mockResolvedValueOnce(mockTokenResponse())
      .mockResolvedValueOnce(mockPayoutResponse());

    const result = await createPayoutBatch([{ publisherId: "pub-1", email: "p@paypal.com", amountCents: 5000 }]);

    expect(result.batchId).toBe("BATCH123");
    expect(result.status).toBe("PENDING");
  });

  it("TC-U-104: throws when PayPal auth fails", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, text: () => Promise.resolve("Unauthorized") });

    await expect(
      createPayoutBatch([{ publisherId: "pub-1", email: "p@paypal.com", amountCents: 5000 }])
    ).rejects.toThrow("PayPal auth failed");
  });

  it("TC-U-105: throws when Payouts API returns non-OK", async () => {
    mockFetch
      .mockResolvedValueOnce(mockTokenResponse())
      .mockResolvedValueOnce({ ok: false, text: () => Promise.resolve("Forbidden") });

    await expect(
      createPayoutBatch([{ publisherId: "pub-1", email: "p@paypal.com", amountCents: 5000 }])
    ).rejects.toThrow("PayPal payout failed");
  });
});

describe("verifyWebhookSignature", () => {
  it("TC-U-106: returns true when PayPal verification returns SUCCESS", async () => {
    mockFetch
      .mockResolvedValueOnce(mockTokenResponse())
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ verification_status: "SUCCESS" }) });

    const result = await verifyWebhookSignature(
      { "paypal-transmission-id": "tx", "paypal-transmission-sig": "sig", "paypal-transmission-time": "t", "paypal-auth-algo": "algo", "paypal-cert-url": "url" },
      JSON.stringify({ event_type: "PAYMENT.PAYOUTS-ITEM.SUCCEEDED" })
    );

    expect(result).toBe(true);
  });

  it("TC-U-107: returns false when verification status is not SUCCESS", async () => {
    mockFetch
      .mockResolvedValueOnce(mockTokenResponse())
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ verification_status: "FAILURE" }) });

    const result = await verifyWebhookSignature(
      { "paypal-transmission-id": "tx", "paypal-transmission-sig": "sig", "paypal-transmission-time": "t", "paypal-auth-algo": "algo", "paypal-cert-url": "url" },
      JSON.stringify({ event_type: "PAYMENT.PAYOUTS-ITEM.SUCCEEDED" })
    );

    expect(result).toBe(false);
  });
});
