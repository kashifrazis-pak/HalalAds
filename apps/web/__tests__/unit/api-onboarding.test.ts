/**
 * @jest-environment node
 */
/**
 * TC-U-084 to TC-U-089
 * Unit tests for POST /api/onboarding — user role selection
 */
import { NextRequest } from "next/server";

const mockAuth = jest.fn();
jest.mock("@/lib/auth", () => ({ auth: (...args: any[]) => mockAuth(...args) }));
jest.mock("@/lib/supabase", () => ({ createServiceClient: jest.fn() }));

const { createServiceClient } = require("@/lib/supabase");
import { POST } from "@/app/api/onboarding/route";

function makeDb() {
  return {
    from: jest.fn((_table: string) => {
      const chain: any = {
        select: jest.fn(() => chain),
        insert: jest.fn(() => chain),
        update: jest.fn(() => chain),
        upsert: jest.fn(() => chain),
        eq: jest.fn(() => chain),
        single: jest.fn(() => Promise.resolve({ data: { id: "user-uuid" }, error: null })),
      };
      return chain;
    }),
  };
}

function makeReq(body: object) {
  return new NextRequest("http://localhost/api/onboarding", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockAuth.mockResolvedValue({ user: { email: "user@test.com", id: "nextauth-sub" } });
  createServiceClient.mockReturnValue(makeDb());
});

describe("POST /api/onboarding", () => {
  it("TC-U-084: returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await POST(makeReq({ role: "advertiser" }));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("TC-U-085: returns 400 for invalid role string", async () => {
    const res = await POST(makeReq({ role: "superadmin" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid role");
  });

  it("TC-U-086: returns 400 for role=admin (not self-assignable)", async () => {
    const res = await POST(makeReq({ role: "admin" }));
    expect(res.status).toBe(400);
  });

  it("TC-U-087: returns 200 with success:true for advertiser role", async () => {
    const res = await POST(makeReq({ role: "advertiser" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it("TC-U-088: returns 200 with success:true for publisher role", async () => {
    const res = await POST(makeReq({ role: "publisher" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it("TC-U-089: returns 400 when role is completely absent from body", async () => {
    const res = await POST(makeReq({}));
    expect(res.status).toBe(400);
  });
});
