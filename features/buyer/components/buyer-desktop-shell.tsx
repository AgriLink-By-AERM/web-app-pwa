"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  Gauge,
  History,
  LayoutDashboard,
  Settings,
  Zap
} from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { AppLogo } from "@/components/app-logo";
import { cn } from "@/lib/utils";

type BuyerDesktopShellProps = {
  active: "dashboard" | "matches" | "demand" | "history" | "invoices" | "settings";
  children: React.ReactNode;
  title: string;
  subtitle: string;
};

const navItems = [
  { id: "dashboard", label: "Dashboard", href: "/buyer/dashboard", icon: LayoutDashboard },
  { id: "matches", label: "Matches", href: "/buyer/matches", icon: Zap },
  { id: "demand", label: "Standing Demand", href: "/buyer/demand", icon: ClipboardList },
  { id: "history", label: "History", href: "/buyer/history", icon: History },
  { id: "invoices", label: "Invoices", href: "/buyer/invoices", icon: FileText },
  { id: "settings", label: "Settings", href: "/buyer/settings", icon: Settings }
] as const;

export function BuyerDesktopShell({ active, children, title, subtitle }: BuyerDesktopShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  return (
    <main className="min-h-screen bg-[#0F2A1A] text-slate-100">
      <div className="flex min-h-screen">
        <aside className={cn("sticky top-0 hidden h-screen shrink-0 border-r border-white/10 bg-[#0F2A1A] transition-all lg:flex lg:flex-col", isSidebarCollapsed ? "w-3 px-0 py-0" : "w-72 px-4 py-5")}>
          <button
            aria-label={isSidebarCollapsed ? "Open buyer navigation" : "Collapse buyer navigation"}
            className={cn("absolute -right-4 top-6 z-30 hidden h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#1E4D2B] text-white shadow-lg lg:flex", isSidebarCollapsed && "-right-7")}
            onClick={() => setIsSidebarCollapsed((current) => !current)}
            type="button"
          >
            {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
          {isSidebarCollapsed ? <span className="h-full w-full bg-[#1E4D2B]" /> : null}
          <div className={cn(isSidebarCollapsed && "hidden")}>
            <AppLogo className="px-3" iconClassName="bg-[#1E4D2B]" subtitle="Enterprise Buyer" />
          </div>

          <nav className={cn("mt-8 flex-1 space-y-1", isSidebarCollapsed && "hidden")}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;

              return (
                <Link
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition",
                    isActive ? "bg-[#1E4D2B] text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )}
                  href={item.href}
                  key={item.id}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className={cn("rounded-2xl border border-white/10 bg-white/[0.03] p-4", isSidebarCollapsed && "hidden")}>
            <p className="text-sm font-bold text-white">Dangote Feeds Ltd</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">Industrial procurement workspace</p>
            <SignOutButton className="mt-4 min-h-10 w-full rounded-xl border border-red-300/30 bg-red-500/10 text-sm font-bold text-red-100 hover:bg-red-500/20" />
          </div>
        </aside>

        <section className="min-w-0 flex-1 bg-slate-100 text-slate-950">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#1E4D2B]">
                  <Gauge className="h-4 w-4" />
                  Corporate Buyer Desktop
                </div>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">{title}</h1>
                <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <AppLogo
                  className="lg:hidden"
                  iconClassName="h-10 w-10 bg-[#1E4D2B]"
                  textClassName="text-[#111827]"
                  subtitle="Buyer"
                  subtitleClassName="text-slate-500"
                />
                <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm" type="button">
                  <Bell className="h-5 w-5" />
                </button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-6 py-6">{children}</div>
        </section>
      </div>
    </main>
  );
}
