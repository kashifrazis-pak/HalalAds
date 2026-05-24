/**
 * @jest-environment node
 */
/**
 * TC-I-050 to TC-I-054
 * Integration tests for GET /api/publisher/payouts
 */
import { NextRequest } from "next/server";

const mockAuth = jest.fn();
jest.mock("@/lib/auth", () => ({ auth: (...args: any[]) => mockAuth(...args) }));
jest.mock("@/lib/supabase", () => ({ createServiceClient: jest.fn() }));

const { createServiceClient } = require("@/lib/supabase");
import { GET } from "@/app/api/publisher/payouts/route";

const FAKE_PAYOUTS = [
  { id: "p1", amount_cents: 5000, currency: "USD", method: "paypal", status: "paid", period_start: "2025-03-01", period_end: "2025-03-31", failure_reason: null, created_at: "2025-04-15T00:00:00Z" },
  { id: "p2", amount_cents: 3200, currency: "USD", method: "paypal", status: "processing", period_start: null, period_end: null, failure_reason: null, created_at: "2025-05-15T00:00:00Z" },
];

function makeDb(payouts = FAKE_PAYOUTS) {
  return {
    from: jest.fn((table: string) => {
      const chain: any = {
        select: jest.fn(() => chain),
        eq: jest.fn(() => chain),
        order: jest.fn(() => Promise.resolve(
          table === "publisher_payouts" ? { data: payouts, error: null } :
          table === "users" ? { data: { id: "user-uuid" }, error: null } :
          table === "publishers" ? { data: { id: "pub-uuid" }, error: null } :
          { data: null, error: null }
        )),
        maybeSingle: jest.fn(() => Promise.resolve(
          table === "users" ? { data: { id: "user-uuid" }, error: null } : { data: null, error: null }
        )),
        single: jest.fn(() => Promise.resolve(
          table === "publishers" ? { data: { id: "pub-uuid" }, error: null } : { data: null, error: null }
        )),
      };
      return chain;
    }),
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  mockAuth.mockResolvedValue({ user: { email: "pub@test.com" } });
  createServiceClient.mockReturnValue(makeDb());
});

describe("GET /api/publisher/payouts", () => {
  it("TC-I-050: returns 401 when unauthenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("TC-I-051: returns 404 when publisher profile not found", async () => {
    createServiceClient.mockReturnValue(makeDb());
    // Override: publishers returns null
    const db = {
      from: jest.fn((table: string) => {
        const chain: any = {
          select: jest.fn(() => chain),
          eq: jest.fn(() => chain),
          order: jest.fn(() => Promise.resolve({ data: [], error: null })),
          maybeSingle: jest.fn(() => Promise.resolve(
            table === "users" ? { data: { id: "user-uuid" }, error: null } : { data: null, error: null }
          )),
          single: jest.fn(() => Promise.resolve({ data: null, error: { message: "not found" } })),
        };
        return chain;
      }),
    };
    createServiceClient.mockReturnValue(db);
    const res = await GET();
    expect(res.status).toBe(404);
  });

  it("TC-I-052: returns 200 with payouts array", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.payouts)).toBe(true);
  });

  it("TC-I-053: returns empty array when no payouts exist", async () => {
    createServiceClient.mockReturnValue(makeDb([]));
    const res = await GET();
    const body = await res.json();
    expect(body.payouts).toHaveLength(0);
  });

  it("TC-I-054: payout records include expected fields", async () => {
    const res = await GET();
    const body = await res.json();
    const payout = body.payouts[0];
    expect(payout).toHaveProperty("amount_cents");
    expect(payout).toHaveProperty("status");
    expect(payout).toHaveProperty("method");
  });
});
