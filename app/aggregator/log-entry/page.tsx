import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Leaf, Recycle, Scale, WalletCards } from "lucide-react";
import { AggregatorBottomNav } from "@/features/aggregator/components/aggregator-bottom-nav";

export default function AggregatorLogEntryPage() {
  return (
    <main className="min-h-screen bg-surface pb-24 text-ink lg:pl-72">
      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header>
          <Link className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-[#A0522D]" href="/aggregator/home">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-[#A0522D]">New field log</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight">What are you logging?</h1>
          <p className="mt-2 text-sm leading-6 text-[#7F6A5B]">
            Choose the correct pipeline. Fresh produce routes to restaurants for cash payout, while agri-waste routes
            to factories and triggers the 70/30 wallet split after collection.
          </p>
        </header>

        <section className="mt-7 space-y-4">
          <PipelineCard
            description="Tomatoes, pepper, leafy greens, cassava, and other perishable harvests that need fast restaurant matching."
            href="/aggregator/log-entry/fresh"
            icon={Leaf}
            kicker="100% cash payout"
            meta={[
              { icon: Clock, text: "Spoilage urgency badge appears immediately" },
              { icon: Scale, text: "Weight, condition, harvest time, GPS, and photo required" }
            ]}
            tone="fresh"
            title="Fresh Produce"
          />

          <PipelineCard
            description="Cassava peel, rice husks, maize stalks, groundnut shells, and other factory-bound agricultural residue."
            href="/aggregator/log-entry/waste"
            icon={Recycle}
            kicker="70% Agri-Wallet / 30% cash"
            meta={[
              { icon: WalletCards, text: "Stage 2 payout happens after factory QR scan" },
              { icon: Scale, text: "Dry weight, moisture, GPS, and photo required" }
            ]}
            tone="waste"
            title="Agri-Waste"
          />
        </section>
      </section>

      <AggregatorBottomNav active="log" />
    </main>
  );
}

type PipelineCardProps = {
  description: string;
  href: string;
  icon: typeof Leaf;
  kicker: string;
  meta: Array<{
    icon: typeof Clock;
    text: string;
  }>;
  title: string;
  tone: "fresh" | "waste";
};

function PipelineCard({ description, href, icon: Icon, kicker, meta, title, tone }: PipelineCardProps) {
  const isFresh = tone === "fresh";

  return (
    <Link
      className={`block rounded-lg border p-5 shadow-panel transition ${
        isFresh
          ? "border-emerald-200 bg-emerald-50 text-emerald-950 hover:border-emerald-500"
          : "border-[#D8C7B3] bg-white text-[#2C1A0E] hover:border-[#7C5C2E]"
      }`}
      href={href}
    >
      <div className="flex items-start gap-4">
        <span
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg ${
            isFresh ? "bg-emerald-600 text-white" : "bg-[#7C5C2E] text-white"
          }`}
        >
          <Icon className="h-7 w-7" />
        </span>
        <span className="min-w-0 flex-1">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${
              isFresh ? "bg-white text-emerald-800" : "bg-[#F5EFE6] text-[#7C5C2E]"
            }`}
          >
            {kicker}
          </span>
          <span className="mt-3 block text-xl font-extrabold">{title}</span>
          <span className="mt-2 block text-sm leading-6 opacity-75">{description}</span>
        </span>
        <ArrowRight className="mt-2 h-5 w-5 shrink-0 opacity-60" />
      </div>

      <div className="mt-5 space-y-2">
        {meta.map((item) => {
          const MetaIcon = item.icon;

          return (
            <div className="flex items-start gap-2 text-xs leading-5 opacity-80" key={item.text}>
              <MetaIcon className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{item.text}</span>
            </div>
          );
        })}
      </div>
    </Link>
  );
}
