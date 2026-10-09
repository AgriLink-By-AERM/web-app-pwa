"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FarmtryBrand } from "./farmtry-brand";

export function LandingHeader() {
  const [open, setOpen] = useState(false);
  return <header className="farmtry-header"><div className="farmtry-container farmtry-header-inner">
    <FarmtryBrand />
    <nav aria-label="Main navigation" className="farmtry-desktop-nav"><Link href="/">Home</Link><Link href="/preview/marketplace">Marketplace</Link><a href="/#buyers">For Corporate Buyers</a><a href="/#aggregators">For Aggregators</a></nav>
    <div className="farmtry-header-actions"><Button variant="ghost" className="farmtry-menu-button" aria-expanded={open} aria-controls="farmtry-mobile-nav" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</Button><a className="farmtry-action farmtry-action-small" href="/#gateways">Get Started</a></div>
  </div>{open && <nav id="farmtry-mobile-nav" className="farmtry-mobile-nav" aria-label="Mobile navigation" onClick={() => setOpen(false)} onKeyDown={event => { if (event.key === "Escape") setOpen(false); }}><Link href="/">Home</Link><Link href="/preview/marketplace">Marketplace</Link><a href="/#buyers">For Corporate Buyers</a><a href="/#aggregators">For Aggregators</a><Link href="/preview/admin">Admin Portal</Link></nav>}</header>;
}
