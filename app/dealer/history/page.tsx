import { DealerHistoryList } from "@/features/dealer/components/dealer-history-list";
import { getRedemptionHistory } from "@/lib/dealer/store";

export default async function DealerHistoryPage() {
  const records = await getRedemptionHistory();

  return <DealerHistoryList records={records} />;
}
