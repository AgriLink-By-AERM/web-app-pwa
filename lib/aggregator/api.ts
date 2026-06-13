import type { AggregatorProfile, AggregatorRegistrationPayload, AggregatorRegistrationResult } from "@/lib/types";

export async function registerAggregator(
  payload: AggregatorRegistrationPayload
): Promise<AggregatorRegistrationResult> {
  await simulateNetworkDelay(450);

  const profile: AggregatorProfile = {
    id: `agg_${Date.now()}`,
    role: "aggregator",
    verificationStatus: "pending_verification",
    submittedAt: new Date().toISOString(),
    performanceScore: 0,
    ...payload
  };

  return {
    profile,
    message: "Registration submitted. Your account is pending verification before field logging is enabled."
  };
}

async function simulateNetworkDelay(milliseconds: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
