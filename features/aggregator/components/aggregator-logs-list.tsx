"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, Leaf, Recycle, Search, Scale } from "lucide-react";
import { StatusBadge, UrgencyBadge } from "@/components/ui/badge";
import { AggregatorBottomNav } from "@/features/aggregator/components/aggregator-bottom-nav";
import { formatKg } from "@/lib/format";
import { formatLogDate, logFilters, type AggregatorHistoricalLog, type AggregatorLogFilter } from "@/lib/aggregator/logs";
import { cn } from "@/lib/utils";

type AggregatorLogsListProps = {
  logs: AggregatorHistoricalLog[];
};

export function AggregatorLogsList({ logs }: AggregatorLogsListProps) {
  const [activeFilter, setActiveFilter] = useState<AggregatorLogFilter>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredLogs = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return logs.filter((log) => {
      const matchesFilter = activeFilter === "all" || log.pipelineType === activeFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        log.itemName.toLowerCase().includes(normalizedSearch) ||
        log.farmerMaskedPhone.toLowerCase().includes(normalizedSearch) ||
        log.location.zone.toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, logs, searchTerm]);

  return (
    <main className="min-h-screen bg-surface pb-24 text-ink lg:pl-72">
      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#A0522D]">Aggregator logs</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight">My Logs</h1>
          <p className="mt-2 text-sm leading-6 text-[#7F6A5B]">
            Track every fresh produce and agri-waste entry from submission through match, collection, and payout.
          </p>
        </header>

        <section className="mt-5 rounded-lg border border-[#E5DDD4] bg-white p-3 shadow-panel">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9C8575]" />
            <input
              className="min-h-12 w-full rounded-lg border border-[#E5DDD4] bg-[#FAF7F2] py-3 pl-10 pr-3 text-sm font-semibold outline-none transition placeholder:font-normal placeholder:text-[#9C8575] focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/15"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search type, farmer, or zone"
              type="search"
              value={searchTerm}
            />
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {logFilters.map((filter) => (
              <button
                className={cn(
                  "min-h-10 rounded-lg border px-3 text-sm font-bold transition",
                  activeFilter === filter.id
                    ? "border-[#A0522D] bg-[#A0522D] text-white"
                    : "border-[#E5DDD4] bg-white text-[#5C3D1E]"
                )}
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                type="button"
              >
                {filter.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-5 space-y-3">
          {filteredLogs.map((log) => (
            <LogCard key={log.id} log={log} />
          ))}

          {filteredLogs.length === 0 ? (
            <div className="rounded-lg border border-[#E5DDD4] bg-white p-6 text-center shadow-panel">
              <p className="text-base font-extrabold">No logs found</p>
              <p className="mt-2 text-sm leading-6 text-[#7F6A5B]">
                Try another filter or search term to find the field entry you need.
              </p>
            </div>
          ) : null}
        </section>
      </section>
      <AggregatorBottomNav active="logs" />
    </main>
  );
}

function LogCard({ log }: { log: AggregatorHistoricalLog }) {
  const isFresh = log.pipelineType === "fresh_produce";

  return (
    <Link
      className="block rounded-lg border border-[#E5DDD4] bg-white p-4 shadow-panel transition hover:border-[#A0522D]"
      href={`/aggregator/logs/${log.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide",
                isFresh ? "bg-emerald-100 text-emerald-800" : "bg-[#F5EFE6] text-[#7C5C2E]"
              )}
            >
              {isFresh ? <Leaf className="h-3 w-3" /> : <Recycle className="h-3 w-3" />}
              {isFresh ? "Fresh" : "Waste"}
            </span>
            {log.urgency ? <UrgencyBadge urgency={log.urgency} /> : null}
          </div>
          <p className="mt-2 truncate text-base font-extrabold">{log.itemName}</p>
          <p className="mt-1 text-xs text-[#7F6A5B]">
            {formatKg(log.weightKg)} · Farmer {log.farmerMaskedPhone}
          </p>
          <p className="mt-1 text-xs text-[#9C8575]">{formatLogDate(log.submittedAt)}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <StatusBadge status={log.status} />
          <ArrowRight className="h-4 w-4 text-[#9C8575]" />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#FAF7F2] px-3 py-2 text-xs text-[#5C3D1E]">
        <Scale className="h-4 w-4 shrink-0 text-[#9C8575]" />
        <span className="truncate">
          {log.location.zone}
          {log.matchedBuyerName ? ` · ${log.matchedBuyerName}` : ""}
        </span>
      </div>

      {log.status === "Disputed" ? (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs leading-5 text-red-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          Dispute active. Funds remain on hold until audit review is complete.
        </div>
      ) : null}
    </Link>
  );
}
