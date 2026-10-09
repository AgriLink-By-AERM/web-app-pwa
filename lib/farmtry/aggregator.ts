import { array, authenticatedRead, authenticatedRequest, FarmtryError, number, oneOf, record, string } from "./client";
export type KycStatus = "pending" | "approved" | "rejected";
export type LogStatus = "pending" | "verified" | "rejected";
export type LogInput = { farmerPhone: string; pipeline: string; category: string; weightKg: number; condition: "good" | "fair" | "damaged"; latitude: number; longitude: number; photoUrl: string; harvestedAt: string };
export type LogRecord = LogInput & { id: string; status: LogStatus; urgencyTier: "low" | "medium" | "high"; qrPayload: string; createdAt: string };
function coordinate(value: unknown, max: number) { if (typeof value !== "number" || !Number.isFinite(value) || Math.abs(value) > max) throw new FarmtryError("contract", "The service returned invalid location coordinates."); return value; }
function timestamp(value: unknown) { const text = string(value); if (!Number.isFinite(Date.parse(text))) throw new FarmtryError("contract", "The service returned an invalid date."); return text; }
export function decodeLog(value: unknown): LogRecord {
  const d = record(value);
  return { id: string(d.id), farmerPhone: string(d.farmerPhone), pipeline: string(d.pipeline), category: string(d.category), weightKg: number(d.weightKg), condition: oneOf(d.condition, ["good", "fair", "damaged"]), latitude: coordinate(d.latitude, 90), longitude: coordinate(d.longitude, 180), photoUrl: string(d.photoUrl), harvestedAt: timestamp(d.harvestedAt), status: oneOf(d.status, ["pending", "verified", "rejected"]), urgencyTier: oneOf(d.urgencyTier, ["low", "medium", "high"]), qrPayload: string(d.qrPayload), createdAt: timestamp(d.createdAt) };
}
export function decodeDashboard(value: unknown) {
  const d = record(value), p = record(d.profile), s = record(d.stats);
  return { profile: { id: string(p.id), fullName: string(p.fullName), email: string(p.email), phone: string(p.phone), zone: string(p.zone), kycStatus: oneOf(p.kycStatus, ["pending", "approved", "rejected"] as const) }, stats: { totalLogs: number(s.totalLogs), pendingLogs: number(s.pendingLogs), verifiedLogs: number(s.verifiedLogs), totalWeightKg: number(s.totalWeightKg), openDisputes: number(s.openDisputes) }, recentLogs: array(d.recentLogs, decodeLog) };
}
export function decodeStatus(value: unknown) { const d = record(value); return { kycStatus: oneOf(d.kycStatus, ["pending", "approved", "rejected"] as const), rejectionReason: d.rejectionReason === undefined ? undefined : string(d.rejectionReason), reviewSteps: array(d.reviewSteps, item => { const step = record(item); if (typeof step.done !== "boolean") throw new FarmtryError("contract", "The service returned an invalid review step."); return { label: string(step.label), done: step.done }; }) }; }
export function decodeLogs(value: unknown) { const d = record(value); return { logs: array(d.logs, decodeLog), total: number(d.total), page: number(d.page), limit: number(d.limit) }; }
export const getDashboard = (signal?: AbortSignal) => authenticatedRead("/aggregator/dashboard", decodeDashboard, signal);
export const getStatus = (signal?: AbortSignal) => authenticatedRead("/aggregator/status", decodeStatus, signal);
export const getLogs = (filters: { page: number; status: string; category: string; pipeline: string }, signal?: AbortSignal) => { const query = new URLSearchParams({ page: String(filters.page), limit: "20" }); for (const key of ["status", "category", "pipeline"] as const) if (filters[key]) query.set(key, filters[key]); return authenticatedRead(`/aggregator/logs?${query}`, decodeLogs, signal); };
function logId(id: string) { if (!/^[a-f\d]{24}$/i.test(id)) throw new FarmtryError("contract", "This log does not have a valid service identifier."); return id; }
export const getLog = (id: string, signal?: AbortSignal) => authenticatedRead(`/aggregator/logs/${logId(id)}`, decodeLog, signal);
export const createLog = (input: LogInput) => authenticatedRequest("/aggregator/logs", decodeLog, { body: input });
export type DisputeInput = { logId: string; reason: string; reportedWeightKg?: number; notes?: string; contactPhone: string };
export const fileDispute = (input: DisputeInput) => { logId(input.logId); return authenticatedRequest("/aggregator/disputes", value => { const d = record(value); return { disputeId: string(d.disputeId), logId: string(d.logId), reason: string(d.reason), status: oneOf(d.status, ["open"] as const), createdAt: timestamp(d.createdAt) }; }, { body: input }); };
export type Dashboard = ReturnType<typeof decodeDashboard>;
export type ReviewStatus = ReturnType<typeof decodeStatus>;
export type LogList = ReturnType<typeof decodeLogs>;
