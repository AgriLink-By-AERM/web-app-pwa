import Link from "next/link";
import {
  BarChart3,
  ClipboardList,
  FileText,
  History,
  LayoutDashboard,
  QrCode,
  Settings,
  Zap
} from "lucide-react";
import { AppLogo } from "@/components/app-logo";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { BuyerTypeSwitch } from "@/features/buyer/components/buyer-type-switch";
import type { BuyerType, CorporateBuyerProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

type BuyerSidebarProps = {
  buyerType: BuyerType;
  profile: CorporateBuyerProfile;
};

const baseNavItems = [
  { href: "/buyer/dashboard", label: "Dashboard", icon: LayoutDashboard, active: true },
  { href: "/buyer/matches", label: "Matches", icon: Zap, badge: "3" },
  { href: "/buyer/orders", label: "Standing Orders", icon: ClipboardList },
  { href: "/buyer/history", label: "History", icon: History },
  { href: "/buyer/invoices", label: "Invoices", icon: FileText },
  { href: "/buyer/settings", label: "Settings", icon: Settings }
];

export function BuyerSidebar({ buyerType, profile }: BuyerSidebarProps) {
  const navItems =
    buyerType === "factory"
      ? [
          ...baseNavItems.slice(0, 5),
          { href: "/buyer/goods-in", label: "Goods-In QR Scan", icon: QrCode },
          baseNavItems[5]
        ]
      : baseNavItems;

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col bg-ink text-white">
      <div className="border-b border-white/10 px-5 py-6">
        <AppLogo iconClassName="h-10 w-10 bg-[#1E4D2B]" subtitle="Buyer Portal" />
        <div className="mt-3 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-factoryAccent" />
          <p className="text-sm font-bold">
            {buyerType === "factory" ? "Factory Portal" : "Restaurant Portal"}
          </p>
        </div>
      </div>

      <div className="border-b border-white/10 p-4">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/35">Switch view</p>
        <BuyerTypeSwitch buyerType={buyerType} />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const href = `${item.href}?type=${buyerType}`;

          return (
            <Link
              className={cn(
                "mb-1 flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm transition",
                item.active
                  ? buyerType === "factory"
                    ? "border border-factoryAccent/40 bg-factoryAccent/15 text-factoryAccent"
                    : "border border-restaurantAccent/40 bg-restaurantAccent/15 text-restaurantAccent"
                  : "border border-transparent text-white/65 hover:bg-white/10 hover:text-white"
              )}
              href={href}
              key={item.href}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 font-medium">{item.label}</span>
              {"badge" in item && item.badge ? (
                <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-5">
        <p className="text-sm font-bold">{profile.organizationName}</p>
        <p className="mt-1 text-xs text-white/45">{profile.roleTitle}</p>
        <SignOutButton className="mt-4 min-h-10 w-full rounded-xl border border-red-300/30 bg-red-500/10 text-sm font-bold text-red-100 hover:bg-red-500/20" />
      </div>
    </aside>
  );
}
