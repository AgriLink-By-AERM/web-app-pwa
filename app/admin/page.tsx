import { AdminDashboard } from "@/features/admin/components/admin-dashboard";
import { getAdminDashboardData } from "@/lib/admin/service";
import { requireAdminSession } from "@/lib/auth/session";

export default async function AdminPage() {
  const session = await requireAdminSession();
  const data = await getAdminDashboardData();

  return <AdminDashboard initialData={data} session={session} />;
}
