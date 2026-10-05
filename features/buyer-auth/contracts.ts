import { pendingContract } from "@/lib/integration/page-requirements";

/** Supplied v1 handoff covers shared login/recovery; buyer signup and OAuth are still unspecified. */
export const buyerAuthContracts = {
  login: { status: "specified", method: "POST", endpoint: "/auth/login" },
  register: { ...pendingContract },
  googleSignIn: { ...pendingContract },
  recover: { status: "specified", method: "POST", endpoint: "/auth/forgot-password" },
  verifyResetCode: { ...pendingContract },
  resendCode: { ...pendingContract },
  resetPassword: { status: "specified", method: "POST", endpoint: "/auth/reset-password" },
} as const;
