import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Beaker, Download, Leaf, PackageCheck, Sprout, UsersRound, WalletCards } from "lucide-react";
import { DealerBottomNav } from "@/features/dealer/components/dealer-bottom-nav";
import { StockStatusCard } from "@/features/dealer/components/stock-status-card";
import {
  buildStockStatus,
  calculateMonthlyMetrics,
  getMonthlyInputStocks,
  type InputCategory,
  type InputStock
} from "@/lib/dealer/reports";
import { formatNaira } from "@/lib/dealer/store";

export default async function DealerMonthlyReportPage() {
  const stocks = await getMonthlyInputStocks();
  const metrics = calculateMonthlyMetrics(stocks);
  const stockStatuses = stocks.map(buildStockStatus);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <section className="mx-auto min-h-screen max-w-md border-x border-slate-200 bg-slate-50 px-4 py-6 pb-24 shadow-sm">
        <Link className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-indigo-700" href="/dealer/reports">
          <ArrowLeft className="h-4 w-4" />
          Reports
        </Link>

        <header className="mt-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-700">Monthly input report</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight">{metrics.monthLabel}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Structured compliance breakdown of government-subsidized inputs distributed this month.
          </p>
        </header>

        <section className="mt-5 grid grid-cols-2 gap-3">
          <MetricCard icon={UsersRound} label="Farmers served" value={String(metrics.farmersServed)} />
          <MetricCard icon={WalletCards} label="Wallet redeemed" value={formatNaira(metrics.walletValueRedeemed)} />
          <MetricCard icon={PackageCheck} label="Completion" value={`${metrics.distributionCompletionRate}%`} />
          <MetricCard icon={Leaf} label="Low stock alerts" value={String(metrics.lowStockCount)} />
        </section>

        <section className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold">Category sub-totals</h2>
            <Download className="h-5 w-5 text-indigo-700" />
          </div>
          <div className="mt-4 space-y-3">
            <CategorySubtotal icon={Sprout} label="Seed bags" value={metrics.seedBagsDistributed} unit="bags" />
            <CategorySubtotal icon={PackageCheck} label="Fertilizer metrics" value={metrics.fertilizerBagsDistributed} unit="bags" />
            <CategorySubtotal icon={Beaker} label="Chemical solutions" value={metrics.chemicalLitresDistributed} unit="litres" />
          </div>
        </section>

        <section className="mt-5">
          <h2 className="mb-3 text-base font-extrabold">Input stock analysis</h2>
          <div className="space-y-3">
            {stockStatuses.map((status) => (
              <StockStatusCard key={status.item.id} status={status} />
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-extrabold">Detailed data table</h2>
          <div className="mt-4 space-y-3">
            {(["seed", "fertilizer", "chemical"] as InputCategory[]).map((category) => (
              <CategoryBlock category={category} key={category} stocks={stocks.filter((stock) => stock.category === category)} />
            ))}
          </div>
        </section>
      </section>
      <DealerBottomNav active="history" />
    </main>
  );
}

function MetricCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <Icon className="h-5 w-5 text-indigo-700" />
      <p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-extrabold text-slate-950">{value}</p>
    </div>
  );
}

function CategorySubtotal({ icon: Icon, label, value, unit }: { icon: LucideIcon; label: string; value: number; unit: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-3">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
          <Icon className="h-5 w-5" />
        </span>
        <p className="text-sm font-bold">{label}</p>
      </div>
      <p className="text-sm font-extrabold text-slate-950">
        {value} {unit}
      </p>
    </div>
  );
}

function CategoryBlock({ category, stocks }: { category: InputCategory; stocks: InputStock[] }) {
  return (
    <div className="rounded-lg border border-slate-200">
      <div className="border-b border-slate-200 bg-slate-50 px-3 py-2">
        <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">{category}</p>
      </div>
      {stocks.map((stock) => (
        <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-slate-100 px-3 py-3 last:border-b-0" key={stock.id}>
          <div>
            <p className="text-sm font-bold">{stock.itemName}</p>
            <p className="mt-1 text-xs text-slate-500">
              Allocated {stock.allocatedThisMonth} · Distributed {stock.distributedThisMonth}
            </p>
          </div>
          <p className="text-sm font-extrabold text-indigo-700">{stock.distributedThisMonth}</p>
        </div>
      ))}
    </div>
  );
}
