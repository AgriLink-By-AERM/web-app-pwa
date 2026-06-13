import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Bell,
  Building2,
  ChevronRight,
  Languages,
  LogOut,
  MapPinned,
  Paintbrush,
  Phone,
  ShieldCheck,
  Warehouse
} from "lucide-react";
import { DealerBottomNav } from "@/features/dealer/components/dealer-bottom-nav";
import { getDealerProfile } from "@/lib/dealer/store";

type WarehouseNode = {
  id: string;
  name: string;
  distanceKm: number;
  status: "connected" | "syncing";
};

const warehouseNodes: WarehouseNode[] = [
  {
    id: "wh_kano_central",
    name: "Kano Central Input Depot",
    distanceKm: 8,
    status: "connected"
  },
  {
    id: "wh_tarauni_micro",
    name: "Tarauni Micro Warehouse",
    distanceKm: 3,
    status: "connected"
  },
  {
    id: "wh_kura_relief",
    name: "Kura Relief Stock Node",
    distanceKm: 22,
    status: "syncing"
  }
];

export default async function DealerProfilePage() {
  const profile = await getDealerProfile();

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <section className="mx-auto min-h-screen max-w-md border-x border-slate-200 bg-slate-50 pb-24 shadow-sm">
        <header className="bg-indigo-900 px-5 pb-7 pt-10 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/45">Dealer profile</p>
          <div className="mt-5 flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-xl font-extrabold">
              BA
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-extrabold tracking-tight">{profile.shopName}</h1>
              <p className="mt-1 text-sm text-white/65">{profile.ownerName}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-100">
                <BadgeCheck className="h-4 w-4" />
                Verified merchant
              </span>
            </div>
          </div>
        </header>

        <section className="px-4 py-5">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-extrabold">Business credentials</h2>
            <div className="mt-4 divide-y divide-slate-100">
              <InfoRow icon={ShieldCheck} label="Business license" value="KNS-MER-2026-04821" />
              <InfoRow icon={Building2} label="Dealer code" value={profile.dealerCode} />
              <InfoRow icon={Phone} label="Contact phone" value={profile.phoneNumber} />
            </div>
          </section>

          <section className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-extrabold">Store location</h2>
            <div className="mt-4 rounded-lg bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                  <MapPinned className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-extrabold">{profile.location}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Coordinates: 12.0022, 8.5920 · Nassarawa LGA agro-input corridor
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-extrabold">Connected warehouse nodes</h2>
            <div className="mt-4 space-y-3">
              {warehouseNodes.map((node) => (
                <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-3" key={node.id}>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-700">
                    <Warehouse className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">{node.name}</span>
                    <span className="mt-0.5 block text-xs text-slate-500">{node.distanceKm}km away</span>
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${node.status === "connected" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"}`}>
                    {node.status === "connected" ? "Connected" : "Syncing"}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-extrabold">App customization</h2>
            <div className="mt-4 divide-y divide-slate-100">
              <ActionRow icon={Bell} label="Voucher alerts" value="Sound and vibration on" />
              <ActionRow icon={Languages} label="Language" value="English" />
              <ActionRow icon={Paintbrush} label="Display mode" value="High contrast" />
            </div>
          </section>

          <Link
            className="mt-5 flex min-h-12 items-center justify-center rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-600 shadow-sm transition hover:bg-red-50"
            href="/dealer/home"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Link>
        </section>
      </section>
      <DealerBottomNav active="profile" />
    </main>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex min-h-14 items-center gap-3 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
        <span className="mt-0.5 block truncate text-sm font-bold text-slate-950">{value}</span>
      </span>
    </div>
  );
}

function ActionRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <button className="flex min-h-14 w-full items-center gap-3 py-3 text-left" type="button">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
        <span className="mt-0.5 block truncate text-sm font-bold text-slate-950">{value}</span>
      </span>
      <ChevronRight className="h-4 w-4 text-slate-400" />
    </button>
  );
}
