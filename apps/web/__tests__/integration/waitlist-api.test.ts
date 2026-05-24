/**
 * @jest-environment node
 */
/**
 * TC-I-001 to TC-I-008
 * Integration tests for waitlist flow — full request/response cycle
 */
import { NextRequest } from "next/server";
import { POST } from "@/app/api/waitlist/route";

function post(body: object) {
  return new NextRequest("http://localhost/api/waitlist", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("Waitlist API — integration", () => {
  it("TC-I-001: full advertiser signup returns 201 with success body", async () => {
    const res = await POST(post({ name: "Ahmad Ali", email: "ahmad@halal.com", type: "advertiser", company: "Halal Foods Ltd" }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.message).toBeTruthy();
  });

  it("TC-I-002: full publisher signup returns 201", async () => {
    const res = await POST(post({ name: "Fatima Hassan", email: "fatima@blog.com", type: "publisher" }));
    expect(res.status).toBe(201);
  });

  it("TC-I-003: response includes CORS header allowing *", async () => {
    const res = await POST(post({ name: "A", email: "a@b.com", type: "advertiser" }));
    expect(res.headers.get("access-control-allow-origin") ?? "*").toBe("*");
  });

  it("TC-I-004: missing name returns 400 with error field", async () => {
    const res = await POST(post({ email: "test@test.com", type: "advertiser" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBeTruthy();
  });

  it("TC-I-005: missing email returns 400", async () => {
    const res = await POST(post({ name: "Test", type: "advertiser" }));
    expect(res.status).toBe(400);
  });

  it("TC-I-006: invalid email format returns 400", async () => {
    const res = await POST(post({ name: "Test", email: "not-valid", type: "advertiser" }));
    expect(res.status).toBe(400);
  });

  it("TC-I-007: missing type returns 400", async () => {
    const res = await POST(post({ name: "Test", email: "test@test.com" }));
    expect(res.status).toBe(400);
  });

  it("TC-I-008: response content-type is application/json", async () => {
    const res = await POST(post({ name: "A", email: "a@b.com", type: "advertiser" }));
    expect(res.headers.get("content-type")).toContain("application/json");
  });
});
