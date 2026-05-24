/**
 * TC-C-060 to TC-C-067
 * Component tests for PayoutSetupForm
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PayoutSetupForm from "@/app/dashboard/publisher/earnings/PayoutSetupForm";

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  jest.clearAllMocks();
  // Default: no existing payout configured
  mockFetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ payout: null }),
  });
});

describe("PayoutSetupForm", () => {
  it("TC-C-060: renders all three method buttons", async () => {
    render(<PayoutSetupForm />);
    await waitFor(() => expect(screen.getByText("PayPal")).toBeInTheDocument());
    expect(screen.getByText("Wise")).toBeInTheDocument();
    expect(screen.getByText("Bank Transfer")).toBeInTheDocument();
  });

  it("TC-C-061: shows PayPal email field by default", async () => {
    render(<PayoutSetupForm />);
    await waitFor(() =>
      expect(screen.getByPlaceholderText(/your@paypal.com/i)).toBeInTheDocument()
    );
  });

  it("TC-C-062: switching to Wise shows Wise email field", async () => {
    render(<PayoutSetupForm />);
    await waitFor(() => screen.getByText("Wise"));
    fireEvent.click(screen.getByText("Wise"));
    expect(screen.getByPlaceholderText(/your@wise.com/i)).toBeInTheDocument();
  });

  it("TC-C-063: switching to Bank Transfer shows bank fields", async () => {
    render(<PayoutSetupForm />);
    await waitFor(() => screen.getByText("Bank Transfer"));
    fireEvent.click(screen.getByText("Bank Transfer"));
    expect(screen.getByPlaceholderText(/account holder name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/IBAN or account number/i)).toBeInTheDocument();
  });

  it("TC-C-064: pre-fills fields when existing payout is loaded", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ payout: { method: "paypal", email: "saved@paypal.com" } }),
    });
    render(<PayoutSetupForm />);
    await waitFor(() =>
      expect(screen.getByDisplayValue("saved@paypal.com")).toBeInTheDocument()
    );
  });

  it("TC-C-065: submit calls POST /api/publisher/payout with correct payload", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ payout: null }) }) // GET
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ok: true }) });    // POST

    render(<PayoutSetupForm />);
    await waitFor(() => screen.getByPlaceholderText(/your@paypal.com/i));

    fireEvent.change(screen.getByPlaceholderText(/your@paypal.com/i), {
      target: { value: "me@paypal.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save payout settings/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/publisher/payout",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ method: "paypal", email: "me@paypal.com" }),
        })
      );
    });
  });

  it("TC-C-066: shows Saved! confirmation on success", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ payout: null }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ ok: true }) });

    render(<PayoutSetupForm />);
    await waitFor(() => screen.getByPlaceholderText(/your@paypal.com/i));
    fireEvent.change(screen.getByPlaceholderText(/your@paypal.com/i), {
      target: { value: "me@paypal.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save payout settings/i }));
    await waitFor(() => expect(screen.getByText(/saved!/i)).toBeInTheDocument());
  });

  it("TC-C-067: shows error message on API failure", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ payout: null }) })
      .mockResolvedValueOnce({ ok: false, json: () => Promise.resolve({ error: "Publisher not found" }) });

    render(<PayoutSetupForm />);
    await waitFor(() => screen.getByPlaceholderText(/your@paypal.com/i));
    fireEvent.change(screen.getByPlaceholderText(/your@paypal.com/i), {
      target: { value: "me@paypal.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /save payout settings/i }));
    await waitFor(() => expect(screen.getByText(/publisher not found/i)).toBeInTheDocument());
  });
});
