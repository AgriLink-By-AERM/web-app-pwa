import {
  clearSession,
  currentSession,
  fetchApi,
  refreshAccessToken,
  saveSession,
  ApiError
} from '../api-client';

export interface AuthUser {
  id?: string;
  _id?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
  [key: string]: any;
}

export async function loginUser(emailOrPhone: string, password: string): Promise<AuthUser> {
  const result = await fetchApi<{
    success: boolean;
    data: { user: AuthUser; sessionId: string };
  }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ emailOrPhone: emailOrPhone.trim(), password }),
    requireAuth: false,
    throwOnError: true,
  });

  if (result?.data?.sessionId) {
    saveSession(result.data.sessionId);
  }

  return result?.data?.user ?? (result?.data as unknown as AuthUser) ?? {};
}

export async function logoutUser(sessionId?: string): Promise<void> {
  const id = sessionId || currentSession();
  try {
    await fetchApi('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ sessionId: id }),
      requireAuth: true,
      throwOnError: true,
    });
  } finally {
    clearSession();
  }
}

export type OtpContact = { email?: string; phone?: string };

export async function verifyOtp(
  contact: string | OtpContact,
  code: string
): Promise<{ success: boolean; message?: string }> {
  const payload =
    typeof contact === 'string'
      ? contact.includes('@')
        ? { email: contact.trim(), code: code.trim() }
        : { phone: contact.trim(), code: code.trim() }
      : { ...contact, code: code.trim() };

  const result = await fetchApi('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify(payload),
    requireAuth: false,
    throwOnError: true,
  });

  return { success: true, message: result?.message };
}

export async function resendOtp(
  contact: string | OtpContact
): Promise<{ success: boolean; message?: string }> {
  const payload =
    typeof contact === 'string'
      ? contact.includes('@')
        ? { email: contact.trim() }
        : { phone: contact.trim() }
      : contact;

  const result = await fetchApi('/auth/resend-otp', {
    method: 'POST',
    body: JSON.stringify(payload),
    requireAuth: false,
    throwOnError: true,
  });

  return { success: true, message: result?.message };
}

export async function forgotPassword(
  contact: string | OtpContact
): Promise<{ success: boolean; message?: string }> {
  const payload =
    typeof contact === 'string'
      ? contact.includes('@')
        ? { email: contact.trim() }
        : { phone: contact.trim() }
      : contact;

  const result = await fetchApi('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(payload),
    requireAuth: false,
    throwOnError: true,
  });

  return { success: true, message: result?.message };
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{ success: boolean; message?: string }> {
  if (!/^[a-f\d]{64}$/i.test(token.trim())) {
    throw new ApiError('validation', 'Open the complete recovery link sent to your email or phone.');
  }
  if (newPassword.length < 8) {
    throw new ApiError('validation', 'Use at least 8 characters for your new password.');
  }

  const result = await fetchApi('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token: token.trim(), newPassword }),
    requireAuth: false,
    throwOnError: true,
  });

  clearSession();
  return { success: true, message: result?.message };
}

export async function getSession() {
  return fetchApi('/auth/session', {
    method: 'GET',
    requireAuth: true,
  });
}

// Named aliases for clean consumption across components
export const login = loginUser;
export const logout = logoutUser;

