"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FarmtryBrand } from "@/features/landing/components/farmtry-brand";
import { buyerAuthContracts } from "./contracts";
import { emptyValues, passwordChecks, validateAuth, type AuthScreen, type AuthValues, type FieldErrors } from "./validation";

const asset = (name: string) => `/figma/buyer-auth/${name}`;
function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <img src={asset(name)} alt="" className={`buyer-auth-icon ${className}`} />;
}

function BrandPanel({ screen }: { screen: AuthScreen }) {
  const recovery = screen === "recovery";
  const login = screen === "login";
  const reset = screen === "reset";
  const standardFeatures = ["Verified Suppliers", "Quality Assurance", "Reliable Deliveries", "Transparent Transactions"];
  const features = login ? ["Browse & Order Produce", "Track Shipments", "Manage Suppliers", "View Invoices & Reports"] : reset ? ["Minimum 8 characters", "Alphanumeric & special symbols", "Multi-device session revocation", "Biometric & passkey support"] : recovery ? ["Two-Factor Verification", "Encrypted Recovery Tokens", "Instant SMS & Email Alerts", "Zero-Downtime Reconnection"] : standardFeatures;
  return <aside className="buyer-auth-panel">
    <div className="buyer-auth-panel-content">
      <div className="buyer-auth-brand"><div className="buyer-auth-desktop-brand"><FarmtryBrand /><p>CORPORATE BUYER</p></div><div className="buyer-auth-mobile-brand"><span><Icon name="d4b0a.svg" /></span><div><strong>Farmtry</strong><p>CORPORATE BUYER</p></div></div></div>
      <div className="buyer-auth-desktop-story">
        <h2>{login ? <>Welcome back,<br /><em>Corporate Buyer.</em></> : reset ? <>Set a new<br /><em>secure password.</em></> : recovery ? <>Account Recovery &amp;<br /><em>Access Security.</em></> : <>Fresh produce,<br /><em>real impact.</em></>}</h2>
        <p className="buyer-auth-story-copy">{login ? "Access your dashboard, manage orders, track deliveries and stay updated on your supply chain." : reset ? "Protect your agricultural trade transactions, orders, and company profile with an enterprise-grade passphrase." : recovery ? "Protecting enterprise buyers and administrative accounts across our unified agricultural supply chain ecosystem." : "Source quality agricultural produce, streamline your supply chain and support local farmers."}</p>
        <ul>{features.map((feature, index) => <li key={feature}><Icon name={login ? ["36ee2.svg", "4f0ff.svg", "a4e53.svg", "48188.svg"][index] : reset ? "22214.svg" : recovery ? "09efb.svg" : "cfb3e.svg"} />{feature}</li>)}</ul>
        {screen !== "register" && <p className="buyer-auth-panel-note">Preview of planned account features. Services are not yet available.</p>}
      </div>
      {<div className="buyer-auth-mobile-story"><h2>{reset ? <>Set a new<br />secure password.</> : <>Fresh produce,<br /><em>real impact.</em></>}</h2><p className="buyer-auth-story-copy">{reset ? "Protect your agricultural trade transactions, orders, and company profile with an enterprise-grade passphrase." : "Source quality agricultural produce, streamline your supply chain and support local farmers."}</p><ul>{(reset ? features : standardFeatures).map(feature => <li key={feature}><Icon name="695d6.svg" />{feature === "Transparent Transactions" ? "Transparent Deals" : feature}</li>)}</ul>{reset && <p className="buyer-auth-panel-note">Planned features; account services are not yet available.</p>}</div>}
      {login && <><div className="buyer-auth-workspace"><img src={asset("3870e.png")} alt="Corporate procurement officer viewing the marketplace on a laptop" /></div><p className="buyer-auth-panel-foot"><Icon name="3c020.svg" />Safe · Reliable · Sustainable</p></>}
      {recovery && <div className="buyer-auth-logistics"><img src={asset("be3ba.png")} alt="Agricultural logistics and warehouse operations" /><span>Enterprise Security Gateway</span></div>}
      {recovery && <p className="buyer-auth-panel-foot"><Icon name="43d4e.svg" /> Safe · Reliable · Sustainable</p>}
    </div>
    {<div className="buyer-auth-tomatoes"><img src={asset("18922.png")} alt="Fresh tomatoes in a wooden crate on farmland" /></div>}
  </aside>;
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: ReactNode; eyeAsset?: string; mobileEyeAsset?: string };
function Field({ label, error, hint, id, type, eyeAsset = "c4d2d.svg", mobileEyeAsset = eyeAsset, ...props }: FieldProps) {
  const [visible, setVisible] = useState(false);
  const password = type === "password";
  return <div className="buyer-auth-field">
    <div className="buyer-auth-label-row"><label htmlFor={id}>{label}</label>{hint && <span>{hint}</span>}</div>
    <div className="buyer-auth-input-wrap"><input {...props} id={id} type={password && visible ? "text" : type} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} />{password && <button type="button" className="buyer-auth-eye" aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`} aria-pressed={visible} onClick={() => setVisible(!visible)}><picture><source media="(max-width: 767px)" srcSet={asset(mobileEyeAsset)} /><img src={asset(eyeAsset)} alt="" className="buyer-auth-icon" /></picture></button>}</div>
    {error && <p id={`${id}-error`} className="buyer-auth-error">{error}</p>}
  </div>;
}

export function BuyerAuthPage({ screen }: { screen: AuthScreen }) {
  const [values, setValues] = useState<AuthValues>({ ...emptyValues });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [method, setMethod] = useState<"email" | "sms">("email");
  const [checked, setChecked] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const register = screen === "register";
  const login = screen === "login";
  const reset = screen === "reset";
  const checks = passwordChecks(values.password);
  const change = (field: keyof AuthValues, value: string) => {
    setValues(previous => ({ ...previous, [field]: value }));
    setErrors(previous => ({ ...previous, [field]: undefined }));
    setChecked(false);
  };
  function checkDetails(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validateAuth(screen, values, method);
    setErrors(nextErrors);
    setChecked(Object.keys(nextErrors).length === 0);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) form.current?.querySelector<HTMLInputElement>(`#auth-${firstError}`)?.focus();
  }
  return <div className={`farmtry-site buyer-auth buyer-auth-${screen}`}>
    {<header className="buyer-auth-mobile-header"><Link href="/"><Icon name="cccdf.svg" />Back to Home</Link><FarmtryBrand /></header>}
    <main className="buyer-auth-shell">
      <BrandPanel screen={screen} />
      <section className="buyer-auth-main" aria-labelledby="buyer-auth-title">
        <Link className="buyer-auth-back" href={register || login ? "/" : "/preview/buyer-login"}><Icon name={login ? "5f93d.svg" : "da276.svg"} />Back to {register || login ? "Home" : "Login"}</Link>
        <div className="buyer-auth-form-area">
          <h1 id="buyer-auth-title">{login ? "Corporate Buyer Login" : register ? "Create Corporate Buyer Account" : reset ? "Reset Password" : "Forgot Password?"}</h1>
          <p className="buyer-auth-intro">{login ? "Enter your details to access your account." : register ? "Join Farmtry and gain access to fresh produce from verified suppliers." : reset ? "Enter a 6-digit verification code and choose your new password. No recovery code has been sent in this preview." : "Recover access using your registered corporate or admin email address, or your Nigerian mobile number."}</p>
          <p className="buyer-auth-preview" id="auth-preview">Preview only. You can check details locally. {login ? "Sign-in is" : register ? "Account creation is" : reset ? "Code verification and password changes are" : "Recovery messages are"} not available yet. Nothing is sent or saved.</p>
          <form ref={form} onSubmit={checkDetails} noValidate aria-describedby="auth-preview" data-contract-status={buyerAuthContracts[login ? "login" : register ? "register" : reset ? "resetPassword" : "recover"].status}>
            {register && <Field id="auth-company" label="Company name" placeholder="e.g. Grand Cereals Ltd" autoComplete="organization" value={values.company} onChange={e => change("company", e.target.value)} error={errors.company} />}
            {screen === "recovery" && <fieldset className="buyer-auth-method"><legend>Recovery method</legend><div>{(["email", "sms"] as const).map(option => <label key={option}><input type="radio" name="recovery-method" value={option} checked={method === option} onChange={() => { setMethod(option); setErrors({}); setChecked(false); }} /><span><Icon name={option === "email" ? "3e027.svg" : "cc625.svg"} />{option === "email" ? "Email" : "SMS"}</span></label>)}</div></fieldset>}
            {(register || login || (screen === "recovery" && method === "email")) && <Field id="auth-email" label={register ? "Business email" : "Email address"} type="email" autoComplete="email" placeholder={register ? "procurement@company.com" : "you@company.com"} value={values.email} onChange={e => change("email", e.target.value)} error={errors.email} />}
            {(register || (screen === "recovery" && method === "sms")) && <Field id="auth-phone" label="Phone number" hint="Nigerian (+234)" type="tel" autoComplete="tel" placeholder="+234 801 234 5678" value={values.phone} onChange={e => change("phone", e.target.value)} error={errors.phone} />}
            {reset && <><Field id="auth-code" label="Verification code" type="text" inputMode="numeric" autoComplete="off" maxLength={6} placeholder="000000" className="buyer-auth-code" value={values.code} onChange={e => change("code", e.target.value.replace(/\D/g, "").slice(0, 6))} error={errors.code} /><div className="buyer-auth-resend"><span>No code sent in this preview</span><button type="button" disabled>Resend code</button></div></>}
            {screen !== "recovery" && <Field eyeAsset={reset ? "572dc.svg" : "c4d2d.svg"} mobileEyeAsset={register ? "a6f4f.svg" : reset ? "572dc.svg" : "c4d2d.svg"} id="auth-password" label={reset ? "New password" : "Password"} type="password" autoComplete={login ? "current-password" : "new-password"} placeholder={login ? "Enter your password" : "Create a strong password"} value={values.password} onChange={e => change("password", e.target.value)} error={errors.password} />}
            {(register || reset) && <ul className="buyer-auth-password-rules" aria-label="Password format requirements">{([['length', 'At least 8 characters'], ['number', 'Contains a number'], ['symbol', 'Special symbol']] as const).map(([key, label]) => <li key={key} data-met={checks[key]}><span aria-hidden="true">{checks[key] ? "✓" : "○"}</span>{label}<span className="sr-only">{checks[key] ? ": met" : ": not met"}</span></li>)}</ul>}
            {reset && <Field eyeAsset="572dc.svg" hint={values.confirmation && values.confirmation === values.password ? <span className="buyer-auth-match"><Icon name="48164.svg" />Passwords match</span> : undefined} id="auth-confirmation" label="Confirm new password" type="password" autoComplete="new-password" placeholder="Re-enter your new password" value={values.confirmation} onChange={e => change("confirmation", e.target.value)} error={errors.confirmation} />}
            {login && <div className="buyer-auth-options"><label><input type="checkbox" disabled aria-describedby="auth-preview" />Remember me</label><Link href="/preview/recovery">Forgot password?</Link></div>}
            <Button type="submit" className="buyer-auth-check" variant="secondary">Check details locally</Button>
            <div role="status" className="buyer-auth-status">{checked ? `Format checks passed. ${login ? "Your credentials have not been authenticated. You are not signed in." : reset ? "The code has not been verified and your password has not changed." : register ? "No account has been created." : "No recovery message has been sent."}` : ""}</div>
            <Button disabled className="buyer-auth-submit" aria-describedby="auth-preview">{login ? "Log In" : register ? "Create Account" : reset ? "Update Password & Sign In" : "Send Recovery Code"}</Button>
          </form>
          {register || login ? <><div className="buyer-auth-divider"><span>{login ? "Or continue with" : "Or sign up with"}</span></div><Button className="buyer-auth-google" variant="secondary" disabled aria-describedby="auth-preview"><picture><source media="(max-width: 767px)" srcSet={asset(register ? "004af.svg" : "b5051.svg")} /><img src={asset("b5051.svg")} alt="" className="buyer-auth-icon" /></picture>Continue with Google</Button></> : screen === "recovery" ? <Card className="buyer-auth-support"><Icon name="82d09.svg" /><p>If you no longer have access to your email or phone, <Link href="/preview/support">contact platform admin support</Link>.</p></Card> : <p className="buyer-auth-help">Having trouble? <Link href="/preview/support">Contact the security team</Link></p>}
          <p className="buyer-auth-account-link">{login ? "Don’t have an account?" : register ? "Already have an account?" : "Remember your password?"} <Link href={login ? "/preview/buyer-register" : "/preview/buyer-login"}>{login ? "Create Buyer Account" : "Log in"}</Link></p>
          <nav className="buyer-auth-preview-nav" aria-label="Account screen previews"><span>Explore previews</span>{!register && <Link href="/preview/buyer-register">Sign up</Link>}{screen !== "recovery" && <Link href="/preview/recovery">Recovery</Link>}{!reset && <Link href="/preview/buyer-reset">Password reset</Link>}</nav>
        </div>
        <p className="buyer-auth-footer">Farmtry account preview · Details stay on this page</p>
      </section>
    </main>
  </div>;
}
