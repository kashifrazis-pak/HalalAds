/**
 * TC-C-040 to TC-C-046
 * Component tests for CampaignControls — pause/activate campaign button
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CampaignControls from "@/app/dashboard/advertiser/campaigns/[id]/CampaignControls";

const mockRefresh = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  jest.clearAllMocks();
  mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ ok: true }) });
});

describe("CampaignControls", () => {
  it("TC-C-040: renders nothing for pending_review status", () => {
    const { container } = render(
      <CampaignControls campaignId="c-1" status="pending_review" />
    );
    expect(container.firstChild).toBeNull();
  });

  it("TC-C-041: renders nothing for rejected status", () => {
    const { container } = render(<CampaignControls campaignId="c-1" status="rejected" />);
    expect(container.firstChild).toBeNull();
  });

  it("TC-C-042: renders nothing for draft status", () => {
    const { container } = render(<CampaignControls campaignId="c-1" status="draft" />);
    expect(container.firstChild).toBeNull();
  });

  it("TC-C-043: renders 'Pause' button for active campaign", () => {
    render(<CampaignControls campaignId="c-1" status="active" />);
    expect(screen.getByRole("button", { name: /pause/i })).toBeInTheDocument();
  });

  it("TC-C-044: renders 'Activate' button for paused campaign", () => {
    render(<CampaignControls campaignId="c-1" status="paused" />);
    expect(screen.getByRole("button", { name: /activate/i })).toBeInTheDocument();
  });

  it("TC-C-045: clicking Pause calls PATCH /api/campaigns/[id]", async () => {
    render(<CampaignControls campaignId="camp-123" status="active" />);
    fireEvent.click(screen.getByRole("button", { name: /pause/i }));
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/campaigns/camp-123",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ status: "paused" }),
        })
      );
    });
  });

  it("TC-C-046: clicking Activate sends status=active to the API", async () => {
    render(<CampaignControls campaignId="camp-456" status="paused" />);
    fireEvent.click(screen.getByRole("button", { name: /activate/i }));
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/campaigns/camp-456",
        expect.objectContaining({
          body: JSON.stringify({ status: "active" }),
        })
      );
    });
  });
});
