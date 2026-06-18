import Link from "next/link";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

type AppLogoProps = {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  subtitle?: string;
  subtitleClassName?: string;
};

export function AppLogo({ className, iconClassName, textClassName, subtitle, subtitleClassName }: AppLogoProps) {
  return (
    <Link className={cn("inline-flex items-center gap-3", className)} href="/" aria-label="Go to AgriLink landing page">
      <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl bg-[#1E4D2B] text-white", iconClassName)}>
        <Leaf className="h-6 w-6" />
      </span>
      <span>
        <span className={cn("block text-sm font-extrabold text-white", textClassName)}>AgriLink</span>
        {subtitle ? <span className={cn("mt-0.5 block text-xs font-medium text-white/45", subtitleClassName)}>{subtitle}</span> : null}
      </span>
    </Link>
  );
}
