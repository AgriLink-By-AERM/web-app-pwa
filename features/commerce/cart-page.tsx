"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CommerceShell } from "./commerce-shell";

const products = [
  { id: "tomatoes", name: "Fresh Roma Tomatoes (Grade A - Premium Ripe)", image: "22d63.png", grade: "Grade A", price: 20000, unit: "50kg Crate", plural: "Crates", weight: 50, initial: 2, supplier: "Aggregator: Aminah Yusuf", code: "AGG-KD-0842", hub: "Kaduna North Cold Hub", supplierIcon: "5a984", dispatchIcon: "99f2f", dispatch: "18-Hour SLA Guarantee (Tomorrow < 12:00 PM)", sensorIcon: "695e1", sensor: "Sensor Monitored: 8°C - 12°C", noteIcon: "654ec", note: "Includes 100% Spoilage Refund Guarantee & Returnable Crate Deposit (₦500/crate)" },
  { id: "cassava", name: "Sun-Dried Cassava Peels - 100kg Heavy Jute Sack", image: "2cd18.png", grade: "Industrial Feed", price: 3800, unit: "Sack", plural: "Sacks", weight: 100, initial: 5, supplier: "Processor: Danjuma Agro-Allied", code: "AGG-KN-1208", hub: "Kano Central Cluster", supplierIcon: "f05ff", dispatchIcon: "b1558", dispatch: "24-Hour Consolidated Dispatch Window", sensorIcon: "3efbf", sensor: "Moisture Index: < 9.4%", noteIcon: "a4cc4", note: "Farm Waste: Sourced directly from Funtua Starch Mills; sanitized, unfermented." },
] as const;
const money = (value: number) => `₦${value.toLocaleString("en-NG")}`;
const initialQuantities = () => Object.fromEntries(products.map(product => [product.id, product.initial]));
function CartIcon({ file }: { file: string }) { return <img className="cart-icon" src={`/figma/cart/${file}.svg`} alt="" aria-hidden="true" />; }

