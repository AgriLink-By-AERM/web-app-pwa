import Link from "next/link";

export function FarmtryBrand() {
  return <Link href="/" className="farmtry-brand" aria-label="Farmtry home"><span className="farmtry-brand-icon"><span><img src="/figma/landing/3b179.png" alt="" /></span></span><span>Farm<span className="farmtry-brand-accent">try</span></span></Link>;
}
