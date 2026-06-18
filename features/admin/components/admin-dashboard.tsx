"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Bell,
  CheckCircle2,
  ClipboardList,
  Factory,
  FileWarning,
  Gauge,
  LayoutDashboard,
  LockKeyhole,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
  Users
} from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { AppLogo } from "@/components/app-logo";
import {
  approveAdminUser,
  formatAdminCurrency,
  formatAdminDate,
  resolveAdminMatch,
  suspendAdminUser,
  type AdminDashboardData,
  type AdminLogStatus,
  type AdminMatchStatus,
  type AdminSystemSeverity,
  type AdminUser,
  type AdminUserStatus
} from "../../../lib/admin/service";
import type { UserSession } from "../../../lib/auth/session";
import { cn } from "../../../lib/utils";

type AdminScreen = "users" | "logs" | "matches" | "system";
type UserTab = "pending" | "active" | "suspended";
type Toast = {
  id: string;
  title: string;
  message: string;
  tone: "success" | "warning" | "info";
};

type AdminDashboardProps = {
  initialData: AdminDashboardData;
  session: UserSession;
};

const navItems: Array<{ id: AdminScreen; label: string; icon: typeof Users }> = [
  { id: "users", label: "User Management", icon: Users },
  { id: "logs", label: "Marketplace Logs", icon: ClipboardList },
  { id: "matches", label: "Matches & Disputes", icon: Factory },
  { id: "system", label: "System Logs", icon: Gauge }
];

