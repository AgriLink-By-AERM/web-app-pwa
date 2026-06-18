"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, BadgeCheck, ClipboardCheck, CreditCard, PackageCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DealerBottomNav } from "@/features/dealer/components/dealer-bottom-nav";
import { confirmRedemption, formatNaira, getVoucherFromCode, type Voucher } from "@/lib/dealer/store";

export function DealerRedeemConfirm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const voucher = useMemo<Voucher & { farmerPhone?: string }>(() => {
    const code = searchParams.get("code") ?? "849201";
    const farmerPhone = searchParams.get("farmerPhone") ?? "";
    const item = searchParams.get("item") ?? "NPK Fertilizer 50kg";
    const farmerId = searchParams.get("farmerId") ?? "FRM-29041";
    const farmerName = searchParams.get("farmerName") ?? "Musa Ibrahim";
    const copay = Number(searchParams.get("copay") ?? "0");

    return {
      code,
      farmerPhone,
      farmerId,
      farmerName,
      farmerMaskedPhone: farmerPhone.replace(/(\+\d{3})\d{4}(\d{4})/, '$1****$2') || "080****2341",
      itemAllocation: item,
      quantity: item.includes("NPK") ? 2 : 1,
      unit: item.includes("NPK") ? "bags" : "pack",
      walletContribution: item.includes("NPK") ? 42000 : 7000,
      farmerCopayDue: Number.isFinite(copay) ? copay : 0,
      expiresAt: "2026-06-12T15:30:00+01:00"
    };
  }, [searchParams]);

  async function handleConfirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const hydratedVoucher = await getVoucherFromCode(voucher.code);
    const receipt = await confirmRedemption({ ...hydratedVoucher, ...voucher });
    const params = new URLSearchParams({
      reference: receipt.ledgerReference,
      farmerName: receipt.farmerName,
      farmerId: receipt.farmerId,
      item: receipt.itemName,
      quantity: String(receipt.quantity),
      unit: receipt.unit,
      wallet: String(receipt.walletContribution),
      copay: String(receipt.farmerCopayDue)
    });

    router.push(`/dealer/redeem/success?${params.toString()}`);
  }

  return (
    <main className="min-h-screen bg-surface text-ink lg:pl-72">
      <section className="mx-auto min-h-screen max-w-7xl bg-slate-50 px-4 py-6 pb-24 shadow-sm sm:px-6 lg:bg-transparent lg:px-8 lg:shadow-none">
        <Link className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-indigo-700" href="/dealer/redeem">
          <ArrowLeft className="h-4 w-4" />
          Enter OTP
        </Link>

        <header className="mt-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-700">Security confirmation</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Confirm input disbursement</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Review the decoded voucher manifest before releasing stock to the farmer.
          </p>
        </header>

        <form className="mt-6 space-y-4" onSubmit={handleConfirm}>
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-emerald-700">
              <BadgeCheck className="h-5 w-5" />
              <p className="text-sm font-extrabold">Voucher validated</p>
            </div>
            <ManifestRow icon={UserRound} label="Farmer" value={`${voucher.farmerName} · ${voucher.farmerId}`} />
            <ManifestRow icon={PackageCheck} label="Subsidy item allocation" value={voucher.itemAllocation} />
            <ManifestRow icon={ClipboardCheck} label="Quantity" value={`${voucher.quantity} ${voucher.unit}`} />
            <ManifestRow icon={CreditCard} label="Co-pay balance due" value={formatNaira(voucher.farmerCopayDue)} />
          </section>

          <section className="rounded-lg border border-indigo-100 bg-indigo-50 p-4">
            <p className="text-xs leading-5 text-indigo-900">
              Ask the farmer to confirm their name and allocation aloud. Once submitted, inventory disbursement is
              recorded against the dealer ledger.
            </p>
          </section>

          <Button className="min-h-12 w-full bg-indigo-700 text-white hover:bg-indigo-800" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Confirming disbursement" : "Confirm Input Disbursement"}
          </Button>
        </form>
      </section>
      <DealerBottomNav active="redeem" />
    </main>
  );
}

function ManifestRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 border-t border-slate-100 py-4 first:border-t-0 first:pt-0 last:pb-0">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
        <span className="mt-0.5 block text-sm font-extrabold text-slate-950">{value}</span>
      </span>
    </div>
  );
}
