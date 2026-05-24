/**
 * @jest-environment node
 */
/**
 * TC-U-065 to TC-U-070
 * Unit tests for POST /api/ad-units — publisher ad unit creation
 */
import { NextRequest } from "next/server";

const mockAuth = jest.fn();
jest.mock("@/lib/auth", () => ({ auth: (...args: any[]) => mockAuth(...args) }));
jest.mock("@/lib/supabase", () => ({ createServiceClient: jest.fn() }));

const { createServiceClient } = require("@/lib/supabase");
import { POST } from "@/app/api/ad-units/route";

function makeDb(tables: Record<string, { data?: any; error?: any }>) {
  return {
    from: jest.fn((table: string) => {
      const resp = tables[table] ?? { data: null, error: null };
      const chain: any = {
        select: jest.fn(() => chain),
        insert: jest.fn(() => chain),
        eq: jest.fn(() => chain),
        maybeSingle: jest.fn(() => Promise.resolve(resp)),
        single: jest.fn(() => Promise.resolve(resp)),
      };
      return chain;
    }),
  };
}

function makeReq(body: object) {
  return new NextRequest("http://localhost/api/ad-units", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

const validBody = { name: "Header Leaderboard", siteUrl: "https://mysite.com", size: "728x90" };

beforeEach(() => {
  jest.clearAllMocks();
  mockAuth.mockResolvedValue({ user: { email: "publisher@test.com" } });
  createServiceClient.mockReturnValue(
    makeDb({
      users: { data: { id: "user-uuid" }, error: null },
      publishers: { data: { id: "pub-uuid" }, error: null },
      ad_units: { data: { id: "unit-uuid" }, error: null },
    })
  );
});

describe("POST /api/ad-units", () => {
  it("TC-U-065: returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("TC-U-066: returns 400 when name is missing", async () => {
    const { name: _n, ...rest } = validBody;
    const res = await POST(makeReq(rest));
    expect(res.status).toBe(400);
  });

  it("TC-U-067: returns 400 when siteUrl is missing", async () => {
    const { siteUrl: _s, ...rest } = validBody;
    const res = await POST(makeReq(rest));
    expect(res.status).toBe(400);
  });

  it("TC-U-068: returns 200 with unit id on valid payload", async () => {
    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe("unit-uuid");
  });

  it("TC-U-069: returns 404 when publisher profile not found", async () => {
    createServiceClient.mockReturnValue(
      makeDb({
        users: { data: { id: "user-uuid" }, error: null },
        publishers: { data: null, error: { message: "Not found" } },
      })
    );
    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(404);
  });

  it("TC-U-070: returns 500 when ad_unit insert fails", async () => {
    createServiceClient.mockReturnValue(
      makeDb({
        users: { data: { id: "user-uuid" }, error: null },
        publishers: { data: { id: "pub-uuid" }, error: null },
        ad_units: { data: null, error: { message: "DB error" } },
      })
    );
    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(500);
  });
});
