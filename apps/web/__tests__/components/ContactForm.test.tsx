/**
 * TC-C-090 to TC-C-096
 * Component tests for ContactForm
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactForm from "@/app/contact/ContactForm";

describe("ContactForm", () => {
  it("TC-C-090: renders hero section with heading", () => {
    render(<ContactForm />);
    expect(screen.getByRole("heading", { name: /get in touch/i })).toBeInTheDocument();
  });

  it("TC-C-091: renders all three contact info cards", () => {
    render(<ContactForm />);
    expect(screen.getByText(/general enquiries/i)).toBeInTheDocument();
    expect(screen.getByText(/enterprise sales/i)).toBeInTheDocument();
    expect(screen.getAllByText(/press & media/i).length).toBeGreaterThanOrEqual(1);
  });

  it("TC-C-092: contact email links are present", () => {
    render(<ContactForm />);
    expect(screen.getByRole("link", { name: /hello@islamicadnetwork/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sales@islamicadnetwork/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /press@islamicadnetwork/i })).toBeInTheDocument();
  });

  it("TC-C-093: form renders all required fields", () => {
    render(<ContactForm />);
    expect(screen.getByPlaceholderText(/your full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/you@company.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/tell us more/i)).toBeInTheDocument();
  });

  it("TC-C-094: reason select has all options", () => {
    render(<ContactForm />);
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /I want to advertise/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /enterprise/i })).toBeInTheDocument();
  });

  it("TC-C-095: send button is present and enabled by default", () => {
    render(<ContactForm />);
    const btn = screen.getByRole("button", { name: /send message/i });
    expect(btn).toBeInTheDocument();
    expect(btn).not.toBeDisabled();
  });

  it("TC-C-096: shows success state after form submission", async () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByPlaceholderText(/your full name/i), { target: { value: "Ahmad" } });
    fireEvent.change(screen.getByPlaceholderText(/you@company.com/i), { target: { value: "a@b.com" } });
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "advertiser" } });
    fireEvent.change(screen.getByPlaceholderText(/tell us more/i), { target: { value: "Hello" } });
    fireEvent.submit(screen.getByRole("button", { name: /send message/i }).closest("form")!);
    await waitFor(() => {
      expect(screen.getByText(/message received/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
