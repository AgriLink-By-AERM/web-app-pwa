/** Local preview values only; these are not backend request schemas. */
export type AuthScreen = "register" | "login" | "recovery" | "reset";
export type AuthValues = { company: string; email: string; phone: string; password: string; confirmation: string; code: string };
export type FieldErrors = Partial<Record<keyof AuthValues, string>>;
export const emptyValues: AuthValues = { company: "", email: "", phone: "", password: "", confirmation: "", code: "" };
export function passwordChecks(password: string) {
  return { length: password.length >= 8, number: /[0-9]/.test(password), symbol: /[^a-zA-Z0-9\s]/.test(password) };
}
export function validateAuth(screen: AuthScreen, values: AuthValues, method: "email" | "sms" = "email"): FieldErrors {
  const errors: FieldErrors = {};
  if (screen === "register" && !values.company.trim()) errors.company = "Enter your company name.";
  if (screen === "register" || screen === "login" || (screen === "recovery" && method === "email")) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Enter a valid email address.";
  }
  if (screen === "register" || (screen === "recovery" && method === "sms")) {
    if (!/^(?:\+234|0)[789][01]\d{8}$/.test(values.phone.replace(/[\s()-]/g, ""))) errors.phone = "Enter a Nigerian mobile number, such as +234 801 234 5678.";
  }
  // Existing credentials must not be rejected by provisional signup policy.
  if (screen === "login" && !values.password) errors.password = "Enter your password.";
  if (screen === "register" || screen === "reset") {
    if (!Object.values(passwordChecks(values.password)).every(Boolean)) errors.password = "Use at least 8 characters, including a number and a special symbol.";
  }
  if (screen === "reset") {
    if (!/^\d{6}$/.test(values.code)) errors.code = "Enter a 6-digit code. This preview checks its format only.";
    if (!values.confirmation || values.confirmation !== values.password) errors.confirmation = "The passwords must match.";
  }
  return errors;
}
