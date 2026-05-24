import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WaitlistContent from "./WaitlistContent";

export const metadata: Metadata = {
  title: "Join the Waitlist | Islamic Ad Network",
  description:
    "Join the Islamic Ad Network waitlist. Founding advertisers and publishers receive locked-in rates, priority access, and exclusive perks.",
  openGraph: {
    title: "Join the Islamic Ad Network Waitlist",
    description:
      "Be among the first on the world's leading halal ad network. Founding members get exclusive rates locked in forever.",
    url: "https://islamicadnetwork.com/waitlist",
  },
  alternates: { canonical: "https://islamicadnetwork.com/waitlist" },
};

export default function WaitlistPage() {
  return (
    <>
      <Navbar />
      <main>
        <WaitlistContent />
      </main>
      <Footer />
    </>
  );
}
