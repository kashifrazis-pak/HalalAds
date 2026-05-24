import { Bell, Plus } from "lucide-react";
import Link from "next/link";

interface Props {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function DashboardHeader({ title, subtitle, ctaLabel, ctaHref }: Props) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-charcoal">{title}</h1>
        {subtitle && <p className="text-brand-muted text-sm mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-xl bg-brand-cream border border-brand-cream-dark flex items-center justify-center hover:bg-brand-cream-dark transition-colors relative">
          <Bell size={16} className="text-brand-muted" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-brand-green" />
        </button>
        {ctaLabel && ctaHref && (
          <Link href={ctaHref} className="btn-primary text-sm px-4 py-2.5">
            <Plus size={15} />
            {ctaLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
