/**
 * TC-C-001 to TC-C-006
 * Component tests for StatCard — metric display card
 */
import { render, screen } from "@testing-library/react";
import StatCard from "@/components/dashboard/StatCard";
import { Activity } from "lucide-react";

describe("StatCard", () => {
  it("TC-C-001: renders label and value", () => {
    render(<StatCard label="Impressions" value="12,400" icon={Activity} />);
    expect(screen.getByText("Impressions")).toBeInTheDocument();
    expect(screen.getByText("12,400")).toBeInTheDocument();
  });

  it("TC-C-002: renders positive change indicator", () => {
    render(<StatCard label="Clicks" value="320" change="+12%" positive icon={Activity} />);
    expect(screen.getByText("+12%")).toBeInTheDocument();
  });

  it("TC-C-003: renders negative change indicator", () => {
    render(<StatCard label="CTR" value="2.4%" change="-3%" positive={false} icon={Activity} />);
    expect(screen.getByText("-3%")).toBeInTheDocument();
  });

  it("TC-C-004: renders without change prop", () => {
    const { container } = render(<StatCard label="Spend" value="$120" icon={Activity} />);
    expect(container.querySelector("[data-testid='change']")).toBeNull();
  });

  it("TC-C-005: applies green icon color by default", () => {
    const { container } = render(<StatCard label="Test" value="0" icon={Activity} />);
    const iconWrapper = container.querySelector(".bg-brand-green\\/10");
    expect(iconWrapper).toBeInTheDocument();
  });

  it("TC-C-006: applies gold icon color when specified", () => {
    const { container } = render(<StatCard label="Test" value="0" icon={Activity} iconColor="gold" />);
    const iconWrapper = container.querySelector(".bg-brand-gold\\/10");
    expect(iconWrapper).toBeInTheDocument();
  });
});
