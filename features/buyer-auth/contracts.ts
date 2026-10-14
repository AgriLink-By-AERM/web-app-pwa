import { pendingContract } from "@/lib/integration/page-requirements";

/** Updated 2026-10-14 handoff. A specified contract does not imply UI integration is complete. */
export const buyerAuthContracts = {
  login: { status: "specified", method: "POST", endpoint: "/auth/login" },
  register: { status: "specified", method: "POST", endpoint: "/buyer/register" },
  googleSignIn: { ...pendingContract },
  recover: { status: "specified", method: "POST", endpoint: "/auth/forgot-password" },
  verifyResetCode: { ...pendingContract },
  resendCode: { ...pendingContract },
  resetPassword: { status: "specified", method: "POST", endpoint: "/auth/reset-password" },
} as const;
