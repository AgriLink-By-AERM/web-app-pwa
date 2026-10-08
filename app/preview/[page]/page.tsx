import { AdminAuth } from "@/features/admin-workspace/admin-auth";
import "@/features/admin-workspace/admin-auth.css";
import { AdminWorkspace } from "@/features/admin-workspace/admin-workspace";
import { adminPages, type AdminPage } from "@/features/admin-workspace/admin-data";
import "@/features/admin-workspace/admin-workspace.css";
import { BuyerListings, BuyerListingDetail, BuyerMatchDetail, BuyerScanner } from "@/features/buyer-workspace/buyer-procurement";
import "@/features/buyer-workspace/buyer-procurement.css";
import { BuyerNotifications } from "@/features/buyer-workspace/buyer-notifications";
import "@/features/buyer-workspace/buyer-notifications.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { LandingHeader } from "@/features/landing/components/landing-header";
import { pageRequirements, type IntegrationPage } from "@/lib/integration/page-requirements";
import "@/features/landing/landing.css";
import { BuyerAuthPage } from "@/features/buyer-auth/buyer-auth-page";
import "@/features/buyer-auth/buyer-auth.css";
import { BuyerDashboard, BuyerPurchaseHistory } from "@/features/buyer-workspace/buyer-workspace";
import "@/features/buyer-workspace/buyer-workspace.css";
import { CartPage } from "@/features/commerce/cart-page";
import "@/features/commerce/cart.css";
import { ProductPage } from "@/features/commerce/product-page";
import "@/features/commerce/commerce.css";
import { AggregatorWorkspace } from "@/features/core/aggregator-workspace";
import { LiveAggregatorRegistration } from "@/features/core/aggregator-registration";
import { OtpVerification } from "@/features/core/otp-verification";
import "@/features/core/core.css";

export function generateStaticParams() { return Object.keys(pageRequirements).map(page => ({ page })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const title = Object.prototype.hasOwnProperty.call(pageRequirements, page)
    ? pageRequirements[page as IntegrationPage].title : "Preview";
  return { title: { absolute: `${title} | Farmtry` } };
}

export default async function PreviewPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  if (!Object.prototype.hasOwnProperty.call(pageRequirements, page)) notFound();
  if (page === "admin-login") return <AdminAuth screen="login" />;
  if (page === "admin-recovery" || page === "admin-recovery-sms") return <AdminAuth key={page} screen="recovery" initialMethod={page === "admin-recovery-sms" ? "sms" : "email"} />;
  if (page === "admin-reset") return <AdminAuth screen="reset" />;
  if (Object.prototype.hasOwnProperty.call(adminPages, page)) return <AdminWorkspace key={page} screen={page as AdminPage} />;
  if (page === "buyer-listings") return <BuyerListings />;
  if (page === "buyer-listing") return <BuyerListingDetail />;
  if (page === "buyer-match") return <BuyerMatchDetail />;
  if (page === "buyer-scan") return <BuyerScanner />;
  if (page === "buyer-notifications") return <BuyerNotifications />;
  if (page === "buyer") return <BuyerDashboard />;
  if (page === "buyer-history") return <BuyerPurchaseHistory />;
  if (page === "cart") return <CartPage />;
  if (page === "product") return <ProductPage />;
  if (page === "aggregator") return <AggregatorWorkspace />;
  if (page === "aggregator-register") return <LiveAggregatorRegistration />;
  if (page === "aggregator-login") return <BuyerAuthPage key="aggregator-login" screen="login" audience="aggregator" />;
  if (page === "aggregator-verify") return <OtpVerification />;
  if (page === "buyer-register") return <BuyerAuthPage key="register" screen="register" />;
  if (page === "buyer-login") return <BuyerAuthPage key="login" screen="login" />;
  if (page === "recovery") return <BuyerAuthPage key="recovery" screen="recovery" />;
  if (page === "buyer-reset") return <BuyerAuthPage key="reset" screen="reset" />;
  const requirement = pageRequirements[page as IntegrationPage];
  return <div className="farmtry-site"><LandingHeader /><main className="farmtry-container farmtry-placeholder"><p className="farmtry-eyebrow">FARMTRY · COMING SOON</p><h1>{requirement.title}</h1><p>{requirement.description}</p><Card className="mt-8 max-w-xl p-8 text-ink"><h2 className="text-xl font-bold">This service is being prepared</h2><p className="mt-3 text-body">This page is a preview. Live account and transaction services are not available yet.</p><p className="mt-3 text-sm text-muted">No information has been submitted and no purchase or account action has been completed.</p><Link className="farmtry-action mt-6" href="/">Back to Farmtry</Link></Card><nav className="mt-8 flex flex-wrap gap-6" aria-label="Explore Farmtry"><Link href="/preview/marketplace">Marketplace</Link><Link href="/preview/buyer">Buyer Hub</Link><Link href="/preview/aggregator">Aggregator Hub</Link></nav></main></div>;
}
