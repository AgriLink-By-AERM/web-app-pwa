import Link from "next/link";
import { ArrowLeft, Leaf, ShieldCheck } from "lucide-react";

const portals = [
  { href: "/aggregator/onboarding", label: "Aggregator signup", description: "Register or resume field aggregator onboarding." },
  { href: "/buyer/dashboard", label: "Buyer workspace", description: "Open the corporate buyer dashboard." },
  { href: "/dealer/home", label: "Dealer workspace", description: "Open agro-dealer voucher tools." },
  { href: "/admin", label: "Admin console", description: "Open platform operations." }
];

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0F2A1A] px-4 py-8 text-white sm:px-6 lg:px-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-100/80 hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Landing page
      </Link>

      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl flex-col justify-center py-10">
        <div className="max-w-2xl">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1E4D2B]">
            <Leaf className="h-7 w-7" />
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.24em] text-emerald-100/50">AgriLink access</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">Choose where to continue</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-100/65">
            You have been signed out. Select a portal to sign in, register, or continue a demo workflow.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {portals.map((portal) => (
            <Link
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-[#F9A825]/60 hover:bg-white/[0.08]"
              href={portal.href}
              key={portal.href}
            >
              <ShieldCheck className="h-5 w-5 text-[#F9A825]" />
              <p className="mt-4 text-lg font-extrabold">{portal.label}</p>
              <p className="mt-2 text-sm leading-6 text-emerald-100/55">{portal.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
