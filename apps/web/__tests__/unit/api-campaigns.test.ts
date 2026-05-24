/**
 * @jest-environment node
 */
/**
 * TC-U-050 to TC-U-059
 * Unit tests for POST /api/campaigns — campaign creation
 */
import { NextRequest } from "next/server";

// ── Auth mock ──────────────────────────────────────────────────────────────
const mockAuth = jest.fn();
jest.mock("@/lib/auth", () => ({ auth: (...args: any[]) => mockAuth(...args) }));

// ── Supabase mock factory ──────────────────────────────────────────────────
type TableResp = { data?: any; error?: any };

function makeDb(tables: Record<string, TableResp>) {
  return {
    from: jest.fn((table: string) => {
      const resp = tables[table] ?? { data: null, error: null };
      const chain: any = {
        select: jest.fn(() => chain),
        insert: jest.fn(() => chain),
        update: jest.fn(() => chain),
        upsert: jest.fn(() => chain),
        eq: jest.fn(() => chain),
        maybeSingle: jest.fn(() => Promise.resolve(resp)),
        single: jest.fn(() => Promise.resolve(resp)),
      };
      return chain;
    }),
  };
}

jest.mock("@/lib/supabase", () => ({ createServiceClient: jest.fn() }));
const { createServiceClient } = require("@/lib/supabase");

import { POST } from "@/app/api/campaigns/route";

function makeReq(body: object) {
  return new NextRequest("http://localhost/api/campaigns", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

const validBody = {
  name: "Ramadan 2025",
  type: "cpc",
  adSize: "300x250",
  destinationUrl: "https://halal.com/landing",
  headline: "Discover Halal Finance",
  description: "Short description",
  countries: ["ID", "MY"],
  interests: ["Islamic Finance"],
  dailyBudget: "50",
  totalBudget: "500",
  bidAmount: "0.05",
  startDate: "2025-03-01",
  endDate: "2025-04-01",
};

beforeEach(() => {
  jest.clearAllMocks();
  mockAuth.mockResolvedValue({ user: { email: "advertiser@test.com" } });
  createServiceClient.mockReturnValue(
    makeDb({
      users: { data: { id: "user-uuid" }, error: null },
      advertisers: { data: { id: "adv-uuid" }, error: null },
      campaigns: { data: { id: "camp-uuid" }, error: null },
      ad_creatives: { data: { id: "creative-uuid" }, error: null },
    })
  );
});

describe("POST /api/campaigns", () => {
  it("TC-U-050: returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("TC-U-051: returns 400 when name is missing", async () => {
    const { name: _n, ...rest } = validBody;
    const res = await POST(makeReq(rest));
    expect(res.status).toBe(400);
  });

  it("TC-U-052: returns 400 when type is missing", async () => {
    const { type: _t, ...rest } = validBody;
    const res = await POST(makeReq(rest));
    expect(res.status).toBe(400);
  });

  it("TC-U-053: returns 400 when destinationUrl is missing", async () => {
    const { destinationUrl: _d, ...rest } = validBody;
    const res = await POST(makeReq(rest));
    expect(res.status).toBe(400);
  });

  it("TC-U-054: returns 400 when headline is missing", async () => {
    const { headline: _h, ...rest } = validBody;
    const res = await POST(makeReq(rest));
    expect(res.status).toBe(400);
  });

  it("TC-U-055: returns 200 with campaign id on valid payload", async () => {
    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe("camp-uuid");
  });

  it("TC-U-056: returns 404 when user row not found in DB", async () => {
    createServiceClient.mockReturnValue(
      makeDb({ users: { data: null, error: { message: "Not found" } } })
    );
    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(404);
  });

  it("TC-U-057: returns 404 when advertiser profile not found", async () => {
    createServiceClient.mockReturnValue(
      makeDb({
        users: { data: { id: "user-uuid" }, error: null },
        advertisers: { data: null, error: { message: "Not found" } },
      })
    );
    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(404);
  });

  it("TC-U-058: returns 500 when campaign insert fails", async () => {
    createServiceClient.mockReturnValue(
      makeDb({
        users: { data: { id: "user-uuid" }, error: null },
        advertisers: { data: { id: "adv-uuid" }, error: null },
        campaigns: { data: null, error: { message: "DB error" } },
      })
    );
    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(500);
  });

  it("TC-U-059: handles optional fields with defaults (no endDate)", async () => {
    const { endDate: _e, bidAmount: _b, ...rest } = validBody;
    const res = await POST(makeReq(rest));
    expect(res.status).toBe(200);
  });
});
