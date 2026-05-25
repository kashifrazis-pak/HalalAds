/**
 * @jest-environment node
 */
/**
 * TC-U-090 to TC-U-102
 * Unit tests for GET /api/serve/[adunit] — ad decision + serving
 */
import { NextRequest } from "next/server";

const mockAdUnit = { id: "unit-abc", publisher_id: "pub-1", size: "300x250", active: true };
const mockCreative = {
  id: "cr-001",
  headline: "Discover Halal Finance",
  description: "Shariah-compliant investments",
  destination_url: "https://example.com",
  cta_text: "Learn More",
  image_url: null,
  size: "300x250",
};
const mockCampaign = {
  id: "camp-001",
  type: "cpm",
  bid_amount: 250,
  spend: 0,
  total_budget: 10000,
  targeting_json: { countries: [], interests: [] },
  start_date: null,
  end_date: null,
  ad_creatives: [mockCreative],
};

function makeSingleChain(data: unknown) {
  const chain: Record<string, unknown> = {};
  chain.select = jest.fn(() => chain);
  chain.eq = jest.fn(() => chain);
  chain.single = jest.fn(() => Promise.resolve({ data, error: null }));
  chain.then = (resolve: (v: unknown) => unknown) =>
    Promise.resolve({ data, error: null }).then(resolve);
  return chain;
}

function makeArrayChain(data: unknown[]) {
  const chain: Record<string, unknown> = {};
  chain.select = jest.fn(() => chain);
  chain.eq = jest.fn(() => chain);
  chain.then = (resolve: (v: unknown) => unknown) =>
    Promise.resolve({ data, error: null }).then(resolve);
  return chain;
}

const mockDb = {
  from: jest.fn((table: string) => {
    if (table === "ad_units") return makeSingleChain(mockAdUnit);
    if (table === "campaigns") return makeArrayChain([mockCampaign]);
    return makeSingleChain(null);
  }),
};

jest.mock("@/lib/supabase", () => ({
  createServiceClient: jest.fn(() => mockDb),
}));

import { GET } from "@/app/api/serve/[adunit]/route";

function makeReq(
  params: Record<string, string> = {},
  headers: Record<string, string> = {}
) {
  const qs = new URLSearchParams({ pub: "site_001", size: "300x250", ...params }).toString();
  const req = new NextRequest(`http://localhost/api/serve/test-unit?${qs}`);
  Object.entries(headers).forEach(([k, v]) => req.headers.set(k, v));
  return req;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockDb.from.mockImplementation((table: string) => {
    if (table === "ad_units") return makeSingleChain(mockAdUnit);
    if (table === "campaigns") return makeArrayChain([mockCampaign]);
    return makeSingleChain(null);
  });
});

