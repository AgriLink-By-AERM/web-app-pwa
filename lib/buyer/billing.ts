import type { CropSpecies } from "@/lib/buyer/store";

export type InvoiceStatus = "paid" | "pending_escrow" | "overdue";

export type TradeStatus = "completed" | "reconciled" | "disputed";

export type WarehouseNodeStatus = "active" | "maintenance" | "offline";

export type CorporateInvoice = {
  id: string;
  invoiceNumber: string;
  batchReference: string;
  cropSpecies: CropSpecies;
  baseCommodityValue: number;
  platformFee: number;
  logisticsCopay: number;
  escrowBalance: number;
  status: InvoiceStatus;
  issuedAt: string;
  dueAt: string;
};

export type TransactionHistory = {
  id: string;
  batchReference: string;
  cropSpecies: CropSpecies;
  variety: string;
  originHub: string;
  region: string;
  metricTonsHandled: number;
  deliveredAt: string;
  totalValue: number;
  status: TradeStatus;
};

export type WarehouseNode = {
  id: string;
  name: string;
  lgaTerminal: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  status: WarehouseNodeStatus;
  receivingCapacityMt: number;
};

export type EscrowSummary = {
  paid: number;
  pendingEscrow: number;
  overdue: number;
};

export type DeliveryManifest = {
  trackingId: string;
  batchReference: string;
  cropSpecies: CropSpecies;
  expectedWeightKg: number;
  receivedWeightKg: number;
  originHub: string;
  destinationWarehouse: string;
  driverName: string;
  vehiclePlate: string;
  qrValue: string;
};

export const invoiceStatusStyles: Record<InvoiceStatus, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  pending_escrow: "bg-blue-100 text-blue-700",
  overdue: "bg-red-100 text-red-700"
};

export const tradeStatusStyles: Record<TradeStatus, string> = {
  completed: "bg-emerald-100 text-emerald-700",
  reconciled: "bg-blue-100 text-blue-700",
  disputed: "bg-red-100 text-red-700"
};

export const warehouseStatusStyles: Record<WarehouseNodeStatus, string> = {
  active: "bg-emerald-100 text-emerald-700",
  maintenance: "bg-amber-100 text-amber-800",
  offline: "bg-red-100 text-red-700"
};

export const corporateInvoices: CorporateInvoice[] = [
  {
    id: "inv_001",
    invoiceNumber: "INV-AGL-2026-9011",
    batchReference: "AGL-MAT-900128",
    cropSpecies: "Cassava Peel",
    baseCommodityValue: 625600,
    platformFee: 18768,
    logisticsCopay: 95000,
    escrowBalance: 739368,
    status: "pending_escrow",
    issuedAt: "2026-06-12T11:30:00+01:00",
    dueAt: "2026-06-14T17:00:00+01:00"
  },
  {
    id: "inv_002",
    invoiceNumber: "INV-AGL-2026-9012",
    batchReference: "AGL-MAT-900129",
    cropSpecies: "Rice Husks",
    baseCommodityValue: 497800,
    platformFee: 14934,
    logisticsCopay: 124000,
    escrowBalance: 636734,
    status: "overdue",
    issuedAt: "2026-06-09T10:10:00+01:00",
    dueAt: "2026-06-11T17:00:00+01:00"
  },
  {
    id: "inv_003",
    invoiceNumber: "INV-AGL-2026-9013",
    batchReference: "AGL-MAT-900130",
    cropSpecies: "Tomatoes",
    baseCommodityValue: 2562000,
    platformFee: 76860,
    logisticsCopay: 46000,
    escrowBalance: 0,
    status: "paid",
    issuedAt: "2026-06-08T09:20:00+01:00",
    dueAt: "2026-06-10T17:00:00+01:00"
  }
];

