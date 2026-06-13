"use client";

import { useState } from "react";
import { Building2, MapPin, SlidersHorizontal, Warehouse } from "lucide-react";
import { warehouseStatusStyles, type WarehouseNode } from "@/lib/buyer/billing";
import { cn } from "@/lib/utils";

type SettingsTab = "profile" | "sourcing" | "warehouses";

type BuyerSettingsPanelProps = {
  warehouses: WarehouseNode[];
};

const tabs: Array<{ id: SettingsTab; label: string }> = [
  { id: "profile", label: "Corporate Profile" },
  { id: "sourcing", label: "Sourcing Parameters" },
  { id: "warehouses", label: "Warehouse Management" }
];

export function BuyerSettingsPanel({ warehouses }: BuyerSettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap gap-2 border-b border-slate-200 px-5 py-4">
        {tabs.map((tab) => (
          <button
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-black transition",
              activeTab === tab.id ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {activeTab === "profile" ? <CorporateProfile /> : null}
        {activeTab === "sourcing" ? <SourcingParameters /> : null}
        {activeTab === "warehouses" ? <WarehouseManagement warehouses={warehouses} /> : null}
      </div>
    </section>
  );
}

function CorporateProfile() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <SettingsCard icon={Building2} label="Company name" value="Dangote Feeds Ltd" />
      <SettingsCard icon={Building2} label="Registration ID" value="RC-1998-DFL-20491" />
      <SettingsCard icon={MapPin} label="Corporate HQ" value="Kano Industrial Estate, Nassarawa LGA" />
      <SettingsCard icon={Building2} label="Primary buyer type" value="Industrial agro-processor" />
    </div>
  );
}

function SourcingParameters() {
  const parameters = [
    { label: "Cassava peel moisture threshold", value: "Dry or Damp only" },
    { label: "Rice husks grade", value: "Low-moisture biomass feedstock" },
    { label: "Fresh produce urgency policy", value: "Amber and Red tiers prioritized" },
    { label: "Default logistics preference", value: "Platform freight with escrow confirmation" }
  ];

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {parameters.map((parameter) => (
        <SettingsCard icon={SlidersHorizontal} key={parameter.label} label={parameter.label} value={parameter.value} />
      ))}
    </div>
  );
}

function WarehouseManagement({ warehouses }: { warehouses: WarehouseNode[] }) {
  return (
    <div className="grid gap-4">
      {warehouses.map((warehouse) => (
        <article className="rounded-2xl border border-slate-200 p-5" key={warehouse.id}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Warehouse className="h-5 w-5" />
              </span>
              <div>
                <p className="font-black text-slate-950">{warehouse.name}</p>
                <p className="mt-1 text-sm text-slate-500">{warehouse.lgaTerminal}</p>
              </div>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-black capitalize ${warehouseStatusStyles[warehouse.status]}`}>
              {warehouse.status}
            </span>
          </div>
          <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">Coordinates</p>
              <p className="mt-1 font-bold text-slate-800">
                {warehouse.coordinates.latitude}, {warehouse.coordinates.longitude}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">Capacity</p>
              <p className="mt-1 font-bold text-slate-800">{warehouse.receivingCapacityMt}MT</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">Terminal class</p>
              <p className="mt-1 font-bold text-slate-800">Regional goods-in</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function SettingsCard({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <Icon className="h-5 w-5 text-blue-700" />
      <p className="mt-3 text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-base font-black text-slate-950">{value}</p>
    </div>
  );
}
