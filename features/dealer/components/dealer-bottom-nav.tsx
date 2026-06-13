import Link from "next/link";
import { CircleUserRound, ClipboardList, Home, KeyRound } from "lucide-react";
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
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white shadow-[0_-8px_24px_rgba(15,23,42,0.08)]">
      <div className="mx-auto grid h-16 max-w-md grid-cols-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <Link
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition",
                isActive ? "text-indigo-700" : "text-slate-400"
              )}
              href={item.href}
              key={item.id}
            >
              <span className={cn("flex h-8 w-8 items-center justify-center rounded-full", isActive && "bg-indigo-50")}>
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
