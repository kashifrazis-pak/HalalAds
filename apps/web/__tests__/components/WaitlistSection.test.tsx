/**
 * TC-C-020 to TC-C-027
 * Component tests for WaitlistSection — advertiser/publisher sign-up form
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WaitlistSection from "@/components/sections/WaitlistSection";

// Framer Motion: disable animations in tests
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  },
}));

describe("WaitlistSection", () => {
  it("TC-C-020: renders heading and join button", () => {
    render(<WaitlistSection />);
    expect(screen.getByRole("heading", { name: /join the waitlist/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /join the waitlist/i })).toBeInTheDocument();
  });

  it("TC-C-021: shows advertiser tab active by default", () => {
    render(<WaitlistSection />);
    const buttons = screen.getAllByRole("button");
    const advertiserBtn = buttons.find((b) => /advertiser/i.test(b.textContent ?? ""));
    expect(advertiserBtn).toBeDefined();
    expect(advertiserBtn!.className).toContain("bg-brand-green");
  });

  it("TC-C-022: switches to publisher tab", () => {
    render(<WaitlistSection />);
    const buttons = screen.getAllByRole("button");
    const publisherBtn = buttons.find((b) => /publisher/i.test(b.textContent ?? ""));
    expect(publisherBtn).toBeDefined();
    fireEvent.click(publisherBtn!);
    expect(publisherBtn!.className).toContain("bg-brand-green");
  });

  it("TC-C-023: renders name and email inputs", () => {
    render(<WaitlistSection />);
    expect(screen.getByPlaceholderText(/ahmed al-rashid/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@company.com")).toBeInTheDocument();
  });

  it("TC-C-024: submit button is enabled when fields are empty (HTML5 required validation)", () => {
    render(<WaitlistSection />);
    const btn = screen.getByRole("button", { name: /join the waitlist/i });
    expect(btn).not.toBeDisabled();
  });

  it("TC-C-025: shows loading state during submission", async () => {
    render(<WaitlistSection />);
    const nameInput = screen.getByPlaceholderText(/ahmed al-rashid/i);
    const emailInput = screen.getByPlaceholderText("you@company.com");
    await userEvent.type(nameInput, "Test User");
    await userEvent.type(emailInput, "test@test.com");
    fireEvent.submit(screen.getByRole("button", { name: /join the waitlist/i }).closest("form")!);
    expect(await screen.findByText(/joining/i)).toBeInTheDocument();
  });

  it("TC-C-026: shows success state after submission", async () => {
    render(<WaitlistSection />);
    const nameInput = screen.getByPlaceholderText(/ahmed al-rashid/i);
    const emailInput = screen.getByPlaceholderText("you@company.com");
    await userEvent.type(nameInput, "Test User");
    await userEvent.type(emailInput, "test@test.com");
    fireEvent.submit(screen.getByRole("button", { name: /join the waitlist/i }).closest("form")!);
    await waitFor(() => expect(screen.getByText(/you're on the list/i)).toBeInTheDocument(), { timeout: 3000 });
  });

  it("TC-C-027: success message mentions following on social", async () => {
    render(<WaitlistSection />);
    const nameInput = screen.getByPlaceholderText(/ahmed al-rashid/i);
    const emailInput = screen.getByPlaceholderText("you@company.com");
    await userEvent.type(nameInput, "Test User");
    await userEvent.type(emailInput, "test@test.com");
    fireEvent.submit(screen.getByRole("button", { name: /join the waitlist/i }).closest("form")!);
    await waitFor(() => expect(screen.getByText(/linkedin/i)).toBeInTheDocument(), { timeout: 3000 });
  });
});
