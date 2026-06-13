import { ArrowRight, Building2, Timer, Truck, Utensils } from "lucide-react";
import { StatusBadge, UrgencyBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatKg, formatNaira } from "@/lib/format";
import type { BuyerMatch, BuyerType } from "@/lib/types";

type MatchSummaryTableProps = {
  buyerType: BuyerType;
  matches: BuyerMatch[];
};

export function MatchSummaryTable({ buyerType, matches }: MatchSummaryTableProps) {
  const isFactory = buyerType === "factory";
  const accent = isFactory ? "text-factoryAccent" : "text-restaurantAccent";
  const Icon = isFactory ? Building2 : Utensils;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white shadow-panel">
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-lg font-extrabold text-ink">Active matches</h2>
          <p className="mt-1 text-sm text-muted">
            {isFactory
              ? "Waste supply requiring collection coordination and Stage 2 payout tracking."
              : "Fresh produce offers prioritized by spoilage urgency and delivery mode."}
          </p>
        </div>
        <Button variant="secondary">
          View all
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-slate-50">
              <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-muted">Supply</th>
              <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-muted">Status</th>
              <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-muted">Location</th>
              <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-muted">Value</th>
              <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-muted">Window</th>
              <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-muted">Action</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr className="border-b border-border last:border-b-0" key={match.id}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                      <Icon className={`h-5 w-5 ${accent}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-ink">{match.itemName}</p>
                        {match.urgency ? <UrgencyBadge urgency={match.urgency} /> : null}
                      </div>
                      <p className="mt-1 text-sm text-muted">
                        {formatKg(match.weightKg)} by {match.aggregatorName}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={match.status} />
                </td>
                <td className="px-5 py-4">
                  <p className="font-semibold text-body">{match.location.zone}</p>
                  <p className="mt-1 text-sm text-muted">{match.distanceKm}km away</p>
                </td>
                <td className="px-5 py-4">
                  <p className="font-bold text-ink">{formatNaira(match.totalPrice)}</p>
                  <p className="mt-1 text-sm text-muted">{formatNaira(match.pricePerKg)} / kg</p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-start gap-2 text-sm text-body">
                    {isFactory ? <Truck className="mt-0.5 h-4 w-4 text-muted" /> : <Timer className="mt-0.5 h-4 w-4 text-muted" />}
                    <span>{match.collectionWindow}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <Button
                    className={
                      isFactory
                        ? "bg-factoryAccent hover:bg-factory"
                        : "bg-restaurantAccent hover:bg-restaurant"
                    }
                  >
                    Review
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
