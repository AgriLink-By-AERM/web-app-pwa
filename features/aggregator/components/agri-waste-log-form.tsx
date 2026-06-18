"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ChevronRight,
  Droplets,
  MapPin,
  Phone,
  Recycle,
  Scale,
  Ticket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AggregatorBottomNav } from "@/features/aggregator/components/aggregator-bottom-nav";
import {
  hasAgriWasteErrors,
  initialAgriWasteForm,
  mockCurrentGps,
  moistureConditions,
  submitAgriWasteLog,
  toAgriWastePayload,
  validateAgriWasteForm,
  wasteCategories,
  type AgriWasteFormErrors,
  type AgriWasteFormState
} from "@/lib/aggregator/log-entry";
import type { AgriWasteLogResult } from "@/lib/types";
import { cn } from "@/lib/utils";

export function AgriWasteLogForm() {
  const router = useRouter();
  const [form, setForm] = useState<AgriWasteFormState>(initialAgriWasteForm);
  const [errors, setErrors] = useState<AgriWasteFormErrors>({});
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<AgriWasteLogResult | null>(null);

  const isComplete = useMemo(() => {
    return Boolean(
      form.farmerPhoneNumber &&
        form.category &&
        form.estimatedDryWeightKg &&
        form.moisture &&
        form.gps &&
        form.photoFileName
    );
  }, [form]);

  function updateField<Key extends keyof AgriWasteFormState>(key: Key, value: AgriWasteFormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function captureGps() {
    setIsLocating(true);

    await new Promise((resolve) => {
      setTimeout(resolve, 450);
    });

    updateField("gps", mockCurrentGps());
    setIsLocating(false);
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    updateField("photoFileName", event.target.files?.[0]?.name ?? "");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateAgriWasteForm(form);
    setErrors(nextErrors);

    if (hasAgriWasteErrors(nextErrors)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = toAgriWastePayload(form);
      const submissionResult = await submitAgriWasteLog(payload);
      setResult(submissionResult);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (result) {
    return (
      <main className="min-h-screen bg-surface pb-24 text-ink lg:pl-72">
        <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-[#E5DDD4] bg-white p-6 text-center shadow-panel">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F5EFE6] text-[#7C5C2E]">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-[#7C5C2E]">Agri-waste log</p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Collection ticket ready</h1>
            <p className="mt-3 text-sm leading-6 text-[#7F6A5B]">{result.message}</p>
            <div className="mt-5 rounded-lg border border-[#E5DDD4] bg-[#FAF7F2] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[#9C8575]">Ticket reference</p>
              <p className="mt-1 text-xl font-extrabold">{result.ticket.referenceNumber}</p>
            </div>
            <Button
              className="mt-6 min-h-12 w-full bg-[#7C5C2E] text-white hover:bg-[#5C3D1E]"
              onClick={() => router.push(`/aggregator/tickets/${result.ticket.id}`)}
            >
              <Ticket className="mr-2 h-4 w-4" />
              Open QR Ticket
            </Button>
          </div>
        </section>
        <AggregatorBottomNav active="log" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface pb-24 text-ink lg:pl-72">
      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header>
          <Link className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-[#A0522D]" href="/aggregator/log-entry">
            <ArrowLeft className="h-4 w-4" />
            Log type
          </Link>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-[#7C5C2E]">Agri-Waste</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Log agri-waste</h1>
          <p className="mt-2 text-sm leading-6 text-[#7F6A5B]">
            Capture factory-relevant waste details. Stage 1 advance starts after buyer confirmation; Stage 2 payout
            triggers after QR scan at goods-in.
          </p>
        </header>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <section className="rounded-lg border border-[#E5DDD4] bg-white p-4 shadow-panel">
            <SectionLabel>Farmer and waste</SectionLabel>
            <TextInput
              error={errors.farmerPhoneNumber}
              icon={Phone}
              inputMode="tel"
              label="Farmer phone number"
              name="farmerPhoneNumber"
              onChange={(value) => updateField("farmerPhoneNumber", value)}
              placeholder="08031234567"
              value={form.farmerPhoneNumber}
            />
            <SelectField
              error={errors.category}
              icon={Recycle}
              label="Waste category"
              onChange={(value) => updateField("category", value as AgriWasteFormState["category"])}
              options={wasteCategories}
              placeholder="Select waste type"
              value={form.category}
            />
            <TextInput
              error={errors.estimatedDryWeightKg}
              icon={Scale}
              inputMode="decimal"
              label="Estimated dry weight (kg)"
              name="estimatedDryWeightKg"
              onChange={(value) => updateField("estimatedDryWeightKg", value)}
              placeholder="e.g. 200"
              value={form.estimatedDryWeightKg}
            />
            <div>
              <p className="mb-2 text-xs font-bold text-[#5C3D1E]">Moisture condition</p>
              <div className="grid grid-cols-3 gap-2">
                {moistureConditions.map((moisture) => (
                  <button
                    className={cn(
                      "min-h-11 rounded-lg border px-2 text-center text-sm font-bold transition",
                      form.moisture === moisture
                        ? "border-[#7C5C2E] bg-[#F5EFE6] text-[#5C3D1E]"
                        : "border-[#E5DDD4] bg-white text-[#5C3D1E]"
                    )}
                    key={moisture}
                    onClick={() => updateField("moisture", moisture)}
                    type="button"
                  >
                    {moisture}
                  </button>
                ))}
              </div>
              {errors.moisture ? <FieldError>{errors.moisture}</FieldError> : null}
            </div>
          </section>

          <section className="rounded-lg border border-[#E5DDD4] bg-white p-4 shadow-panel">
            <SectionLabel>Proof and location</SectionLabel>
            <ActionInput
              error={errors.gps}
              icon={MapPin}
              meta={form.gps ? `${form.gps.latitude}, ${form.gps.longitude}` : "Required before submit"}
              onClick={captureGps}
              title={isLocating ? "Locating..." : form.gps ? form.gps.address : "Get GPS Location"}
            />
            <div className="mt-4">
              <p className="mb-1.5 text-xs font-bold text-[#5C3D1E]">Proof photo</p>
              <label
                className={cn(
                  "flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 transition",
                  errors.photoFileName ? "border-red-400 ring-2 ring-red-100" : "border-[#E5DDD4] hover:border-[#A0522D]"
                )}
                htmlFor="wasteProofPhoto"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F5EFE6] text-[#7C5C2E]">
                  <Camera className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">
                    {form.photoFileName || "Capture Photo"}
                  </span>
                  <span className="mt-0.5 block text-xs text-[#7F6A5B]">Show waste pile and pickup context</span>
                </span>
                <ChevronRight className="h-4 w-4 text-[#9C8575]" />
              </label>
              <input
                accept="image/png,image/jpeg,image/webp"
                capture="environment"
                className="sr-only"
                id="wasteProofPhoto"
                onChange={handlePhotoChange}
                type="file"
              />
              {errors.photoFileName ? <FieldError>{errors.photoFileName}</FieldError> : null}
            </div>
          </section>

          <section className="rounded-lg border border-[#D8C7B3] bg-[#F5EFE6] p-4">
            <div className="flex items-start gap-3">
              <Droplets className="mt-0.5 h-5 w-5 shrink-0 text-[#7C5C2E]" />
              <p className="text-xs leading-5 text-[#5C3D1E]">
                Waste earnings split after Stage 2 payout: 70% locked Agri-Wallet and 30% cash wallet. The QR ticket
                is required for the factory goods-in scan.
              </p>
            </div>
          </section>

          <Button
            className="min-h-12 w-full bg-[#7C5C2E] text-white hover:bg-[#5C3D1E]"
            disabled={!isComplete || isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Submitting log" : "Submit Agri-Waste Log"}
          </Button>
        </form>
      </section>
      <AggregatorBottomNav active="log" />
    </main>
  );
}

type TextInputProps = {
  error?: string;
  icon: LucideIcon;
  inputMode?: "text" | "tel" | "numeric" | "decimal" | "email" | "search" | "url";
  label: string;
  name: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

function TextInput({ error, icon: Icon, inputMode = "text", label, name, onChange, placeholder, value }: TextInputProps) {
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

type SelectFieldProps = {
  error?: string;
  icon: LucideIcon;
  label: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  value: string;
};

function SelectField({ error, icon: Icon, label, onChange, options, placeholder, value }: SelectFieldProps) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-xs font-bold text-[#5C3D1E]">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9C8575]" />
        <select
          className={cn(
            "min-h-12 w-full appearance-none rounded-lg border bg-white py-3 pl-10 pr-10 text-sm font-semibold outline-none transition",
            error
              ? "border-red-400 ring-2 ring-red-100"
              : "border-[#E5DDD4] focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/15"
          )}
          onChange={(event) => onChange(event.target.value)}
          value={value}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 rotate-90 -translate-y-1/2 text-[#9C8575]" />
      </div>
      {error ? <FieldError>{error}</FieldError> : null}
    </div>
  );
}

function ActionInput({
  error,
  icon: Icon,
  meta,
  onClick,
  title
}: {
  error?: string;
  icon: LucideIcon;
  meta: string;
  onClick: () => void;
  title: string;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-bold text-[#5C3D1E]">GPS location</p>
      <button
        className={cn(
          "flex min-h-12 w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition",
          error ? "border-red-400 ring-2 ring-red-100" : "border-[#E5DDD4] hover:border-[#A0522D]"
        )}
        onClick={onClick}
        type="button"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F5EFE6] text-[#7C5C2E]">
          <Icon className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold">{title}</span>
          <span className="mt-0.5 block text-xs text-[#7F6A5B]">{meta}</span>
        </span>
        <ChevronRight className="h-4 w-4 text-[#9C8575]" />
      </button>
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
