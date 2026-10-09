"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { resendOtp, verifyOtp } from "@/lib/farmtry/auth";
import { FarmtryError } from "@/lib/farmtry/client";
import { ActionError, CoreField, CoreShell, useCoreAction } from "./core-ui";
export function OtpVerification() {
  const action = useCoreAction(); const [email, setEmail] = useState(""); const [code, setCode] = useState(""); const [done, setDone] = useState(false); const [sent, setSent] = useState(false); const [remaining, setRemaining] = useState(0); const until = useRef(0);
  useEffect(() => { if (!remaining) return; const interval = setInterval(() => setRemaining(Math.max(0, Math.ceil((until.current - Date.now()) / 1000))), 1000); return () => clearInterval(interval); }, [remaining > 0]);
  function cooldown(seconds: number) { until.current = Date.now() + seconds * 1000; setRemaining(seconds); }
  return <CoreShell title="Verify your email"><Card className="core-card core-narrow">{done ? <div role="status"><h2>Email verified</h2><p>Sign in to start your session. Your registration may still need identity review.</p><Link href="/preview/aggregator-login" className="core-link">Sign in</Link></div> : <><p>Enter the email used for registration and the six-digit code you received.</p><form onSubmit={event => { event.preventDefault(); void action.run(async () => { await verifyOtp(email.trim(), code); setCode(""); setDone(true); }); }}><fieldset disabled={action.busy}><CoreField label="Email address" name="email" type="email" required autoComplete="email" value={email} onChange={event => { setEmail(event.target.value); setSent(false); }} /><CoreField label="Verification code" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={event => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} /><Button type="submit" className="core-primary" disabled={action.busy}>{action.busy ? "Please wait…" : "Verify email"}</Button></fieldset></form><Button variant="secondary" disabled={action.busy || remaining > 0 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())} onClick={() => void action.run(async () => { try { await resendOtp(email.trim()); setSent(true); cooldown(60); } catch (error) { if (error instanceof FarmtryError && error.status === 429) cooldown(error.retryAfter ?? 60); throw error; } })}>{remaining ? `Resend available in ${remaining}s` : "Resend code"}</Button>{sent && <p role="status">A new code has been requested. Check your email.</p>}</>}<ActionError message={action.error} /></Card></CoreShell>;
}
