import { pendingContract } from "@/lib/integration/page-requirements";

/** Deliberately no callable transport or invented request/response DTOs. */
export const buyerAuthContracts = {
  login: { ...pendingContract },
  register: { ...pendingContract },
  googleSignIn: { ...pendingContract },
  recover: { ...pendingContract },
  verifyResetCode: { ...pendingContract },
  resendCode: { ...pendingContract },
  resetPassword: { ...pendingContract },
} as const;
