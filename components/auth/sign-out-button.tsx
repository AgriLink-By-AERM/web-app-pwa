"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

type SignOutButtonProps = {
  className?: string;
  iconClassName?: string;
  label?: string;
};

export function SignOutButton({ className, iconClassName, label = "Sign out" }: SignOutButtonProps) {
  const router = useRouter();

  function handleSignOut() {
    localStorage.removeItem("agrilink_token");
    localStorage.removeItem("agrilink_user");
    document.cookie = "agrilink_token=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "agrilink_user=; path=/; max-age=0; SameSite=Lax";
    router.replace("/");
    router.refresh();
  }

  return (
    <button className={cn("inline-flex items-center justify-center gap-2", className)} onClick={handleSignOut} type="button">
      <LogOut className={cn("h-4 w-4", iconClassName)} />
      {label}
    </button>
  );
}
