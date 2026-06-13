import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Download, FileSpreadsheet, FileText, ShieldCheck } from "lucide-react";
import { DealerBottomNav } from "@/features/dealer/components/dealer-bottom-nav";
import { formatNaira } from "@/lib/dealer/store";
import { formatReportDate, getReportSummaries, type RegistrySubmissionStatus } from "@/lib/dealer/reports";
import { cn } from "@/lib/utils";

export default async function DealerReportsPage() {
  const reports = await getReportSummaries();
  const currentReport = reports[0];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <section className="mx-auto min-h-screen max-w-md border-x border-slate-200 bg-slate-50 px-4 py-6 pb-24 shadow-sm">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-700">Reporting terminal</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Compliance Reports</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Submit monthly input distribution data to regional agricultural registries and export audit files.
          </p>
        </header>

        <Link
          className="mt-5 flex min-h-20 items-center justify-between rounded-xl bg-indigo-700 px-5 py-4 text-white shadow-sm transition hover:bg-indigo-800"
          href="/dealer/reports/monthly"
        >
          <span>
            <span className="block text-xs font-bold uppercase tracking-wide text-white/55">Current month</span>
            <span className="mt-1 block text-lg font-extrabold">{currentReport.monthLabel} Deep Dive</span>
          </span>
          <ArrowRight className="h-6 w-6" />
        </Link>

        <section className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-extrabold">Registry status</h2>
              <p className="mt-1 text-xs text-slate-500">Regional agricultural submission ledger</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {reports.map((report) => (
              <article className="rounded-lg border border-slate-200 p-4" key={report.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-extrabold">{report.monthLabel}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatReportDate(report.periodStart)} - {formatReportDate(report.periodEnd)}
                    </p>
                  </div>
                  <StatusPill status={report.registryStatus} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="font-bold uppercase tracking-wide text-slate-400">Farmers</p>
                    <p className="mt-1 font-extrabold text-slate-900">{report.totalFarmersServed}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="font-bold uppercase tracking-wide text-slate-400">Wallet value</p>
                    <p className="mt-1 font-extrabold text-slate-900">{formatNaira(report.totalWalletValue)}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <ExportLink href={report.pdfHref} icon={FileText} label="PDF" />
                  <ExportLink href={report.csvHref} icon={FileSpreadsheet} label="CSV" />
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
      <DealerBottomNav active="history" />
    </main>
  );
}

function StatusPill({ status }: { status: RegistrySubmissionStatus }) {
  const styles: Record<RegistrySubmissionStatus, string> = {
    submitted: "bg-blue-100 text-blue-700",
    pending_review: "bg-amber-100 text-amber-800",
    accepted: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700"
  };
  const labels: Record<RegistrySubmissionStatus, string> = {
    submitted: "Submitted",
    pending_review: "Pending",
    accepted: "Accepted",
    rejected: "Rejected"
  };

  return <span className={cn("rounded-full px-3 py-1 text-xs font-extrabold", styles[status])}>{labels[status]}</span>;
}

function ExportLink({ href, icon: Icon, label }: { href: string; icon: LucideIcon; label: string }) {
  return (
    <Link
      className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-extrabold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
      href={href}
    >
      <Icon className="mr-2 h-4 w-4" />
      <Download className="mr-1 h-3.5 w-3.5" />
      {label}
    </Link>
  );
}
