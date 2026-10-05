"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { FarmtryBrand } from "@/features/landing/components/farmtry-brand";

/** Each responsive icon uses its original Figma export and intrinsic dimensions. */
export function CommerceIcon({ file, mobile }: { file: string; mobile?: string }) {
  return <span className="commerce-icon" aria-hidden="true"><img className={mobile ? "commerce-desktop" : undefined} src={`/figma/commerce/${file}.svg`} alt="" />{mobile && <img className="commerce-mobile" src={`/figma/commerce/${mobile}.svg`} alt="" />}</span>;
}

export function CommerceShell({ children }: { children: ReactNode }) {
  const [announcement, setAnnouncement] = useState(true);
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [searchFeedback, setSearchFeedback] = useState("");
  return <div className="commerce-site">
    {announcement && <div className="commerce-announcement"><div className="commerce-width"><span><CommerceIcon file="44b32" mobile="2e477" />Special Offer — 20% Off First Bulk Off-take <small>(sample)</small></span><button aria-label="Dismiss offer banner" onClick={() => setAnnouncement(false)}>×</button></div></div>}
    <header className="commerce-header"><div className="commerce-width">
      <div className="commerce-header-row"><div className="commerce-desktop"><FarmtryBrand /></div><Link href="/" className="commerce-mobile commerce-mobile-brand"><CommerceIcon file="6c09a" />Farmtry</Link>
        <form className="commerce-search" role="search" onSubmit={event => { event.preventDefault(); setSearchFeedback(query.trim() ? "Catalogue search is not available yet. This page shows a sample product." : "Enter a product to search for."); }}><label className="sr-only" htmlFor="commerce-search">Search products</label><CommerceIcon file="6ca4c" mobile="5c17a" /><input id="commerce-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search tomatoes, livestock, seeds, farm equipment…" /><Button type="submit">Search</Button></form>
        <nav className="commerce-account" aria-label="Your account"><Link href="/preview/buyer-login" aria-label="Account"><CommerceIcon file="5651b" /><span>Account</span><i className="commerce-desktop"><CommerceIcon file="0f95d" /></i></Link><Link href="/preview/wishlist" aria-label="Wishlist"><CommerceIcon file="87809" /><span>Wishlist</span></Link><Link href="/preview/cart" aria-label="Cart"><CommerceIcon file="8505e" mobile="3c365" /><span>Cart</span></Link></nav>
      </div>
      {searchFeedback && <p className="commerce-search-feedback" role="status">{searchFeedback}</p>}
      <div className="commerce-subnav"><nav aria-label="Shop categories"><button className="commerce-menu commerce-desktop" aria-label="Open marketplace menu" aria-expanded={menu} onClick={() => setMenu(!menu)}><CommerceIcon file="6bbb3" /></button><Link href="/preview/marketplace">Fresh Farm Produce</Link><Link href="/preview/marketplace">Farm-Waste</Link><Link href="/preview/buyer">Track Order</Link></nav><div><Link className="commerce-support commerce-desktop" href="/preview/support"><CommerceIcon file="b6e8a" />Call Support</Link><span className="commerce-shipping"><CommerceIcon file="44b6b" mobile="258a0" /><span className="commerce-desktop">Nationwide </span>Cold Shipping</span></div></div>
      {menu && <nav className="commerce-expanded-menu" aria-label="Marketplace menu"><Link href="/preview/marketplace">Browse marketplace</Link><Link href="/preview/product">Sample product</Link><Link href="/preview/cart">Shopping cart</Link><Link href="/preview/support">Help and support</Link></nav>}
    </div></header>
    <aside className="commerce-preview commerce-width">Design preview · All prices, suppliers, stock and delivery details are illustrative. Purchases and account actions are unavailable.</aside>
    {children}
    <footer className="commerce-footer"><div className="commerce-width commerce-footer-grid"><div><FarmtryBrand /><p>We help businesses buy farm goods, turn organic waste into value, and settle payments securely across growing farming areas.</p><Link className="commerce-accreditation" href="/preview/governance"><CommerceIcon file="307cf" mobile="bf2b8" />Accreditation information</Link></div><div><h2>Enterprise</h2><Link href="/preview/buyer">Corporate Buyer Suite</Link><Link href="/preview/aggregator">Aggregator Hub</Link><Link href="/preview/marketplace">Agri Waste Exchange</Link><Link href="/preview/governance">Guaranteed Settlement</Link></div><div><h2>Governance &amp; Trust</h2><Link href="/preview/governance">FIRS &amp; CAC Verification</Link><Link href="/preview/governance">Quality Grading Standards</Link><Link href="/preview/governance">Master Service Agreement</Link><Link href="/preview/governance">Data Protection Policy</Link></div><div className="commerce-desktop"><h2>Support &amp; Desk</h2><Link href="/preview/support">Aggregator Help Center</Link><Link href="/preview/support">Disputes</Link></div></div><p className="commerce-mobile commerce-copyright">© 2026 Farmtry. All rights reserved. Grow. Gain. Value.</p></footer>
  </div>;
}
