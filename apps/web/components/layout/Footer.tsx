import Link from "next/link";
import { Mail } from "lucide-react";

const footerLinks = {
  Advertisers: [
    { label: "How It Works", href: "/advertisers" },
    { label: "Pricing", href: "/pricing" },
    { label: "Campaign Types", href: "/advertisers#campaign-types" },
    { label: "Targeting", href: "/advertisers#targeting" },
    { label: "Get Started", href: "/waitlist" },
  ],
  Publishers: [
    { label: "Monetize Your Site", href: "/publishers" },
    { label: "Revenue Share", href: "/publishers#revenue" },
    { label: "Ad Sizes", href: "/publishers#ad-sizes" },
    { label: "Apply Now", href: "/publishers#apply" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "/careers" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Halal Policy", href: "/halal-policy" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const socials = [
  { label: "X / Twitter", href: "https://twitter.com/halalads", initial: "𝕏" },
  { label: "LinkedIn", href: "https://linkedin.com/company/halalads", initial: "in" },
  { label: "Instagram", href: "https://instagram.com/halalads", initial: "IG" },
  { label: "YouTube", href: "https://youtube.com/@halalads", initial: "YT" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-charcoal text-white">
      {/* Top CTA strip */}
      <div className="bg-gradient-brand border-b border-white/10">
        <div className="container-brand py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-display text-2xl font-bold text-white">
              Ready to Reach the Muslim World?
            </p>
            <p className="text-white/70 mt-1 text-sm">
              Join thousands of brands and publishers on HalalAds.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/waitlist?type=advertiser" className="btn-secondary text-sm">
              Start Advertising
            </Link>
            <Link href="/waitlist?type=publisher" className="btn-ghost text-sm">
              Become a Publisher
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-brand py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 2C8.5 2 7.1 2.4 5.9 3.1C8.7 4.2 10.7 6.9 10.7 10C10.7 13.1 8.7 15.8 5.9 16.9C7.1 17.6 8.5 18 10 18C14.4 18 18 14.4 18 10C18 5.6 14.4 2 10 2Z"
                    fill="#C9A84C"
                  />
                </svg>
              </div>
              <span className="font-display font-bold text-xl text-white">
                Halal<span className="text-brand-gold">Ads</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              The world&apos;s leading halal advertising network, connecting brands
              with 1.8 billion Muslims across Southeast Asia, the Middle East,
              and beyond.
            </p>
            <div className="flex items-center gap-1.5 mt-4">
              <div className="w-5 h-5 rounded-full bg-brand-gold/20 flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M5 1C3.75 1 2.59 1.33 1.59 1.92C3.73 2.75 5.25 4.74 5.25 7.08C5.25 9.42 3.73 11.41 1.59 12.24C2.59 12.83 3.75 13.17 5 13.17C8.31 13.17 11 10.48 11 7.17C11 3.86 8.31 1 5 1Z" fill="#C9A84C"/>
                </svg>
              </div>
              <span className="text-xs text-brand-gold font-medium">Halal Certified Platform</span>
            </div>
            <div className="flex items-center gap-3 mt-6">
              {socials.map(({ label, href, initial }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-brand-gold/20 flex items-center justify-center transition-colors group text-xs font-bold text-white/50 hover:text-brand-gold"
                >
                  {initial}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/50 hover:text-brand-gold text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 mt-10 border-t border-white/10">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} HalalAds. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <Mail size={12} />
            <a href="mailto:hello@halalads.com" className="hover:text-brand-gold transition-colors">
              hello@halalads.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
