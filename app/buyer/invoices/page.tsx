import { BuyerDesktopShell } from "@/features/buyer/components/buyer-desktop-shell";
import { BuyerInvoicesWorkspace } from "@/features/buyer/components/buyer-invoices-workspace";
import { getInvoices } from "@/lib/buyer/billing";

export default async function BuyerInvoicesPage() {
  const invoices = await getInvoices();

  return (
    <BuyerDesktopShell
      active="invoices"
      subtitle="Corporate escrow balances, invoice status, commodity valuations, and PDF receipts."
      title="Invoices and Escrow"
    >
      <BuyerInvoicesWorkspace invoices={invoices} />
    </BuyerDesktopShell>
  );
}
