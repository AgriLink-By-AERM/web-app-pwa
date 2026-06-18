"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  Leaf,
  MapPin,
  Phone,
  Scale
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UrgencyBadge } from "@/components/ui/badge";
import { AggregatorBottomNav } from "@/features/aggregator/components/aggregator-bottom-nav";
import {
  freshProduceCategories,
  hasFreshProduceErrors,
  initialFreshProduceForm,
  mockCurrentGps,
  produceConditions,
  submitFreshProduceLog,
  toFreshProducePayload,
  validateFreshProduceForm,
  type FreshProduceFormErrors,
  type FreshProduceFormState
} from "@/lib/aggregator/log-entry";
import type { FreshProduceLogResult, ProduceCondition } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FreshProduceLogForm() {
  const [form, setForm] = useState<FreshProduceFormState>(initialFreshProduceForm);
  const [errors, setErrors] = useState<FreshProduceFormErrors>({});
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<FreshProduceLogResult | null>(null);

  const isComplete = useMemo(() => {
    return Boolean(
      form.farmerPhoneNumber &&
        form.category &&
        form.weightKg &&
        form.condition &&
        form.estimatedHarvestTime &&
        form.gps &&
        form.photoFileName
    );
  }, [form]);

  function updateField<Key extends keyof FreshProduceFormState>(key: Key, value: FreshProduceFormState[Key]) {
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
    const fileName = event.target.files?.[0]?.name ?? "";
    updateField("photoFileName", fileName);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateFreshProduceForm(form);
    setErrors(nextErrors);

    if (hasFreshProduceErrors(nextErrors)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = toFreshProducePayload(form);
      const submissionResult = await submitFreshProduceLog(payload);
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
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-[#A0522D]">Fresh produce log</p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Submitted successfully</h1>
            <p className="mt-3 text-sm leading-6 text-[#7F6A5B]">{result.message}</p>
            <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-800">Spoilage urgency</p>
              <div className="mt-3 flex justify-center">
                <UrgencyBadge urgency={result.urgency} />
              </div>
            </div>
            <Link
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[#A0522D] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#7C3D20]"
              href="/aggregator/home"
            >
              Return to Home
            </Link>
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
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">Fresh Produce</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Log fresh produce</h1>
          <p className="mt-2 text-sm leading-6 text-[#7F6A5B]">
            Capture farmer, weight, condition, harvest time, GPS, and proof photo so restaurants can match quickly.
          </p>
        </header>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <section className="rounded-lg border border-[#E5DDD4] bg-white p-4 shadow-panel">
            <SectionLabel>Farmer and produce</SectionLabel>
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
              icon={Leaf}
              label="Produce category"
              onChange={(value) => updateField("category", value as FreshProduceFormState["category"])}
              options={freshProduceCategories}
              placeholder="Select produce"
              value={form.category}
            />

            <TextInput
              error={errors.weightKg}
              icon={Scale}
              inputMode="decimal"
              label="Weight (kg)"
              name="weightKg"
              onChange={(value) => updateField("weightKg", value)}
              placeholder="e.g. 140"
              value={form.weightKg}
            />

            <div>
              <p className="mb-2 text-xs font-bold text-[#5C3D1E]">Condition</p>
              <div className="grid gap-2">
                {produceConditions.map((condition) => (
                  <button
                    className={cn(
                      "min-h-11 rounded-lg border px-3 text-left text-sm font-bold transition",
                      form.condition === condition
                        ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                        : "border-[#E5DDD4] bg-white text-[#5C3D1E]"
                    )}
                    key={condition}
                    onClick={() => updateField("condition", condition)}
                    type="button"
                  >
                    {condition}
                  </button>
                ))}
              </div>
              {errors.condition ? <FieldError>{errors.condition}</FieldError> : null}
            </div>
          </section>

          <section className="rounded-lg border border-[#E5DDD4] bg-white p-4 shadow-panel">
            <SectionLabel>Proof and location</SectionLabel>
            <TextInput
              error={errors.estimatedHarvestTime}
              icon={Clock}
              label="Estimated harvest time"
              name="estimatedHarvestTime"
              onChange={(value) => updateField("estimatedHarvestTime", value)}
              type="datetime-local"
              value={form.estimatedHarvestTime}
            />

            <div className="mb-4">
              <p className="mb-1.5 text-xs font-bold text-[#5C3D1E]">GPS location</p>
              <button
                className={cn(
                  "flex min-h-12 w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition",
                  errors.gps ? "border-red-400 ring-2 ring-red-100" : "border-[#E5DDD4] hover:border-[#A0522D]"
                )}
                disabled={isLocating}
                onClick={captureGps}
                type="button"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F5EFE6] text-[#A0522D]">
                  <MapPin className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold">
                    {isLocating ? "Locating..." : form.gps ? form.gps.address : "Get GPS Location"}
                  </span>
                  <span className="mt-0.5 block text-xs text-[#7F6A5B]">
                    {form.gps ? `${form.gps.latitude}, ${form.gps.longitude}` : "Required before submit"}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 text-[#9C8575]" />
              </button>
              {errors.gps ? <FieldError>{errors.gps}</FieldError> : null}
            </div>

            <div>
              <p className="mb-1.5 text-xs font-bold text-[#5C3D1E]">Proof photo</p>
              <label
                className={cn(
                  "flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 transition",
                  errors.photoFileName ? "border-red-400 ring-2 ring-red-100" : "border-[#E5DDD4] hover:border-[#A0522D]"
                )}
                htmlFor="proofPhoto"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F5EFE6] text-[#A0522D]">
                  <Camera className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">
                    {form.photoFileName || "Capture Photo"}
                  </span>
                  <span className="mt-0.5 block text-xs text-[#7F6A5B]">Show produce and farmer handoff context</span>
                </span>
                <ChevronRight className="h-4 w-4 text-[#9C8575]" />
              </label>
              <input
                accept="image/png,image/jpeg,image/webp"
                capture="environment"
                className="sr-only"
                id="proofPhoto"
                onChange={handlePhotoChange}
                type="file"
              />
              {errors.photoFileName ? <FieldError>{errors.photoFileName}</FieldError> : null}
            </div>
          </section>

          <Button
            className="min-h-12 w-full bg-emerald-700 text-white hover:bg-emerald-800"
            disabled={!isComplete || isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Submitting log" : "Submit Fresh Produce Log"}
          </Button>
        </form>
      </section>
      <AggregatorBottomNav active="log" />
    </main>
  );
}

type TextInputProps = {
  error?: string;
  icon: typeof Phone;
  inputMode?: "text" | "tel" | "numeric" | "decimal" | "email" | "search" | "url";
  label: string;
  name: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  value: string;
};

function TextInput({
  error,
  icon: Icon,
  inputMode = "text",
  label,
  name,
  onChange,
  placeholder,
  type = "text",
  value
}: TextInputProps) {
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
          type={type}
          value={value}
        />
      </div>
      {error ? <FieldError>{error}</FieldError> : null}
    </div>
  );
}

type SelectFieldProps = {
  error?: string;
  icon: typeof Leaf;
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.16em] text-[#9C8575]">{children}</p>;
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-xs font-semibold text-red-600">{children}</p>;
}