export const transactionHistories: TransactionHistory[] = [
  {
    id: "trade_001",
    batchReference: "AGL-MAT-899901",
    cropSpecies: "Cassava Peel",
    variety: "Industrial starch grade",
    originHub: "Tarauni Terminal",
    region: "Kano",
    metricTonsHandled: 18.4,
    deliveredAt: "2026-06-10T08:45:00+01:00",
    totalValue: 715400,
    status: "reconciled"
  },
  {
    id: "trade_002",
    batchReference: "AGL-MAT-899902",
    cropSpecies: "Rice Husks",
    variety: "Biomass feedstock",
    originHub: "Kura Depot",
    region: "Kano",
    metricTonsHandled: 26.2,
    deliveredAt: "2026-06-08T14:15:00+01:00",
    totalValue: 636734,
    status: "completed"
  },
  {
    id: "trade_003",
    batchReference: "AGL-MAT-899903",
    cropSpecies: "Tomatoes",
    variety: "Roma fresh produce",
    originHub: "Mile 12 Cold Lane",
    region: "Lagos",
    metricTonsHandled: 4.2,
    deliveredAt: "2026-06-07T15:40:00+01:00",
    totalValue: 2684860,
    status: "reconciled"
  },
  {
    id: "trade_004",
    batchReference: "AGL-MAT-899904",
    cropSpecies: "Maize Stalks",
    variety: "Dry silage residue",
    originHub: "Zaria Rural Node",
    region: "Kaduna",
    metricTonsHandled: 31,
    deliveredAt: "2025-12-18T11:25:00+01:00",
    totalValue: 864460,
    status: "disputed"
  }
];

export const warehouseNodes: WarehouseNode[] = [
  {
    id: "wh_001",
    name: "Kano Industrial Receiving Dock",
    lgaTerminal: "Nassarawa LGA",
    coordinates: { latitude: 12.0022, longitude: 8.592 },
    status: "active",
    receivingCapacityMt: 420
  },
  {
    id: "wh_002",
    name: "Lagos Fresh Produce Cross-Dock",
    lgaTerminal: "Ikorodu LGA",
    coordinates: { latitude: 6.6194, longitude: 3.5105 },
    status: "active",
    receivingCapacityMt: 96
  },
  {
    id: "wh_003",
    name: "Kaduna Biomass Storage Node",
    lgaTerminal: "Zaria LGA",
    coordinates: { latitude: 11.0855, longitude: 7.7199 },
    status: "maintenance",
    receivingCapacityMt: 260
  }
];

export const deliveryManifests: DeliveryManifest[] = [
  {
    trackingId: "NIPOST-AGL-482100",
    batchReference: "AGL-MAT-900128",
    cropSpecies: "Cassava Peel",
    expectedWeightKg: 18400,
    receivedWeightKg: 18320,
    originHub: "Tarauni aggregation corridor",
    destinationWarehouse: "Kano Industrial Receiving Dock",
    driverName: "Sani Musa",
    vehiclePlate: "KAN-482-AG",
    qrValue: "AGRILINK:MANIFEST:NIPOST-AGL-482100"
  },
  {
    trackingId: "NIPOST-AGL-775012",
    batchReference: "AGL-MAT-900130",
    cropSpecies: "Tomatoes",
    expectedWeightKg: 4200,
    receivedWeightKg: 4188,
    originHub: "Mile 12 Cold Lane",
    destinationWarehouse: "Lagos Fresh Produce Cross-Dock",
    driverName: "Tunde Adeyemi",
    vehiclePlate: "LND-204-FP",
    qrValue: "AGRILINK:MANIFEST:NIPOST-AGL-775012"
  }
];

export async function getInvoices(): Promise<CorporateInvoice[]> {
  await simulateNetworkDelay(120);
  return corporateInvoices;
}

export async function getTransactionHistories(): Promise<TransactionHistory[]> {
  await simulateNetworkDelay(120);
  return transactionHistories;
}

export async function getWarehouseNodes(): Promise<WarehouseNode[]> {
  await simulateNetworkDelay(120);
  return warehouseNodes;
}

export async function getDeliveryManifests(): Promise<DeliveryManifest[]> {
  await simulateNetworkDelay(120);
  return deliveryManifests;
}

export function calculateEscrowSummary(invoices: CorporateInvoice[]): EscrowSummary {
  return invoices.reduce<EscrowSummary>(
    (summary, invoice) => {
      if (invoice.status === "paid") {
        summary.paid += invoice.baseCommodityValue + invoice.platformFee + invoice.logisticsCopay;
      }

      if (invoice.status === "pending_escrow") {
        summary.pendingEscrow += invoice.escrowBalance;
      }

      if (invoice.status === "overdue") {
        summary.overdue += invoice.escrowBalance;
      }

      return summary;
    },
    { paid: 0, pendingEscrow: 0, overdue: 0 }
  );
}

export function formatBillingDate(value: string): string {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Lagos"
  }).format(new Date(value));
}

export function formatNaira(value: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(value);
}

async function simulateNetworkDelay(milliseconds: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
