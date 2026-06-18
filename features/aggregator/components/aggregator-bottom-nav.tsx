import Link from "next/link";
import { CircleUserRound, ClipboardList, Home, Plus } from "lucide-react";
import { AppLogo } from "@/components/app-logo";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { cn } from "@/lib/utils";

type AggregatorBottomNavProps = {
  active: "home" | "log" | "logs" | "profile";
};

const navItems = [
  { id: "home", label: "Home", href: "/aggregator/home", icon: Home },
  { id: "log", label: "Log Entry", href: "/aggregator/log-entry", icon: Plus },
  { id: "logs", label: "My Logs", href: "/aggregator/logs", icon: ClipboardList },
  { id: "profile", label: "Profile", href: "/aggregator/profile", icon: CircleUserRound }
] as const;

export function AggregatorBottomNav({ active }: AggregatorBottomNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-[#E5E7EB] bg-white shadow-[0_-8px_24px_rgba(15,42,26,0.08)] lg:inset-y-0 lg:left-0 lg:right-auto lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-t-0 lg:bg-[#0F2A1A] lg:px-4 lg:py-5 lg:text-white lg:shadow-none">
      <div className="hidden lg:block">
        <AppLogo subtitle="Aggregator Portal" iconClassName="bg-[#1E4D2B]" />
      </div>
      <div className="mx-auto grid h-16 max-w-md grid-cols-4 lg:mx-0 lg:mt-8 lg:h-auto lg:max-w-none lg:flex-1 lg:grid-cols-1 lg:space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <Link
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition lg:min-h-11 lg:flex-row lg:justify-start lg:gap-3 lg:rounded-xl lg:px-3 lg:text-sm",
                isActive ? "text-[#1E4D2B] lg:bg-[#1E4D2B] lg:text-white" : "text-[#6B7280] lg:text-slate-300 lg:hover:bg-white/5 lg:hover:text-white"
              )}
              href={item.href}
              key={item.id}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full lg:h-auto lg:w-auto lg:bg-transparent",
                  item.id === "log" && "bg-[#1E4D2B] text-white lg:bg-transparent",
                  item.id !== "log" && isActive && "bg-[#E8F3EC] lg:bg-transparent"
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="mt-auto hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 lg:block">
        <p className="text-sm font-bold text-white">Field workspace</p>
        <p className="mt-1 text-xs leading-5 text-slate-400">Offline-first aggregation tools</p>
        <SignOutButton className="mt-4 min-h-10 w-full rounded-xl border border-red-300/30 bg-red-500/10 text-sm font-bold text-red-100 hover:bg-red-500/20" />
      </div>
    </nav>
  );
}
