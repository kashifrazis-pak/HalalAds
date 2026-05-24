/**
 * TC-C-070 to TC-C-075
 * Component tests for PayoutHistory
 */
import { render, screen, waitFor } from "@testing-library/react";
import PayoutHistory from "@/app/dashboard/publisher/earnings/PayoutHistory";

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("PayoutHistory", () => {
  it("TC-C-070: shows empty state when no payouts exist", async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ payouts: [] }) });
    render(<PayoutHistory />);
    await waitFor(() => expect(screen.getByText(/no payouts yet/i)).toBeInTheDocument());
  });

  it("TC-C-071: renders a payout row for each payout", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        payouts: [
          { id: "p1", amount_cents: 5000, currency: "USD", method: "paypal", status: "paid", period_start: "2025-03-01", period_end: "2025-03-31", failure_reason: null, created_at: "2025-04-15T00:00:00Z" },
          { id: "p2", amount_cents: 3200, currency: "USD", method: "paypal", status: "processing", period_start: null, period_end: null, failure_reason: null, created_at: "2025-05-15T00:00:00Z" },
        ],
      }),
    });
    render(<PayoutHistory />);
    await waitFor(() => expect(screen.getByText("$50.00")).toBeInTheDocument());
    expect(screen.getByText("$32.00")).toBeInTheDocument();
  });

  it("TC-C-072: shows paid status badge with correct styling", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        payouts: [{ id: "p1", amount_cents: 5000, currency: "USD", method: "paypal", status: "paid", period_start: null, period_end: null, failure_reason: null, created_at: "2025-04-15T00:00:00Z" }],
      }),
    });
    render(<PayoutHistory />);
    await waitFor(() => expect(screen.getByText("paid")).toBeInTheDocument());
  });

  it("TC-C-073: shows failure_reason for failed payouts", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        payouts: [{ id: "p1", amount_cents: 2500, currency: "USD", method: "paypal", status: "failed", period_start: null, period_end: null, failure_reason: "Receiver account is invalid", created_at: "2025-04-15T00:00:00Z" }],
      }),
    });
    render(<PayoutHistory />);
    await waitFor(() => expect(screen.getByText(/receiver account is invalid/i)).toBeInTheDocument());
  });

  it("TC-C-074: formats period dates correctly when both are set", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        payouts: [{ id: "p1", amount_cents: 5000, currency: "USD", method: "paypal", status: "paid", period_start: "2025-03-01", period_end: "2025-03-31", failure_reason: null, created_at: "2025-04-15T00:00:00Z" }],
      }),
    });
    render(<PayoutHistory />);
    await waitFor(() => {
      // Should show "Mar 2025 – Mar 2025" range
      expect(screen.getByText(/mar 2025/i)).toBeInTheDocument();
    });
  });

  it("TC-C-075: shows loading spinner initially", () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // never resolves
    render(<PayoutHistory />);
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });
});
