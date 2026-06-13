"use client";

import { AlertTriangle, CheckCircle2, PackageOpen } from "lucide-react";
import type { StockStatus } from "@/lib/dealer/reports";
import { cn } from "@/lib/utils";

type StockStatusCardProps = {
  status: StockStatus;
};

export function StockStatusCard({ status }: StockStatusCardProps) {
  const levelCopy: Record<StockStatus["level"], { label: string; className: string }> = {
    healthy: {
      label: "Healthy",
      className: "bg-emerald-100 text-emerald-700"
    },
    watch: {
      label: "Watch",
      className: "bg-amber-100 text-amber-800"
    },
    low: {
      label: "Low stock",
      className: "bg-red-100 text-red-700"
    }
  };
  const Icon = status.level === "healthy" ? CheckCircle2 : status.level === "watch" ? PackageOpen : AlertTriangle;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-slate-950">{status.item.itemName}</p>
          <p className="mt-1 text-xs text-slate-500 capitalize">{status.item.category} input</p>
        </div>
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold", levelCopy[status.level].className)}>
          <Icon className="h-3.5 w-3.5" />
          {levelCopy[status.level].label}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <Metric label="Closing" value={`${status.closingStock}`} />
        <Metric label="Allocated" value={`${status.allocatedPercent}%`} />
        <Metric label="Distributed" value={`${status.distributedPercent}%`} />
      </div>

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-xs font-bold text-slate-500">
          <span>Distributed volume</span>
          <span>
            {status.item.distributedThisMonth}/{status.item.openingStock + status.item.receivedThisMonth} {status.item.unit}
          </span>
        </div>
        <div className="h-2 rounded-full bg-slate-200">
          <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${Math.min(100, status.distributedPercent)}%` }} />
        </div>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-2">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-extrabold text-slate-950">{value}</p>
    </div>
  );
}
