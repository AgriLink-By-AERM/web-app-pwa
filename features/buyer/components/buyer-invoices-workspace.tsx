"use client";

import { useMemo, useState } from "react";
import { Download, FileText, LockKeyhole, WalletCards } from "lucide-react";
import {
  calculateEscrowSummary,
  formatBillingDate,
  formatNaira,
  invoiceStatusStyles,
  type CorporateInvoice,
  type InvoiceStatus
} from "@/lib/buyer/billing";

type BuyerInvoicesWorkspaceProps = {
  invoices: CorporateInvoice[];
};

export function BuyerInvoicesWorkspace({ invoices }: BuyerInvoicesWorkspaceProps) {
  const [statusOverrides, setStatusOverrides] = useState<Record<string, InvoiceStatus>>({});

  const renderedInvoices = useMemo(() => {
    return invoices.map((invoice) => ({ ...invoice, status: statusOverrides[invoice.id] ?? invoice.status }));
  }, [invoices, statusOverrides]);
  const summary = calculateEscrowSummary(renderedInvoices);

  function releaseEscrow(invoice: CorporateInvoice) {
    setStatusOverrides((current) => ({ ...current, [invoice.id]: "paid" }));
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-3">
        <EscrowCard icon={WalletCards} label="Paid balance" value={formatNaira(summary.paid)} tone="emerald" />
        <EscrowCard icon={LockKeyhole} label="Pending escrow" value={formatNaira(summary.pendingEscrow)} tone="blue" />
        <EscrowCard icon={FileText} label="Overdue balance" value={formatNaira(summary.overdue)} tone="red" />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-black text-slate-950">Enterprise invoicing ledger</h2>
          <p className="mt-1 text-sm text-slate-500">Commodity valuation, platform fee, logistics co-pay, and escrow controls.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left">
            <thead className="bg-slate-50">
              <tr>
                <Th>Invoice</Th>
                <Th>Batch</Th>
                <Th>Commodity</Th>
                <Th>Platform fee</Th>
                <Th>Logistics co-pay</Th>
                <Th>Escrow</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {renderedInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <Td>
                    <p className="font-black text-slate-950">{invoice.invoiceNumber}</p>
                    <p className="mt-1 text-xs text-slate-500">Due {formatBillingDate(invoice.dueAt)}</p>
                  </Td>
                  <Td>{invoice.batchReference}</Td>
                  <Td>
                    <p className="font-bold text-slate-900">{invoice.cropSpecies}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatNaira(invoice.baseCommodityValue)}</p>
                  </Td>
                  <Td>{formatNaira(invoice.platformFee)}</Td>
                  <Td>{formatNaira(invoice.logisticsCopay)}</Td>
                  <Td>{formatNaira(invoice.escrowBalance)}</Td>
                  <Td>
                    <span className={`rounded-full px-3 py-1 text-xs font-black capitalize ${invoiceStatusStyles[invoice.status]}`}>
                      {invoice.status.replace("_", " ")}
                    </span>
                  </Td>
                  <Td>
                    {invoice.status === "paid" ? (
                      <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-50" type="button">
                        <Download className="mr-2 inline h-4 w-4" />
                        Download PDF Receipt
                      </button>
                    ) : (
                      <button className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-black text-white hover:bg-blue-800" onClick={() => releaseEscrow(invoice)} type="button">
                        Release Escrow Funds
                      </button>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function EscrowCard({ icon: Icon, label, value, tone }: { icon: typeof WalletCards; label: string; value: string; tone: "emerald" | "blue" | "red" }) {
  const styles: Record<typeof tone, string> = {
    emerald: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
    red: "bg-red-50 text-red-700"
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${styles[tone]}`}>
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-4 text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{value}</p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-5 py-3 text-xs font-black uppercase tracking-wide text-slate-500">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-5 py-4 text-sm text-slate-700">{children}</td>;
}
