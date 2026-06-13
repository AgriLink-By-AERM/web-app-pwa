"use client";

import type { LucideIcon } from "lucide-react";
import { X, BadgeCheck, Banknote, Clock, MapPin, ShieldCheck, Truck, UserRound } from "lucide-react";
import { formatMetricTonsFromKg, formatNaira, type AgroMatchBatch } from "@/lib/buyer/store";

type MatchConfirmationModalProps = {
  match: AgroMatchBatch | null;
  onClose: () => void;
  onAccept: (match: AgroMatchBatch) => void;
  onReject: (match: AgroMatchBatch) => void;
};

export function MatchConfirmationModal({ match, onAccept, onClose, onReject }: MatchConfirmationModalProps) {
  if (!match) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-6 py-8 backdrop-blur-sm">
      <section className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-6 border-b border-slate-200 px-7 py-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">Contract breakdown</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{match.batchReference}</h2>
            <p className="mt-2 text-sm text-slate-500">
              {match.cropSpecies} · {match.variety} · {formatMetricTonsFromKg(match.bulkWeightKg)}
            </p>
          </div>
          <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50" onClick={onClose} type="button">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="grid gap-0 overflow-y-auto lg:grid-cols-[1fr_360px]">
          <div className="p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <BreakdownCard icon={Banknote} label="Total sourced cost" value={formatNaira(match.totalSourcedCost)} />
              <BreakdownCard icon={UserRound} label="Aggregator ID" value={`${match.aggregatorId} · ${match.aggregatorName}`} />
              <BreakdownCard icon={Clock} label="Delivery window" value={match.estimatedDeliveryWindow} />
              <BreakdownCard icon={Truck} label="Logistics mode" value={match.logisticsMode.replaceAll("_", " ")} />
            </div>

            <section className="mt-6 rounded-2xl border border-slate-200">
              <div className="border-b border-slate-200 px-5 py-4">
                <h3 className="text-lg font-black text-slate-950">Cost stack</h3>
              </div>
              <div className="divide-y divide-slate-100">
                <CostRow label="Commodity value" value={formatNaira(match.bulkWeightKg * match.pricePerKg)} />
                <CostRow label="Platform fees" value={formatNaira(match.platformFee)} />
                <CostRow label="Estimated logistics" value={formatNaira(match.logisticsFee)} />
                <CostRow label="Escrow commitment" value={formatNaira(match.totalSourcedCost)} strong />
              </div>
            </section>
          </div>

          <aside className="border-t border-slate-200 bg-slate-50 p-7 lg:border-l lg:border-t-0">
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <ShieldCheck className="h-7 w-7 text-blue-700" />
              <p className="mt-3 text-sm font-black text-slate-950">Escrow protection</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Funds are committed to escrow on acceptance. Agri-waste Stage 2 payout releases only after goods-in QR
                confirmation and receipt validation.
              </p>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <InfoLine icon={BadgeCheck} label="Match score" value={`${match.matchScore}%`} />
              <InfoLine icon={MapPin} label="Source" value={`${match.region}, ${match.sourceLocation}`} />
              <InfoLine icon={Clock} label="Pickup" value={match.estimatedPickupWindow} />
            </div>

            <div className="mt-6 grid gap-3">
              <button
                className="min-h-12 rounded-xl bg-blue-700 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-800"
                onClick={() => onAccept(match)}
                type="button"
              >
                Accept and Commit Funds to Escrow
              </button>
              <button
                className="min-h-12 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-100"
                onClick={() => onReject(match)}
                type="button"
              >
                Reject Match
              </button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function BreakdownCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <Icon className="h-5 w-5 text-blue-700" />
      <p className="mt-3 text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-black text-slate-950">{value}</p>
    </div>
  );
}

function CostRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <span className={strong ? "font-black text-slate-950" : "font-semibold text-slate-600"}>{label}</span>
      <span className={strong ? "font-black text-blue-700" : "font-bold text-slate-950"}>{value}</span>
    </div>
  );
}

function InfoLine({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-white p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
      <div>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-1 font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
