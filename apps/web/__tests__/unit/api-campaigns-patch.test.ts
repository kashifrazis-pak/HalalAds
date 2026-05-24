/**
 * @jest-environment node
 */
/**
 * TC-U-060 to TC-U-064
 * Unit tests for PATCH /api/campaigns/[id] — pause/activate a campaign
 */
import { NextRequest } from "next/server";

const mockAuth = jest.fn();
jest.mock("@/lib/auth", () => ({ auth: (...args: any[]) => mockAuth(...args) }));
jest.mock("@/lib/supabase", () => ({ createServiceClient: jest.fn() }));

const { createServiceClient } = require("@/lib/supabase");
import { PATCH } from "@/app/api/campaigns/[id]/route";

function makeDb(advertiserData: any, updateError: any = null) {
  return {
    from: jest.fn((table: string) => {
      const chain: any = {
        select: jest.fn(() => chain),
        update: jest.fn(() => chain),
        eq: jest.fn(() => chain),
        maybeSingle: jest.fn(() =>
          Promise.resolve(table === "users" ? { data: { id: "u-1" }, error: null } : { data: null, error: null })
        ),
        single: jest.fn(() =>
          Promise.resolve(table === "advertisers" ? { data: advertiserData, error: null } : { data: null, error: updateError })
        ),
      };
      return chain;
    }),
  };
}

function makeReq(body: object, id = "camp-uuid") {
  return new NextRequest(`http://localhost/api/campaigns/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

const params = { id: "camp-uuid" };

beforeEach(() => {
  jest.clearAllMocks();
  mockAuth.mockResolvedValue({ user: { email: "adv@test.com" } });
  createServiceClient.mockReturnValue(makeDb({ id: "adv-uuid" }));
});

describe("PATCH /api/campaigns/[id]", () => {
  it("TC-U-060: returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await PATCH(makeReq({ status: "paused" }), { params });
    expect(res.status).toBe(401);
  });

  it("TC-U-061: returns 400 for invalid status value", async () => {
    const res = await PATCH(makeReq({ status: "deleted" }), { params });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid status");
  });

  it("TC-U-062: returns 400 for status=draft (not allowed via PATCH)", async () => {
    const res = await PATCH(makeReq({ status: "draft" }), { params });
    expect(res.status).toBe(400);
  });

  it("TC-U-063: returns 200 when pausing an active campaign", async () => {
    const res = await PATCH(makeReq({ status: "paused" }), { params });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  it("TC-U-064: returns 200 when activating a paused campaign", async () => {
    const res = await PATCH(makeReq({ status: "active" }), { params });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });
});
