import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://islamicadnetwork.com"),
  title: {
    default: "Islamic Ad Network — Reach the Muslim World",
    template: "%s | Islamic Ad Network",
  },
  description:
    "The world's leading halal advertising network. Reach 1.8 billion Muslims across Southeast Asia, the Middle East, and beyond with precision-targeted, Shariah-compliant campaigns.",
  keywords: [
    "halal advertising", "muslim marketing", "advertise to muslims",
    "islamic finance ads", "halal ad network", "muslim consumers",
    "halal publisher network", "muslim audience", "islamic advertising",
  ],
  authors: [{ name: "Islamic Ad Network" }],
  creator: "Islamic Ad Network",
  openGraph: {
    type: "website",
    siteName: "Islamic Ad Network",
    title: "Islamic Ad Network — Reach the Muslim World",
    description: "The world's leading halal advertising network. Reach 1.8 billion Muslims globally.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Islamic Ad Network — Reach the Muslim World" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@islamicadnetwork",
    title: "Islamic Ad Network — Reach the Muslim World",
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
  name: "Islamic Ad Network",
  url: "https://islamicadnetwork.com",
  logo: "https://islamicadnetwork.com/logo.png",
  description: "The world's leading halal advertising network.",
  sameAs: [
    "https://twitter.com/halalads",
    "https://linkedin.com/company/halalads",
    "https://instagram.com/halalads",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@islamicadnetwork.com",
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
