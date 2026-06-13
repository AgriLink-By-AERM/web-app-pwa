import { StatusBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatKg, formatNaira } from "@/lib/format";
import type { BuyerType, StandingDemandOrder } from "@/lib/types";

type OrderListProps = {
  buyerType: BuyerType;
  orders: StandingDemandOrder[];
};

export function OrderList({ buyerType, orders }: OrderListProps) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-ink">Standing orders</h2>
          <p className="mt-1 text-sm text-muted">Matching rules currently feeding the demand engine.</p>
        </div>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <div className="rounded-lg border border-border p-4" key={order.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-ink">{order.itemName}</p>
                <p className="mt-1 text-sm text-muted">
                  {formatKg(order.minimumKg)}
                  {order.maximumKg ? ` - ${formatKg(order.maximumKg)}` : ""} per match
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-subtle">Price</p>
                <p className="mt-1 font-semibold text-body">{formatNaira(order.pricePerKg)} / kg</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-subtle">
                  {buyerType === "factory" ? "Moisture" : "Logistics"}
                </p>
                <p className="mt-1 font-semibold text-body">
                  {buyerType === "factory" ? order.moistureTolerance : order.logisticsMode?.replace("_", " ")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
