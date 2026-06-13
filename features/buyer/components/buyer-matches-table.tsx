"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { MatchConfirmationModal } from "@/features/buyer/components/match-confirmation-modal";
import { formatMetricTonsFromKg, formatNaira, type AgroMatchBatch, type BuyerMatchStatus } from "@/lib/buyer/store";
import { cn } from "@/lib/utils";

type BuyerMatchesTableProps = {
  matches: AgroMatchBatch[];
};

type MatchFilter = "all" | BuyerMatchStatus;

const filters: Array<{ id: MatchFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "reviewing", label: "Reviewing" },
  { id: "accepted", label: "Accepted" },
  { id: "in_transit", label: "In Transit" }
];

export function BuyerMatchesTable({ matches }: BuyerMatchesTableProps) {
  const [activeFilter, setActiveFilter] = useState<MatchFilter>("all");
  const [query, setQuery] = useState<string>("");
  const [selectedMatch, setSelectedMatch] = useState<AgroMatchBatch | null>(null);
  const [matchStates, setMatchStates] = useState<Record<string, BuyerMatchStatus>>({});

  const renderedMatches = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return matches.filter((match) => {
      const status = matchStates[match.id] ?? match.status;
      const matchesFilter = activeFilter === "all" || status === activeFilter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        match.batchReference.toLowerCase().includes(normalizedQuery) ||
        match.cropSpecies.toLowerCase().includes(normalizedQuery) ||
        match.region.toLowerCase().includes(normalizedQuery) ||
        match.aggregatorId.toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, matchStates, matches, query]);

  function acceptMatch(match: AgroMatchBatch) {
    setMatchStates((current) => ({ ...current, [match.id]: "accepted" }));
    setSelectedMatch(null);
  }

  function rejectMatch(match: AgroMatchBatch) {
    setMatchStates((current) => ({ ...current, [match.id]: "rejected" }));
    setSelectedMatch(null);
  }

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-black text-slate-950">Programmatic match ledger</h2>
            <p className="mt-1 text-sm text-slate-500">Review scored supply batches against active demand contracts.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="h-11 w-72 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-semibold outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search batch, species, region"
                type="search"
                value={query}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-slate-200 px-5 py-3">
          <span className="inline-flex items-center gap-2 text-sm font-black text-slate-500">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </span>
          {filters.map((filter) => (
            <button
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-black transition",
                activeFilter === filter.id ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              type="button"
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left">
            <thead className="bg-slate-50">
              <tr>
                <Th>Batch</Th>
                <Th>Crop species</Th>
                <Th>Score</Th>
                <Th>Bulk weight</Th>
                <Th>Source region</Th>
                <Th>Cost</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {renderedMatches.map((match) => {
                const status = matchStates[match.id] ?? match.status;

                return (
                  <tr className="hover:bg-slate-50" key={match.id}>
                    <Td>
                      <p className="font-black text-slate-950">{match.batchReference}</p>
                      <p className="mt-1 text-xs text-slate-500">{match.aggregatorId}</p>
                    </Td>
                    <Td>
                      <p className="font-bold text-slate-900">{match.cropSpecies}</p>
                      <p className="mt-1 text-xs text-slate-500">{match.variety}</p>
                    </Td>
                    <Td>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">{match.matchScore}%</span>
                    </Td>
                    <Td>{formatMetricTonsFromKg(match.bulkWeightKg)}</Td>
                    <Td>
                      <p className="font-semibold text-slate-800">{match.region}</p>
                      <p className="mt-1 text-xs text-slate-500">{match.sourceLocation}</p>
                    </Td>
                    <Td>{formatNaira(match.totalSourcedCost)}</Td>
                    <Td>
                      <span className="capitalize text-slate-700">{status.replace("_", " ")}</span>
                    </Td>
                    <Td>
                      <button className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-black text-white hover:bg-blue-800" onClick={() => setSelectedMatch(match)} type="button">
                        Review match
                      </button>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <MatchConfirmationModal match={selectedMatch} onAccept={acceptMatch} onClose={() => setSelectedMatch(null)} onReject={rejectMatch} />
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-5 py-3 text-xs font-black uppercase tracking-wide text-slate-500">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-5 py-4 text-sm text-slate-700">{children}</td>;
}
