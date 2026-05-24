"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Megaphone, BarChart2, CreditCard,
  Globe, DollarSign, Settings, LogOut, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const advertiserNav = [
  { label: "Overview", href: "/dashboard/advertiser", icon: LayoutDashboard, exact: true },
  { label: "Campaigns", href: "/dashboard/advertiser/campaigns", icon: Megaphone },
  { label: "Analytics", href: "/dashboard/advertiser/analytics", icon: BarChart2 },
  { label: "Billing", href: "/dashboard/advertiser/billing", icon: CreditCard },
  { label: "Settings", href: "/dashboard/advertiser/settings", icon: Settings },
];

const publisherNav = [
  { label: "Overview", href: "/dashboard/publisher", icon: LayoutDashboard, exact: true },
  { label: "Ad Units", href: "/dashboard/publisher/ad-units", icon: Globe },
  { label: "Earnings", href: "/dashboard/publisher/earnings", icon: DollarSign },
  { label: "Settings", href: "/dashboard/publisher/settings", icon: Settings },
];

interface Props {
  role: "advertiser" | "publisher";
  userName?: string;
  userEmail?: string;
}

export default function DashboardSidebar({ role, userName, userEmail }: Props) {
  const pathname = usePathname();
  const nav = role === "advertiser" ? advertiserNav : publisherNav;

  function isActive(item: { href: string; exact?: boolean }) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href);
  }

  return (
    <aside className="w-64 flex-shrink-0 bg-brand-charcoal min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M10 2C8.5 2 7.1 2.4 5.9 3.1C8.7 4.2 10.7 6.9 10.7 10C10.7 13.1 8.7 15.8 5.9 16.9C7.1 17.6 8.5 18 10 18C14.4 18 18 14.4 18 10C18 5.6 14.4 2 10 2Z" fill="#C9A84C" />
            </svg>
          </div>
          <span className="font-display font-bold text-white text-base leading-tight">
            Islamic<span className="text-brand-gold">AdNetwork</span>
          </span>
        </Link>
      </div>

      {/* Role badge */}
      <div className="px-6 py-4 border-b border-white/10">
        <span className={cn(
          "text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full",
          role === "advertiser"
            ? "bg-brand-green/20 text-brand-green-light"
            : "bg-brand-gold/20 text-brand-gold"
        )}>
          {role}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
              isActive(item)
                ? "bg-white/10 text-white"
                : "text-white/50 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon size={17} />
            {item.label}
            {isActive(item) && <ChevronRight size={14} className="ml-auto" />}
          </Link>
        ))}
      </nav>

      {/* User + sign out */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="px-3 py-3 rounded-xl bg-white/5 mb-2">
          <div className="text-white text-sm font-medium truncate">{userName || "User"}</div>
          <div className="text-white/40 text-xs truncate">{userEmail}</div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all text-sm"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
