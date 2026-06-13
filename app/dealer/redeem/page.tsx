"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DealerBottomNav } from "@/features/dealer/components/dealer-bottom-nav";
import { validateVoucherCode } from "@/lib/dealer/store";

export default function DealerRedeemPage() {
  const router = useRouter();
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const result = await validateVoucherCode(code);

    if (!result.valid) {
      setError(result.reason);
      return;
    }

    setIsSubmitting(true);
    router.push(
      `/dealer/redeem/confirm?code=${result.voucher.code}&farmerId=${encodeURIComponent(result.voucher.farmerId)}&farmerName=${encodeURIComponent(result.voucher.farmerName)}&item=${encodeURIComponent(result.voucher.itemAllocation)}&copay=${result.voucher.farmerCopayDue}`
    );
  }

  function handleCodeChange(value: string) {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
    setCode(digitsOnly);
    setError("");
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <section className="mx-auto min-h-screen max-w-md border-x border-slate-200 bg-slate-50 px-4 py-6 pb-24 shadow-sm">
        <Link className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-indigo-700" href="/dealer/home">
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>

        <header className="mt-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-700">Voucher redemption</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Enter farmer OTP</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Type the 6-digit redemption voucher code the farmer received by SMS.
          </p>
        </header>

        <form className="mt-7" onSubmit={handleSubmit}>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <label className="mb-3 block text-xs font-bold uppercase tracking-wide text-slate-500" htmlFor="otpCode">
              Voucher code
            </label>
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  className={`flex h-14 items-center justify-center rounded-lg border text-xl font-extrabold ${
                    error
                      ? "border-red-300 bg-red-50 text-red-700"
                      : code[index]
                        ? "border-indigo-600 bg-indigo-50 text-indigo-800"
                        : "border-slate-200 bg-slate-50 text-slate-300"
                  }`}
                  key={index}
                >
                  {code[index] ?? ""}
                </div>
              ))}
            </div>
            <input
              autoComplete="one-time-code"
              className="mt-4 min-h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-center text-lg font-extrabold tracking-[0.4em] outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              id="otpCode"
              inputMode="numeric"
              onChange={(event) => handleCodeChange(event.target.value)}
              placeholder="000000"
              type="text"
              value={code}
            />
            {error ? (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold leading-5 text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </div>
            ) : null}
          </div>

          <section className="mt-5 rounded-lg border border-indigo-100 bg-indigo-50 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-indigo-700" />
              <p className="text-xs leading-5 text-indigo-900">
                Confirm the decoded manifest with the farmer before releasing stock. This action credits your dealer
                account and debits the farmer's Agri-Wallet.
              </p>
            </div>
          </section>

          <Button className="mt-5 min-h-12 w-full bg-indigo-700 text-white hover:bg-indigo-800" disabled={code.length !== 6 || isSubmitting} type="submit">
            <KeyRound className="mr-2 h-4 w-4" />
            Validate Voucher
          </Button>
        </form>
      </section>
      <DealerBottomNav active="redeem" />
    </main>
  );
}
