import { BuyerDesktopShell } from "@/features/buyer/components/buyer-desktop-shell";
import { QrDockScanner } from "@/features/buyer/components/qr-dock-scanner";
import { getDeliveryManifests } from "@/lib/buyer/billing";

export default async function BuyerScanPage() {
  const manifests = await getDeliveryManifests();

  return (
    <BuyerDesktopShell
      active="matches"
      subtitle="Warehouse receiving dock tools for NIPOST manifest validation and goods-in intake."
      title="Goods-In QR Scan"
    >
      <QrDockScanner manifests={manifests} />
    </BuyerDesktopShell>
  );
}
