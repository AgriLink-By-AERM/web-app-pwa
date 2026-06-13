import { AggregatorLogsList } from "@/features/aggregator/components/aggregator-logs-list";
import { getAggregatorLogs } from "@/lib/aggregator/logs";

export default async function AggregatorLogsPage() {
  const logs = await getAggregatorLogs("all");

  return <AggregatorLogsList logs={logs} />;
}
