export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('agrilink_token');
  }
  return null;
}

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('agrilink_token', token);
    document.cookie = `agrilink_token=${token}; path=/; max-age=86400; SameSite=Lax`;
  }
}

export function setAuthUser(user: unknown): void {
  if (typeof window !== 'undefined') {
    const serializedUser = JSON.stringify(user);
    localStorage.setItem('agrilink_user', serializedUser);
    document.cookie = `agrilink_user=${encodeURIComponent(serializedUser)}; path=/; max-age=86400; SameSite=Lax`;
  }
}

export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('agrilink_token');
    localStorage.removeItem('agrilink_user');
    document.cookie = 'agrilink_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'agrilink_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (error) {
    // Network error (e.g. connection refused during SSR or build)
    return null;
  }

  if (!response.ok) {
    // We can also return null here to trigger the fallback mechanisms in store.ts
    // instead of throwing, which crashes Next.js SSR.
    return null;
  }

  // Not all endpoints return JSON, but most do.
  if (response.status !== 204) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }
  
  return null;
}
