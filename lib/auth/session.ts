import { redirect } from "next/navigation";

export type UserSession = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "aggregator" | "dealer" | "buyer";
  isAdmin: boolean;
};

const localAdminSession: UserSession = {
  id: "admin_demo_001",
  name: "AgriLink Super Admin",
  email: "admin@agrilink.local",
  role: "admin",
  isAdmin: true
};

export async function getCurrentUserSession(): Promise<UserSession | null> {
  return localAdminSession;
}

export async function requireAdminSession(): Promise<UserSession> {
  const session = await getCurrentUserSession();

  if (!session?.isAdmin) {
    redirect("/");
  }

  return session;
}
