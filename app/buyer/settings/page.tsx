import { BuyerDesktopShell } from "@/features/buyer/components/buyer-desktop-shell";
import { BuyerSettingsPanel } from "@/features/buyer/components/buyer-settings-panel";
import { getWarehouseNodes } from "@/lib/buyer/billing";

export default async function BuyerSettingsPage() {
  const warehouses = await getWarehouseNodes();

  return (
    <BuyerDesktopShell
      active="settings"
      subtitle="Corporate profile, sourcing thresholds, logistics preferences, and receiving warehouse nodes."
      title="Enterprise Settings"
    >
      <BuyerSettingsPanel warehouses={warehouses} />
    </BuyerDesktopShell>
  );
}
