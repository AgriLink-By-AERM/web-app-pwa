import { array, number, oneOf, record, string } from "@/lib/api-validation";
import { fetchApi, ApiError } from "@/lib/api-client";
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
  if (!("email" in payload) || !("password" in payload)) throw new ApiError("validation", "Register using your email, password and an uploaded ID photo URL.");
  const backendPayload = payload;

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

  const registeredId = string(response?.data?.userId);
  const profile: AggregatorProfile = {
    id: registeredId,
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
  return decodeDashboard(response?.data);
}

export async function getStatus(signal?: AbortSignal): Promise<ReviewStatus> {
  const response = await fetchApi<{ success: boolean; data: ReviewStatus }>("/aggregator/status", {
    method: "GET",
    signal,
    throwOnError: true,
  });
  return decodeStatus(response?.data);
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
  return decodeLogs(response?.data);
}

export async function getLog(id: string, signal?: AbortSignal): Promise<LogRecord> {
  if (!/^[a-f\d]{24}$/i.test(id)) throw new ApiError("validation", "Invalid log identifier.");
  const response = await fetchApi<{ success: boolean; data: LogRecord }>(`/aggregator/logs/${encodeURIComponent(id)}`, {
    method: "GET",
    signal,
    throwOnError: true,
  });
  return decodeLog(response?.data);
}

export async function createLog(input: LogInput): Promise<LogRecord> {
  const response = await fetchApi<{ success: boolean; data: LogRecord }>("/aggregator/logs", {
    method: "POST",
    body: JSON.stringify(input),
    throwOnError: true,
  });
  return decodeLog(response?.data);
}

export async function fileDispute(input: DisputeInput): Promise<DisputeResult> {
  const response = await fetchApi<{ success: boolean; data: DisputeResult }>("/aggregator/disputes", {
    method: "POST",
    body: JSON.stringify(input),
    throwOnError: true,
  });
  const d = record(response?.data);
  return { disputeId: string(d.disputeId), logId: string(d.logId), reason: string(d.reason), status: oneOf(d.status, ["open"] as const), createdAt: timestamp(d.createdAt) };
}



function coordinate(value: unknown, max: number) { if (typeof value !== "number" || !Number.isFinite(value) || Math.abs(value) > max) throw new ApiError("contract", "The service returned invalid location coordinates."); return value; }
function timestamp(value: unknown) { const text = string(value); if (!Number.isFinite(Date.parse(text))) throw new ApiError("contract", "The service returned an invalid date."); return text; }
export function decodeLog(value: unknown): LogRecord {
  const d = record(value);
  return { id: string(d.id), farmerPhone: string(d.farmerPhone), pipeline: string(d.pipeline), category: string(d.category), weightKg: number(d.weightKg), condition: oneOf(d.condition, ["good", "fair", "damaged"]), latitude: coordinate(d.latitude, 90), longitude: coordinate(d.longitude, 180), photoUrl: string(d.photoUrl), harvestedAt: timestamp(d.harvestedAt), status: oneOf(d.status, ["pending", "verified", "rejected"]), urgencyTier: oneOf(d.urgencyTier, ["low", "medium", "high"]), qrPayload: string(d.qrPayload), createdAt: timestamp(d.createdAt) };
}
export function decodeDashboard(value: unknown) {
  const d = record(value), p = record(d.profile), s = record(d.stats);
  return { profile: { id: string(p.id), fullName: string(p.fullName), email: string(p.email), phone: string(p.phone), zone: string(p.zone), kycStatus: oneOf(p.kycStatus, ["pending", "approved", "rejected"] as const) }, stats: { totalLogs: number(s.totalLogs), pendingLogs: number(s.pendingLogs), verifiedLogs: number(s.verifiedLogs), totalWeightKg: number(s.totalWeightKg), openDisputes: number(s.openDisputes) }, recentLogs: array(d.recentLogs, decodeLog) };
}
export function decodeStatus(value: unknown) { const d = record(value); return { kycStatus: oneOf(d.kycStatus, ["pending", "approved", "rejected"] as const), rejectionReason: d.rejectionReason == null ? undefined : string(d.rejectionReason), reviewSteps: array(d.reviewSteps, item => { const step = record(item); if (typeof step.done !== "boolean") throw new ApiError("contract", "The service returned an invalid review step."); return { label: string(step.label), done: step.done }; }) }; }
export function decodeLogs(value: unknown) { const d = record(value); return { logs: array(d.logs, decodeLog), total: number(d.total), page: number(d.page), limit: number(d.limit) }; }
