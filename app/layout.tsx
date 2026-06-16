import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegistration } from "./service-worker-registration";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AgriLink",
    template: "%s | AgriLink"
  },
  description: "Low-connectivity marketplace for agricultural buyers, aggregators, and agro-dealers.",
  applicationName: "AgriLink",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AgriLink"
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/icons/icon.svg", type: "image/svg+xml" }
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
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
