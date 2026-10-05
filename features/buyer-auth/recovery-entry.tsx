"use client";
import { useEffect, useState } from "react";
import { BuyerAuthPage } from "./buyer-auth-page";
export function RecoveryEntry() {
  const [reset, setReset] = useState<boolean | null>(null);
  useEffect(() => { setReset(new URLSearchParams(window.location.search).has("token")); }, []);
  if (reset === null) return <main className="p-8" role="status">Opening account recovery…</main>;
  return <BuyerAuthPage screen={reset ? "reset" : "recovery"} />;
}
