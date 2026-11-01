import {CanonicalRouting} from "@/features/account-access/canonical-routing";
import "@/features/backend/backend.css";
import {AccountLifecycle} from "@/features/account-access/account-state";
import "@/features/account-access/account-state.css";
import { PresentationToolbar } from "@/features/account-access/presentation-toolbar";
import { AccountAccessProvider } from "@/features/account-access/account-access";
import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegistration } from "./service-worker-registration";
import "./globals.css";
import "@/features/account-access/account-access.css";
import "@/features/account-access/shopping-account.css";
import { LegacyDemoNotice } from "@/components/auth/legacy-demo-notice";

export const metadata: Metadata = {
  referrer: "no-referrer",
  title: {
    default: "Farmtry",
    template: "%s | Farmtry"
  },
  description: "Low-connectivity marketplace for agricultural buyers, aggregators, and agro-dealers.",
  applicationName: "Farmtry",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Farmtry"
  },
  icons: {
    icon: [
      { url: "/icons/farmtry-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/farmtry-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }]
  }
};

export const viewport: Viewport = {
  themeColor: "#14532D"
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <LegacyDemoNotice /><CanonicalRouting/>
        <AccountLifecycle><AccountAccessProvider><PresentationToolbar>{children}</PresentationToolbar></AccountAccessProvider></AccountLifecycle>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
