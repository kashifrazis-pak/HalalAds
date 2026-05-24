/**
 * @jest-environment node
 */
/**
 * TC-I-055 to TC-I-061
 * Integration tests for POST /api/admin/payouts/process
 */
import { NextRequest } from "next/server";

jest.mock("@/lib/supabase", () => ({ createServiceClient: jest.fn() }));
jest.mock("@/lib/paypal", () => ({
  createPayoutBatch: jest.fn(),
}));

const { createServiceClient } = require("@/lib/supabase");
const { createPayoutBatch } = require("@/lib/paypal");

import { POST } from "@/app/api/admin/payouts/process/route";

process.env.ADMIN_SECRET = "test-admin-secret-123";

function makeDb(overrides: Record<string, { data?: any; error?: any }> = {}) {
  const defaults: Record<string, { data?: any; error?: any }> = {
    publishers:               { data: { id: "pub-uuid" }, error: null },
    publisher_payout_methods: { data: { method: "paypal", email: "pub@paypal.com" }, error: null },
    publisher_payouts:        { data: { id: "payout-uuid" }, error: null },
  };
  const tables = { ...defaults, ...overrides };
  return {
    from: jest.fn((table: string) => {
      const resp = tables[table] ?? { data: null, error: null };
      const chain: any = {};
      chain.select = jest.fn(() => chain);
      chain.insert = jest.fn(() => chain);
      chain.update = jest.fn(() => chain);
      chain.eq = jest.fn(() => chain);
      chain.maybeSingle = jest.fn(() => Promise.resolve(resp));
      chain.single = jest.fn(() => Promise.resolve(resp));
      // Makes `await db.from(...).update(...).eq(...)` resolve to { error: null }
      chain.then = (resolve: any) => Promise.resolve({ error: null }).then(resolve);
      return chain;
    }),
  };
}

function makeRequest(body: object, secret = "test-admin-secret-123") {
  return new NextRequest("http://localhost/api/admin/payouts/process", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": secret,
    },
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  createServiceClient.mockReturnValue(makeDb());
  createPayoutBatch.mockResolvedValue({
    batchId: "batch-abc",
    status: "PENDING",
    items: [{ senderId: "pub-uuid", itemId: "item-xyz" }],
  });
});

describe("POST /api/admin/payouts/process", () => {
  it("TC-I-055: returns 403 with missing or wrong admin secret", async () => {
    const req = makeRequest({ publisher_id: "pub-uuid", amount_cents: 5000 }, "wrong-secret");
    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it("TC-I-056: returns 400 when amount_cents is below minimum ($25)", async () => {
    const req = makeRequest({ publisher_id: "pub-uuid", amount_cents: 1000 });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("TC-I-057: returns 404 when publisher not found", async () => {
    createServiceClient.mockReturnValue(makeDb({ publishers: { data: null, error: null } }));
    const req = makeRequest({ publisher_id: "bad-uuid", amount_cents: 5000 });
    const res = await POST(req);
    expect(res.status).toBe(404);
  });

  it("TC-I-058: returns 422 when publisher has no payout method", async () => {
    createServiceClient.mockReturnValue(
      makeDb({ publisher_payout_methods: { data: null, error: null } })
    );
    const req = makeRequest({ publisher_id: "pub-uuid", amount_cents: 5000 });
    const res = await POST(req);
    expect(res.status).toBe(422);
  });

  it("TC-I-059: returns 422 when payout method is not paypal", async () => {
    createServiceClient.mockReturnValue(
      makeDb({ publisher_payout_methods: { data: { method: "bank", email: null }, error: null } })
    );
    const req = makeRequest({ publisher_id: "pub-uuid", amount_cents: 5000 });
    const res = await POST(req);
    expect(res.status).toBe(422);
  });

  it("TC-I-060: returns 200 with batch ID on success", async () => {
    const req = makeRequest({ publisher_id: "pub-uuid", amount_cents: 5000 });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.paypal_batch_id).toBe("batch-abc");
  });

  it("TC-I-061: returns 502 and marks payout failed when PayPal throws", async () => {
    createPayoutBatch.mockRejectedValue(new Error("PayPal API down"));
    const req = makeRequest({ publisher_id: "pub-uuid", amount_cents: 5000 });
    const res = await POST(req);
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.error).toContain("PayPal");
  });
});
