import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  Check,
  Circle,
  Clock,
  CreditCard,
  Leaf,
  MapPin,
  Recycle,
  Scale,
  ShieldAlert,
  Truck,
  UserRound
} from "lucide-react";
import { StatusBadge, UrgencyBadge } from "@/components/ui/badge";
import { AggregatorBottomNav } from "@/features/aggregator/components/aggregator-bottom-nav";
import {
  buildLogMilestones,
  formatLogDate,
  getAggregatorLogById,
  type AggregatorHistoricalLog,
  type AggregatorLogMilestone
} from "@/lib/aggregator/logs";
import { formatKg } from "@/lib/format";
import { cn } from "@/lib/utils";

type AggregatorLogDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AggregatorLogDetailPage({ params }: AggregatorLogDetailPageProps) {
  const { id } = await params;
  const log = await getAggregatorLogById(id);
  const milestones = buildLogMilestones(log);
  const isFresh = log.pipelineType === "fresh_produce";

  return (
    <main className="min-h-screen bg-[#FAF7F2] pb-24 text-[#2C1A0E]">
      <section className="mx-auto w-full max-w-md px-4 py-6">
        <header>
          <Link className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-[#A0522D]" href="/aggregator/logs">
            <ArrowLeft className="h-4 w-4" />
            My Logs
          </Link>

          <div className="mt-5 rounded-lg border border-[#E5DDD4] bg-white p-5 shadow-panel">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide",
                    isFresh ? "bg-emerald-100 text-emerald-800" : "bg-[#F5EFE6] text-[#7C5C2E]"
                  )}
                >
                  {isFresh ? <Leaf className="h-3 w-3" /> : <Recycle className="h-3 w-3" />}
                  {isFresh ? "Fresh Produce" : "Agri-Waste"}
                </span>
                <h1 className="mt-3 text-2xl font-extrabold tracking-tight">{log.itemName}</h1>
                <p className="mt-1 text-sm text-[#7F6A5B]">
                  {formatKg(log.weightKg)} · Farmer {log.farmerMaskedPhone}
                </p>
              </div>
              <StatusBadge status={log.status} />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {log.urgency ? <UrgencyBadge urgency={log.urgency} /> : null}
              {log.moisture ? (
                <span className="rounded-full bg-[#F5EFE6] px-3 py-1 text-xs font-bold text-[#7C5C2E]">
                  {log.moisture}
                </span>
              ) : null}
              {log.condition ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                  {log.condition}
                </span>
              ) : null}
            </div>
          </div>
        </header>

        <section className="mt-5 rounded-lg border border-[#E5DDD4] bg-white p-5 shadow-panel">
          <h2 className="text-base font-extrabold">Status tracking</h2>
          <div className="mt-5 space-y-0">
            {milestones.map((milestone, index) => (
              <MilestoneRow
                isLast={index === milestones.length - 1}
                key={milestone.key}
                milestone={milestone}
              />
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-lg border border-[#E5DDD4] bg-white p-5 shadow-panel">
          <h2 className="text-base font-extrabold">Log details</h2>
          <div className="mt-4 grid gap-3">
            <SummaryRow icon={Clock} label="Submitted" value={formatLogDate(log.submittedAt)} />
            <SummaryRow icon={MapPin} label="GPS location" value={`${log.location.zone} · ${log.location.address}`} />
            <SummaryRow icon={Camera} label="Proof photo" value={log.proofPhotoLabel} />
            <SummaryRow icon={UserRound} label="Matched buyer" value={log.matchedBuyerName ?? "Not matched yet"} />
            <SummaryRow icon={Truck} label="Collection window" value={log.collectionWindow ?? "Pending"} />
            <SummaryRow icon={CreditCard} label="Payout status" value={formatPayoutStatus(log)} />
          </div>
        </section>

        {log.status === "Disputed" ? (
          <section className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <p className="text-xs leading-5 text-red-700">
                This log is under audit review. Stage 2 payout remains held until the discrepancy is resolved.
              </p>
            </div>
          </section>
        ) : (
          <Link
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-[#A0522D] bg-white px-4 py-2 text-sm font-bold text-[#A0522D] transition hover:bg-[#F5EFE6]"
            href={`/aggregator/dispute?logId=${log.id}`}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Raise dispute
          </Link>
        )}
      </section>
      <AggregatorBottomNav active="logs" />
    </main>
  );
}

function MilestoneRow({ milestone, isLast }: { milestone: AggregatorLogMilestone; isLast: boolean }) {
  const isComplete = milestone.status === "complete";
  const isCurrent = milestone.status === "current";
  const isBlocked = milestone.status === "blocked";

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-extrabold",
            isComplete && "border-emerald-200 bg-emerald-100 text-emerald-700",
            isCurrent && "border-[#A0522D] bg-[#F5EFE6] text-[#A0522D]",
            isBlocked && "border-red-200 bg-red-100 text-red-600",
            milestone.status === "pending" && "border-[#E5DDD4] bg-[#FAF7F2] text-[#9C8575]"
          )}
        >
          {isComplete ? <Check className="h-5 w-5" /> : isBlocked ? <AlertTriangle className="h-5 w-5" /> : <Circle className="h-4 w-4" />}
        </div>
        {!isLast ? <div className="h-16 w-px bg-[#E5DDD4]" /> : null}
      </div>
      <div className="min-w-0 flex-1 pb-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold">{milestone.title}</p>
            <p className="mt-1 text-xs leading-5 text-[#7F6A5B]">{milestone.description}</p>
          </div>
        </div>
        {milestone.timestamp ? (
          <p className="mt-2 text-xs font-semibold text-[#9C8575]">{formatLogDate(milestone.timestamp)}</p>
        ) : null}
      </div>
    </div>
  );
}

function SummaryRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-[#FAF7F2] px-3 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#A0522D]">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-bold uppercase tracking-wide text-[#9C8575]">{label}</span>
        <span className="mt-0.5 block truncate text-sm font-bold text-[#2C1A0E]">{value}</span>
      </span>
    </div>
  );
}

function formatPayoutStatus(log: AggregatorHistoricalLog): string {
  if (log.pipelineType === "fresh_produce") {
    return log.status === "Delivered" ? "Cash payout completed" : "Awaiting buyer settlement";
  }

  if (log.stage2PayoutStatus === "released") {
    return "Stage 2 payout released";
  }

  if (log.stage2PayoutStatus === "held") {
    return "Stage 2 payout held";
  }

  if (log.stage1AdvanceStatus === "released") {
    return "Stage 1 advance released · Stage 2 payout pending QR scan";
  }

  return "Awaiting factory confirmation";
}
