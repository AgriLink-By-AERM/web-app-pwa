"use client";
import Link from "next/link";
import { useRef, useState, type ReactNode, type InputHTMLAttributes } from "react";
import { FarmtryBrand } from "@/features/landing/components/farmtry-brand";
import { errorMessage } from "@/lib/api-client";
export function CoreShell({ title, children }: { title: string; children: ReactNode }) { return <div className="core-site"><header><FarmtryBrand /><Link href="/">Home</Link><Link href="/preview/aggregator-login">Sign in</Link></header><main><h1>{title}</h1>{children}</main></div>; }
export function CoreField({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) { return <label className="core-field"><span>{label}</span><input {...props} /></label>; }
export function useCoreAction() {
  const lock = useRef(false); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  async function run(action: () => Promise<void>) { if (lock.current) return; lock.current = true; setBusy(true); setError(""); try { await action(); } catch (err) { setError(errorMessage(err)); } finally { lock.current = false; setBusy(false); } }
  return { busy, error, run };
}
export function ActionError({ message }: { message: string }) { return message ? <p role="alert" className="core-error">{message}</p> : null; }
