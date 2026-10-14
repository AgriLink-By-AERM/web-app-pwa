/** Local preview values only; these are not backend request schemas. */
export type AuthScreen = "register" | "login" | "recovery" | "reset";
export type AuthValues = { company: string; fullName: string; organizationType: string; contactPerson: string; address: string; zone: string; businessRegNumber: string; email: string; phone: string; password: string; confirmation: string; code: string };
export type FieldErrors = Partial<Record<keyof AuthValues, string>>;
export const emptyValues: AuthValues = { company: "", fullName: "", organizationType: "processor", contactPerson: "", address: "", zone: "", businessRegNumber: "", email: "", phone: "", password: "", confirmation: "", code: "" };
export function passwordChecks(password: string) {
  return { length: password.length >= 8, number: /[0-9]/.test(password), symbol: /[^a-zA-Z0-9\s]/.test(password) };
}
export function validateAuth(screen: AuthScreen, values: AuthValues, method: "email" | "sms" = "email"): FieldErrors {
  const errors: FieldErrors = {};
  if (screen === "register" && !values.company.trim()) errors.company = "Enter your company name.";
  if (screen === "register" || screen === "login" || ((screen === "recovery" || screen === "reset") && method === "email")) {
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim());
    const validPhoneLogin = screen === "login" && /^(?:\+234|234|0)[789][01]\d{8}$/.test(values.email.trim());
    if (!validEmail && !validPhoneLogin) errors.email = screen === "login" ? "Enter a valid email address or Nigerian phone number." : "Enter a valid email address.";
  }
  if (screen === "register" || ((screen === "recovery" || screen === "reset") && method === "sms")) {
    if (!/^(?:\+234|0)[789][01]\d{8}$/.test(values.phone.replace(/[\s()-]/g, ""))) errors.phone = "Enter a Nigerian mobile number, such as +234 801 234 5678.";
  }
  // Existing credentials must not be rejected by provisional signup policy.
  if (screen === "login" && !values.password) errors.password = "Enter your password.";
  if (screen === "register") {
    for (const field of ["fullName", "contactPerson", "address", "zone", "businessRegNumber"] as const) if (!values[field].trim()) errors[field] = "This detail is required.";
    if (!["factory", "restaurant", "processor", "exporter", "other"].includes(values.organizationType)) errors.organizationType = "Choose an organization type.";
    if (!Object.values(passwordChecks(values.password)).every(Boolean)) errors.password = "Use at least 8 characters, including a number and a special symbol.";
  }
  if (screen === "reset") {
    if (!/^\d{6}$/.test(values.code)) errors.code = "Enter the six-digit recovery code.";
    if (values.password.length < 8) errors.password = "Use at least 8 characters for your new password.";
    if (!values.confirmation || values.confirmation !== values.password) errors.confirmation = "The passwords must match.";
  }
  return errors;
}
