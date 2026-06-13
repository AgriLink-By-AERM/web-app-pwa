"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Building2, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BuyerType } from "@/lib/types";

type BuyerTypeSwitchProps = {
  buyerType: BuyerType;
};

export function BuyerTypeSwitch({ buyerType }: BuyerTypeSwitchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setBuyerType(nextBuyerType: BuyerType) {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("type", nextBuyerType);
    router.push(`/buyer/dashboard?${nextParams.toString()}`);
  }

  return (
    <div className="rounded-lg bg-white/10 p-1">
      <div className="grid grid-cols-2 gap-1">
        <button
          className={cn(
            "flex min-h-9 items-center justify-center rounded-md text-xs font-bold transition",
            buyerType === "factory" ? "bg-factoryAccent text-white" : "text-white/55 hover:bg-white/10"
          )}
          onClick={() => setBuyerType("factory")}
          type="button"
        >
          <Building2 className="mr-1.5 h-4 w-4" />
          Factory
        </button>
        <button
          className={cn(
            "flex min-h-9 items-center justify-center rounded-md text-xs font-bold transition",
            buyerType === "restaurant"
              ? "bg-restaurantAccent text-white"
              : "text-white/55 hover:bg-white/10"
          )}
          onClick={() => setBuyerType("restaurant")}
          type="button"
        >
          <Utensils className="mr-1.5 h-4 w-4" />
          Restaurant
        </button>
      </div>
    </div>
  );
}
