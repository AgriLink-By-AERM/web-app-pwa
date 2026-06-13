import type { LucideIcon } from "lucide-react";
import { AlertTriangle, ClipboardList, FileText, PackageCheck, Route, ShipWheel, Zap } from "lucide-react";
import { BuyerDesktopShell } from "@/features/buyer/components/buyer-desktop-shell";
import {
  formatBuyerDate,
  formatMetricTonsFromKg,
  getBuyerDashboard,
  type InventoryAlert
} from "@/lib/buyer/store";
import { cn } from "@/lib/utils";

export default async function BuyerDashboardPage() {
  const data = await getBuyerDashboard();

  return (
    <BuyerDesktopShell
      active="dashboard"
      subtitle="High-volume procurement command center for bulk agro-input matching and logistics."
      title="Buyer Command Dashboard"
    >
      <section className="grid gap-4 xl:grid-cols-4">
        <MetricCard icon={Zap} label="Active Matches" value={String(data.stats.activeMatches)} sub="Programmatic supply offers" />
        <MetricCard icon={ClipboardList} label="Open Demand" value={String(data.stats.openDemandOrders)} sub="Active standing contracts" />
        <MetricCard icon={PackageCheck} label="Volume Secured" value={`${data.stats.totalVolumeSecuredMt}MT`} sub="Across current matches" />
        <MetricCard icon={FileText} label="Outstanding Invoices" value={String(data.stats.outstandingInvoices)} sub="Awaiting finance approval" />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-extrabold text-slate-950">Real-time transit tracking</h2>
            <p className="mt-1 text-sm text-slate-500">Current movements from aggregation zones into buyer facilities.</p>
          </div>
          <div className="divide-y divide-slate-100">
            {data.transitBatches.map((batch) => (
              <article className="p-5" key={batch.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-extrabold text-slate-950">{batch.cropSpecies}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {batch.origin} to {batch.destination}
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-700">{batch.vehicleId}</span>
                </div>
                <div className="mt-4 h-2 rounded-full bg-slate-200">
                  <div className="h-2 rounded-full bg-blue-600" style={{ width: `${batch.progressPercent}%` }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-2 text-slate-600">
                    <Route className="h-4 w-4" />
                    {batch.progressPercent}% route complete
                  </span>
                  <span className="font-bold text-slate-950">ETA {batch.eta}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-extrabold text-slate-950">Inventory alert feed</h2>
            <p className="mt-1 text-sm text-slate-500">Procurement exceptions surfaced by matching telemetry.</p>
          </div>
          <div className="divide-y divide-slate-100">
            {data.inventoryAlerts.map((alert) => (
              <AlertCard alert={alert} key={alert.id} />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-extrabold text-slate-950">Priority active matches</h2>
          <p className="mt-1 text-sm text-slate-500">Top scored supply batches requiring procurement attention.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead className="bg-slate-50">
              <tr>
                <TableHead>Batch</TableHead>
                <TableHead>Species</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.activeMatches.slice(0, 4).map((match) => (
                <tr key={match.id}>
                  <TableCell>
                    <p className="font-bold text-slate-950">{match.batchReference}</p>
                    <p className="mt-1 text-xs text-slate-500">{match.aggregatorId}</p>
                  </TableCell>
                  <TableCell>{match.cropSpecies}</TableCell>
                  <TableCell>{formatMetricTonsFromKg(match.bulkWeightKg)}</TableCell>
                  <TableCell>{match.region}</TableCell>
                  <TableCell>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-700">{match.matchScore}%</span>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize text-slate-700">{match.status.replace("_", " ")}</span>
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </BuyerDesktopShell>
  );
}

function MetricCard({ icon: Icon, label, value, sub }: { icon: LucideIcon; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{value}</p>
          <p className="mt-2 text-sm text-slate-500">{sub}</p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

function AlertCard({ alert }: { alert: InventoryAlert }) {
  const styles: Record<InventoryAlert["severity"], string> = {
    critical: "text-red-700 bg-red-50",
    warning: "text-amber-700 bg-amber-50",
    info: "text-blue-700 bg-blue-50"
  };
  const Icon = alert.severity === "info" ? ShipWheel : AlertTriangle;

  return (
    <article className="flex gap-3 p-5">
      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", styles[alert.severity])}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="font-extrabold text-slate-950">{alert.title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-500">{alert.description}</p>
        <p className="mt-2 text-xs font-bold text-slate-400">{formatBuyerDate(alert.createdAt)}</p>
      </div>
    </article>
  );
}

function TableHead({ children }: { children: React.ReactNode }) {
  return <th className="px-5 py-3 text-xs font-black uppercase tracking-wide text-slate-500">{children}</th>;
}

function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="px-5 py-4 text-sm text-slate-700">{children}</td>;
}
