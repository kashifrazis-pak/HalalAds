/**
 * TC-C-050 to TC-C-056
 * Component tests for AdUnitCodePanel — embed code display + copy
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdUnitCodePanel from "@/app/dashboard/publisher/ad-units/[id]/AdUnitCodePanel";

// Mock clipboard API
const mockWriteText = jest.fn().mockResolvedValue(undefined);
Object.defineProperty(navigator, "clipboard", {
  value: { writeText: mockWriteText },
  writable: true,
});

const UNIT_ID = "unit-uuid-abc123";
const SIZE = "300x250";
const NAME = "Header Leaderboard";

describe("AdUnitCodePanel", () => {
  it("TC-C-050: renders the section heading", () => {
    render(<AdUnitCodePanel unitId={UNIT_ID} size={SIZE} name={NAME} />);
    expect(screen.getByRole("heading", { name: /embed code/i })).toBeInTheDocument();
  });

  it("TC-C-051: embed code contains the real unit ID", () => {
    render(<AdUnitCodePanel unitId={UNIT_ID} size={SIZE} name={NAME} />);
    expect(screen.getByText(new RegExp(UNIT_ID))).toBeInTheDocument();
  });

  it("TC-C-052: embed code contains the correct ad size", () => {
    render(<AdUnitCodePanel unitId={UNIT_ID} size={SIZE} name={NAME} />);
    // size appears both in the code block and the header chip
    const elements = screen.getAllByText(new RegExp(SIZE));
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });

  it("TC-C-053: embed code contains the unit name in the comment", () => {
    render(<AdUnitCodePanel unitId={UNIT_ID} size={SIZE} name={NAME} />);
    expect(screen.getByText(new RegExp(NAME))).toBeInTheDocument();
  });

  it("TC-C-054: Copy button is present and labelled", () => {
    render(<AdUnitCodePanel unitId={UNIT_ID} size={SIZE} name={NAME} />);
    expect(screen.getByText(/copy/i)).toBeInTheDocument();
  });

  it("TC-C-055: clicking Copy calls navigator.clipboard.writeText", async () => {
    render(<AdUnitCodePanel unitId={UNIT_ID} size={SIZE} name={NAME} />);
    fireEvent.click(screen.getByText(/copy/i));
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledTimes(1);
      const arg = mockWriteText.mock.calls[0][0] as string;
      expect(arg).toContain(UNIT_ID);
      expect(arg).toContain(SIZE);
    });
  });

  it("TC-C-056: shows 'Copied!' confirmation after clicking Copy", async () => {
    render(<AdUnitCodePanel unitId={UNIT_ID} size={SIZE} name={NAME} />);
    fireEvent.click(screen.getByText(/copy/i));
    await waitFor(() => {
      expect(screen.getByText(/copied!/i)).toBeInTheDocument();
    });
  });
});
