"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, Camera, ChevronRight, Clock, IdCard, MapPin, Phone, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  aggregatorZones,
  hasRegistrationErrors,
  initialAggregatorRegistrationForm,
  toAggregatorRegistrationPayload,
  validateAggregatorRegistration,
  type AggregatorRegistrationErrors,
  type AggregatorRegistrationFormState
} from "@/lib/aggregator/registration";
import { registerAggregator } from "@/lib/aggregator/api";
import type { AggregatorRegistrationResult } from "@/lib/types";
import { cn } from "@/lib/utils";

type TextFieldName = "fullName" | "phoneNumber" | "governmentIdNumber" | "guarantorPhoneNumber";

export function AggregatorRegistrationForm() {
  const router = useRouter();
  const [form, setForm] = useState<AggregatorRegistrationFormState>(initialAggregatorRegistrationForm);
  const [errors, setErrors] = useState<AggregatorRegistrationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<AggregatorRegistrationResult | null>(null);

  const isComplete = useMemo(() => {
    return (
      form.fullName.trim().length > 0 &&
      form.phoneNumber.trim().length > 0 &&
      form.governmentIdNumber.trim().length > 0 &&
      form.guarantorPhoneNumber.trim().length > 0 &&
      form.zone.length > 0 &&
      form.idPhotoFileName.length > 0
    );
  }, [form]);

  function updateTextField(name: TextFieldName, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  function updateZone(value: AggregatorRegistrationFormState["zone"]) {
    setForm((current) => ({ ...current, zone: value }));
    setErrors((current) => ({ ...current, zone: undefined }));
  }

  function handleIdPhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    const idPhotoFileName = file?.name ?? "";

    setForm((current) => ({ ...current, idPhotoFileName }));
    setErrors((current) => ({ ...current, idPhotoFileName: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateAggregatorRegistration(form);
    setErrors(nextErrors);

    if (hasRegistrationErrors(nextErrors)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = toAggregatorRegistrationPayload(form);
      const registrationResult = await registerAggregator(payload);
      setResult(registrationResult);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (result) {
    return (
      <main className="min-h-screen bg-[#FAF7F2] px-4 py-8 text-[#2C1A0E]">
        <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-center">
          <div className="rounded-lg border border-[#E5DDD4] bg-white p-6 shadow-panel">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Clock className="h-7 w-7" />
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-[#A0522D]">Pending verification</p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Registration submitted</h1>
            <p className="mt-3 text-sm leading-6 text-[#6F5A49]">{result.message}</p>

            <div className="mt-6 rounded-lg border border-[#E5DDD4] bg-[#FAF7F2] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold">{result.profile.fullName}</p>
                  <p className="mt-1 text-xs text-[#7F6A5B]">{result.profile.zone}</p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                  Pending
                </span>
              </div>
            </div>

            <p className="mt-5 text-xs leading-5 text-[#7F6A5B]">
              After admin approval, this device will open directly to the Aggregator Home screen for field logging.
            </p>

            <Button
              className="mt-6 min-h-12 w-full bg-[#A0522D] text-white hover:bg-[#7C3D20]"
              onClick={() => router.push("/aggregator/pending-verification")}
            >
              View verification status
            </Button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#2C1A0E]">
      <section className="mx-auto grid min-h-screen w-full max-w-6xl lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden border-r border-[#E5DDD4] bg-[#2C1A0E] px-10 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/45">AgriLink</p>
            <h1 className="mt-6 max-w-sm text-4xl font-extrabold leading-tight tracking-tight">
              Field onboarding for verified aggregators.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/65">
              Aggregators are the trust-sensitive bridge between farmers and buyers. This setup captures identity,
              guarantor, and operating-zone details before any field logs can be submitted.
            </p>
          </div>

          <div className="space-y-3">
            <TrustItem icon={Phone} title="Phone number as Account ID" />
            <TrustItem icon={IdCard} title="Government ID verification" />
            <TrustItem icon={ShieldCheck} title="Guarantor and zone assignment" />
          </div>
        </div>

        <div className="px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#A0522D]">Aggregator onboarding</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight">Create your field account</h2>
              <p className="mt-2 text-sm leading-6 text-[#7F6A5B]">
                Enter the required details once. The account remains locked until verification is approved.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="rounded-lg border border-[#E5DDD4] bg-white p-4 shadow-panel">
                <SectionLabel>Personal details</SectionLabel>
                <TextInput
                  autoComplete="name"
                  error={errors.fullName}
                  icon={User}
                  label="Full name"
                  name="fullName"
                  onChange={(value) => updateTextField("fullName", value)}
                  placeholder="e.g. Amina Yusuf"
                  value={form.fullName}
                />
                <TextInput
                  autoComplete="tel"
                  error={errors.phoneNumber}
                  icon={Phone}
                  inputMode="tel"
                  label="Phone number"
                  name="phoneNumber"
                  onChange={(value) => updateTextField("phoneNumber", value)}
                  placeholder="08031234567"
                  value={form.phoneNumber}
                />
              </div>

              <div className="rounded-lg border border-[#E5DDD4] bg-white p-4 shadow-panel">
                <SectionLabel>Verification</SectionLabel>
                <TextInput
                  autoComplete="off"
                  error={errors.governmentIdNumber}
                  icon={IdCard}
                  label="Government ID number"
                  name="governmentIdNumber"
                  onChange={(value) => updateTextField("governmentIdNumber", value)}
                  placeholder="NIN or driver's licence"
                  value={form.governmentIdNumber}
                />

                <div className="mb-4">
                  <label className="mb-1.5 block text-xs font-bold text-[#5C3D1E]" htmlFor="idPhoto">
                    ID photo upload
                  </label>
                  <label
                    className={cn(
                      "flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border bg-white px-3 py-3 transition",
                      errors.idPhotoFileName
                        ? "border-red-400 ring-2 ring-red-100"
                        : "border-[#E5DDD4] hover:border-[#A0522D]"
                    )}
                    htmlFor="idPhoto"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F5EFE6] text-[#A0522D]">
                      <Camera className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">
                        {form.idPhotoFileName || "Capture or upload front of ID card"}
                      </span>
                      <span className="mt-0.5 block text-xs text-[#7F6A5B]">JPG, PNG, or device camera image</span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-[#9C8575]" />
                  </label>
                  <input
                    accept="image/png,image/jpeg,image/webp"
                    capture="environment"
                    className="sr-only"
                    id="idPhoto"
                    name="idPhoto"
                    onChange={handleIdPhotoChange}
                    type="file"
                  />
                  {errors.idPhotoFileName ? <FieldError>{errors.idPhotoFileName}</FieldError> : null}
                </div>

                <TextInput
                  autoComplete="tel"
                  error={errors.guarantorPhoneNumber}
                  icon={ShieldCheck}
                  inputMode="tel"
                  label="Guarantor phone number"
                  name="guarantorPhoneNumber"
                  onChange={(value) => updateTextField("guarantorPhoneNumber", value)}
                  placeholder="08039876543"
                  value={form.guarantorPhoneNumber}
                />
              </div>

              <div className="rounded-lg border border-[#E5DDD4] bg-white p-4 shadow-panel">
                <SectionLabel>Operating area</SectionLabel>
                <label className="mb-1.5 block text-xs font-bold text-[#5C3D1E]" htmlFor="zone">
                  Zone / LGA assignment
                </label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9C8575]" />
                  <select
                    className={cn(
                      "min-h-12 w-full appearance-none rounded-lg border bg-white py-3 pl-10 pr-10 text-sm font-semibold outline-none transition",
                      errors.zone
                        ? "border-red-400 ring-2 ring-red-100"
                        : "border-[#E5DDD4] focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/15"
                    )}
                    id="zone"
                    name="zone"
                    onChange={(event) => updateZone(event.target.value as AggregatorRegistrationFormState["zone"])}
                    value={form.zone}
                  >
                    <option value="">Select operating zone</option>
                    {aggregatorZones.map((zone) => (
                      <option key={zone} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 rotate-90 -translate-y-1/2 text-[#9C8575]" />
                </div>
                {errors.zone ? <FieldError>{errors.zone}</FieldError> : null}
              </div>

              <Button
                className="min-h-12 w-full bg-[#A0522D] text-white hover:bg-[#7C3D20]"
                disabled={!isComplete || isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Submitting registration" : "Submit for verification"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

type TextInputProps = {
  autoComplete: string;
  error?: string;
  icon: typeof User;
  inputMode?: "text" | "tel" | "numeric" | "decimal" | "email" | "search" | "url";
  label: string;
  name: TextFieldName;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

function TextInput({
  autoComplete,
  error,
  icon: Icon,
  inputMode = "text",
  label,
  name,
  onChange,
  placeholder,
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
          autoComplete={autoComplete}
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

function TrustItem({ icon: Icon, title }: { icon: typeof Phone; title: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-emerald-300">
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-sm font-semibold text-white/80">{title}</span>
    </div>
  );
}
