export type InputCategory = "seed" | "fertilizer" | "chemical";

export type RegistrySubmissionStatus = "submitted" | "pending_review" | "accepted" | "rejected";

export type InputStock = {
  id: string;
  category: InputCategory;
  itemName: string;
  unit: string;
  openingStock: number;
  receivedThisMonth: number;
  allocatedThisMonth: number;
  distributedThisMonth: number;
  lowStockThreshold: number;
};

export type ReportSummary = {
  id: string;
  monthLabel: string;
  periodStart: string;
  periodEnd: string;
  totalFarmersServed: number;
  totalWalletValue: number;
  registryStatus: RegistrySubmissionStatus;
  submittedAt?: string;
  pdfHref: string;
  csvHref: string;
};

export type MonthlyMetrics = {
  monthLabel: string;
  seedBagsDistributed: number;
  fertilizerBagsDistributed: number;
  chemicalLitresDistributed: number;
  farmersServed: number;
  walletValueRedeemed: number;
  lowStockCount: number;
  distributionCompletionRate: number;
};

export type StockLevel = "healthy" | "watch" | "low";

export type StockStatus = {
  item: InputStock;
  closingStock: number;
  allocatedPercent: number;
  distributedPercent: number;
  level: StockLevel;
};

export const monthlyInputStocks: InputStock[] = [
  {
    id: "stock_seed_maize",
    category: "seed",
    itemName: "Hybrid Maize Seed 10kg",
    unit: "bags",
    openingStock: 80,
    receivedThisMonth: 40,
    allocatedThisMonth: 76,
    distributedThisMonth: 68,
    lowStockThreshold: 20
  },
  {
    id: "stock_seed_rice",
    category: "seed",
    itemName: "NERICA Rice Seed 25kg",
    unit: "bags",
    openingStock: 45,
    receivedThisMonth: 25,
    allocatedThisMonth: 42,
    distributedThisMonth: 36,
    lowStockThreshold: 14
  },
  {
    id: "stock_fert_npk",
    category: "fertilizer",
    itemName: "NPK Fertilizer 50kg",
    unit: "bags",
    openingStock: 120,
    receivedThisMonth: 90,
    allocatedThisMonth: 164,
    distributedThisMonth: 138,
    lowStockThreshold: 35
  },
  {
    id: "stock_fert_urea",
    category: "fertilizer",
    itemName: "Urea Fertilizer 50kg",
    unit: "bags",
    openingStock: 70,
    receivedThisMonth: 60,
    allocatedThisMonth: 102,
    distributedThisMonth: 88,
    lowStockThreshold: 25
  },
  {
    id: "stock_chem_herbicide",
    category: "chemical",
    itemName: "Selective Herbicide 1L",
    unit: "litres",
    openingStock: 96,
    receivedThisMonth: 48,
    allocatedThisMonth: 101,
    distributedThisMonth: 84,
    lowStockThreshold: 30
  },
  {
    id: "stock_chem_pesticide",
    category: "chemical",
    itemName: "Organic Pesticide 500ml",
    unit: "litres",
    openingStock: 60,
    receivedThisMonth: 36,
    allocatedThisMonth: 74,
    distributedThisMonth: 58,
    lowStockThreshold: 18
  }
];

