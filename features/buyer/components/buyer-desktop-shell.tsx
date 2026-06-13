"use client";

import Link from "next/link";
import {
  Bell,
  ClipboardList,
  Factory,
  FileText,
  Gauge,
  History,
  LayoutDashboard,
  Settings,
  Zap
} from "lucide-react";
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
  return (
    <main className="min-h-screen bg-zinc-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-white/10 bg-zinc-950 px-4 py-5 lg:flex lg:flex-col">
          <div className="flex items-center gap-3 px-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Factory className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">AgriLink</p>
              <p className="text-sm font-extrabold text-white">Enterprise Buyer</p>
            </div>
          </div>

          <nav className="mt-8 flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;

              return (
                <Link
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition",
                    isActive ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
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

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm font-bold text-white">Dangote Feeds Ltd</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">Industrial procurement workspace</p>
          </div>
        </aside>

        <section className="min-w-0 flex-1 bg-slate-100 text-slate-950">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                  <Gauge className="h-4 w-4" />
                  Corporate Buyer Desktop
                </div>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">{title}</h1>
                <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
              </div>
              <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm" type="button">
                <Bell className="h-5 w-5" />
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-6 py-6">{children}</div>
        </section>
      </div>
    </main>
  );
}
