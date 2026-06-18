"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, ArrowLeft, CheckCircle2, ChevronRight, FileWarning, Phone, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AggregatorBottomNav } from "@/features/aggregator/components/aggregator-bottom-nav";
import {
  disputeReasons,
  formatLogDate,
  hasDisputeErrors,
  initialDisputeFormState,
  submitAggregatorDispute,
  validateDisputeForm,
  type AggregatorHistoricalLog,
  type DisputeFormErrors,
  type DisputeFormState,
  type DisputeReason,
  type DisputeSubmissionResult
} from "@/lib/aggregator/logs";
import { formatKg } from "@/lib/format";
import { cn } from "@/lib/utils";

type AggregatorDisputeFormProps = {
  logs: AggregatorHistoricalLog[];
};

export function AggregatorDisputeForm({ logs }: AggregatorDisputeFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialLogId = searchParams.get("logId") ?? "";
  const [form, setForm] = useState<DisputeFormState>({
    ...initialDisputeFormState,
    logId: logs.some((log) => log.id === initialLogId) ? initialLogId : "",
    contactPhone: "08031234567"
  });
  const [errors, setErrors] = useState<DisputeFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<DisputeSubmissionResult | null>(null);

  const selectedLog = useMemo(() => logs.find((log) => log.id === form.logId) ?? null, [form.logId, logs]);

  function updateField<Key extends keyof DisputeFormState>(key: Key, value: DisputeFormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateDisputeForm(form);
    setErrors(nextErrors);

    if (hasDisputeErrors(nextErrors)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionResult = await submitAggregatorDispute(form);
      setResult(submissionResult);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (result) {
    return (
      <main className="min-h-screen bg-surface pb-24 text-ink lg:pl-72">
        <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-emerald-200 bg-white p-6 text-center shadow-panel">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">Dispute submitted</p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight">{result.disputeId}</h1>
            <p className="mt-3 text-sm leading-6 text-[#7F6A5B]">{result.message}</p>
            <Button
              className="mt-6 min-h-12 w-full bg-[#A0522D] text-white hover:bg-[#7C3D20]"
              onClick={() => router.push(form.logId ? `/aggregator/logs/${form.logId}` : "/aggregator/logs")}
            >
              Return to Log
            </Button>
          </div>
        </section>
        <AggregatorBottomNav active="logs" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface pb-24 text-ink lg:pl-72">
      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header>
          <Link className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-[#A0522D]" href="/aggregator/logs">
            <ArrowLeft className="h-4 w-4" />
            My Logs
          </Link>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-red-700">Escalation</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Raise a dispute</h1>
          <p className="mt-2 text-sm leading-6 text-[#7F6A5B]">
            Lodge a complaint for weight mismatches, rejected logs, payout delays, or proof-data issues.
          </p>
        </header>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <section className="rounded-lg border border-[#E5DDD4] bg-white p-4 shadow-panel">
            <SectionLabel>Affected batch</SectionLabel>
            <label className="mb-1.5 block text-xs font-bold text-[#5C3D1E]" htmlFor="logId">
              Select log
            </label>
            <div className="relative">
              <FileWarning className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9C8575]" />
              <select
                className={cn(
                  "min-h-12 w-full appearance-none rounded-lg border bg-white py-3 pl-10 pr-10 text-sm font-semibold outline-none transition",
                  errors.logId
                    ? "border-red-400 ring-2 ring-red-100"
                    : "border-[#E5DDD4] focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/15"
                )}
                id="logId"
                onChange={(event) => updateField("logId", event.target.value)}
                value={form.logId}
              >
                <option value="">Choose a field log</option>
                {logs.map((log) => (
                  <option key={log.id} value={log.id}>
                    {log.itemName} · {formatKg(log.weightKg)} · {formatLogDate(log.submittedAt)}
                  </option>
                ))}
              </select>
              <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 rotate-90 -translate-y-1/2 text-[#9C8575]" />
            </div>
            {errors.logId ? <FieldError>{errors.logId}</FieldError> : null}

            {selectedLog ? (
              <div className="mt-4 rounded-lg bg-[#FAF7F2] p-3">
                <p className="text-sm font-extrabold">{selectedLog.itemName}</p>
                <p className="mt-1 text-xs leading-5 text-[#7F6A5B]">
                  {selectedLog.status} · Farmer {selectedLog.farmerMaskedPhone} · {selectedLog.location.zone}
                </p>
              </div>
            ) : null}
          </section>

          <section className="rounded-lg border border-[#E5DDD4] bg-white p-4 shadow-panel">
            <SectionLabel>Dispute reason</SectionLabel>
            <div className="grid gap-2">
              {disputeReasons.map((reason) => (
                <button
                  className={cn(
                    "min-h-11 rounded-lg border px-3 text-left text-sm font-bold transition",
                    form.reason === reason.id
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-[#E5DDD4] bg-white text-[#5C3D1E]"
                  )}
                  key={reason.id}
                  onClick={() => updateField("reason", reason.id)}
                  type="button"
                >
                  {reason.label}
                </button>
              ))}
            </div>
            {errors.reason ? <FieldError>{errors.reason}</FieldError> : null}
          </section>

          <section className="rounded-lg border border-[#E5DDD4] bg-white p-4 shadow-panel">
            <SectionLabel>Evidence</SectionLabel>
            <TextInput
              error={errors.reportedWeightKg}
              icon={Scale}
              inputMode="decimal"
              label="Actual received weight (kg)"
              name="reportedWeightKg"
              onChange={(value) => updateField("reportedWeightKg", value)}
              placeholder="Required for weight mismatch"
              value={form.reportedWeightKg}
            />
            <label className="mb-1.5 block text-xs font-bold text-[#5C3D1E]" htmlFor="notes">
              Notes
            </label>
            <textarea
              className={cn(
                "min-h-32 w-full resize-none rounded-lg border bg-white px-3 py-3 text-sm font-semibold outline-none transition placeholder:font-normal placeholder:text-[#9C8575]",
                errors.notes
                  ? "border-red-400 ring-2 ring-red-100"
                  : "border-[#E5DDD4] focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/15"
              )}
              id="notes"
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Explain what happened, who was present, and what needs review."
              value={form.notes}
            />
            {errors.notes ? <FieldError>{errors.notes}</FieldError> : null}
          </section>

          <section className="rounded-lg border border-[#E5DDD4] bg-white p-4 shadow-panel">
            <SectionLabel>Follow-up contact</SectionLabel>
            <TextInput
              error={errors.contactPhone}
              icon={Phone}
              inputMode="tel"
              label="Phone number"
              name="contactPhone"
              onChange={(value) => updateField("contactPhone", value)}
              placeholder="08031234567"
              value={form.contactPhone}
            />
          </section>

          <section className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <p className="text-xs leading-5 text-red-700">
                Disputes trigger audit log review, phone arbitration, and senior agent escalation if unresolved.
                False claims can affect aggregator performance score.
              </p>
            </div>
          </section>

          <Button
            className="min-h-12 w-full bg-red-600 text-white hover:bg-red-700"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Submitting dispute" : "Submit dispute"}
          </Button>
        </form>
      </section>
      <AggregatorBottomNav active="logs" />
    </main>
  );
}

function TextInput({
  error,
  icon: Icon,
  inputMode,
  label,
  name,
  onChange,
  placeholder,
  value
}: {
  error?: string;
  icon: LucideIcon;
  inputMode: "text" | "tel" | "numeric" | "decimal" | "email" | "search" | "url";
  label: string;
  name: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="mb-1.5 block text-xs font-bold text-[#5C3D1E]" htmlFor={name}>
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9C8575]" />
        <input
          className={cn(
            "min-h-12 w-full rounded-lg border bg-white py-3 pl-10 pr-3 text-sm font-semibold outline-none transition placeholder:font-normal placeholder:text-[#9C8575]",
            error
              ? "border-red-400 ring-2 ring-red-100"
              : "border-[#E5DDD4] focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/15"
          )}
          id={name}
          inputMode={inputMode}
          name={name}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          type="text"
          value={value}
        />
      </div>
      {error ? <FieldError>{error}</FieldError> : null}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.16em] text-[#9C8575]">{children}</p>;
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-xs font-semibold text-red-600">{children}</p>;
}
