import { clearSession, currentSession, FarmtryError, record, refreshSession, request, saveSession, string } from "./client";

export async function login(emailOrPhone: string, password: string) {
  const result = await request("/auth/login", value => { const data = record(value); return { user: record(data.user), sessionId: string(data.sessionId) }; }, { body: { emailOrPhone: emailOrPhone.trim(), password } });
  saveSession(result.sessionId);
  return result.user;
}
export async function logout() {
  if (!currentSession()) await refreshSession();
  await request("/auth/logout", () => undefined, { body: { sessionId: currentSession() } });
  clearSession();
}
export const forgotPassword = (contact: { email: string } | { phone: string }) => request("/auth/forgot-password", () => undefined, { body: contact });
export async function resetPassword(token: string, newPassword: string) {
  if (!/^[a-f\d]{64}$/i.test(token)) throw new FarmtryError("validation", "Open the complete recovery link sent to your email or phone.");
  if (newPassword.length < 8) throw new FarmtryError("validation", "Use at least 8 characters for your new password.");
  await request("/auth/reset-password", () => undefined, { body: { token, newPassword } });
  clearSession();
}
export async function verifyOtp(email: string, code: string) {
  await request("/auth/verify-otp", value => { const data = record(value); record(data.user); string(record(data.token).accessToken); return undefined; }, { body: { email, code } });
  // Verification does not supply sessionId. Require cookie login before entering the workspace.
}
export const resendOtp = (email: string) => request("/auth/resend-otp", () => undefined, { body: { email } });
export type AggregatorRegistration = { fullName: string; email: string; password: string; phone: string; zone: string; governmentIdType: "nin" | "drivers-license" | "intl_passport"; governmentIdNumber?: string; governmentIdPhotoUrl: string; guarantorPhone: string };
export const registerAggregator = (input: AggregatorRegistration) => request("/auth/aggregator/register", value => { const data = record(value); string(data.userId); string(data.fullName); string(data.email); string(data.role); string(data.status); record(data.aggregator); return undefined; }, { body: input });
