/**
 * TC-C-080 to TC-C-086
 * Component tests for DashboardSidebar
 */
import { render, screen, fireEvent } from "@testing-library/react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

jest.mock("next-auth/react", () => ({ signOut: jest.fn() }));

describe("DashboardSidebar — advertiser", () => {
  it("TC-C-080: renders IslamicAdNetwork brand name (not HalalAds)", () => {
    render(<DashboardSidebar role="advertiser" />);
    // Brand is split: "Islamic" + "AdNetwork" in separate spans
    expect(screen.getByText("Islamic")).toBeInTheDocument();
    expect(screen.getByText("AdNetwork")).toBeInTheDocument();
    expect(screen.queryByText(/halal\s*ads/i)).toBeNull();
  });

  it("TC-C-081: shows advertiser nav links", () => {
    render(<DashboardSidebar role="advertiser" />);
    expect(screen.getByRole("link", { name: /campaigns/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /billing/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /analytics/i })).toBeInTheDocument();
  });

  it("TC-C-082: does not show publisher-only nav links for advertiser", () => {
    render(<DashboardSidebar role="advertiser" />);
    expect(screen.queryByRole("link", { name: /earnings/i })).toBeNull();
    expect(screen.queryByRole("link", { name: /ad units/i })).toBeNull();
  });

  it("TC-C-083: displays user email when provided", () => {
    render(<DashboardSidebar role="advertiser" userEmail="test@example.com" />);
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("TC-C-084: displays username when provided", () => {
    render(<DashboardSidebar role="advertiser" userName="Ahmad" />);
    expect(screen.getByText("Ahmad")).toBeInTheDocument();
  });
});

describe("DashboardSidebar — publisher", () => {
  it("TC-C-085: shows publisher nav links", () => {
    render(<DashboardSidebar role="publisher" />);
    expect(screen.getByRole("link", { name: /earnings/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ad units/i })).toBeInTheDocument();
  });

  it("TC-C-086: sign out button is present", () => {
    render(<DashboardSidebar role="publisher" />);
    expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
  });
});
