import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Islamic Ad Network",
  description:
    "Get in touch with the Islamic Ad Network team for advertising inquiries, publisher applications, enterprise deals, and press enquiries.",
  openGraph: {
    title: "Contact Islamic Ad Network",
    description:
      "Reach our team for advertising, publishing, enterprise, and press enquiries. We respond within one business day.",
    url: "https://islamicadnetwork.com/contact",
  },
  alternates: { canonical: "https://islamicadnetwork.com/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <ContactForm />
      <Footer />
    </>
  );
}
