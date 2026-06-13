import type { SpoilageUrgency, TransactionStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  dotClassName?: string;
};

export function Badge({ children, className, dotClassName }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold leading-none",
        className
      )}
    >
      {dotClassName ? <span className={cn("h-1.5 w-1.5 rounded-full", dotClassName)} /> : null}
      {children}
    </span>
  );
}

type StatusBadgeProps = {
  status: TransactionStatus | "Active" | "Paused" | "Confirmed";
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<string, { className: string; dotClassName: string }> = {
    "Pending Match": {
      className: "bg-yellow-100 text-yellow-800",
      dotClassName: "bg-yellow-600"
    },
    Matched: {
      className: "bg-emerald-100 text-emerald-800",
      dotClassName: "bg-emerald-600"
    },
    "In Transit": {
      className: "bg-blue-100 text-blue-800",
      dotClassName: "bg-blue-600"
    },
    "Stage 1 Released": {
      className: "bg-violet-100 text-violet-800",
      dotClassName: "bg-violet-600"
    },
    Collected: {
      className: "bg-emerald-100 text-emerald-800",
      dotClassName: "bg-emerald-600"
    },
    Delivered: {
      className: "bg-emerald-100 text-emerald-800",
      dotClassName: "bg-emerald-600"
    },
    Disputed: {
      className: "bg-red-100 text-red-700",
      dotClassName: "bg-red-600"
    },
    "No Match Found": {
      className: "bg-slate-100 text-slate-700",
      dotClassName: "bg-slate-500"
    },
    Expired: {
      className: "bg-slate-100 text-slate-600",
      dotClassName: "bg-slate-400"
    },
    Active: {
      className: "bg-emerald-100 text-emerald-800",
      dotClassName: "bg-emerald-600"
    },
    Paused: {
      className: "bg-slate-100 text-slate-600",
      dotClassName: "bg-slate-400"
    },
    Confirmed: {
      className: "bg-emerald-100 text-emerald-800",
      dotClassName: "bg-emerald-600"
    }
  };
  const style = styles[status] ?? styles["Pending Match"];

  return (
    <Badge className={style.className} dotClassName={style.dotClassName}>
      {status}
    </Badge>
  );
}

type UrgencyBadgeProps = {
  urgency: SpoilageUrgency;
};

export function UrgencyBadge({ urgency }: UrgencyBadgeProps) {
  const styles: Record<SpoilageUrgency, { label: string; className: string }> = {
    green: {
      label: "48h+",
      className: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200"
    },
    amber: {
      label: "12-48h",
      className: "bg-amber-100 text-amber-800 ring-1 ring-amber-200"
    },
    red: {
      label: "Under 12h",
      className: "bg-red-100 text-red-700 ring-1 ring-red-200"
    }
  };

  return <Badge className={styles[urgency].className}>{styles[urgency].label}</Badge>;
}