/** Illustrative cart only. No storage, API calls, reservation or payment is performed. */
export function CartPage() {
  const [quantities, setQuantities] = useState<Record<string, number>>(initialQuantities);
  const [feedback, setFeedback] = useState("");
  const items = products.filter(product => quantities[product.id] > 0);
  const subtotal = items.reduce((sum, product) => sum + product.price * quantities[product.id], 0);
  const deposit = (quantities.tomatoes || 0) * 500;
  const total = subtotal + deposit + (items.length ? 7000 : 0);
  const remaining = Math.max(0, 69000 - subtotal);
  const progress = Math.min(100, Math.floor(subtotal / 69000 * 100));
  function changeQuantity(id: string, amount: number) {
    setQuantities(current => ({ ...current, [id]: Math.max(1, Math.min(99, current[id] + amount)) }));
    setFeedback("Sample quantities updated. No order has been placed.");
  }
  function remove(id: string, name: string) { setQuantities(current => ({ ...current, [id]: 0 })); setFeedback(`${name} removed from this preview.`); }
  return <CommerceShell><main className="commerce-width cart-page">
    <div className="cart-topline"><nav className="cart-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><CartIcon file="3be0e" /><Link href="/preview/marketplace">Marketplace</Link><CartIcon file="3be0e" /><span aria-current="page">Shopping Cart</span></nav><ol className="cart-steps" aria-label="Checkout progress"><li aria-current="step"><b>1</b>Cart Review</li><li><b>2</b>Delivery &amp; Account</li><li><b>3</b>Escrow Settlement</li></ol></div>
    <p className="cart-preview-note">Sample cart · Changes apply only to this preview and reset when you reload.</p>
    <div className="cart-layout"><div className="cart-items">
      <Card className="cart-heading-card"><div className="cart-heading"><div><h1>Shopping Cart</h1><span>{items.length} {items.length === 1 ? "Order" : "Orders"}</span></div><p><CartIcon file="9b79d" />Direct Farm-Gate Aggregated Prices</p></div>
      {items.length > 0 &&
        <div className="cart-incentive"><div><CartIcon file="edb16" /><p>{remaining ? <>Add <strong>{money(remaining)}</strong> more produce for <strong>Free Cold-Chain Hub Insurance</strong></> : <strong>Free Cold-Chain Hub Insurance threshold reached</strong>}<small>Illustrative offer only</small></p><span>{progress}% Complete</span></div><progress aria-label="Sample insurance offer progress" value={progress} max={100} /></div>}</Card>
      {items.length > 0 ? <>
        {items.map(product => <Card key={product.id} className={`cart-item cart-item-${product.id}`}><div className="cart-item-main"><div className="cart-photo"><img src={`/figma/cart/${product.image}`} alt={product.id === "tomatoes" ? "Crates of fresh Roma tomatoes" : "Sacks of sun-dried cassava peels"} /><span>{product.grade}</span></div><div className="cart-item-info"><div className="cart-item-title"><h2>{product.name}</h2><div className="cart-line-price"><strong>{money(product.price * quantities[product.id])}</strong><p className="cart-unit-price">{money(product.price)} / {product.unit}</p></div></div><p className="cart-supplier"><CartIcon file={product.supplierIcon} /><strong>{product.supplier}</strong><span>•</span>{product.code}<span>•</span>{product.hub}</p><div className="cart-tags"><span className="cart-dispatch"><CartIcon file={product.dispatchIcon} />{product.dispatch}</span><span><CartIcon file={product.sensorIcon} />{product.sensor}</span></div><div className="cart-item-controls"><div className="cart-quantity-group"><div className="cart-quantity" role="group" aria-label={`${product.name} quantity`}><button aria-label={`Decrease ${product.id} quantity`} disabled={quantities[product.id] === 1} onClick={() => changeQuantity(product.id, -1)}><CartIcon file="1e7e5" /></button><output aria-label={`${product.id} quantity`}>{quantities[product.id]}</output><button aria-label={`Increase ${product.id} quantity`} disabled={quantities[product.id] === 99} onClick={() => changeQuantity(product.id, 1)}><CartIcon file="fa127" /></button></div><span>{product.plural} ({quantities[product.id] * product.weight}kg total)</span></div><div className="cart-item-actions"><button disabled title="Saved items API is not available yet"><CartIcon file="e613e" />Save for Later</button><button onClick={() => remove(product.id, product.name)} aria-label={`Remove ${product.id}`}><CartIcon file="581c9" />Remove</button></div></div></div></div><p className="cart-item-note"><CartIcon file={product.noteIcon} />{product.note}</p></Card>)}
        <div className="cart-bottom-actions"><Link href="/preview/marketplace"><CartIcon file="b47dc" />Continue Sourcing Catalog</Link><button onClick={() => { setQuantities({}); setFeedback("Sample cart cleared. Nothing was changed in an account."); }}>Clear Cart</button></div>
      </> : <Card className="cart-empty"><h2>Your sample cart is empty</h2><p>Restore the example items to keep testing the shopping cart.</p><Button onClick={() => { setQuantities(initialQuantities()); setFeedback("Sample items restored."); }}>Restore sample items</Button><Link href="/preview/marketplace">Continue sourcing</Link></Card>}
      <p className="cart-feedback" role="status">{feedback}</p>
    </div><Card className="cart-summary"><div className="cart-summary-heading"><h2>Landed Summary</h2><span>NGN / NAIRA</span></div><dl><div><dt>Produce &amp; Agro-Feed Subtotal</dt><dd>{money(subtotal)}</dd></div><div><dt>Hub Consolidation &amp; Pre-Cooling <span title="Illustrative consolidation charge"><CartIcon file="bfda7" /></span></dt><dd>{money(items.length ? 4500 : 0)}</dd></div><div><dt>Temperature-Monitored Delivery <span title="Illustrative delivery charge"><CartIcon file="bfda7" /></span></dt><dd>{money(items.length ? 2500 : 0)}</dd></div><div><dt>Reusable Crate Deposit ({quantities.tomatoes || 0} × ₦500) <CartIcon file="0dfb6" /><small>100% Refundable · sample</small></dt><dd>{money(deposit)}</dd></div><div><dt>Federal Agro-Levy &amp; Transit Toll</dt><dd>₦0</dd></div></dl><div className="cart-total"><h3>Total Landed Amount</h3><output aria-label="Sample total landed amount">{money(total)}</output></div>{items.length > 0 && <div className="cart-delivery"><h3><CartIcon file="e08b5" />Guaranteed Delivery Window</h3><strong>Tomorrow, 8:00 AM – 11:30 AM</strong><p>Routing from Oke Ogun regional distribution points direct to your address.</p><small>Design example; no delivery has been booked.</small></div>}<Button className="cart-checkout" disabled aria-describedby="cart-checkout-reason">Proceed to Checkout<CartIcon file="77060" /></Button><p className="cart-payment"><CartIcon file="576a6" />Payment Secured · design preview</p><Link className="cart-unavailable" href="/preview/confirm-account-summary/">Explore the separate account &amp; delivery design →</Link><p id="cart-checkout-reason" className="cart-unavailable">Checkout and saved items are unavailable until the shopping API is connected. Amounts shown are sample calculations.</p></Card></div>
  </main></CommerceShell>;
}
