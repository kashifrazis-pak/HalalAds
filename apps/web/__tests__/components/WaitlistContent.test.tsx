/**
 * TC-C-097 to TC-C-101
 * Component tests for WaitlistContent
 */
import { render, screen, fireEvent } from "@testing-library/react";
import WaitlistContent from "@/app/waitlist/WaitlistContent";

jest.mock("next/navigation", () => ({
  useSearchParams: () => ({ get: () => null }),
}));

describe("WaitlistContent", () => {
  it("TC-C-097: renders waitlist heading", () => {
    render(<WaitlistContent />);
    expect(screen.getByRole("heading", { name: /join the islamic ad network waitlist/i })).toBeInTheDocument();
  });

  it("TC-C-098: defaults to advertiser type", () => {
    render(<WaitlistContent />);
    expect(screen.getByText(/sign up as an advertiser/i)).toBeInTheDocument();
  });

  it("TC-C-099: toggles to publisher type on click", () => {
    render(<WaitlistContent />);
    fireEvent.click(screen.getByRole("button", { name: /publisher/i }));
    expect(screen.getByText(/sign up as a publisher/i)).toBeInTheDocument();
  });

  it("TC-C-100: advertiser perks list is visible by default", () => {
    render(<WaitlistContent />);
    expect(screen.getByText(/locked-in founding advertiser rates/i)).toBeInTheDocument();
  });

  it("TC-C-101: publisher perks appear after toggle", () => {
    render(<WaitlistContent />);
    fireEvent.click(screen.getByRole("button", { name: /publisher/i }));
    expect(screen.getByText(/founding publisher badge/i)).toBeInTheDocument();
  });
});