export const reportSummaries: ReportSummary[] = [
  {
    id: "report_june_2026",
    monthLabel: "June 2026",
    periodStart: "2026-06-01",
    periodEnd: "2026-06-30",
    totalFarmersServed: 142,
    totalWalletValue: 3820000,
    registryStatus: "pending_review",
    submittedAt: "2026-06-12T12:30:00+01:00",
    pdfHref: "/dealer/reports/monthly?format=pdf&period=2026-06",
    csvHref: "/dealer/reports/monthly?format=csv&period=2026-06"
  },
  {
    id: "report_may_2026",
    monthLabel: "May 2026",
    periodStart: "2026-05-01",
    periodEnd: "2026-05-31",
    totalFarmersServed: 218,
    totalWalletValue: 5246000,
    registryStatus: "accepted",
    submittedAt: "2026-06-02T09:45:00+01:00",
    pdfHref: "/exports/dealer-may-2026.pdf",
    csvHref: "/exports/dealer-may-2026.csv"
  },
  {
    id: "report_april_2026",
    monthLabel: "April 2026",
    periodStart: "2026-04-01",
    periodEnd: "2026-04-30",
    totalFarmersServed: 193,
    totalWalletValue: 4712000,
    registryStatus: "accepted",
    submittedAt: "2026-05-02T10:10:00+01:00",
    pdfHref: "/exports/dealer-april-2026.pdf",
    csvHref: "/exports/dealer-april-2026.csv"
  },
  {
    id: "report_march_2026",
    monthLabel: "March 2026",
    periodStart: "2026-03-01",
    periodEnd: "2026-03-31",
    totalFarmersServed: 161,
    totalWalletValue: 3965000,
    registryStatus: "submitted",
    submittedAt: "2026-04-02T11:20:00+01:00",
    pdfHref: "/exports/dealer-march-2026.pdf",
    csvHref: "/exports/dealer-march-2026.csv"
  }
];

export async function getMonthlyInputStocks(): Promise<InputStock[]> {
  await simulateNetworkDelay(120);
  return monthlyInputStocks;
}

export async function getReportSummaries(): Promise<ReportSummary[]> {
  await simulateNetworkDelay(120);
  return reportSummaries;
}

export function calculateClosingStock(stock: InputStock): number {
  return stock.openingStock + stock.receivedThisMonth - stock.distributedThisMonth;
}

export function calculateAllocatedPercent(stock: InputStock): number {
  const available = stock.openingStock + stock.receivedThisMonth;
  return available === 0 ? 0 : Math.round((stock.allocatedThisMonth / available) * 100);
}

export function calculateDistributedPercent(stock: InputStock): number {
  const available = stock.openingStock + stock.receivedThisMonth;
  return available === 0 ? 0 : Math.round((stock.distributedThisMonth / available) * 100);
}

export function getStockLevel(stock: InputStock): StockLevel {
  const closingStock = calculateClosingStock(stock);

  if (closingStock <= stock.lowStockThreshold) {
    return "low";
  }

  if (closingStock <= stock.lowStockThreshold * 1.75) {
    return "watch";
  }

  return "healthy";
}

export function buildStockStatus(stock: InputStock): StockStatus {
  return {
    item: stock,
    closingStock: calculateClosingStock(stock),
    allocatedPercent: calculateAllocatedPercent(stock),
    distributedPercent: calculateDistributedPercent(stock),
    level: getStockLevel(stock)
  };
}

export function calculateMonthlyMetrics(stocks: InputStock[]): MonthlyMetrics {
  const seedBagsDistributed = sumByCategory(stocks, "seed");
  const fertilizerBagsDistributed = sumByCategory(stocks, "fertilizer");
  const chemicalLitresDistributed = sumByCategory(stocks, "chemical");
  const totalAllocated = stocks.reduce((total, stock) => total + stock.allocatedThisMonth, 0);
  const totalDistributed = stocks.reduce((total, stock) => total + stock.distributedThisMonth, 0);

  return {
    monthLabel: "June 2026",
    seedBagsDistributed,
    fertilizerBagsDistributed,
    chemicalLitresDistributed,
    farmersServed: 142,
    walletValueRedeemed: 3820000,
    lowStockCount: stocks.filter((stock) => getStockLevel(stock) === "low").length,
    distributionCompletionRate: totalAllocated === 0 ? 0 : Math.round((totalDistributed / totalAllocated) * 100)
  };
}

export function formatReportDate(value: string): string {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeZone: "Africa/Lagos"
  }).format(new Date(value));
}

function sumByCategory(stocks: InputStock[], category: InputCategory): number {
  return stocks
    .filter((stock) => stock.category === category)
    .reduce((total, stock) => total + stock.distributedThisMonth, 0);
}

async function simulateNetworkDelay(milliseconds: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
