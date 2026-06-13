import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Copy, MapPin, MessageCircle, Printer, QrCode, Scale, Share2, UserRound } from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import { AggregatorBottomNav } from "@/features/aggregator/components/aggregator-bottom-nav";
import { getCollectionTicket } from "@/lib/aggregator/tickets";
import { formatKg, maskPhone } from "@/lib/format";

type CollectionTicketPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CollectionTicketPage({ params }: CollectionTicketPageProps) {
  const { id } = await params;
  const ticket = await getCollectionTicket(id);

  return (
    <main className="min-h-screen bg-[#FAF7F2] pb-24 text-[#2C1A0E]">
      <section className="mx-auto w-full max-w-md px-4 py-6">
        <header>
          <Link className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-[#A0522D]" href="/aggregator/home">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-[#7C5C2E]">QR collection ticket</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight">{ticket.referenceNumber}</h1>
          <p className="mt-2 text-sm leading-6 text-[#7F6A5B]">
            Show this ticket to the farmer or factory driver. The same QR value is scanned at goods-in to trigger
            Stage 2 payout.
          </p>
        </header>

        <section className="mt-6 rounded-lg border border-[#E5DDD4] bg-white p-5 text-center shadow-panel">
          <div className="mx-auto flex aspect-square w-56 max-w-full items-center justify-center rounded-lg border-4 border-[#2C1A0E] bg-white p-5">
            <div className="grid h-full w-full grid-cols-5 grid-rows-5 gap-1">
              {Array.from({ length: 25 }).map((_, index) => (
                <span
                  className={index % 2 === 0 || index === 7 || index === 18 ? "rounded-sm bg-[#2C1A0E]" : "rounded-sm bg-[#E5DDD4]"}
                  key={index}
                />
              ))}
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <StatusBadge status={ticket.status} />
          </div>
          <p className="mt-3 break-all rounded-lg bg-[#FAF7F2] px-3 py-2 text-xs font-bold text-[#5C3D1E]">
            {ticket.qrCodeValue}
          </p>
        </section>

        <section className="mt-5 rounded-lg border border-[#E5DDD4] bg-white p-5 shadow-panel">
          <h2 className="text-base font-extrabold">Waste summary</h2>
          <div className="mt-4 grid gap-3">
            <SummaryRow icon={QrCode} label="Waste type" value={ticket.wasteCategory} />
            <SummaryRow icon={Scale} label="Weight and moisture" value={`${formatKg(ticket.estimatedDryWeightKg)} · ${ticket.moisture}`} />
            <SummaryRow icon={UserRound} label="Farmer ID" value={ticket.farmerMaskedPhone} />
            <SummaryRow icon={MapPin} label="Pickup zone" value={`${ticket.gps.zone} · ${ticket.gps.address}`} />
          </div>
        </section>

        <section className="mt-5 rounded-lg border border-[#D8C7B3] bg-[#F5EFE6] p-5">
          <p className="text-sm font-extrabold">Aggregator contact</p>
          <p className="mt-2 text-sm text-[#5C3D1E]">
            {ticket.aggregatorName} · {maskPhone(ticket.aggregatorPhone)}
          </p>
        </section>

        <section className="mt-5 grid gap-3">
          <TicketAction icon={MessageCircle} label="Share via WhatsApp" />
          <TicketAction icon={Copy} label="Copy ticket link" />
          <TicketAction icon={Printer} label="Print simple ticket" />
        </section>
      </section>
      <AggregatorBottomNav active="logs" />
    </main>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-[#FAF7F2] px-3 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#7C5C2E]">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-bold uppercase tracking-wide text-[#9C8575]">{label}</span>
        <span className="mt-0.5 block truncate text-sm font-bold text-[#2C1A0E]">{value}</span>
      </span>
    </div>
  );
}

function TicketAction({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button
      className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#A0522D] bg-white px-4 py-2 text-sm font-bold text-[#A0522D] transition hover:bg-[#F5EFE6]"
      type="button"
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </button>
  );
}
