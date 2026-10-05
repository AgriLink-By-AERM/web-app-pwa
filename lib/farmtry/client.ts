/** Browser transport for the supplied Farmtry v1 contract; never imports demo services. */
export const FARMTRY_API_URL = (process.env.NEXT_PUBLIC_FARMTRY_API_URL || "http://localhost:5001/api/v1").replace(/\/+$/, "");
export type ErrorKind = "network" | "timeout" | "unauthorized" | "forbidden" | "validation" | "conflict" | "rate-limit" | "not-found" | "server" | "contract";
export class FarmtryError extends Error {
  constructor(public kind: ErrorKind, message: string, public status = 0, public retryAfter: number | null = null) { super(message); this.name = "FarmtryError"; }
}
export function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new FarmtryError("contract", "The service returned an unexpected response. Please try again or contact support.");
  return value as Record<string, unknown>;
}
export function string(value: unknown): string { if (typeof value !== "string" || !value.trim()) throw new FarmtryError("contract", "The service response is missing required information."); return value; }
export function number(value: unknown): number { if (typeof value !== "number" || !Number.isFinite(value) || value < 0) throw new FarmtryError("contract", "The service returned an invalid amount or count."); return value; }
export function array<T>(value: unknown, decode: (item: unknown) => T): T[] { if (!Array.isArray(value)) throw new FarmtryError("contract", "The service returned an invalid list."); return value.map(decode); }
export function oneOf<T extends string>(value: unknown, options: readonly T[]): T { if (typeof value !== "string" || !options.includes(value as T)) throw new FarmtryError("contract", "The service returned an unsupported status."); return value as T; }
export function errorMessage(error: unknown): string { return error instanceof FarmtryError ? error.message : "Something went wrong. Please try again."; }

const messages: Record<number, [ErrorKind, string]> = {
  400: ["validation", "The request could not be accepted. Check the details and try again."],
  401: ["unauthorized", "Sign-in is required, or your session has expired. Please sign in again."],
  403: ["forbidden", "Your account does not have permission for this action. Check your role and verification status."],
  404: ["not-found", "This record could not be found or is not available to your account."],
  409: ["conflict", "This request conflicts with an existing record. Check for an existing account or open dispute."],
  422: ["validation", "Some details were rejected by the service. Please review the form."],
  429: ["rate-limit", "Too many attempts. Please wait before trying again."]
};

export async function request<T>(path: string, decode: (data: unknown) => T, options: { body?: unknown; method?: "GET" | "POST"; signal?: AbortSignal } = {}): Promise<T> {
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  options.signal?.addEventListener("abort", onAbort, { once: true });
  if (options.signal?.aborted) controller.abort();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(`${FARMTRY_API_URL}${path}`, {
      method: options.method ?? (options.body === undefined ? "GET" : "POST"),
      credentials: "include", cache: "no-store", redirect: "error", signal: controller.signal,
      headers: { Accept: "application/json", ...(options.body === undefined ? {} : { "Content-Type": "application/json" }) },
      ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) })
    });
    // Do not render server stack traces, contact-disclosing auth messages or arbitrary error details.
    if (!response.ok) {
      const [kind, message] = messages[response.status] ?? ["server", "The service is unavailable. Please try again later."];
      const retry = response.headers.get("Retry-After");
      const seconds = retry && /^\d+$/.test(retry) ? Number(retry) : null;
      throw new FarmtryError(kind, message, response.status, seconds);
    }
    let body: Record<string, unknown>;
    try { body = record(await response.json()); } catch { throw new FarmtryError("contract", "The service returned an unreadable response. No success has been confirmed."); }
    if (body.success !== true) throw new FarmtryError("contract", "The service did not confirm this action. Please try again.");
    return decode(body.data);
  } catch (error) {
    if (error instanceof FarmtryError) throw error;
    if (controller.signal.aborted) throw new FarmtryError("timeout", "The request was interrupted or timed out. Check the current state before resubmitting.");
    throw new FarmtryError("network", "Cannot reach Farmtry. Check your connection and try again. No success has been confirmed.");
  } finally { clearTimeout(timer); options.signal?.removeEventListener("abort", onAbort); }
}

const sessionKey = "farmtry.session-id"; // Logout reference only; tokens remain in HttpOnly cookies.
let sessionId: string | null = null;
export function saveSession(id: string) { sessionId = id; try { sessionStorage.setItem(sessionKey, id); } catch { /* Memory session still supports logout. */ } }
export function clearSession() { sessionId = null; try { sessionStorage.removeItem(sessionKey); } catch { /* No storage available. */ } }
export function currentSession() { try { return sessionId ?? sessionStorage.getItem(sessionKey); } catch { return sessionId; } }
let refreshing: Promise<void> | null = null;
export function refreshSession(): Promise<void> {
  if (!refreshing) refreshing = request("/auth/refresh-token", value => string(record(value).sessionId), { method: "POST" }).then(saveSession).catch(error => { if (error instanceof FarmtryError && error.kind === "unauthorized") clearSession(); throw error; }).finally(() => { refreshing = null; });
  return refreshing;
}
/** Only read requests retry after a cookie refresh. Mutations are never replayed automatically. */
export async function authenticatedRead<T>(path: string, decode: (data: unknown) => T, signal?: AbortSignal): Promise<T> {
  try { return await request(path, decode, { signal }); }
  catch (error) {
    if (!(error instanceof FarmtryError) || error.status !== 401 || signal?.aborted) throw error;
    await refreshSession();
    return request(path, decode, { signal });
  }
}
