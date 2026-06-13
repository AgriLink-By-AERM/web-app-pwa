import { Suspense } from "react";
import { DealerRedeemConfirm } from "@/features/dealer/components/dealer-redeem-confirm";

export default function DealerRedeemConfirmPage() {
  return (
    <Suspense fallback={<ConfirmLoading />}>
      <DealerRedeemConfirm />
    </Suspense>
  );
}

function ConfirmLoading() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <section className="mx-auto min-h-screen max-w-md border-x border-slate-200 bg-slate-50 px-4 py-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-700">Security confirmation</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Loading voucher manifest</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Preparing the decoded OTP details.</p>
      </section>
    </main>
  );
}
