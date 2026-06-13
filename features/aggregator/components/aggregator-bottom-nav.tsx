import Link from "next/link";
import { CircleUserRound, ClipboardList, Home, Plus } from "lucide-react";
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
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-[#E5DDD4] bg-white shadow-[0_-8px_24px_rgba(44,26,14,0.08)]">
      <div className="mx-auto grid h-16 max-w-md grid-cols-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <Link
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition",
                isActive ? "text-[#A0522D]" : "text-[#9C8575]"
              )}
              href={item.href}
              key={item.id}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  item.id === "log" && "bg-[#5C3D1E] text-white",
                  item.id !== "log" && isActive && "bg-[#F5EFE6]"
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
