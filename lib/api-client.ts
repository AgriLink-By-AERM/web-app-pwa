export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

export type ErrorKind =
  | "network"
  | "timeout"
  | "unauthorized"
  | "forbidden"
  | "validation"
  | "conflict"
  | "rate-limit"
  | "not-found"
  | "server"
  | "contract";

export class ApiError extends Error {
  constructor(
    public kind: ErrorKind,
    message: string,
    public status = 0,
    public retryAfter: number | null = null,
    public code: string | null = null,
    public details: Array<{ field?: string; message: string }> | null = null,
    public raw: any = null
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

const statusMessages: Record<number, [ErrorKind, string]> = {
  400: ["validation", "The request could not be accepted. Check the details and try again."],
  401: ["unauthorized", "Sign-in is required or your session has expired. Please sign in again."],
  403: ["forbidden", "Your account does not have permission for this action."],
  404: ["not-found", "This record could not be found or is not available."],
  409: ["conflict", "This request conflicts with an existing record."],
  422: ["validation", "Some details were rejected by the service. Please review the form."],
  429: ["rate-limit", "Too many attempts. Please wait before trying again."]
};

// Session storage helpers for session tracking
const sessionKey = "farmtry.session-id";
let memorySessionId: string | null = null;
let generation = 0;
let expired = false;

export function saveSession(id: string) {
  generation++;
  expired = false;
  memorySessionId = id;
  try {
    sessionStorage.setItem(sessionKey, id);
  } catch {
    // fallback to memory
  }
}

export function clearSession() {
  generation++;
  memorySessionId = null;
  try {
    sessionStorage.removeItem(sessionKey);
  } catch {
    // ignore
  }
}

export function currentSession(): string | null {
  try {
    return memorySessionId ?? sessionStorage.getItem(sessionKey);
  } catch {
    return memorySessionId;
  }
}

export interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
  throwOnError?: boolean;
  retryBody?: () => BodyInit;
}

let refreshPromise: Promise<boolean> | null = null;

export async function refreshAccessToken(): Promise<boolean> {
  // During static build (Node.js), session cookies do not exist
  if (typeof window === "undefined") return false;
  if (refreshPromise) return refreshPromise;

  const started = generation;
  refreshPromise = (async () => {
    const result = await fetchApi<{ success: true; data: { sessionId: string } }>("/auth/refresh-token", {
      method: "POST", requireAuth: false, throwOnError: true,
    });
    if (started !== generation) throw new ApiError("unauthorized", "The session changed while refreshing.", 401);
    if (!result?.data?.sessionId || typeof result.data.sessionId !== "string") throw new ApiError("contract", "The service did not return a session reference.");
    saveSession(result.data.sessionId);
    return true;
  })();

  try {
    return await refreshPromise;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401 && started === generation) expireSession();
    throw error;
  } finally {
    refreshPromise = null;
  }
}

function expireSession() {
  if (expired) return;
  clearSession(); expired = true;
  if (typeof window !== "undefined") {
    const audience = window.location.pathname.includes("aggregator") ? "aggregator" : "buyer";
    window.location.replace(`/preview/${audience}-login/?expired=true`);
  }
}

export async function fetchApi<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T | null> {
  const isServer = typeof window === "undefined";

  // During static export (next build) in Node.js:
  // 1. If API_BASE_URL is a relative path (e.g. "/api/v1"), Node fetch cannot parse it without an origin.
  // 2. Private authenticated data cannot be resolved at build time without active user cookies.
  // Short-circuit immediately so pages render fallback data instantly without blocking Next.js build workers.
  if (isServer && !API_BASE_URL.startsWith("http://") && !API_BASE_URL.startsWith("https://")) {
    return null;
  }

  const { requireAuth = true, throwOnError = false, retryBody, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(fetchOptions.body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(fetchOptions.headers as Record<string, string> || {}),
  };

  const timeoutMs = isServer ? 1500 : 10000;

  const started = generation;
  const makeRequest = (retry = false) =>
    fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      ...(retry && retryBody ? { body: retryBody() } : {}),
      cache: "no-store",
      redirect: "error",
      headers,
      credentials: "include", // sends HttpOnly cookies
      signal: fetchOptions.signal ?? AbortSignal.timeout(timeoutMs),
    });

  try {
    let response = await makeRequest();

    // Handle 401: try refresh once, then retry (only in browser)
    if (response.status === 401 && requireAuth && !isServer) {
      if (expired) throw new ApiError("unauthorized", "Please sign in again.", 401);
      const refreshed = generation !== started ? !!currentSession() : await refreshAccessToken();
      if (refreshed) {
        response = await makeRequest(true);
      }
      if (response.status === 401) expireSession();
    }

    if (!response.ok) {
      const [kind, defaultMsg] = statusMessages[response.status] ?? ["server", "The service is temporarily unavailable."];
      const retry = response.headers.get("Retry-After");
      const retryAfter = retry && /^\d+$/.test(retry) ? Number(retry) : null;
      
      let errMsg = defaultMsg;
      let errCode: string | null = null;
      let errDetails: Array<{ field?: string; message: string }> | null = null;
      let errorJson: any = null;

      try {
        errorJson = await response.json();

        // Extract error code if present
        if (errorJson?.error?.code) {
          errCode = String(errorJson.error.code);
        } else if (errorJson?.code) {
          errCode = String(errorJson.code);
        }

        // Extract validation details or specific error messages
        if (Array.isArray(errorJson?.error?.details) && errorJson.error.details.length > 0) {
          errDetails = errorJson.error.details;
          const messages = errorJson.error.details
            .map((d: any) => d.message || d.msg)
            .filter(Boolean);
          if (messages.length > 0) errMsg = messages.join(" ");
        } else if (Array.isArray(errorJson?.details) && errorJson.details.length > 0) {
          errDetails = errorJson.details;
          const messages = errorJson.details
            .map((d: any) => d.message || d.msg)
            .filter(Boolean);
          if (messages.length > 0) errMsg = messages.join(" ");
        } else if (typeof errorJson?.message === "string" && errorJson.message.trim().length > 0) {
          errMsg = errorJson.message.trim();
        } else if (typeof errorJson?.error?.message === "string" && errorJson.error.message.trim().length > 0) {
          errMsg = errorJson.error.message.trim();
        } else if (typeof errorJson?.error === "string" && errorJson.error.trim().length > 0) {
          errMsg = errorJson.error.trim();
        }
      } catch {
        // ignore json parse error on error response
      }

      if (throwOnError) {
        throw new ApiError(kind, errMsg, response.status, retryAfter, errCode, errDetails, errorJson);
      }
      return null;
    }

    if (response.status === 204) throw new ApiError("contract", "The service did not return the documented success confirmation.");

    let envelope;
    try { envelope = await response.json(); } catch { throw new ApiError("contract", "The service returned an unreadable response."); }
    if (!envelope || envelope.success !== true) throw new ApiError("contract", "The service did not confirm this action.");
    return envelope as T;
  } catch (error) {
    if (error instanceof ApiError) { if (throwOnError) throw error; return null; }
    if (throwOnError) {
      const isTimeout = (error as any)?.name === "TimeoutError" || (error as any)?.name === "AbortError";
      throw new ApiError(
        isTimeout ? "timeout" : "network",
        isTimeout ? "The request timed out. Please check your connection." : "Cannot reach the service. Please check your connection."
      );
    }
    return null;
  }
}