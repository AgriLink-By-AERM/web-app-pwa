import { BuyerDesktopShell } from "@/features/buyer/components/buyer-desktop-shell";
import { BuyerMatchesTable } from "@/features/buyer/components/buyer-matches-table";
import { getAgroMatches } from "@/lib/buyer/store";

export default async function BuyerMatchesPage() {
  const matches = await getAgroMatches();

  return (
    <BuyerDesktopShell
      active="matches"
      subtitle="Scored supply batches matched against demand orders and logistics constraints."
      title="Bulk Matches"
    >
      <BuyerMatchesTable matches={matches} />
    </BuyerDesktopShell>
  );
}
