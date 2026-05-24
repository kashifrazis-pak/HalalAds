/**
 * TC-C-010 to TC-C-016
 * Component tests for Navbar — navigation header
 */
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@/components/layout/Navbar";

describe("Navbar", () => {
  it("TC-C-010: renders brand name", () => {
    render(<Navbar />);
    expect(screen.getByText("AdNetwork")).toBeInTheDocument();
  });

  it("TC-C-011: renders all nav links", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: /advertisers/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /publishers/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /pricing/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /blog/i })).toBeInTheDocument();
  });

  it("TC-C-012: renders Get Started CTA", () => {
    render(<Navbar />);
    const ctaLinks = screen.getAllByRole("link", { name: /get started/i });
    expect(ctaLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("TC-C-013: renders Sign in link", () => {
    render(<Navbar />);
    const signInLinks = screen.getAllByRole("link", { name: /sign in/i });
    expect(signInLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("TC-C-014: mobile menu toggle button is present", () => {
    render(<Navbar />);
    expect(screen.getByLabelText("Toggle menu")).toBeInTheDocument();
  });

  it("TC-C-015: mobile menu opens on toggle click", () => {
    render(<Navbar />);
    const toggle = screen.getByLabelText("Toggle menu");
    fireEvent.click(toggle);
    // After opening, mobile nav links should be visible (duplicated in mobile menu)
    const advertiserLinks = screen.getAllByRole("link", { name: /advertisers/i });
    expect(advertiserLinks.length).toBeGreaterThanOrEqual(2);
  });

  it("TC-C-016: mobile menu closes after clicking a link", () => {
    render(<Navbar />);
    const toggle = screen.getByLabelText("Toggle menu");
    fireEvent.click(toggle);
    const mobileLinks = screen.getAllByRole("link", { name: /publishers/i });
    fireEvent.click(mobileLinks[mobileLinks.length - 1]);
    // Menu should close — only one publishers link visible again
    const afterClose = screen.getAllByRole("link", { name: /publishers/i });
    expect(afterClose.length).toBe(1);
  });
});