describe("GET /api/serve/[adunit]", () => {
  it("TC-U-090: returns 200 with an ad object", async () => {
    const res = await GET(makeReq(), { params: { adunit: "unit-abc" } } as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ad).toBeDefined();
  });

  it("TC-U-091: response includes creative headline and CTA", async () => {
    const res = await GET(makeReq(), { params: { adunit: "unit-abc" } } as any);
    const body = await res.json();
    expect(body.ad.creative.headline).toBeTruthy();
    expect(body.ad.creative.ctaText).toBeTruthy();
  });

  it("TC-U-092: response includes tracking impression and click URLs", async () => {
    const res = await GET(makeReq(), { params: { adunit: "unit-abc" } } as any);
    const body = await res.json();
    expect(body.ad.tracking.impressionUrl).toContain("/api/track/impression");
    expect(body.ad.tracking.clickUrl).toContain("/api/track/click");
  });

  it("TC-U-093: returns ad:null with reason:bot for known bot user-agents", async () => {
    const res = await GET(
      makeReq({}, { "user-agent": "Googlebot/2.1 (+http://www.google.com/bot.html)" }),
      { params: { adunit: "unit-abc" } } as any
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ad).toBeNull();
    expect(body.reason).toBe("bot");
  });

  it("TC-U-094: cache-control header prevents caching", async () => {
    const res = await GET(
      makeReq({}, { "user-agent": "Googlebot" }),
      { params: { adunit: "unit-abc" } } as any
    );
    const cc = res.headers.get("cache-control") ?? "";
    expect(cc).toContain("no-store");
  });

  it("TC-U-095: CORS header allows any origin", async () => {
    const res = await GET(
      makeReq({}, { "user-agent": "Googlebot" }),
      { params: { adunit: "unit-abc" } } as any
    );
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
  });

  it("TC-U-096: ad unit size is reflected in the served creative", async () => {
    const res = await GET(makeReq(), { params: { adunit: "unit-abc" } } as any);
    const body = await res.json();
    expect(body.ad.creative.size).toBe("300x250");
  });

  it("TC-U-097: spider user-agent is treated as bot", async () => {
    const res = await GET(
      makeReq({}, { "user-agent": "AhrefsBot/7.0" }),
      { params: { adunit: "unit-abc" } } as any
    );
    const body = await res.json();
    expect(body.ad).toBeNull();
  });

  it("TC-U-098: returns no_unit when ad unit is inactive", async () => {
    mockDb.from.mockImplementation((table: string) => {
      if (table === "ad_units") return makeSingleChain({ ...mockAdUnit, active: false });
      return makeArrayChain([]);
    });
    const res = await GET(makeReq(), { params: { adunit: "unit-abc" } } as any);
    const body = await res.json();
    expect(body.ad).toBeNull();
    expect(body.reason).toBe("no_unit");
  });

  it("TC-U-099: returns no_fill when no active campaigns exist", async () => {
    mockDb.from.mockImplementation((table: string) => {
      if (table === "ad_units") return makeSingleChain(mockAdUnit);
      if (table === "campaigns") return makeArrayChain([]);
      return makeSingleChain(null);
    });
    const res = await GET(makeReq(), { params: { adunit: "unit-abc" } } as any);
    const body = await res.json();
    expect(body.ad).toBeNull();
    expect(body.reason).toBe("no_fill");
  });

  it("TC-U-100: geo-filtered campaign excluded when country does not match", async () => {
    const geoLocked = {
      ...mockCampaign,
      targeting_json: { countries: ["SA", "AE"], interests: [] },
    };
    mockDb.from.mockImplementation((table: string) => {
      if (table === "ad_units") return makeSingleChain(mockAdUnit);
      if (table === "campaigns") return makeArrayChain([geoLocked]);
      return makeSingleChain(null);
    });
    const res = await GET(makeReq(), { params: { adunit: "unit-abc" } } as any);
    const body = await res.json();
    expect(body.ad).toBeNull();
    expect(body.reason).toBe("no_fill");
  });

  it("TC-U-101: exhausted-budget campaign is excluded", async () => {
    const exhausted = { ...mockCampaign, spend: 10000, total_budget: 10000 };
    mockDb.from.mockImplementation((table: string) => {
      if (table === "ad_units") return makeSingleChain(mockAdUnit);
      if (table === "campaigns") return makeArrayChain([exhausted]);
      return makeSingleChain(null);
    });
    const res = await GET(makeReq(), { params: { adunit: "unit-abc" } } as any);
    const body = await res.json();
    expect(body.ad).toBeNull();
    expect(body.reason).toBe("no_fill");
  });

  it("TC-U-102: highest bid wins when multiple campaigns are eligible", async () => {
    const low = {
      ...mockCampaign,
      id: "camp-low",
      bid_amount: 100,
      ad_creatives: [{ ...mockCreative, id: "cr-low" }],
    };
    const high = {
      ...mockCampaign,
      id: "camp-high",
      bid_amount: 500,
      ad_creatives: [{ ...mockCreative, id: "cr-high" }],
    };
    mockDb.from.mockImplementation((table: string) => {
      if (table === "ad_units") return makeSingleChain(mockAdUnit);
      if (table === "campaigns") return makeArrayChain([low, high]);
      return makeSingleChain(null);
    });
    const res = await GET(makeReq(), { params: { adunit: "unit-abc" } } as any);
    const body = await res.json();
    expect(body.ad.campaignId).toBe("camp-high");
  });
});
