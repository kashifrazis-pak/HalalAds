"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Advertisers", href: "/advertisers" },
  { label: "Publishers", href: "/publishers" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-brand-sm border-b border-brand-cream-dark"
          : "bg-transparent"
      )}
    >
      <div className="container-brand">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-brand-sm group-hover:shadow-brand-md transition-shadow">
              <CrescentLogo />
            </div>
            <span
              className={cn(
                "font-display font-bold text-xl transition-colors",
                scrolled ? "text-brand-charcoal" : "text-white"
              )}
            >
              Halal<span className="text-brand-gold">Ads</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-brand-gold",
                  scrolled ? "text-brand-charcoal" : "text-white/90"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className={cn(
                "text-sm font-medium transition-colors hover:text-brand-gold",
                scrolled ? "text-brand-charcoal" : "text-white/90"
              )}
            >
              Sign in
            </Link>
            <Link href="/waitlist" className="btn-secondary text-sm px-5 py-2.5">
              Get Started
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className={cn(
              "lg:hidden p-2 rounded-lg transition-colors",
              scrolled
                ? "text-brand-charcoal hover:bg-brand-cream-dark"
                : "text-white hover:bg-white/10"
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-brand-cream-dark shadow-brand-md">
          <div className="container-brand py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-brand-charcoal font-medium py-3 px-4 rounded-xl hover:bg-brand-cream transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-3 border-t border-brand-cream-dark mt-2">
              <Link href="/login" className="btn-outline flex-1 text-sm py-2.5">
                Sign in
              </Link>
              <Link href="/waitlist" className="btn-secondary flex-1 text-sm py-2.5">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function CrescentLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 2C8.5 2 7.1 2.4 5.9 3.1C8.7 4.2 10.7 6.9 10.7 10C10.7 13.1 8.7 15.8 5.9 16.9C7.1 17.6 8.5 18 10 18C14.4 18 18 14.4 18 10C18 5.6 14.4 2 10 2Z"
        fill="#C9A84C"
      />
    </svg>
  );
}
