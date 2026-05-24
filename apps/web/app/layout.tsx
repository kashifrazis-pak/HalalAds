import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "HalalAds — Reach the Muslim World",
    template: "%s | HalalAds",
  },
  description:
    "The world's leading halal advertising network. Reach 1.8 billion Muslims across Southeast Asia, the Middle East, and beyond with precision-targeted, Shariah-compliant campaigns.",
  keywords: [
    "halal advertising",
    "muslim marketing",
    "advertise to muslims",
    "islamic finance ads",
    "halal ad network",
    "muslim consumers",
  ],
  openGraph: {
    type: "website",
    siteName: "HalalAds",
    title: "HalalAds — Reach the Muslim World",
    description:
      "The world's leading halal advertising network. Reach 1.8 billion Muslims globally.",
  },
  twitter: {
    card: "summary_large_image",
    title: "HalalAds — Reach the Muslim World",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
