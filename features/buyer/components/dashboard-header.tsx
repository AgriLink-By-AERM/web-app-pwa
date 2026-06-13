import { Building2, MapPin, Utensils } from "lucide-react";
import type { BuyerType, CorporateBuyerProfile } from "@/lib/types";

type DashboardHeaderProps = {
  buyerType: BuyerType;
  profile: CorporateBuyerProfile;
};

export function DashboardHeader({ buyerType, profile }: DashboardHeaderProps) {
  const Icon = buyerType === "factory" ? Building2 : Utensils;
  const label = buyerType === "factory" ? "Factory procurement" : "Restaurant procurement";

  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted">{label}</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink">{profile.organizationName}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Icon className="h-4 w-4" />
            {profile.contactName}, {profile.roleTitle}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {profile.location}
          </span>
        </div>
      </div>
    </header>
  );
}
