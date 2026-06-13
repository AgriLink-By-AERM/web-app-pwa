import { BuyerDesktopShell } from "@/features/buyer/components/buyer-desktop-shell";
import { BuyerDemandWorkspace } from "@/features/buyer/components/buyer-demand-workspace";
import { getDemandOrders } from "@/lib/buyer/store";

export default async function BuyerDemandPage() {
  const orders = await getDemandOrders();

  return (
    <BuyerDesktopShell
      active="demand"
      subtitle="Configure automated contract pipelines for crop, waste, and feedstock procurement."
      title="Standing Demand Orders"
    >
      <BuyerDemandWorkspace initialOrders={orders} />
    </BuyerDesktopShell>
  );
}
