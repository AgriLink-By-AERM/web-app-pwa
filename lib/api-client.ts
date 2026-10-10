export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5002/api/v1"
    : "/api/v1");

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
    public retryAfter: number | null = null
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

export function saveSession(id: string) {
  memorySessionId = id;
  try {
    sessionStorage.setItem(sessionKey, id);
  } catch {
    // fallback to memory
  }
}

export function clearSession() {
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
}

let refreshPromise: Promise<boolean> | null = null;

export async function refreshAccessToken(): Promise<boolean> {
  // During static build (Node.js), session cookies do not exist
  if (typeof window === "undefined") return false;
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(5000)
      });
      if (!response.ok) return false;
      const data = await response.json();
      if (data?.data?.sessionId) {
        saveSession(data.data.sessionId);
      }
      return true;
    } catch {
      return false;
    }
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
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

  const { requireAuth = true, throwOnError = false, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(fetchOptions.body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(fetchOptions.headers as Record<string, string> || {}),
  };

  const timeoutMs = isServer ? 1500 : 10000;
  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  const signal = fetchOptions.signal ?? timeoutSignal;

  const makeRequest = () =>
    fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
      credentials: "include", // sends HttpOnly cookies
      signal,
    });

  try {
    let response = await makeRequest();

    // Handle 401: try refresh once, then retry (only in browser)
    if (response.status === 401 && requireAuth && !isServer) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        response = await makeRequest();
      }
    }

    if (!response.ok) {
      const [kind, defaultMsg] = statusMessages[response.status] ?? ["server", "The service is temporarily unavailable."];
      const retry = response.headers.get("Retry-After");
      const retryAfter = retry && /^\d+$/.test(retry) ? Number(retry) : null;
      
      let errMsg = defaultMsg;
      try {
        const errorJson = await response.json();
        if (errorJson?.message) errMsg = errorJson.message;
      } catch {
        // ignore json parse error on error response
      }

      if (throwOnError) {
        throw new ApiError(kind, errMsg, response.status, retryAfter);
      }
      return null;
    }

    if (response.status === 204) return null;

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
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