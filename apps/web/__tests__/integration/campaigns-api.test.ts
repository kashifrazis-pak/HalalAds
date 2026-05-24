/**
 * @jest-environment node
 */
/**
 * TC-I-020 to TC-I-026
 * Integration tests for campaign creation + status update full cycle
 */
import { NextRequest } from "next/server";

const mockAuth = jest.fn();
jest.mock("@/lib/auth", () => ({ auth: (...args: any[]) => mockAuth(...args) }));
jest.mock("@/lib/supabase", () => ({ createServiceClient: jest.fn() }));

const { createServiceClient } = require("@/lib/supabase");
import { POST } from "@/app/api/campaigns/route";
import { PATCH } from "@/app/api/campaigns/[id]/route";

function makeDb(overrides: Record<string, { data?: any; error?: any }> = {}) {
  const defaults: Record<string, { data?: any; error?: any }> = {
    users: { data: { id: "user-uuid" }, error: null },
    advertisers: { data: { id: "adv-uuid" }, error: null },
    campaigns: { data: { id: "camp-uuid" }, error: null },
    ad_creatives: { data: { id: "cr-uuid" }, error: null },
  };
  const tables = { ...defaults, ...overrides };
  return {
    from: jest.fn((table: string) => {
      const resp = tables[table] ?? { data: null, error: null };
      const chain: any = {
        select: jest.fn(() => chain),
        insert: jest.fn(() => chain),
        update: jest.fn(() => chain),
        eq: jest.fn(() => chain),
        maybeSingle: jest.fn(() => Promise.resolve(resp)),
        single: jest.fn(() => Promise.resolve(resp)),
      };
      return chain;
    }),
  };
}

const session = { user: { email: "adv@test.com" } };
const validCampaign = {
  name: "Eid Campaign",
  type: "cpm",
  adSize: "728x90",
  destinationUrl: "https://brand.com/eid",
  headline: "Eid Mubarak Sale",
  description: "Up to 50% off",
  countries: ["ID", "MY", "PK"],
  interests: ["Halal Food & Beverage", "Modest Fashion"],
  dailyBudget: "100",
  totalBudget: "1000",
  bidAmount: "1.50",
  startDate: "2025-04-01",
  endDate: "2025-05-01",
};

beforeEach(() => {
  jest.clearAllMocks();
  mockAuth.mockResolvedValue(session);
  createServiceClient.mockReturnValue(makeDb());
});

describe("Campaign API — integration", () => {
  it("TC-I-020: full creation flow returns 200 with campaign id", async () => {
    const req = new NextRequest("http://localhost/api/campaigns", {
      method: "POST",
      body: JSON.stringify(validCampaign),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe("camp-uuid");
  });

  it("TC-I-021: unauthenticated creation returns 401 JSON", async () => {
    mockAuth.mockResolvedValue(null);
    const req = new NextRequest("http://localhost/api/campaigns", {
      method: "POST",
      body: JSON.stringify(validCampaign),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
    expect(res.headers.get("content-type")).toContain("application/json");
  });

  it("TC-I-022: creation response is always application/json", async () => {
    const req = new NextRequest("http://localhost/api/campaigns", {
      method: "POST",
      body: JSON.stringify(validCampaign),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.headers.get("content-type")).toContain("application/json");
  });

  it("TC-I-023: pausing a campaign via PATCH returns 200", async () => {
    const req = new NextRequest("http://localhost/api/campaigns/camp-uuid", {
      method: "PATCH",
      body: JSON.stringify({ status: "paused" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await PATCH(req, { params: { id: "camp-uuid" } });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  it("TC-I-024: activating a campaign via PATCH returns 200", async () => {
    const req = new NextRequest("http://localhost/api/campaigns/camp-uuid", {
      method: "PATCH",
      body: JSON.stringify({ status: "active" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await PATCH(req, { params: { id: "camp-uuid" } });
    expect(res.status).toBe(200);
  });

  it("TC-I-025: PATCH with forbidden status=completed returns 400", async () => {
    const req = new NextRequest("http://localhost/api/campaigns/camp-uuid", {
      method: "PATCH",
      body: JSON.stringify({ status: "completed" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await PATCH(req, { params: { id: "camp-uuid" } });
    expect(res.status).toBe(400);
  });

  it("TC-I-026: creation without auth and PATCH without auth both return 401", async () => {
    mockAuth.mockResolvedValue(null);
    const createReq = new NextRequest("http://localhost/api/campaigns", {
      method: "POST",
      body: JSON.stringify(validCampaign),
      headers: { "Content-Type": "application/json" },
    });
    const patchReq = new NextRequest("http://localhost/api/campaigns/camp-uuid", {
      method: "PATCH",
      body: JSON.stringify({ status: "paused" }),
      headers: { "Content-Type": "application/json" },
    });
    const [createRes, patchRes] = await Promise.all([
      POST(createReq),
      PATCH(patchReq, { params: { id: "camp-uuid" } }),
    ]);
    expect(createRes.status).toBe(401);
    expect(patchRes.status).toBe(401);
  });
});
