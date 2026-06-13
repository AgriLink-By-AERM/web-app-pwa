"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import { BuyerDesktopShell } from "@/features/buyer/components/buyer-desktop-shell";
import {
  formatBillingDate,
  formatNaira,
  getTransactionHistories,
  tradeStatusStyles,
  type TransactionHistory
} from "@/lib/buyer/billing";
import type { CropSpecies } from "@/lib/buyer/store";
import { cropSpeciesOptions } from "@/lib/buyer/store";

type YearFilter = "all" | "2026" | "2025";

const historyPromise = getTransactionHistories();

export default function BuyerHistoryPage() {
  const [records, setRecords] = useState<TransactionHistory[]>([]);
  const [query, setQuery] = useState<string>("");
  const [cropFilter, setCropFilter] = useState<CropSpecies | "all">("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<YearFilter>("all");

  useEffect(() => {
    historyPromise.then(setRecords).catch(() => setRecords([]));
  }, []);

  const regions = useMemo(() => Array.from(new Set(records.map((record) => record.region))), [records]);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return records.filter((record) => {
      const matchesQuery =
        normalized.length === 0 ||
        record.batchReference.toLowerCase().includes(normalized) ||
        record.originHub.toLowerCase().includes(normalized) ||
        record.variety.toLowerCase().includes(normalized);
      const matchesCrop = cropFilter === "all" || record.cropSpecies === cropFilter;
      const matchesRegion = regionFilter === "all" || record.region === regionFilter;
      const matchesYear = yearFilter === "all" || new Date(record.deliveredAt).getFullYear().toString() === yearFilter;

      return matchesQuery && matchesCrop && matchesRegion && matchesYear;
    });
  }, [cropFilter, query, records, regionFilter, yearFilter]);

  const totalMt = filtered.reduce((total, record) => total + record.metricTonsHandled, 0);

  return (
    <BuyerDesktopShell
      active="history"
      subtitle="Archival fulfillment ledger for completed trades, regional origins, and delivery timestamps."
      title="Fulfillment History"
    >
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-black text-slate-950">Historical trade grid</h2>
            <p className="mt-1 text-sm text-slate-500">{totalMt.toLocaleString("en-NG")}MT handled in current view.</p>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-11 w-80 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-semibold outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search batch, origin, variety"
              value={query}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-5 py-3">
          <Filter className="h-4 w-4 text-slate-500" />
          <Select value={cropFilter} onChange={(value) => setCropFilter(value as CropSpecies | "all")}>
            <option value="all">All crops</option>
            {cropSpeciesOptions.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </Select>
          <Select value={regionFilter} onChange={setRegionFilter}>
            <option value="all">All regions</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </Select>
          <Select value={yearFilter} onChange={(value) => setYearFilter(value as YearFilter)}>
            <option value="all">All years</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead className="bg-slate-50">
              <tr>
                <Th>Batch</Th>
                <Th>Crop</Th>
                <Th>Origin hub</Th>
                <Th>Metric tons</Th>
                <Th>Delivered</Th>
                <Th>Total value</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((record) => (
                <tr key={record.id}>
                  <Td>{record.batchReference}</Td>
                  <Td>
                    <p className="font-black text-slate-950">{record.cropSpecies}</p>
                    <p className="mt-1 text-xs text-slate-500">{record.variety}</p>
                  </Td>
                  <Td>
                    <p className="font-semibold">{record.originHub}</p>
                    <p className="mt-1 text-xs text-slate-500">{record.region}</p>
                  </Td>
                  <Td>{record.metricTonsHandled}MT</Td>
                  <Td>{formatBillingDate(record.deliveredAt)}</Td>
                  <Td>{formatNaira(record.totalValue)}</Td>
                  <Td>
                    <span className={`rounded-full px-3 py-1 text-xs font-black capitalize ${tradeStatusStyles[record.status]}`}>
                      {record.status}
                    </span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </BuyerDesktopShell>
  );
}

function Select({ children, onChange, value }: { children: React.ReactNode; onChange: (value: string) => void; value: string }) {
  return (
    <select
      className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none focus:border-blue-600"
      onChange={(event) => onChange(event.target.value)}
      value={value}
    >
      {children}
    </select>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-5 py-3 text-xs font-black uppercase tracking-wide text-slate-500">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-5 py-4 text-sm text-slate-700">{children}</td>;
}
