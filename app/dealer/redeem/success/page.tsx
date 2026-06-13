import Link from "next/link";
import { CheckCircle2, ClipboardList, CreditCard, FileKey2, Home, PackageCheck, UserRound } from "lucide-react";
import { DealerBottomNav } from "@/features/dealer/components/dealer-bottom-nav";
import { formatDealerDate, formatNaira, getReceiptFromReference } from "@/lib/dealer/store";

type DealerRedeemSuccessPageProps = {
  searchParams: Promise<{
    reference?: string;
    farmerName?: string;
    farmerId?: string;
    item?: string;
    quantity?: string;
    unit?: string;
    wallet?: string;
    copay?: string;
  }>;
};

export default async function DealerRedeemSuccessPage({ searchParams }: DealerRedeemSuccessPageProps) {
  const params = await searchParams;
  const baseReceipt = await getReceiptFromReference(params.reference ?? "AGR-LDG-84291055");
  const receipt = {
    ...baseReceipt,
    farmerName: params.farmerName ?? baseReceipt.farmerName,
    farmerId: params.farmerId ?? baseReceipt.farmerId,
    itemName: params.item ?? baseReceipt.itemName,
    quantity: Number(params.quantity ?? baseReceipt.quantity),
    unit: params.unit ?? baseReceipt.unit,
    walletContribution: Number(params.wallet ?? baseReceipt.walletContribution),
    farmerCopayDue: Number(params.copay ?? baseReceipt.farmerCopayDue)
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <section className="mx-auto min-h-screen max-w-md border-x border-slate-200 bg-slate-50 px-4 py-6 pb-24 shadow-sm">
        <section className="rounded-xl border border-emerald-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">Disbursement complete</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Digital receipt issued</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            The farmer's Agri-Wallet has been debited and this dealer account has been credited.
          </p>
        </section>

        <section className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <ReceiptRow icon={FileKey2} label="Ledger reference" value={receipt.ledgerReference} />
          <ReceiptRow icon={ClipboardList} label="Timestamp" value={formatDealerDate(receipt.timestamp)} />
          <ReceiptRow icon={UserRound} label="Farmer" value={`${receipt.farmerName} · ${receipt.farmerId}`} />
          <ReceiptRow icon={PackageCheck} label="Itemized distribution" value={`${receipt.quantity} ${receipt.unit} · ${receipt.itemName}`} />
          <ReceiptRow icon={CreditCard} label="Wallet contribution" value={formatNaira(receipt.walletContribution)} />
          <ReceiptRow icon={CreditCard} label="Farmer co-pay" value={formatNaira(receipt.farmerCopayDue)} />
        </section>

        <Link
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-indigo-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-800"
          href="/dealer/home"
        >
          <Home className="mr-2 h-4 w-4" />
          Return to Dealer Home
        </Link>
      </section>
      <DealerBottomNav active="redeem" />
    </main>
  );
}

function ReceiptRow({ icon: Icon, label, value }: { icon: typeof FileKey2; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 border-t border-slate-100 py-4 first:border-t-0 first:pt-0 last:pb-0">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
        <span className="mt-0.5 block break-words text-sm font-extrabold text-slate-950">{value}</span>
      </span>
    </div>
  );
}
