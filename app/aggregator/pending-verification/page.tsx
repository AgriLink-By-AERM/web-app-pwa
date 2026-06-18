import { CheckCircle2, Clock3, FileText, MapPin, Phone, ShieldCheck } from "lucide-react";
import { getAggregatorVerificationSummary } from "@/lib/aggregator/status";
import { maskPhone } from "@/lib/format";
import { cn } from "@/lib/utils";

export default async function AggregatorPendingVerificationPage() {
  const summary = await getAggregatorVerificationSummary();

  return (
    <main className="min-h-screen bg-surface px-4 py-6 text-ink sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col">
        <header className="pt-2">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#A0522D]">AgriLink</p>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight">Verification in progress</h1>
          <p className="mt-2 text-sm leading-6 text-[#7F6A5B]">
            Your aggregator account is being reviewed. Field logging stays locked until approval is complete.
          </p>
        </header>

        <section className="mt-6 rounded-lg border border-[#E5DDD4] bg-white p-5 shadow-panel">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <Clock3 className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-extrabold">{summary.fullName}</h2>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                  Pending
                </span>
              </div>
              <p className="mt-1 text-sm text-[#7F6A5B]">Reference: {summary.referenceNumber}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <SummaryRow icon={Phone} label="Phone account ID" value={maskPhone(summary.phoneNumber)} />
            <SummaryRow icon={MapPin} label="Assigned zone" value={summary.zone} />
            <SummaryRow icon={FileText} label="Submitted" value={formatSubmittedDate(summary.submittedAt)} />
            <SummaryRow icon={ShieldCheck} label="Expected review" value={summary.expectedReviewWindow} />
          </div>
        </section>

        <section className="mt-5 rounded-lg border border-[#E5DDD4] bg-white p-5 shadow-panel">
          <h2 className="text-base font-extrabold">Review checklist</h2>
          <div className="mt-4 space-y-4">
            {summary.reviewSteps.map((step, index) => (
              <div className="flex gap-3" key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-extrabold",
                      step.status === "complete" && "border-emerald-200 bg-emerald-100 text-emerald-700",
                      step.status === "in_progress" && "border-amber-200 bg-amber-100 text-amber-700",
                      step.status === "pending" && "border-[#E5DDD4] bg-[#FAF7F2] text-[#9C8575]"
                    )}
                  >
                    {step.status === "complete" ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                  </div>
                  {index < summary.reviewSteps.length - 1 ? <div className="mt-2 h-full w-px bg-[#E5DDD4]" /> : null}
                </div>
                <div className="pb-1">
                  <p className="text-sm font-bold">{step.title}</p>
                  <p className="mt-1 text-xs leading-5 text-[#7F6A5B]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-lg border border-[#E5DDD4] bg-[#2C1A0E] p-5 text-white">
          <p className="text-sm font-bold">What happens next?</p>
          <p className="mt-2 text-xs leading-5 text-white/65">
            Once approved, this device will open the Aggregator Home screen with access to Log Fresh Produce,
            Log Agri-Waste, My Logs, and Profile. If verification fails, the reason will appear here with the next
            action required.
          </p>
        </section>
      </section>
    </main>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Phone;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-[#FAF7F2] px-3 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#A0522D]">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-bold uppercase tracking-wide text-[#9C8575]">{label}</span>
        <span className="mt-0.5 block truncate text-sm font-bold text-[#2C1A0E]">{value}</span>
      </span>
    </div>
  );
}

function formatSubmittedDate(value: string): string {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Lagos"
  }).format(new Date(value));
}
