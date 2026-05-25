/**
 * @jest-environment node
 */
/**
 * TC-U-110 to TC-U-122
 * Unit tests for /api/track/impression and /api/track/click
 */
import { NextRequest } from "next/server";

// ─── Supabase mock ────────────────────────────────────────────────────────────

const mockInsert = jest.fn(() =>
  Promise.resolve({ data: { id: "imp-001" }, error: null })
);
const mockUpdate = jest.fn(() => Promise.resolve({ error: null }));

function makeChain(data: unknown) {
  const chain: Record<string, unknown> = {};
  chain.select = jest.fn(() => chain);
  chain.eq = jest.fn(() => chain);
  chain.insert = mockInsert;
  chain.update = jest.fn(() => chain);
  chain.single = jest.fn(() => Promise.resolve({ data, error: null }));
  chain.then = (resolve: (v: unknown) => unknown) =>
    Promise.resolve({ data, error: null }).then(resolve);
  return chain;
}

const mockCpmCampaign = {
  id: "camp-001",
  type: "cpm",
  bid_amount: 200,
  spend: 0,
  advertiser_id: "adv-001",
};
const mockCpcCampaign = { ...mockCpmCampaign, type: "cpc" };
const mockAdvertiser = { id: "adv-001", balance: 10000 };

const mockDb = {
  from: jest.fn((table: string) => {
    if (table === "campaigns") return makeChain(mockCpmCampaign);
    if (table === "advertisers") return makeChain(mockAdvertiser);
    if (table === "impressions") return makeChain({ id: "imp-001" });
    if (table === "clicks") return makeChain({ id: "clk-001" });
    return makeChain(null);
  }),
};

jest.mock("@/lib/supabase", () => ({
  createServiceClient: jest.fn(() => mockDb),
}));

import { GET as impressionGET } from "@/app/api/track/impression/route";
import { GET as clickGET } from "@/app/api/track/click/route";

function makeImpressionReq(params: Record<string, string> = {}) {
  const qs = new URLSearchParams({
    cid: "camp-001",
    crid: "cr-001",
    auid: "unit-abc",
    iid: "imp-001",
    ...params,
  }).toString();
  return new NextRequest(`http://localhost/api/track/impression?${qs}`);
}

function makeClickReq(params: Record<string, string> = {}) {
  const qs = new URLSearchParams({
    cid: "camp-001",
    auid: "unit-abc",
    iid: "imp-001",
    url: "https://example.com",
    ...params,
  }).toString();
  return new NextRequest(`http://localhost/api/track/click?${qs}`);
}

beforeEach(() => {
  jest.clearAllMocks();
  mockDb.from.mockImplementation((table: string) => {
    if (table === "campaigns") return makeChain(mockCpmCampaign);
    if (table === "advertisers") return makeChain(mockAdvertiser);
    if (table === "impressions") return makeChain({ id: "imp-001" });
    if (table === "clicks") return makeChain({ id: "clk-001" });
    return makeChain(null);
  });
});

// ─── Impression tests ─────────────────────────────────────────────────────────

describe("GET /api/track/impression", () => {
  it("TC-U-110: returns 200 with a 1×1 GIF pixel", async () => {
    const res = await impressionGET(makeImpressionReq());
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("image/gif");
  });

  it("TC-U-111: CORS header allows any origin", async () => {
    const res = await impressionGET(makeImpressionReq());
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
  });

  it("TC-U-112: cache-control prevents caching", async () => {
    const res = await impressionGET(makeImpressionReq());
    expect(res.headers.get("cache-control")).toContain("no-store");
  });

  it("TC-U-113: returns pixel without DB call when required params are missing", async () => {
    const req = new NextRequest("http://localhost/api/track/impression");
    const res = await impressionGET(req);
    expect(res.status).toBe(200);
    expect(mockDb.from).not.toHaveBeenCalled();
  });

  it("TC-U-114: returns pixel without DB call for bot user-agent", async () => {
    const req = makeImpressionReq();
    req.headers.set("user-agent", "Googlebot/2.1");
    const res = await impressionGET(req);
    expect(res.status).toBe(200);
    expect(mockDb.from).not.toHaveBeenCalled();
  });

  it("TC-U-115: records impression in DB for valid non-bot request", async () => {
    const insertMock = jest.fn(() => Promise.resolve({ data: { id: "imp-001" }, error: null }));
    mockDb.from.mockImplementation((table: string) => {
      const chain = makeChain(
        table === "campaigns" ? mockCpmCampaign : table === "advertisers" ? mockAdvertiser : null
      );
      if (table === "impressions") (chain.insert as jest.Mock) = insertMock;
      return chain;
    });
    await impressionGET(makeImpressionReq());
    expect(mockDb.from).toHaveBeenCalledWith("impressions");
  });
});

// ─── Click tests ──────────────────────────────────────────────────────────────

describe("GET /api/track/click", () => {
  it("TC-U-116: redirects to destination URL", async () => {
    mockDb.from.mockImplementation((table: string) =>
      makeChain(table === "campaigns" ? mockCpcCampaign : table === "advertisers" ? mockAdvertiser : null)
    );
    const res = await clickGET(makeClickReq());
    expect(res.status).toBe(302);
    const location = res.headers.get("location") ?? "";
    expect(location).toContain("example.com");
  });

  it("TC-U-117: appends utm_source and utm_medium to redirect URL", async () => {
    mockDb.from.mockImplementation((table: string) =>
      makeChain(table === "campaigns" ? mockCpcCampaign : mockAdvertiser)
    );
    const res = await clickGET(makeClickReq());
    const location = res.headers.get("location") ?? "";
    expect(location).toContain("utm_source=islamicadnetwork");
    expect(location).toContain("utm_medium=display");
  });

  it("TC-U-118: redirects to home when url param is missing", async () => {
    const req = new NextRequest(
      "http://localhost/api/track/click?cid=camp-001&auid=unit-abc"
    );
    const res = await clickGET(req);
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toContain("localhost");
  });

  it("TC-U-119: bot does not trigger DB write and still redirects", async () => {
    const req = makeClickReq();
    req.headers.set("user-agent", "Googlebot/2.1");
    const res = await clickGET(req);
    expect(res.status).toBe(302);
    expect(mockDb.from).not.toHaveBeenCalled();
  });

  it("TC-U-120: records click in DB for valid non-bot request", async () => {
    const insertMock = jest.fn(() => Promise.resolve({ data: null, error: null }));
    mockDb.from.mockImplementation((table: string) => {
      const chain = makeChain(
        table === "campaigns" ? mockCpcCampaign : table === "advertisers" ? mockAdvertiser : null
      );
      if (table === "clicks") (chain.insert as jest.Mock) = insertMock;
      return chain;
    });
    await clickGET(makeClickReq());
    expect(mockDb.from).toHaveBeenCalledWith("clicks");
  });

  it("TC-U-121: cache-control on redirect prevents caching", async () => {
    mockDb.from.mockImplementation((table: string) =>
      makeChain(table === "campaigns" ? mockCpcCampaign : mockAdvertiser)
    );
    const res = await clickGET(makeClickReq());
    expect(res.headers.get("cache-control")).toContain("no-store");
  });

  it("TC-U-122: invalid destination URL falls back to home redirect", async () => {
    mockDb.from.mockImplementation((table: string) =>
      makeChain(table === "campaigns" ? mockCpcCampaign : mockAdvertiser)
    );
    const req = makeClickReq({ url: "not-a-valid-url" });
    const res = await clickGET(req);
    expect(res.status).toBe(302);
  });
});
