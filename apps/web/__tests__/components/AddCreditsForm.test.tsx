/**
 * TC-C-030 to TC-C-036
 * Component tests for AddCreditsForm — billing credit package selector
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddCreditsForm from "@/app/dashboard/advertiser/billing/AddCreditsForm";

// Prevent Stripe Node SDK from loading in jsdom
jest.mock("@/lib/stripe", () => ({
  CREDIT_PACKAGES: [
    { id: "credits_50",  amount: 5000,  credits: 5000,  label: "$50",  popular: false },
    { id: "credits_200", amount: 20000, credits: 22000, label: "$200", bonus: "+10% bonus", popular: true },
    { id: "credits_500", amount: 50000, credits: 60000, label: "$500", bonus: "+20% bonus", popular: false },
  ],
  getStripe: jest.fn(),
}));

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;


beforeEach(() => {
  jest.clearAllMocks();
  mockFetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ url: "https://checkout.stripe.com/pay/cs_test" }),
  });
});

describe("AddCreditsForm", () => {
  it("TC-C-030: renders all 3 credit package options", () => {
    render(<AddCreditsForm />);
    expect(screen.getByText("$50")).toBeInTheDocument();
    expect(screen.getByText("$200")).toBeInTheDocument();
    expect(screen.getByText("$500")).toBeInTheDocument();
  });

  it("TC-C-031: shows 'Most Popular' badge on the $200 package", () => {
    render(<AddCreditsForm />);
    expect(screen.getByText("Most Popular")).toBeInTheDocument();
  });

  it("TC-C-032: $200 package is selected by default", () => {
    render(<AddCreditsForm />);
    // The $200 button should have green border styling (selected)
    const buttons = screen.getAllByRole("button");
    const pkg200Btn = buttons.find((b) => b.textContent?.includes("$200") && b.textContent?.includes("22,000"));
    expect(pkg200Btn).toBeDefined();
    expect(pkg200Btn!.className).toContain("border-brand-green");
  });

  it("TC-C-033: selecting the $50 package updates selection", () => {
    render(<AddCreditsForm />);
    const buttons = screen.getAllByRole("button");
    const pkg50Btn = buttons.find((b) => b.textContent?.includes("$50") && b.textContent?.includes("5,000"));
    expect(pkg50Btn).toBeDefined();
    fireEvent.click(pkg50Btn!);
    expect(pkg50Btn!.className).toContain("border-brand-green");
  });

  it("TC-C-034: renders the Add Credits action button", () => {
    render(<AddCreditsForm />);
    expect(screen.getByRole("button", { name: /add credits/i })).toBeInTheDocument();
  });

  it("TC-C-035: shows loading state while checkout request is in flight", async () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // never resolves
    render(<AddCreditsForm />);
    fireEvent.click(screen.getByRole("button", { name: /add credits/i }));
    await waitFor(() => {
      expect(screen.getByText(/redirecting to stripe/i)).toBeInTheDocument();
    });
  });

  it("TC-C-036: calls /api/billing/checkout with selected packageId on submit", async () => {
    render(<AddCreditsForm />);
    fireEvent.click(screen.getByRole("button", { name: /add credits/i }));
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/billing/checkout",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ packageId: "credits_200" }),
        })
      );
    });
  });
});
