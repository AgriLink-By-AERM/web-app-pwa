import { Suspense } from "react";
import { AggregatorDisputeForm } from "@/features/aggregator/components/aggregator-dispute-form";
import { getAggregatorLogs } from "@/lib/aggregator/logs";

export default async function AggregatorDisputePage() {
  const logs = await getAggregatorLogs("all");

  return (
    <Suspense fallback={<DisputeLoading />}>
      <AggregatorDisputeForm logs={logs} />
    </Suspense>
  );
}

function DisputeLoading() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] px-4 py-6 text-[#2C1A0E]">
      <section className="mx-auto w-full max-w-md rounded-lg border border-[#E5DDD4] bg-white p-6 shadow-panel">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#A0522D]">Escalation</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Loading dispute form</h1>
        <p className="mt-2 text-sm leading-6 text-[#7F6A5B]">Preparing the selected field log.</p>
      </section>
    </main>
  );
}
