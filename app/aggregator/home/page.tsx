import Link from "next/link";
import { AlertTriangle, ArrowRight, BadgeCheck, Leaf, MapPin, PackageCheck, Scale, WalletCards } from "lucide-react";
import { StatusBadge, UrgencyBadge } from "@/components/ui/badge";
import { AggregatorBottomNav } from "@/features/aggregator/components/aggregator-bottom-nav";
import { getAggregatorDashboardData } from "@/lib/aggregator/dashboard";
import { formatKg, formatNaira, maskPhone } from "@/lib/format";
import type { AggregatorLogSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

export default async function AggregatorHomePage() {
  const data = await getAggregatorDashboardData();

  return (
    <main className="min-h-screen bg-[#FAF7F2] pb-24 text-[#2C1A0E]">
      <section className="mx-auto w-full max-w-md">
        <header className="bg-[#2C1A0E] px-5 pb-6 pt-10 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/45">Aggregator Home</p>
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">{data.profile.fullName}</h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-white/60">
                <MapPin className="h-4 w-4" />
                {data.profile.zone}
              </p>
              <p className="mt-1 text-xs text-white/45">Account ID: {maskPhone(data.profile.phoneNumber)}</p>
            </div>
            <div className="rounded-lg bg-white/10 px-3 py-2 text-right">
              <p className="text-[10px] font-bold uppercase tracking-wide text-white/45">Score</p>
              <p className="mt-1 text-xl font-extrabold text-emerald-300">{data.profile.performanceScore}</p>
            </div>
          </div>

          <div className="mt-5 rounded-lg bg-white/10 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-white/50">Cash float balance</p>
                <p className="mt-1 text-3xl font-extrabold">{formatNaira(data.profile.cashFloatBalance)}</p>
              </div>
              <WalletCards className="h-8 w-8 text-amber-300" />
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-200">
              <BadgeCheck className="h-3.5 w-3.5" />
              {data.profile.premiumTier} tier
            </div>
          </div>
        </header>

        <section className="px-4 py-5">
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Logs today" value={String(data.stats.logsToday)} />
            <StatCard label="Pending matches" value={String(data.stats.pendingMatches)} />
            <StatCard label="Completed this week" value={String(data.stats.completedThisWeek)} />
            <StatCard label="Disputed logs" value={String(data.stats.disputedLogs)} warning={data.stats.disputedLogs > 0} />
          </div>

          <div className="mt-5 grid gap-3">
            <ActionCard
              description="For tomatoes, pepper, leafy greens, and other time-sensitive harvests."
              href="/aggregator/log-entry/fresh"
              icon={Leaf}
              tone="fresh"
              title="Log Fresh Produce"
            />
            <ActionCard
              description="For cassava peel, rice husks, maize stalks, and factory-bound residue."
              href="/aggregator/log-entry/waste"
              icon={PackageCheck}
              tone="waste"
              title="Log Agri-Waste"
            />
          </div>

          <section className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold">Recent logs</h2>
                <p className="text-sm text-[#7F6A5B]">Latest field entries and match status.</p>
              </div>
              <Link className="text-sm font-bold text-[#A0522D]" href="/aggregator/logs">
                See all
              </Link>
            </div>

            <div className="space-y-3">
              {data.recentLogs.map((log) => (
                <RecentLogCard key={log.id} log={log} />
              ))}
            </div>
          </section>
        </section>
      </section>

      <AggregatorBottomNav active="home" />
    </main>
  );
}

function StatCard({ label, value, warning = false }: { label: string; value: string; warning?: boolean }) {
  return (
    <div className="rounded-lg border border-[#E5DDD4] bg-white p-4 shadow-panel">
      <p className="text-xs font-bold uppercase tracking-wide text-[#9C8575]">{label}</p>
      <p className={cn("mt-2 text-2xl font-extrabold", warning ? "text-red-600" : "text-[#2C1A0E]")}>{value}</p>
    </div>
  );
}

function ActionCard({
  description,
  href,
  icon: Icon,
  title,
  tone
}: {
  description: string;
  href: string;
  icon: typeof Leaf;
  title: string;
  tone: "fresh" | "waste";
}) {
  return (
    <Link
      className={cn(
        "flex min-h-24 items-center gap-4 rounded-lg border p-4 shadow-panel transition",
        tone === "fresh"
          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
          : "border-[#E5DDD4] bg-white text-[#2C1A0E]"
      )}
      href={href}
    >
      <span
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
          tone === "fresh" ? "bg-emerald-600 text-white" : "bg-[#7C5C2E] text-white"
        )}
      >
        <Icon className="h-6 w-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-extrabold">{title}</span>
        <span className="mt-1 block text-xs leading-5 opacity-75">{description}</span>
      </span>
      <ArrowRight className="h-5 w-5 shrink-0 opacity-60" />
    </Link>
  );
}

function RecentLogCard({ log }: { log: AggregatorLogSummary }) {
  const isFresh = log.pipelineType === "fresh_produce";

  return (
    <Link
      className="block rounded-lg border border-[#E5DDD4] bg-white p-4 shadow-panel transition hover:border-[#A0522D]"
      href={`/aggregator/logs/${log.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide",
                isFresh ? "bg-emerald-100 text-emerald-800" : "bg-[#F5EFE6] text-[#7C5C2E]"
              )}
            >
              {isFresh ? <Leaf className="h-3 w-3" /> : <Scale className="h-3 w-3" />}
              {isFresh ? "Fresh" : "Waste"}
            </span>
            {log.urgency ? <UrgencyBadge urgency={log.urgency} /> : null}
          </div>
          <p className="mt-2 truncate text-sm font-extrabold">{log.itemName}</p>
          <p className="mt-1 text-xs text-[#7F6A5B]">
            {formatKg(log.weightKg)} · Farmer {log.farmerMaskedPhone}
          </p>
        </div>
        <StatusBadge status={log.status} />
      </div>
      {log.status === "No Match Found" ? (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          Fallback protocol is active and the search radius is being expanded.
        </div>
      ) : null}
    </Link>
  );
}
