"use client";

import { useMemo, useState } from "react";
import { PackageCheck, Search } from "lucide-react";
import { DealerBottomNav } from "@/features/dealer/components/dealer-bottom-nav";
import {
  formatDealerDate,
  formatNaira,
  historyFilters,
  type RedemptionHistoryFilter,
  type RedemptionRecord
} from "@/lib/dealer/store";
import { cn } from "@/lib/utils";

type DealerHistoryListProps = {
  records: RedemptionRecord[];
};

export function DealerHistoryList({ records }: DealerHistoryListProps) {
  const [activeFilter, setActiveFilter] = useState<RedemptionHistoryFilter>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredRecords = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return records.filter((record) => {
      const matchesFilter = activeFilter === "all" || record.status === activeFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        record.itemName.toLowerCase().includes(normalizedSearch) ||
        record.farmerName.toLowerCase().includes(normalizedSearch) ||
        record.farmerId.toLowerCase().includes(normalizedSearch) ||
        record.ledgerReference.toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, records, searchTerm]);

  return (
    <main className="min-h-screen bg-surface text-ink lg:pl-72">
      <section className="mx-auto min-h-screen max-w-7xl bg-slate-50 px-4 py-6 pb-24 shadow-sm sm:px-6 lg:bg-transparent lg:px-8 lg:shadow-none">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-700">Dealer records</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Redemptions History</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Search past voucher disbursements by farmer, item type, or ledger reference.
          </p>
        </header>

        <section className="mt-5 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              className="min-h-12 w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm font-semibold outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search farmer, item, ledger"
              type="search"
              value={searchTerm}
            />
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {historyFilters.map((filter) => (
              <button
                className={cn(
                  "min-h-10 rounded-lg border px-2 text-xs font-bold transition",
                  activeFilter === filter.id
                    ? "border-indigo-700 bg-indigo-700 text-white"
                    : "border-slate-200 bg-white text-slate-600"
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
          {filteredRecords.map((record) => (
            <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" key={record.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                    <PackageCheck className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-extrabold">{record.itemName}</span>
                    <span className="mt-1 block text-xs text-slate-500">
                      {record.farmerName} · {record.farmerMaskedPhone}
                    </span>
                  </span>
                </div>
                <StatusPill status={record.status} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="font-bold uppercase tracking-wide text-slate-400">Date</p>
                  <p className="mt-1 font-semibold text-slate-700">{formatDealerDate(record.redeemedAt)}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="font-bold uppercase tracking-wide text-slate-400">Value</p>
                  <p className="mt-1 font-semibold text-slate-700">{formatNaira(record.walletContribution)}</p>
                </div>
              </div>
              <p className="mt-3 break-all rounded-lg bg-slate-50 px-3 py-2 text-xs font-bold text-slate-500">
                {record.ledgerReference}
              </p>
            </article>
          ))}

          {filteredRecords.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
              <p className="text-base font-extrabold">No redemptions found</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">Try another filter or search term.</p>
            </div>
          ) : null}
        </section>
      </section>
      <DealerBottomNav active="history" />
    </main>
  );
}

function StatusPill({ status }: { status: RedemptionRecord["status"] }) {
  const styles: Record<RedemptionRecord["status"], string> = {
    completed: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-800",
    reversed: "bg-red-100 text-red-700"
  };

  return (
    <span className={cn("rounded-full px-3 py-1 text-xs font-extrabold capitalize", styles[status])}>
      {status}
    </span>
  );
}
