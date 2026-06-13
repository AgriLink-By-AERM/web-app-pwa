import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgriLink Buyer Portal",
  description: "Corporate procurement dashboard for AgriLink factories and restaurants."
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
