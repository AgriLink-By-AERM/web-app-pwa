import { fetchApi } from "@/lib/api-client";
import type { AggregatorProfile, AggregatorRegistrationPayload, AggregatorRegistrationResult } from "@/lib/types";

export async function registerAggregator(
  payload: AggregatorRegistrationPayload
): Promise<AggregatorRegistrationResult> {
  const backendPayload = {
    phone: payload.phoneNumber,
    fullName: payload.fullName,
    password: "defaultPassword123", // UI doesn't collect password currently
    zone: payload.zone,
    governmentIdType: "nin", // default for now
    governmentIdNumber: payload.governmentIdNumber,
    governmentIdPhotoUrl: "http://example.com/" + payload.idPhotoFileName,
    guarantorPhone: payload.guarantorPhoneNumber
  };

  const response = await fetchApi('/aggregator/register', {
    method: 'POST',
    body: JSON.stringify(backendPayload)
  });

  // Backend returns 201 with `{ data: { message: ... } }` based on standard ok() response format
  // or `{ message: ... }` if unwrapped. Let's assume standard response structure.

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
    message: response?.data?.message || response?.message || "Registration submitted successfully."
  };
}
