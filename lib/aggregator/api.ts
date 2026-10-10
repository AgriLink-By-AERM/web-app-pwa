import { fetchApi } from "@/lib/api-client";
import type { AggregatorProfile, AggregatorRegistrationPayload, AggregatorRegistrationResult } from "@/lib/types";

export type AggregatorRegistration = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  zone: string;
  governmentIdType: "nin" | "drivers-license" | "intl_passport";
  governmentIdNumber?: string;
  governmentIdPhotoUrl: string;
  guarantorPhone: string;
};

export type KycStatus = "pending" | "approved" | "rejected";
export type LogStatus = "pending" | "verified" | "rejected";

export type LogInput = {
  farmerPhone: string;
  pipeline: string;
  category: string;
  weightKg: number;
  condition: "good" | "fair" | "damaged";
  latitude: number;
  longitude: number;
  photoUrl: string;
  harvestedAt: string;
};

export type LogRecord = LogInput & {
  id: string;
  status: LogStatus;
  urgencyTier: "low" | "medium" | "high";
  qrPayload: string;
  createdAt: string;
};

export type Dashboard = {
  profile: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    zone: string;
    kycStatus: KycStatus;
  };
  stats: {
    totalLogs: number;
    pendingLogs: number;
    verifiedLogs: number;
    totalWeightKg: number;
    openDisputes: number;
  };
  recentLogs: LogRecord[];
};

export type ReviewStatus = {
  kycStatus: KycStatus;
  rejectionReason?: string;
  reviewSteps: Array<{ label: string; done: boolean }>;
};

export type LogList = {
  logs: LogRecord[];
  total: number;
  page: number;
  limit: number;
};

export type DisputeInput = {
  logId: string;
  reason: string;
  reportedWeightKg?: number;
  notes?: string;
  contactPhone: string;
};

export type DisputeResult = {
  disputeId: string;
  logId: string;
  reason: string;
  status: "open";
  createdAt: string;
};

export async function registerAggregator(
  payload: AggregatorRegistrationPayload | AggregatorRegistration
): Promise<AggregatorRegistrationResult> {
  const backendPayload: AggregatorRegistration =
    "email" in payload && "password" in payload
      ? payload
      : {
          phone: (payload as AggregatorRegistrationPayload).phoneNumber,
          fullName: (payload as AggregatorRegistrationPayload).fullName,
          email: `${(payload as AggregatorRegistrationPayload).phoneNumber.replace(/\D/g, "")}@farmtry.internal`,
          password: "DefaultPassword123!",
          zone: (payload as AggregatorRegistrationPayload).zone,
          governmentIdType: "nin",
          governmentIdNumber: (payload as AggregatorRegistrationPayload).governmentIdNumber,
          governmentIdPhotoUrl: (payload as AggregatorRegistrationPayload).idPhotoFileName.startsWith("http")
            ? (payload as AggregatorRegistrationPayload).idPhotoFileName
            : "https://farmtry.app/uploads/" + (payload as AggregatorRegistrationPayload).idPhotoFileName,
          guarantorPhone: (payload as AggregatorRegistrationPayload).guarantorPhoneNumber,
        };

  const response = await fetchApi<{
    success: boolean;
    message?: string;
    data?: any;
  }>("/auth/aggregator/register", {
    method: "POST",
    body: JSON.stringify(backendPayload),
    requireAuth: false,
    throwOnError: true,
  });

  const profile: AggregatorProfile = {
    id: response?.data?.userId || `agg_${Date.now()}`,
    role: "aggregator",
    verificationStatus: "pending_verification",
    submittedAt: new Date().toISOString(),
    performanceScore: 0,
    fullName: backendPayload.fullName,
    phoneNumber: backendPayload.phone,
    governmentIdNumber: backendPayload.governmentIdNumber || "",
    guarantorPhoneNumber: backendPayload.guarantorPhone,
    zone: (backendPayload.zone as any) || "Kano - Tarauni LGA",
    idPhotoFileName: backendPayload.governmentIdPhotoUrl,
  };

  return {
    profile,
    message: response?.data?.message || response?.message || "Registration submitted successfully.",
  };
}

export async function getDashboard(signal?: AbortSignal): Promise<Dashboard> {
  const response = await fetchApi<{ success: boolean; data: Dashboard }>("/aggregator/dashboard", {
    method: "GET",
    signal,
    throwOnError: true,
  });
  return response?.data as Dashboard;
}

export async function getStatus(signal?: AbortSignal): Promise<ReviewStatus> {
  const response = await fetchApi<{ success: boolean; data: ReviewStatus }>("/aggregator/status", {
    method: "GET",
    signal,
    throwOnError: true,
  });
  return response?.data as ReviewStatus;
}

export async function getLogs(
  filters: { page: number; status: string; category: string; pipeline: string },
  signal?: AbortSignal
): Promise<LogList> {
  const query = new URLSearchParams({ page: String(filters.page), limit: "20" });
  for (const key of ["status", "category", "pipeline"] as const) {
    if (filters[key]) query.set(key, filters[key]);
  }
  const response = await fetchApi<{ success: boolean; data: LogList }>(`/aggregator/logs?${query}`, {
    method: "GET",
    signal,
    throwOnError: true,
  });
  return response?.data as LogList;
}

export async function getLog(id: string, signal?: AbortSignal): Promise<LogRecord> {
  const response = await fetchApi<{ success: boolean; data: LogRecord }>(`/aggregator/logs/${encodeURIComponent(id)}`, {
    method: "GET",
    signal,
    throwOnError: true,
  });
  return response?.data as LogRecord;
}

export async function createLog(input: LogInput): Promise<LogRecord> {
  const response = await fetchApi<{ success: boolean; data: LogRecord }>("/aggregator/logs", {
    method: "POST",
    body: JSON.stringify(input),
    throwOnError: true,
  });
  return response?.data as LogRecord;
}

export async function fileDispute(input: DisputeInput): Promise<DisputeResult> {
  const response = await fetchApi<{ success: boolean; data: DisputeResult }>("/aggregator/disputes", {
    method: "POST",
    body: JSON.stringify(input),
    throwOnError: true,
  });
  return response?.data as DisputeResult;
}


