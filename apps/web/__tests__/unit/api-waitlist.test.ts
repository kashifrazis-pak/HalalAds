/**
 * @jest-environment node
 */
/**
 * TC-U-020 to TC-U-026
 * Unit tests for /api/waitlist — input validation and response shape
 */
import { NextRequest } from "next/server";
import { POST } from "@/app/api/waitlist/route";

function makeRequest(body: object) {
  return new NextRequest("http://localhost/api/waitlist", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/waitlist", () => {
  it("TC-U-020: returns 201 with valid advertiser payload", async () => {
    const req = makeRequest({ name: "Ahmad Ali", email: "ahmad@halal.com", type: "advertiser", company: "Halal Foods Ltd" });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it("TC-U-021: returns 201 with valid publisher payload", async () => {
    const req = makeRequest({ name: "Fatima Hassan", email: "fatima@islamicblog.com", type: "publisher", company: "https://islamicblog.com" });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  it("TC-U-022: returns 400 when name is missing", async () => {
    const req = makeRequest({ email: "test@test.com", type: "advertiser" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("TC-U-023: returns 400 when email is missing", async () => {
    const req = makeRequest({ name: "Test User", type: "advertiser" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("TC-U-024: returns 400 when type is missing", async () => {
    const req = makeRequest({ name: "Test User", email: "test@test.com" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("TC-U-025: returns 400 for invalid email format", async () => {
    const req = makeRequest({ name: "Test User", email: "not-an-email", type: "advertiser" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("TC-U-026: response has correct Content-Type JSON header", async () => {
    const req = makeRequest({ name: "Ahmad", email: "ahmad@test.com", type: "advertiser" });
    const res = await POST(req);
    expect(res.headers.get("content-type")).toContain("application/json");
  });
});
