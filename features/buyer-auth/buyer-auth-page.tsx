"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { forgotPassword, login as signIn, logout, resetPassword } from "@/lib/farmtry/auth";
import { errorMessage, FarmtryError } from "@/lib/farmtry/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FarmtryBrand } from "@/features/landing/components/farmtry-brand";
import { buyerAuthContracts } from "./contracts";
import { emptyValues, passwordChecks, validateAuth, type AuthScreen, type AuthValues, type FieldErrors } from "./validation";

const asset = (name: string) => `/figma/buyer-auth/${name}`;
function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <img src={asset(name)} alt="" className={`buyer-auth-icon ${className}`} />;
}

function BrandPanel({ screen, audience }: { screen: AuthScreen; audience: "buyer" | "aggregator" }) {
  const recovery = screen === "recovery";
  const login = screen === "login";
  const reset = screen === "reset";
  const standardFeatures = ["Verified Suppliers", "Quality Assurance", "Reliable Deliveries", "Transparent Transactions"];
  const features = login ? audience === "aggregator" ? ["View Your Field Records", "Track Verification", "Log Produce & Waste", "Report Log Issues"] : ["Browse & Order Produce", "Track Shipments", "Manage Suppliers", "View Invoices & Reports"] : reset ? ["Minimum 8 characters", "Recovery links expire in 60 minutes", "Previous sessions are revoked", "Sign in again after resetting"] : recovery ? ["Email or phone recovery", "Single-use recovery link", "60-minute link expiry", "Your account stays private"] : standardFeatures;
  return <aside className="buyer-auth-panel">
    <div className="buyer-auth-panel-content">
      <div className="buyer-auth-brand"><div className="buyer-auth-desktop-brand"><FarmtryBrand /><p>{audience === "aggregator" ? "AGGREGATOR" : "CORPORATE BUYER"}</p></div><div className="buyer-auth-mobile-brand"><span><Icon name="d4b0a.svg" /></span><div><strong>Farmtry</strong><p>{audience === "aggregator" ? "AGGREGATOR" : "CORPORATE BUYER"}</p></div></div></div>
      <div className="buyer-auth-desktop-story">
        <h2>{login ? <>Welcome back,<br /><em>{audience === "aggregator" ? "Aggregator." : "Corporate Buyer."}</em></> : reset ? <>Set a new<br /><em>secure password.</em></> : recovery ? <>Account Recovery &amp;<br /><em>Access Security.</em></> : <>Fresh produce,<br /><em>real impact.</em></>}</h2>
        <p className="buyer-auth-story-copy">{login ? "Access your dashboard, manage orders, track deliveries and stay updated on your supply chain." : reset ? "Protect your agricultural trade transactions, orders, and company profile with an enterprise-grade passphrase." : recovery ? "Protecting enterprise buyers and administrative accounts across our unified agricultural supply chain ecosystem." : "Source quality agricultural produce, streamline your supply chain and support local farmers."}</p>
        <ul>{features.map((feature, index) => <li key={feature}><Icon name={login ? ["36ee2.svg", "4f0ff.svg", "a4e53.svg", "48188.svg"][index] : reset ? "22214.svg" : recovery ? "09efb.svg" : "cfb3e.svg"} />{feature}</li>)}</ul>
        {screen !== "register" && <p className="buyer-auth-panel-note">Sign-in and recovery are available. Other workspace features are still being prepared.</p>}
      </div>
      {<div className="buyer-auth-mobile-story"><h2>{reset ? <>Set a new<br />secure password.</> : <>Fresh produce,<br /><em>real impact.</em></>}</h2><p className="buyer-auth-story-copy">{reset ? "Protect your agricultural trade transactions, orders, and company profile with an enterprise-grade passphrase." : "Source quality agricultural produce, streamline your supply chain and support local farmers."}</p><ul>{(reset ? features : standardFeatures).map(feature => <li key={feature}><Icon name="695d6.svg" />{feature === "Transparent Transactions" ? "Transparent Deals" : feature}</li>)}</ul>{reset && <p className="buyer-auth-panel-note">Password recovery uses the link sent to your registered contact.</p>}</div>}
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

export function BuyerAuthPage({ screen, audience = "buyer" }: { screen: AuthScreen; audience?: "buyer" | "aggregator" }) {
  const router = useRouter();
  const [values, setValues] = useState<AuthValues>({ ...emptyValues });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [method, setMethod] = useState<"email" | "sms">("email");
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [failure, setFailure] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [completed, setCompleted] = useState(false);
  const inFlight = useRef(false);
  const tokenRead = useRef(false);
  const form = useRef<HTMLFormElement>(null);
  const register = screen === "register";
  const login = screen === "login";
  const reset = screen === "reset";
  const checks = passwordChecks(values.password);
  useEffect(() => {
    if (screen !== "reset" || tokenRead.current) return;
    tokenRead.current = true;
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token") || "";
    setValues(current => ({ ...current, token }));
    // The recovery secret stays in memory and is removed from history before leaving the page.
    if (url.searchParams.has("token")) { url.searchParams.delete("token"); window.history.replaceState(null, "", url.pathname + url.search + url.hash); }
  }, [screen]);
  const change = (field: keyof AuthValues, value: string) => {
    setValues(previous => ({ ...previous, [field]: value }));
    setErrors(previous => ({ ...previous, [field]: undefined }));
    setChecked(false);
    setFailure("");
  };
  function checkDetails(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validateAuth(screen, values, method);
    setErrors(nextErrors);
    setChecked(Object.keys(nextErrors).length === 0);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) form.current?.querySelector<HTMLInputElement>(`#auth-${firstError}`)?.focus();
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (register) { checkDetails(event); return; }
    if (inFlight.current) return;
    const nextErrors = validateAuth(screen, values, method);
    setErrors(nextErrors); setFailure(""); setNotice("");
    if (Object.keys(nextErrors).length) { form.current?.querySelector<HTMLInputElement>(`#auth-${Object.keys(nextErrors)[0]}`)?.focus(); return; }
    inFlight.current = true; setBusy(true);
    try {
      if (login) {
        const user = await signIn(values.email, values.password);
        setValues(current => ({ ...current, password: "" }));
        setSignedIn(true); setNotice("You are signed in. Your account session has been confirmed.");
        if (user.role === "aggregator") router.push("/preview/aggregator");
      } else if (reset) {
        await resetPassword(values.token, values.password);
        setValues({ ...emptyValues }); setCompleted(true);
        setNotice("Password reset successfully. Your previous sessions have been invalidated. Please sign in again.");
      } else {
        await forgotPassword(method === "email" ? { email: values.email.trim() } : { phone: values.phone.replace(/[\s()-]/g, "") });
        setCompleted(true); setNotice("If an account exists for that contact, a password reset link has been sent.");
      }
    } catch (error) {
      setFailure(login && error instanceof FarmtryError && error.status === 401 ? "Sign-in was not accepted. Check your credentials and try again." : reset && error instanceof FarmtryError && error.status === 400 ? "This recovery link is invalid or expired. Request a new recovery link." : errorMessage(error));
    } finally { inFlight.current = false; setBusy(false); }
  }
  return <div className={`farmtry-site buyer-auth buyer-auth-${screen}`}>
    {<header className="buyer-auth-mobile-header"><Link href="/"><Icon name="cccdf.svg" />Back to Home</Link><FarmtryBrand /></header>}
    <main className="buyer-auth-shell">
      <BrandPanel screen={screen} audience={audience} />
      <section className="buyer-auth-main" aria-labelledby="buyer-auth-title">
        <Link className="buyer-auth-back" href={register || login ? "/" : "/preview/buyer-login"}><Icon name={login ? "5f93d.svg" : "da276.svg"} />Back to {register || login ? "Home" : "Login"}</Link>
        <div className="buyer-auth-form-area">
          <h1 id="buyer-auth-title">{login ? audience === "aggregator" ? "Aggregator Login" : "Corporate Buyer Login" : register ? "Create Corporate Buyer Account" : reset ? "Reset Password" : "Forgot Password?"}</h1>
          <p className="buyer-auth-intro">{login ? "Enter your details to access your account." : register ? "Join Farmtry and gain access to fresh produce from verified suppliers." : reset ? "Choose a new password using the recovery link you received." : "Recover access using your registered email address or Nigerian mobile number."}</p>
          <p className="buyer-auth-preview" id="auth-preview">{register ? "Buyer registration is awaiting its service specification. You can check details locally; no account is created." : reset ? "Your recovery link can be used once and expires after 60 minutes. Resetting your password signs out previous sessions." : login ? "Sign in with an existing Farmtry account. Google sign-in and remember me are not yet available." : "We will send a recovery link if an account exists for the contact you provide."}</p>
          <form ref={form} onSubmit={submit} noValidate aria-describedby="auth-preview" aria-busy={busy} data-contract-status={buyerAuthContracts[login ? "login" : register ? "register" : reset ? "resetPassword" : "recover"].status}>
            <fieldset disabled={busy || signedIn || completed} className="buyer-auth-live-fields">
            {register && <Field id="auth-company" label="Company name" placeholder="e.g. Grand Cereals Ltd" autoComplete="organization" value={values.company} onChange={e => change("company", e.target.value)} error={errors.company} />}
            {screen === "recovery" && <fieldset className="buyer-auth-method"><legend>Recovery method</legend><div>{(["email", "sms"] as const).map(option => <label key={option}><input type="radio" name="recovery-method" value={option} checked={method === option} onChange={() => { setMethod(option); setErrors({}); setChecked(false); }} /><span><Icon name={option === "email" ? "3e027.svg" : "cc625.svg"} />{option === "email" ? "Email" : "SMS"}</span></label>)}</div></fieldset>}
            {(register || login || (screen === "recovery" && method === "email")) && <Field id="auth-email" label={register ? "Business email" : login ? "Email or phone" : "Email address"} type={login ? "text" : "email"} autoComplete={login ? "username" : "email"} placeholder={register ? "procurement@company.com" : "you@company.com"} value={values.email} onChange={e => change("email", e.target.value)} error={errors.email} />}
            {(register || (screen === "recovery" && method === "sms")) && <Field id="auth-phone" label="Phone number" hint="Nigerian (+234)" type="tel" autoComplete="tel" placeholder="+234 801 234 5678" value={values.phone} onChange={e => change("phone", e.target.value)} error={errors.phone} />}
            {reset && !/^[a-f\d]{64}$/i.test(values.token) && !completed && <p className="buyer-auth-error">Open the recovery link from your email or phone. <Link href="/recovery">Request a new link</Link>.</p>}
            {errors.token && <p role="alert" className="buyer-auth-error">{errors.token}</p>}
            {screen !== "recovery" && <Field eyeAsset={reset ? "572dc.svg" : "c4d2d.svg"} mobileEyeAsset={register ? "a6f4f.svg" : reset ? "572dc.svg" : "c4d2d.svg"} id="auth-password" label={reset ? "New password" : "Password"} type="password" autoComplete={login ? "current-password" : "new-password"} placeholder={login ? "Enter your password" : "Create a strong password"} value={values.password} onChange={e => change("password", e.target.value)} error={errors.password} />}
            {(register || reset) && <ul className="buyer-auth-password-rules" aria-label="Password format requirements">{([['length', 'At least 8 characters'], ['number', 'Contains a number'], ['symbol', 'Special symbol']] as const).filter(([key]) => !reset || key === "length").map(([key, label]) => <li key={key} data-met={checks[key]}><span aria-hidden="true">{checks[key] ? "✓" : "○"}</span>{label}<span className="sr-only">{checks[key] ? ": met" : ": not met"}</span></li>)}</ul>}
            {reset && <Field eyeAsset="572dc.svg" hint={values.confirmation && values.confirmation === values.password ? <span className="buyer-auth-match"><Icon name="48164.svg" />Passwords match</span> : undefined} id="auth-confirmation" label="Confirm new password" type="password" autoComplete="new-password" placeholder="Re-enter your new password" value={values.confirmation} onChange={e => change("confirmation", e.target.value)} error={errors.confirmation} />}
            {login && <div className="buyer-auth-options"><label><input type="checkbox" disabled aria-describedby="auth-preview" />Remember me</label><Link href="/preview/recovery">Forgot password?</Link></div>}
            {register && <Button type="submit" className="buyer-auth-check" variant="secondary">Check details locally</Button>}
            <div role="status" className="buyer-auth-status">{checked ? `Format checks passed. ${login ? "Your credentials have not been authenticated. You are not signed in." : reset ? "The code has not been verified and your password has not changed." : register ? "No account has been created." : "No recovery message has been sent."}` : ""}</div>
            <Button type="submit" disabled={register || busy || signedIn || completed || (reset && !/^[a-f\d]{64}$/i.test(values.token))} className="buyer-auth-submit" aria-describedby="auth-preview">{busy ? "Please wait…" : login ? "Log In" : register ? "Create Account" : reset ? "Update Password" : "Send Recovery Link"}</Button>
            </fieldset>
            {failure && <p role="alert" className="buyer-auth-error">{failure}</p>}
            {notice && <p role="status" className="buyer-auth-status">{notice}</p>}
            {completed && <Link className="buyer-auth-check" href="/preview/buyer-login">Back to sign in</Link>}
            {signedIn && <><p className="buyer-auth-intro">Buyer shopping and workspace services are still being prepared.</p><Button type="button" disabled={busy} onClick={async () => { setBusy(true); setFailure(""); try { await logout(); setSignedIn(false); setNotice("You have been signed out."); } catch(error) { setFailure(errorMessage(error)); } finally { setBusy(false); } }}>Sign out</Button></>}
          </form>
          {register || login ? <><div className="buyer-auth-divider"><span>{login ? "Or continue with" : "Or sign up with"}</span></div><Button className="buyer-auth-google" variant="secondary" disabled aria-describedby="auth-preview"><picture><source media="(max-width: 767px)" srcSet={asset(register ? "004af.svg" : "b5051.svg")} /><img src={asset("b5051.svg")} alt="" className="buyer-auth-icon" /></picture>Continue with Google</Button></> : screen === "recovery" ? <Card className="buyer-auth-support"><Icon name="82d09.svg" /><p>If you no longer have access to your email or phone, <Link href="/preview/support">contact platform admin support</Link>.</p></Card> : <p className="buyer-auth-help">Having trouble? <Link href="/preview/support">Contact the security team</Link></p>}
          <p className="buyer-auth-account-link">{login ? "Don’t have an account?" : register ? "Already have an account?" : "Remember your password?"} <Link href={login ? audience === "aggregator" ? "/preview/aggregator-register" : "/preview/buyer-register" : "/preview/buyer-login"}>{login ? audience === "aggregator" ? "Register as aggregator" : "Create Buyer Account" : "Log in"}</Link></p>
          <nav className="buyer-auth-preview-nav" aria-label="Account pages"><span>Account pages</span>{!register && <Link href={audience === "aggregator" ? "/preview/aggregator-register" : "/preview/buyer-register"}>Sign up</Link>}{screen !== "recovery" && <Link href="/preview/recovery">Recovery</Link>}{!reset && <Link href="/preview/buyer-reset">Password reset</Link>}</nav>
        </div>
        <p className="buyer-auth-footer">{register ? "Farmtry account preview · Details stay on this page" : "Farmtry account services"}</p>
      </section>
    </main>
  </div>;
}
