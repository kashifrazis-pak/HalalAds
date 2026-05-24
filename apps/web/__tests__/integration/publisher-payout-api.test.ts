/**
 * @jest-environment node
 */
/**
 * TC-I-040 to TC-I-048
 * Integration tests for publisher payout setup API
 */
import { NextRequest } from "next/server";

const mockAuth = jest.fn();
jest.mock("@/lib/auth", () => ({ auth: (...args: any[]) => mockAuth(...args) }));
jest.mock("@/lib/supabase", () => ({ createServiceClient: jest.fn() }));

const { createServiceClient } = require("@/lib/supabase");
import { GET, POST } from "@/app/api/publisher/payout/route";

function makeDb(overrides: Record<string, { data?: any; error?: any }> = {}) {
  const defaults: Record<string, { data?: any; error?: any }> = {
    users:                    { data: { id: "user-uuid" }, error: null },
    publishers:               { data: { id: "pub-uuid" }, error: null },
    publisher_payout_methods: { data: null, error: null },
  };
  const tables = { ...defaults, ...overrides };
  return {
    from: jest.fn((table: string) => {
      const resp = tables[table] ?? { data: null, error: null };
      const chain: any = {
        select:      jest.fn(() => chain),
        insert:      jest.fn(() => chain),
        update:      jest.fn(() => chain),
        upsert:      jest.fn(() => Promise.resolve({ error: null })),
        eq:          jest.fn(() => chain),
        maybeSingle: jest.fn(() => Promise.resolve(resp)),
        single:      jest.fn(() => Promise.resolve(resp)),
      };
      return chain;
    }),
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  mockAuth.mockResolvedValue({ user: { email: "publisher@test.com" } });
  createServiceClient.mockReturnValue(makeDb());
});

describe("Publisher payout API — integration", () => {
  it("TC-I-040: GET returns 401 when unauthenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("TC-I-041: GET returns 404 when publisher profile not found", async () => {
    createServiceClient.mockReturnValue(
      makeDb({ publishers: { data: null, error: null } })
    );
    const res = await GET();
    expect(res.status).toBe(404);
  });

  it("TC-I-042: GET returns null payout when none configured", async () => {
    createServiceClient.mockReturnValue(
      makeDb({ publisher_payout_methods: { data: null, error: null } })
    );
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.payout).toBeNull();
  });

  it("TC-I-043: GET returns existing payout method", async () => {
    const existingPayout = { method: "paypal", email: "pay@paypal.com", account_holder: null, account_number: null, swift_bic: null };
    createServiceClient.mockReturnValue(
      makeDb({ publisher_payout_methods: { data: existingPayout, error: null } })
    );
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.payout.method).toBe("paypal");
    expect(body.payout.email).toBe("pay@paypal.com");
  });

  it("TC-I-044: POST returns 401 when unauthenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const req = new NextRequest("http://localhost/api/publisher/payout", {
      method: "POST",
      body: JSON.stringify({ method: "paypal", email: "a@b.com" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("TC-I-045: POST returns 400 for invalid method", async () => {
    const req = new NextRequest("http://localhost/api/publisher/payout", {
      method: "POST",
      body: JSON.stringify({ method: "crypto" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("TC-I-046: POST returns 400 for paypal without email", async () => {
    const req = new NextRequest("http://localhost/api/publisher/payout", {
      method: "POST",
      body: JSON.stringify({ method: "paypal" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("TC-I-047: POST returns 400 for bank without account_holder or account_number", async () => {
    const req = new NextRequest("http://localhost/api/publisher/payout", {
      method: "POST",
      body: JSON.stringify({ method: "bank", account_holder: "John" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("TC-I-048: POST returns 200 with valid paypal payload", async () => {
    const req = new NextRequest("http://localhost/api/publisher/payout", {
      method: "POST",
      body: JSON.stringify({ method: "paypal", email: "me@paypal.com" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  it("TC-I-049: POST returns 200 with valid bank payload", async () => {
    const req = new NextRequest("http://localhost/api/publisher/payout", {
      method: "POST",
      body: JSON.stringify({
        method: "bank",
        account_holder: "Ahmad Hassan",
        account_number: "GB29NWBK60161331926819",
        swift_bic: "NWBKGB2L",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });
});
