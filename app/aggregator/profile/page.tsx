import {
  BadgeCheck,
  ChevronRight,
  CircleDollarSign,
  MapPin,
  PackageCheck,
  Phone,
  Settings,
  ShieldCheck,
  UsersRound
} from "lucide-react";
import { AppLogo } from "@/components/app-logo";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { AggregatorBottomNav } from "@/features/aggregator/components/aggregator-bottom-nav";
import { getAggregatorDashboardData } from "@/lib/aggregator/dashboard";
import { formatNaira, maskPhone } from "@/lib/format";

export default async function AggregatorProfilePage() {
  const data = await getAggregatorDashboardData();

  return (
    <main className="min-h-screen bg-surface text-ink lg:pl-72">
      <section className="mx-auto min-h-screen max-w-7xl bg-slate-50 pb-24 shadow-sm lg:bg-transparent lg:px-8 lg:py-6 lg:shadow-none">
        <header className="rounded-none bg-[#0F2A1A] px-5 pb-7 pt-10 text-white lg:rounded-2xl lg:p-6">
          <AppLogo className="mb-6 lg:hidden" iconClassName="bg-[#1E4D2B]" subtitle="Aggregator Profile" />
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/50">Aggregator Profile</p>
          <div className="mt-5 flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-2xl font-extrabold">
              AY
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-extrabold tracking-tight">{data.profile.fullName}</h1>
              <p className="mt-1 text-sm text-white/65">{maskPhone(data.profile.phoneNumber)}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-300/15 px-3 py-1 text-xs font-bold text-emerald-100">
                <BadgeCheck className="h-4 w-4" />
                Verified field aggregator
              </div>
            </div>
          </div>
        </header>

        <section className="px-4 py-5">
          <div className="grid grid-cols-2 gap-3">
            <MetricCard icon={PackageCheck} label="Total collections" value="124" />
            <MetricCard icon={UsersRound} label="Farmers reached" value="58" />
            <MetricCard icon={CircleDollarSign} label="Cash float" value={formatNaira(data.profile.cashFloatBalance)} />
            <MetricCard icon={ShieldCheck} label="Score" value={`${data.profile.performanceScore}/100`} />
          </div>

          <section className="mt-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-extrabold">Terminal location</h2>
            <div className="mt-4 flex items-start gap-3 rounded-lg bg-slate-50 px-3 py-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold">NIPOST Tarauni Field Terminal</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{data.profile.zone} · Kano dispatch corridor</p>
              </div>
            </div>
          </section>

          <section className="mt-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-extrabold">Account configuration</h2>
            <div className="mt-4 divide-y divide-slate-100">
              <ConfigRow icon={Phone} label="Phone account ID" value={maskPhone(data.profile.phoneNumber)} />
              <ConfigRow icon={ShieldCheck} label="Trust tier" value={data.profile.premiumTier} />
              <ConfigRow icon={Settings} label="Offline queue" value="Enabled for field logs" />
            </div>
          </section>

          <SignOutButton className="mt-5 flex min-h-12 w-full rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-600 shadow-sm transition hover:bg-red-50" />
        </section>
      </section>
      <AggregatorBottomNav active="profile" />
    </main>
  );
}

function MetricCard({ icon: Icon, label, value }: { icon: typeof PackageCheck; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-extrabold text-slate-950">{value}</p>
    </div>
  );
}

function ConfigRow({ icon: Icon, label, value }: { icon: typeof Phone; label: string; value: string }) {
  return (
    <div className="flex min-h-14 items-center gap-3 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
        <span className="mt-0.5 block truncate text-sm font-bold text-slate-900">{value}</span>
      </span>
      <ChevronRight className="h-4 w-4 text-slate-400" />
    </div>
  );
}
