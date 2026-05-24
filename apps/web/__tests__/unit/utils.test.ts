/**
 * TC-U-001 to TC-U-005
 * Unit tests for lib/utils.ts — cn() class name merger
 */
import { cn } from "@/lib/utils";

describe("cn() — class name utility", () => {
  it("TC-U-001: merges simple class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("TC-U-002: deduplicates conflicting Tailwind classes (last wins)", () => {
    expect(cn("bg-red-500", "bg-green-500")).toBe("bg-green-500");
  });

  it("TC-U-003: handles conditional classes via clsx", () => {
    expect(cn("base", false && "excluded", "included")).toBe("base included");
  });

  it("TC-U-004: handles undefined and null gracefully", () => {
    expect(cn("a", undefined, null as unknown as string, "b")).toBe("a b");
  });

  it("TC-U-005: handles object syntax from clsx", () => {
    expect(cn({ "text-green-500": true, "text-red-500": false })).toBe("text-green-500");
  });

  it("TC-U-006: handles empty input", () => {
    expect(cn()).toBe("");
  });

  it("TC-U-007: merges padding conflicts correctly", () => {
    expect(cn("px-4 py-2", "px-8")).toBe("py-2 px-8");
  });
});
