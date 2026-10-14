import { ApiError } from "./api-client";
export function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ApiError("contract", "The service returned an unexpected response. Please try again or contact support.");
  return value as Record<string, unknown>;
}
export function string(value: unknown): string { if (typeof value !== "string" || !value.trim()) throw new ApiError("contract", "The service response is missing required information."); return value; }
export function number(value: unknown): number { if (typeof value !== "number" || !Number.isFinite(value) || value < 0) throw new ApiError("contract", "The service returned an invalid amount or count."); return value; }
export function array<T>(value: unknown, decode: (item: unknown) => T): T[] { if (!Array.isArray(value)) throw new ApiError("contract", "The service returned an invalid list."); return value.map(decode); }
export function oneOf<T extends string>(value: unknown, options: readonly T[]): T { if (typeof value !== "string" || !options.includes(value as T)) throw new ApiError("contract", "The service returned an unsupported status."); return value as T; }
