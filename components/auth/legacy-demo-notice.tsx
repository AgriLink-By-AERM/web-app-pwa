"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function LegacyDemoNotice() {
  const path = usePathname();
  if (["/admin","/buyer/dashboard","/buyer/history","/buyer/settings","/dealer/home","/dealer/profile","/dealer/redeem","/dealer/redeem/confirm","/dealer/redeem/success","/dealer/history","/dealer/register"].includes(path.replace(/\/$/,""))) return null;
  if (!/^\/(aggregator|buyer|dealer|admin)(\/|$)/.test(path)) return null;
  return <aside role="note" className="relative z-50 border-b border-amber-300 bg-amber-50 px-5 py-3 text-sm text-amber-950"><strong>Legacy demo workspace.</strong> These records and actions are not connected to the current Farmtry service. <Link href="/preview/aggregator" className="font-bold underline">Open the connected aggregator workspace</Link>.</aside>;
}
