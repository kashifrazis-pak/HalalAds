import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon: React.ElementType;
  iconColor?: "green" | "gold";
}

export default function StatCard({ label, value, change, positive, icon: Icon, iconColor = "green" }: Props) {
  return (
    <div className="card-brand p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center",
          iconColor === "green" ? "bg-brand-green/10" : "bg-brand-gold/10"
        )}>
          <Icon size={18} className={iconColor === "green" ? "text-brand-green" : "text-brand-gold-dark"} />
        </div>
        {change && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-semibold",
            positive ? "text-brand-green" : "text-red-500"
          )}>
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {change}
          </div>
        )}
      </div>
      <div className="font-display text-2xl font-bold text-brand-charcoal mb-1">{value}</div>
      <div className="text-brand-muted text-sm">{label}</div>
    </div>
  );
}
