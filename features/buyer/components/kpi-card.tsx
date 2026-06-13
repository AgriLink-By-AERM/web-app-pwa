import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type KpiCardProps = {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  tone?: "factory" | "restaurant" | "neutral";
};

export function KpiCard({ label, value, sub, icon: Icon, tone = "neutral" }: KpiCardProps) {
  const accentClass = {
    factory: "text-factoryAccent bg-factoryTint",
    restaurant: "text-restaurantAccent bg-restaurantTint",
    neutral: "text-ink bg-slate-100"
  }[tone];

  return (
    <div className="rounded-lg border border-border bg-white p-5 shadow-panel">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
          <p className="mt-2 text-3xl font-extrabold leading-none text-ink">{value}</p>
          <p className="mt-2 text-sm text-subtle">{sub}</p>
        </div>
        <div className={cn("rounded-lg p-2.5", accentClass)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
