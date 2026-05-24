import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://halalads.com"),
  title: {
    default: "HalalAds — Reach the Muslim World",
    template: "%s | HalalAds",
  },
  description:
    "The world's leading halal advertising network. Reach 1.8 billion Muslims across Southeast Asia, the Middle East, and beyond with precision-targeted, Shariah-compliant campaigns.",
  keywords: [
    "halal advertising", "muslim marketing", "advertise to muslims",
    "islamic finance ads", "halal ad network", "muslim consumers",
    "halal publisher network", "muslim audience", "islamic advertising",
  ],
  authors: [{ name: "HalalAds" }],
  creator: "HalalAds",
  openGraph: {
    type: "website",
    siteName: "HalalAds",
    title: "HalalAds — Reach the Muslim World",
    description: "The world's leading halal advertising network. Reach 1.8 billion Muslims globally.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "HalalAds — Reach the Muslim World" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@halalads",
    title: "HalalAds — Reach the Muslim World",
    description: "Reach 1.8 billion Muslims with Shariah-compliant advertising.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  verification: {
    // google: "your-google-verification-token",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "HalalAds",
  url: "https://halalads.com",
  logo: "https://halalads.com/logo.png",
  description: "The world's leading halal advertising network.",
  sameAs: [
    "https://twitter.com/halalads",
    "https://linkedin.com/company/halalads",
    "https://instagram.com/halalads",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@halalads.com",
    contactType: "customer service",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