export function AdminDashboard({ initialData, session }: AdminDashboardProps) {
  const [screen, setScreen] = useState<AdminScreen>("users");
  const [userTab, setUserTab] = useState<UserTab>("pending");
  const [users, setUsers] = useState<AdminUser[]>(initialData.users);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [matches, setMatches] = useState<AdminDashboardData["matches"]>(initialData.matches);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [suspendUser, setSuspendUser] = useState<AdminUser | null>(null);
  const [suspendReason, setSuspendReason] = useState<string>("");

  const stats = useMemo(
    () => ({
      pendingUsers: users.filter((user) => user.status === "pending").length,
      activeUsers: users.filter((user) => user.status === "active").length,
      flaggedLogs: initialData.logs.filter((log) => log.status === "flagged").length,
      disputedMatches: matches.filter((match) => match.status === "disputed").length
    }),
    [initialData.logs, matches, users]
  );

  const visibleUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const matchesTab = user.status === userTab;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.userId.toLowerCase().includes(normalizedSearch) ||
        user.zone.toLowerCase().includes(normalizedSearch);

      return matchesTab && matchesSearch;
    });
  }, [searchTerm, userTab, users]);

  function pushToast(title: string, message: string, tone: Toast["tone"]): void {
    const toast: Toast = {
      id: `toast_${Date.now()}`,
      title,
      message,
      tone
    };

    setToasts((current) => [toast, ...current].slice(0, 3));
  }

  async function handleApprove(userId: string): Promise<void> {
    await approveAdminUser(userId);
    setUsers((current) => current.map((user) => (user.id === userId ? { ...user, status: "active" } : user)));
    pushToast("User approved", "The account can now access its assigned AgriLink portal.", "success");
  }

  async function handleSuspendSubmit(): Promise<void> {
    if (!suspendUser || suspendReason.trim().length < 8) {
      pushToast("Suspension reason required", "Enter a clear reason before suspending this account.", "warning");
      return;
    }

    await suspendAdminUser(suspendUser.id, suspendReason.trim());
    setUsers((current) => current.map((user) => (user.id === suspendUser.id ? { ...user, status: "suspended" } : user)));
    setSuspendUser(null);
    setSuspendReason("");
    pushToast("Account suspended", `${suspendUser.name} has been restricted pending review.`, "warning");
  }

  async function handleResolveMatch(matchId: string): Promise<void> {
    await resolveAdminMatch(matchId);
    setMatches((current) => current.map((match) => (match.id === matchId ? { ...match, status: "resolved" } : match)));
    pushToast("Dispute resolved", "The match has been closed and marked resolved.", "success");
  }

  return (
    <main className="min-h-screen bg-[#0F2A1A] text-slate-100">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-white/10 bg-[#0F2A1A] px-4 py-5 lg:flex lg:flex-col">
          <AppLogo className="px-3" iconClassName="bg-[#1E4D2B]" subtitle="Admin Console" />

          <nav className="mt-8 flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === screen;

              return (
                <button
                  className={cn(
                    "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold transition",
                    isActive ? "bg-[#1E4D2B] text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )}
                  key={item.id}
                  onClick={() => setScreen(item.id)}
                  type="button"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F3EC] text-sm font-black text-[#1E4D2B]">
                {session.name.slice(0, 2).toUpperCase()}
              </span>
              <div>
                <p className="text-sm font-bold text-white">{session.name}</p>
                <p className="text-xs text-slate-500">isAdmin: true</p>
              </div>
            </div>
            <SignOutButton className="mt-4 min-h-10 w-full rounded-xl border border-red-300/30 bg-red-500/10 text-sm font-bold text-red-100 hover:bg-red-500/20" />
          </div>
        </aside>

        <section className="min-w-0 flex-1 bg-slate-100 text-slate-950">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                  <LockKeyhole className="h-4 w-4" />
                  Protected Administrative Workspace
                </div>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">AgriLink Operations Control</h1>
                <p className="mt-1 text-sm text-slate-500">Verify users, inspect supply logs, resolve disputes, and audit platform events.</p>
              </div>
              <div className="flex items-center gap-2">
                <AppLogo
                  className="lg:hidden"
                  iconClassName="h-10 w-10 bg-[#1E4D2B]"
                  textClassName="text-[#111827]"
                  subtitle="Admin"
                  subtitleClassName="text-slate-500"
                />
                <button className="hidden min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm md:flex" type="button">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>
                <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm" type="button">
                  <Bell className="h-5 w-5" />
                </button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-5 py-6">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard icon={Users} label="Pending Users" value={String(stats.pendingUsers)} tone="emerald" />
              <MetricCard icon={UserCheck} label="Active Users" value={String(stats.activeUsers)} tone="blue" />
              <MetricCard icon={FileWarning} label="Flagged Logs" value={String(stats.flaggedLogs)} tone="amber" />
              <MetricCard icon={AlertTriangle} label="Disputed Matches" value={String(stats.disputedMatches)} tone="red" />
            </section>

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
              {screen === "users" ? (
                <UsersPanel
                  onApprove={handleApprove}
                  onOpenSuspend={setSuspendUser}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  setUserTab={setUserTab}
                  userTab={userTab}
                  users={visibleUsers}
                />
              ) : null}
              {screen === "logs" ? <LogsPanel logs={initialData.logs} /> : null}
              {screen === "matches" ? <MatchesPanel matches={matches} onResolve={handleResolveMatch} /> : null}
              {screen === "system" ? <SystemPanel logs={initialData.systemLogs} /> : null}
            </section>
          </div>
        </section>
      </div>

      <div className="fixed bottom-5 right-5 z-50 w-80 space-y-2">
        {toasts.map((toast) => (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-950 shadow-xl" key={toast.id}>
            <p className="font-extrabold">{toast.title}</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">{toast.message}</p>
          </div>
        ))}
      </div>

      {suspendUser ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 text-slate-950 shadow-2xl">
            <h2 className="text-xl font-black">Suspend {suspendUser.name}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Record a compliance reason before restricting this account.</p>
            <textarea
              className="mt-5 min-h-32 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              onChange={(event) => setSuspendReason(event.target.value)}
              placeholder="Example: Registry license mismatch during verification refresh"
              value={suspendReason}
            />
            <div className="mt-5 flex justify-end gap-3">
              <button className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700" onClick={() => setSuspendUser(null)} type="button">
                Cancel
              </button>
              <button className="rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white" onClick={handleSuspendSubmit} type="button">
                Confirm Suspension
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function MetricCard({ icon: Icon, label, value, tone }: { icon: typeof Users; label: string; value: string; tone: "emerald" | "blue" | "amber" | "red" }) {
  const toneClass: Record<typeof tone, string> = {
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700"
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{value}</p>
        </div>
        <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", toneClass[tone])}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

function UsersPanel({
  onApprove,
  onOpenSuspend,
  searchTerm,
  setSearchTerm,
  setUserTab,
  userTab,
  users
}: {
  onApprove: (userId: string) => Promise<void>;
  onOpenSuspend: (user: AdminUser) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  setUserTab: (value: UserTab) => void;
  userTab: UserTab;
  users: AdminUser[];
}) {
  return (
    <>
      <PanelHeader title="User verification queue" subtitle="Approve, suspend, and audit role-specific access across all AgriLink portals." />
      <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["pending", "active", "suspended"] as UserTab[]).map((tab) => (
            <button
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-bold capitalize",
                userTab === tab ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
              key={tab}
              onClick={() => setUserTab(tab)}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>
        <label className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm text-slate-500 lg:w-80">
          <Search className="h-4 w-4" />
          <input
            className="w-full bg-transparent font-medium text-slate-950 outline-none"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search user, ID, or zone"
            value={searchTerm}
          />
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left">
          <thead className="bg-slate-50">
            <tr>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-xs font-black text-white">{user.initials}</span>
                    <div>
                      <p className="font-extrabold text-slate-950">{user.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{user.userId}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.zone}</TableCell>
                <TableCell>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{user.verificationScore}%</span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={user.status} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {user.status === "pending" ? (
                      <button className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-black text-white" onClick={() => void onApprove(user.id)} type="button">
                        Approve
                      </button>
                    ) : null}
                    {user.status !== "suspended" ? (
                      <button className="rounded-lg border border-red-200 px-3 py-2 text-xs font-black text-red-700" onClick={() => onOpenSuspend(user)} type="button">
                        Suspend
                      </button>
                    ) : null}
                  </div>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function LogsPanel({ logs }: { logs: AdminDashboardData["logs"] }) {
  return (
    <>
      <PanelHeader title="Marketplace supply logs" subtitle="Inspect field-submitted produce and agri-waste records before matching and settlement." />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left">
          <thead className="bg-slate-50">
            <tr>
              <TableHead>Batch</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Commodity</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Logged</TableHead>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => (
              <tr key={log.id}>
                <TableCell>
                  <p className="font-bold text-slate-950">{log.batchReference}</p>
                  <p className="mt-1 text-xs text-slate-500">{log.category}</p>
                </TableCell>
                <TableCell>{log.owner}</TableCell>
                <TableCell>{log.commodity}</TableCell>
                <TableCell>{log.weightKg.toLocaleString()} kg</TableCell>
                <TableCell>{log.region}</TableCell>
                <TableCell>
                  <LogStatusBadge status={log.status} />
                </TableCell>
                <TableCell>{formatAdminDate(log.loggedAt)}</TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function MatchesPanel({ matches, onResolve }: { matches: AdminDashboardData["matches"]; onResolve: (matchId: string) => Promise<void> }) {
  return (
    <>
      <PanelHeader title="Matches and disputes" subtitle="Review escrow-backed buyer matches and resolve weight or quality disputes." />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1040px] text-left">
          <thead className="bg-slate-50">
            <tr>
              <TableHead>Buyer</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Commodity</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead>Escrow</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {matches.map((match) => (
              <tr key={match.id}>
                <TableCell>{match.buyer}</TableCell>
                <TableCell>{match.batchReference}</TableCell>
                <TableCell>{match.commodity}</TableCell>
                <TableCell>{match.volumeMt} MT</TableCell>
                <TableCell>{formatAdminCurrency(match.escrowValue)}</TableCell>
                <TableCell>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">{match.matchScore}%</span>
                </TableCell>
                <TableCell>
                  <MatchStatusBadge status={match.status} />
                </TableCell>
                <TableCell>
                  {match.status === "disputed" ? (
                    <button className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-black text-white" onClick={() => void onResolve(match.id)} type="button">
                      Resolve
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-slate-400">No action</span>
                  )}
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function SystemPanel({ logs }: { logs: AdminDashboardData["systemLogs"] }) {
  return (
    <>
      <PanelHeader title="System audit logs" subtitle="Trace security, escrow, registry, and compliance events across the platform." />
      <div className="divide-y divide-slate-100">
        {logs.map((log) => (
          <article className="flex items-start gap-4 p-5" key={log.id}>
            <span className={cn("mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", systemSeverityClass(log.severity))}>
              {log.severity === "info" ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
            </span>
            <div className="min-w-0">
              <p className="font-extrabold text-slate-950">{log.actor}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{log.event}</p>
              <p className="mt-2 text-xs font-bold text-slate-400">{formatAdminDate(log.createdAt)}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function PanelHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="border-b border-slate-200 px-5 py-4">
      <div className="flex items-center gap-2">
        <BadgeCheck className="h-5 w-5 text-emerald-600" />
        <h2 className="text-lg font-extrabold text-slate-950">{title}</h2>
      </div>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}

function TableHead({ children }: { children: React.ReactNode }) {
  return <th className="px-5 py-3 text-xs font-black uppercase tracking-wide text-slate-500">{children}</th>;
}

function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="px-5 py-4 text-sm text-slate-700">{children}</td>;
}

function StatusBadge({ status }: { status: AdminUserStatus }) {
  const styles: Record<AdminUserStatus, string> = {
    active: "bg-emerald-50 text-emerald-700",
    pending: "bg-amber-50 text-amber-700",
    suspended: "bg-red-50 text-red-700"
  };

  return <span className={cn("rounded-full px-3 py-1 text-xs font-black capitalize", styles[status])}>{status}</span>;
}

function LogStatusBadge({ status }: { status: AdminLogStatus }) {
  const styles: Record<AdminLogStatus, string> = {
    clean: "bg-emerald-50 text-emerald-700",
    flagged: "bg-amber-50 text-amber-700",
    rejected: "bg-red-50 text-red-700"
  };

  return <span className={cn("rounded-full px-3 py-1 text-xs font-black capitalize", styles[status])}>{status}</span>;
}

function MatchStatusBadge({ status }: { status: AdminMatchStatus }) {
  const styles: Record<AdminMatchStatus, string> = {
    accepted: "bg-emerald-50 text-emerald-700",
    disputed: "bg-red-50 text-red-700",
    pending: "bg-amber-50 text-amber-700",
    resolved: "bg-blue-50 text-blue-700"
  };

  return <span className={cn("rounded-full px-3 py-1 text-xs font-black capitalize", styles[status])}>{status}</span>;
}

function systemSeverityClass(severity: AdminSystemSeverity): string {
  const styles: Record<AdminSystemSeverity, string> = {
    critical: "bg-red-50 text-red-700",
    info: "bg-blue-50 text-blue-700",
    warning: "bg-amber-50 text-amber-700"
  };

  return styles[severity];
}
