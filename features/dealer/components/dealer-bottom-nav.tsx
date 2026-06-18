"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, CircleUserRound, ClipboardList, Home, KeyRound } from "lucide-react";
import { AppLogo } from "@/components/app-logo";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { cn } from "@/lib/utils";

type DealerBottomNavProps = {
  active: "home" | "redeem" | "history" | "profile";
};

const navItems = [
  { id: "home", label: "Home", href: "/dealer/home", icon: Home },
  { id: "redeem", label: "Redeem", href: "/dealer/redeem", icon: KeyRound },
  { id: "history", label: "History", href: "/dealer/history", icon: ClipboardList },
  { id: "profile", label: "Profile", href: "/dealer/profile", icon: CircleUserRound }
] as const;

export function DealerBottomNav({ active }: DealerBottomNavProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty("--role-sidebar-width", isCollapsed ? "0.75rem" : "18rem");

    return () => {
      document.documentElement.style.removeProperty("--role-sidebar-width");
    };
  }, [isCollapsed]);

  return (
    <nav className={cn("fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white shadow-[0_-8px_24px_rgba(15,23,42,0.08)] transition-all lg:inset-y-0 lg:left-0 lg:right-auto lg:flex lg:flex-col lg:border-r lg:border-t-0 lg:bg-[#0F2A1A] lg:text-white lg:shadow-none", isCollapsed ? "lg:w-3 lg:px-0 lg:py-0" : "lg:w-72 lg:px-4 lg:py-5")}>
      <AppLogo className="fixed right-4 top-4 lg:hidden" iconClassName="h-10 w-10 bg-[#1E4D2B] shadow-lg" textClassName="sr-only" />
      <button
        aria-label={isCollapsed ? "Open dealer navigation" : "Collapse dealer navigation"}
        className={cn("absolute -right-4 top-6 hidden h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#1E4D2B] text-white shadow-lg lg:flex", isCollapsed && "-right-7")}
        onClick={() => setIsCollapsed((current) => !current)}
        type="button"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
      {isCollapsed ? <span className="hidden h-full w-full bg-[#1E4D2B] lg:block" /> : null}
      <div className={cn("hidden lg:block", isCollapsed && "lg:hidden")}>
        <AppLogo subtitle="Agro-Dealer Portal" iconClassName="bg-[#1E4D2B]" />
      </div>
      <div className={cn("mx-auto grid h-16 max-w-md grid-cols-4 lg:mx-0 lg:mt-8 lg:h-auto lg:max-w-none lg:flex-1 lg:grid-cols-1 lg:space-y-1", isCollapsed && "lg:hidden")}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <Link
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition lg:min-h-11 lg:flex-row lg:justify-start lg:gap-3 lg:rounded-xl lg:px-3 lg:text-sm",
                isActive ? "text-[#1E4D2B] lg:bg-[#1E4D2B] lg:text-white" : "text-slate-400 lg:text-slate-300 lg:hover:bg-white/5 lg:hover:text-white"
              )}
              href={item.href}
              key={item.id}
            >
              <span className={cn("flex h-8 w-8 items-center justify-center rounded-full lg:h-auto lg:w-auto lg:bg-transparent", isActive && "bg-[#E8F3EC] lg:bg-transparent")}>
                <Icon className="h-5 w-5" />
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
      <div className={cn("mt-auto hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 lg:block", isCollapsed && "lg:hidden")}>
        <p className="text-sm font-bold text-white">Dealer workspace</p>
        <p className="mt-1 text-xs leading-5 text-slate-400">Voucher redemption and reports</p>
        <SignOutButton className="mt-4 min-h-10 w-full rounded-xl border border-red-300/30 bg-red-500/10 text-sm font-bold text-red-100 hover:bg-red-500/20" />
      </div>
    </nav>
  );
}
