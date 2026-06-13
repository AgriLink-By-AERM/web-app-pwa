import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle2, Clock, Home, Leaf, ListChecks, MapPin, WalletCards } from "lucide-react";
import { UrgencyBadge } from "@/components/ui/badge";
import { AggregatorBottomNav } from "@/features/aggregator/components/aggregator-bottom-nav";

export default function FreshProduceSuccessPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] pb-24 text-[#2C1A0E]">
      <section className="mx-auto w-full max-w-md px-4 py-6">
        <div className="rounded-lg border border-emerald-200 bg-white p-6 text-center shadow-panel">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">Fresh produce log</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Submitted successfully</h1>
          <p className="mt-3 text-sm leading-6 text-[#7F6A5B]">
            The matching engine is checking nearby restaurant demand. The spoilage urgency tier is available
            immediately so the pickup can be prioritized.
          </p>

          <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-800">Spoilage urgency</p>
            <div className="mt-3 flex justify-center">
              <UrgencyBadge urgency="amber" />
            </div>
          </div>
        </div>

        <section className="mt-5 rounded-lg border border-[#E5DDD4] bg-white p-5 shadow-panel">
          <h2 className="text-base font-extrabold">What happens next?</h2>
          <div className="mt-4 space-y-3">
            <NextStep icon={Leaf} text="Restaurant demand orders are checked against produce type, quantity, and zone." />
            <NextStep icon={MapPin} text="Nearby buyers see the matched supply without exposing the farmer's exact phone number." />
            <NextStep icon={Clock} text="If no match is confirmed, fallback search radius expansion starts automatically." />
            <NextStep icon={WalletCards} text="Fresh produce payout remains 100% cash after buyer confirmation and settlement." />
          </div>
        </section>

        <div className="mt-5 grid gap-3">
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#A0522D] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#7C3D20]"
            href="/aggregator/home"
          >
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </Link>
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#A0522D] bg-white px-4 py-2 text-sm font-bold text-[#A0522D] transition hover:bg-[#F5EFE6]"
            href="/aggregator/logs"
          >
            <ListChecks className="mr-2 h-4 w-4" />
            View My Logs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
      <AggregatorBottomNav active="log" />
    </main>
  );
}

function NextStep({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-[#FAF7F2] px-3 py-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#A0522D]">
        <Icon className="h-4 w-4" />
      </span>
      <p className="text-xs leading-5 text-[#5C3D1E]">{text}</p>
    </div>
  );
}
