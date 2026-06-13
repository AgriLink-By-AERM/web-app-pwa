import Link from "next/link";
import { ArrowRight, BadgeCheck, Boxes, ClipboardList, KeyRound, PackageCheck, WalletCards } from "lucide-react";
import { DealerBottomNav } from "@/features/dealer/components/dealer-bottom-nav";
import { formatDealerDate, formatNaira, getDealerProfile, getRecentRedemptions } from "@/lib/dealer/store";

export default async function DealerHomePage() {
  const [profile, recentRedemptions] = await Promise.all([getDealerProfile(), getRecentRedemptions(3)]);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <section className="mx-auto min-h-screen max-w-md border-x border-slate-200 bg-slate-50 pb-24 shadow-sm">
        <header className="bg-indigo-900 px-5 pb-6 pt-10 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/45">Dealer command center</p>
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">{profile.shopName}</h1>
              <p className="mt-1 text-sm text-white/60">
                {profile.dealerCode} · {profile.location}
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-100">
                <BadgeCheck className="h-4 w-4" />
                Verified agro-dealer
              </span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <HeaderMetric icon={WalletCards} label="Disbursed today" value={formatNaira(profile.todayDisbursedValue)} />
            <HeaderMetric icon={ClipboardList} label="Redemptions" value={String(profile.todayVoucherCount)} />
          </div>
        </header>

        <section className="px-4 py-5">
          <Link
            className="flex min-h-20 items-center justify-between rounded-xl bg-indigo-700 px-5 py-4 text-white shadow-sm transition hover:bg-indigo-800"
            href="/dealer/redeem"
          >
            <span>
              <span className="block text-xs font-bold uppercase tracking-wide text-white/55">Primary action</span>
              <span className="mt-1 block text-lg font-extrabold">Redeem Voucher OTP</span>
            </span>
            <KeyRound className="h-8 w-8" />
          </Link>

          <section className="mt-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold">Inventory stock</h2>
              <Boxes className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="mt-4 space-y-3">
              {profile.inventory.map((item) => (
                <div className="rounded-lg bg-slate-50 p-3" key={item.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold">{item.name}</p>
                    <p className="text-sm font-extrabold text-indigo-700">{item.stockOnHand}</p>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-indigo-600"
                      style={{ width: `${Math.min(100, (item.stockOnHand / (item.lowStockThreshold * 4)) * 100)}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.unit} · Low stock below {item.lowStockThreshold}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-extrabold">Recent transactions</h2>
              <Link className="text-sm font-bold text-indigo-700" href="/dealer/history">
                See all
              </Link>
            </div>
            <div className="space-y-3">
              {recentRedemptions.map((record) => (
                <Link className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm" href="/dealer/history" key={record.id}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                        <PackageCheck className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold">{record.itemName}</span>
                        <span className="mt-0.5 block text-xs text-slate-500">{formatDealerDate(record.redeemedAt)}</span>
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </section>
      </section>
      <DealerBottomNav active="home" />
    </main>
  );
}

function HeaderMetric({ icon: Icon, label, value }: { icon: typeof WalletCards; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/10 p-3">
      <Icon className="h-5 w-5 text-indigo-200" />
      <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-white/45">{label}</p>
      <p className="mt-1 text-lg font-extrabold">{value}</p>
    </div>
  );
}
