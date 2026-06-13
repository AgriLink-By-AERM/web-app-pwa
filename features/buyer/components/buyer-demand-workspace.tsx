"use client";

import { FormEvent, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { CalendarDays, CheckCircle2, Plus, Target, WalletCards } from "lucide-react";
import {
  createDemandOrderFromForm,
  cropSpeciesOptions,
  formatBuyerDate,
  formatNaira,
  hasDemandOrderErrors,
  initialDemandOrderForm,
  validateDemandOrderForm,
  type DemandOrder,
  type DemandOrderFormErrors,
  type DemandOrderFormState
} from "@/lib/buyer/store";
import { cn } from "@/lib/utils";

type BuyerDemandWorkspaceProps = {
  initialOrders: DemandOrder[];
};

export function BuyerDemandWorkspace({ initialOrders }: BuyerDemandWorkspaceProps) {
  const [orders, setOrders] = useState<DemandOrder[]>(initialOrders);
  const [form, setForm] = useState<DemandOrderFormState>(initialDemandOrderForm);
  const [errors, setErrors] = useState<DemandOrderFormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>("");

  function updateField<Key extends keyof DemandOrderFormState>(key: Key, value: DemandOrderFormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSuccessMessage("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateDemandOrderForm(form);
    setErrors(nextErrors);

    if (hasDemandOrderErrors(nextErrors)) {
      return;
    }

    const newOrder = createDemandOrderFromForm(form);
    setOrders((current) => [newOrder, ...current]);
    setForm(initialDemandOrderForm);
    setSuccessMessage(`${newOrder.cropSpecies} standing order deployed.`);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-black text-slate-950">Active standing orders</h2>
          <p className="mt-1 text-sm text-slate-500">Automated contract pipelines currently feeding the matching engine.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-slate-50">
              <tr>
                <Th>Commodity</Th>
                <Th>Target</Th>
                <Th>Fulfilled</Th>
                <Th>Price ceiling</Th>
                <Th>Regions</Th>
                <Th>Duration</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id}>
                  <Td>
                    <p className="font-black text-slate-950">{order.cropSpecies}</p>
                    <p className="mt-1 text-xs text-slate-500">{order.createdBy}</p>
                  </Td>
                  <Td>{order.targetWeightMt}MT</Td>
                  <Td>
                    <div className="w-40">
                      <div className="mb-1 flex justify-between text-xs font-bold text-slate-500">
                        <span>{order.fulfilledWeightMt}MT</span>
                        <span>{Math.round((order.fulfilledWeightMt / order.targetWeightMt) * 100)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200">
                        <div className="h-2 rounded-full bg-blue-600" style={{ width: `${Math.min(100, Math.round((order.fulfilledWeightMt / order.targetWeightMt) * 100))}%` }} />
                      </div>
                    </div>
                  </Td>
                  <Td>{formatNaira(order.maxPricePerKg)} / kg</Td>
                  <Td>{order.regions.join(", ")}</Td>
                  <Td>
                    {formatBuyerDate(order.startDate)} - {formatBuyerDate(order.endDate)}
                  </Td>
                  <Td>
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-black capitalize",
                        order.status === "active" && "bg-emerald-100 text-emerald-700",
                        order.status === "paused" && "bg-amber-100 text-amber-800",
                        order.status === "fulfilled" && "bg-blue-100 text-blue-700"
                      )}
                    >
                      {order.status}
                    </span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <Target className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-black text-slate-950">Deploy standing order</h2>
            <p className="text-sm text-slate-500">Configure automated sourcing parameters.</p>
          </div>
        </div>

        {successMessage ? (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            {successMessage}
          </div>
        ) : null}

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <Field label="Crop selection" error={errors.cropSpecies}>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              onChange={(event) => updateField("cropSpecies", event.target.value as DemandOrderFormState["cropSpecies"])}
              value={form.cropSpecies}
            >
              <option value="">Select crop species</option>
              {cropSpeciesOptions.map((crop) => (
                <option key={crop} value={crop}>
                  {crop}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Total target weight (MT)" error={errors.targetWeightMt}>
            <Input
              icon={Target}
              inputMode="decimal"
              onChange={(value) => updateField("targetWeightMt", value)}
              placeholder="120"
              value={form.targetWeightMt}
            />
          </Field>

          <Field label="Fixed max price ceiling (₦/kg)" error={errors.maxPricePerKg}>
            <Input
              icon={WalletCards}
              inputMode="decimal"
              onChange={(value) => updateField("maxPricePerKg", value)}
              placeholder="36"
              value={form.maxPricePerKg}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Start date" error={errors.startDate}>
              <Input icon={CalendarDays} onChange={(value) => updateField("startDate", value)} type="date" value={form.startDate} />
            </Field>
            <Field label="End date" error={errors.endDate}>
              <Input icon={CalendarDays} onChange={(value) => updateField("endDate", value)} type="date" value={form.endDate} />
            </Field>
          </div>

          <Field label="Sourcing regions" error={errors.regions}>
            <textarea
              className="min-h-24 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              onChange={(event) => updateField("regions", event.target.value)}
              value={form.regions}
            />
          </Field>

          <button className="flex min-h-12 w-full items-center justify-center rounded-xl bg-blue-700 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-800" type="submit">
            <Plus className="mr-2 h-4 w-4" />
            Deploy Standing Order
          </button>
        </form>
      </aside>
    </div>
  );
}

function Field({ children, error, label }: { children: React.ReactNode; error?: string; label: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs font-bold text-red-600">{error}</span> : null}
    </label>
  );
}

function Input({
  icon: Icon,
  inputMode = "text",
  onChange,
  placeholder,
  type = "text",
  value
}: {
  icon: LucideIcon;
  inputMode?: "text" | "decimal" | "numeric";
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  value: string;
}) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-bold outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-5 py-3 text-xs font-black uppercase tracking-wide text-slate-500">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-5 py-4 text-sm text-slate-700">{children}</td>;
}
