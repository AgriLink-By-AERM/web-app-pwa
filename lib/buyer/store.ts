export type BuyerMatchStatus = "new" | "reviewing" | "accepted" | "rejected" | "in_transit" | "delivered";

export type DemandOrderStatus = "active" | "paused" | "fulfilled";

export type LogisticsMode = "buyer_pickup" | "platform_freight" | "third_party_haulage";

export type CropSpecies =
  | "Cassava Peel"
  | "Rice Husks"
  | "Maize Stalks"
  | "Tomatoes"
  | "Pepper"
  | "Soybean Meal"
  | "Groundnut Shells";

export type BuyerDashboardStats = {
  activeMatches: number;
  openDemandOrders: number;
  totalVolumeSecuredMt: number;
  outstandingInvoices: number;
};

export type AgroMatchBatch = {
  id: string;
  batchReference: string;
  cropSpecies: CropSpecies;
  variety: string;
  matchScore: number;
  bulkWeightKg: number;
  region: string;
  sourceLocation: string;
  aggregatorId: string;
  aggregatorName: string;
  status: BuyerMatchStatus;
  pricePerKg: number;
  platformFee: number;
  logisticsFee: number;
  totalSourcedCost: number;
  estimatedPickupWindow: string;
  estimatedDeliveryWindow: string;
  moistureGrade: "Dry" | "Damp" | "Wet" | "Fresh";
  logisticsMode: LogisticsMode;
};

export type DemandOrder = {
  id: string;
  cropSpecies: CropSpecies;
  targetWeightMt: number;
  fulfilledWeightMt: number;
  maxPricePerKg: number;
  regions: string[];
  startDate: string;
  endDate: string;
  status: DemandOrderStatus;
  createdBy: string;
};

export type TransitBatch = {
  id: string;
  cropSpecies: CropSpecies;
  vehicleId: string;
  origin: string;
  destination: string;
  eta: string;
  progressPercent: number;
};

export type InventoryAlert = {
  id: string;
  severity: "info" | "warning" | "critical";
  title: string;
  description: string;
  createdAt: string;
};

export type BuyerDashboardData = {
  stats: BuyerDashboardStats;
  activeMatches: AgroMatchBatch[];
  transitBatches: TransitBatch[];
  inventoryAlerts: InventoryAlert[];
  demandOrders: DemandOrder[];
};

export type DemandOrderFormState = {
  cropSpecies: CropSpecies | "";
  targetWeightMt: string;
  maxPricePerKg: string;
  startDate: string;
  endDate: string;
  regions: string;
};

export type DemandOrderFormErrors = Partial<Record<keyof DemandOrderFormState, string>>;

export const cropSpeciesOptions: CropSpecies[] = [
  "Cassava Peel",
  "Rice Husks",
  "Maize Stalks",
  "Tomatoes",
  "Pepper",
  "Soybean Meal",
  "Groundnut Shells"
];

export const initialDemandOrderForm: DemandOrderFormState = {
  cropSpecies: "",
  targetWeightMt: "",
  maxPricePerKg: "",
  startDate: "2026-06-12",
  endDate: "2026-09-12",
  regions: "Kano, Kaduna, Lagos"
};

const matches: AgroMatchBatch[] = [
  {
    id: "match_bulk_001",
    batchReference: "AGL-MAT-900128",
    cropSpecies: "Cassava Peel",
    variety: "Sun-dried industrial starch grade",
    matchScore: 96,
    bulkWeightKg: 18400,
    region: "Kano North",
    sourceLocation: "Tarauni aggregation corridor",
    aggregatorId: "AGG-4821",
    aggregatorName: "Amina Yusuf",
    status: "new",
    pricePerKg: 34,
    platformFee: 18768,
    logisticsFee: 95000,
    totalSourcedCost: 739368,
    estimatedPickupWindow: "Jun 12, 2:00 PM - 5:00 PM",
    estimatedDeliveryWindow: "Jun 13, 8:00 AM - 11:00 AM",
    moistureGrade: "Dry",
    logisticsMode: "platform_freight"
  },
  {
    id: "match_bulk_002",
    batchReference: "AGL-MAT-900129",
    cropSpecies: "Rice Husks",
    variety: "Low-moisture biomass feedstock",
    matchScore: 91,
    bulkWeightKg: 26200,
    region: "Kura Basin",
    sourceLocation: "Kura cooperative depot",
    aggregatorId: "AGG-1930",
    aggregatorName: "Bello Sani",
    status: "reviewing",
    pricePerKg: 19,
    platformFee: 14934,
    logisticsFee: 124000,
    totalSourcedCost: 636734,
    estimatedPickupWindow: "Jun 13, 9:00 AM - 12:00 PM",
    estimatedDeliveryWindow: "Jun 14, 7:00 AM - 10:00 AM",
    moistureGrade: "Damp",
    logisticsMode: "third_party_haulage"
  },
  {
    id: "match_bulk_003",
    batchReference: "AGL-MAT-900130",
    cropSpecies: "Tomatoes",
    variety: "Roma fresh produce",
    matchScore: 88,
    bulkWeightKg: 4200,
    region: "Lagos East",
    sourceLocation: "Mile 12 cold pickup lane",
    aggregatorId: "AGG-7750",
    aggregatorName: "Chinedu Obi",
    status: "in_transit",
    pricePerKg: 610,
    platformFee: 76860,
    logisticsFee: 46000,
    totalSourcedCost: 2684860,
    estimatedPickupWindow: "Jun 12, 11:00 AM - 12:30 PM",
    estimatedDeliveryWindow: "Jun 12, 2:30 PM - 4:00 PM",
    moistureGrade: "Fresh",
    logisticsMode: "platform_freight"
  },
  {
    id: "match_bulk_004",
    batchReference: "AGL-MAT-900131",
    cropSpecies: "Maize Stalks",
    variety: "Chopped dry silage residue",
    matchScore: 83,
    bulkWeightKg: 31000,
    region: "Kaduna South",
    sourceLocation: "Zaria rural consolidation node",
    aggregatorId: "AGG-6502",
    aggregatorName: "Hadiza Lawal",
    status: "accepted",
    pricePerKg: 22,
    platformFee: 20460,
    logisticsFee: 162000,
    totalSourcedCost: 864460,
    estimatedPickupWindow: "Jun 14, 6:00 AM - 9:00 AM",
    estimatedDeliveryWindow: "Jun 15, 8:00 AM - 12:00 PM",
    moistureGrade: "Dry",
    logisticsMode: "buyer_pickup"
  }
];

const demandOrders: DemandOrder[] = [
  {
    id: "demand_001",
    cropSpecies: "Cassava Peel",
    targetWeightMt: 120,
    fulfilledWeightMt: 74,
    maxPricePerKg: 36,
    regions: ["Kano", "Kaduna"],
    startDate: "2026-06-01",
    endDate: "2026-08-31",
    status: "active",
    createdBy: "Procurement Desk"
  },
  {
    id: "demand_002",
    cropSpecies: "Rice Husks",
    targetWeightMt: 200,
    fulfilledWeightMt: 118,
    maxPricePerKg: 21,
    regions: ["Kura", "Bunkure"],
    startDate: "2026-05-15",
    endDate: "2026-09-15",
    status: "active",
    createdBy: "Industrial Feedstock Team"
  },
  {
    id: "demand_003",
    cropSpecies: "Tomatoes",
    targetWeightMt: 35,
    fulfilledWeightMt: 22,
    maxPricePerKg: 650,
    regions: ["Lagos", "Ogun"],
    startDate: "2026-06-01",
    endDate: "2026-07-15",
    status: "paused",
    createdBy: "Fresh Produce Desk"
  }
];

const transitBatches: TransitBatch[] = [
  {
    id: "transit_001",
    cropSpecies: "Tomatoes",
    vehicleId: "LAG-TRK-204",
    origin: "Mile 12",
    destination: "Ikoyi Central Kitchen",
    eta: "Today, 3:20 PM",
    progressPercent: 64
  },
  {
    id: "transit_002",
    cropSpecies: "Maize Stalks",
    vehicleId: "KD-HAUL-882",
    origin: "Zaria",
    destination: "Kano Biofuel Works",
    eta: "Tomorrow, 10:00 AM",
    progressPercent: 28
  }
];

const inventoryAlerts: InventoryAlert[] = [
  {
    id: "alert_001",
    severity: "critical",
    title: "Cassava peel demand gap",
    description: "46MT still open against August industrial feedstock contract.",
    createdAt: "2026-06-12T11:10:00+01:00"
  },
  {
    id: "alert_002",
    severity: "warning",
    title: "Rice husks moisture variance",
    description: "Two batches from Kura are above preferred moisture threshold.",
    createdAt: "2026-06-12T10:35:00+01:00"
  },
  {
    id: "alert_003",
    severity: "info",
    title: "Fresh tomato route cleared",
    description: "Platform freight has confirmed cold-chain pickup for Lagos East.",
    createdAt: "2026-06-12T09:55:00+01:00"
  }
];

export async function getBuyerDashboard(): Promise<BuyerDashboardData> {
  await simulateNetworkDelay(120);

  return {
    stats: {
      activeMatches: matches.filter((match) => match.status !== "delivered" && match.status !== "rejected").length,
      openDemandOrders: demandOrders.filter((order) => order.status === "active").length,
      totalVolumeSecuredMt: Math.round(matches.reduce((total, match) => total + match.bulkWeightKg, 0) / 1000),
      outstandingInvoices: 7
    },
    activeMatches: matches,
    transitBatches,
    inventoryAlerts,
    demandOrders
  };
}

export async function getAgroMatches(): Promise<AgroMatchBatch[]> {
  await simulateNetworkDelay(120);
  return matches;
}

export async function getDemandOrders(): Promise<DemandOrder[]> {
  await simulateNetworkDelay(120);
  return demandOrders;
}

export function validateDemandOrderForm(form: DemandOrderFormState): DemandOrderFormErrors {
  const errors: DemandOrderFormErrors = {};
  const targetWeight = Number(form.targetWeightMt);
  const maxPrice = Number(form.maxPricePerKg);

  if (!form.cropSpecies) {
    errors.cropSpecies = "Select a crop or commodity.";
  }

  if (!Number.isFinite(targetWeight) || targetWeight <= 0) {
    errors.targetWeightMt = "Enter a positive target weight in metric tons.";
  }

  if (!Number.isFinite(maxPrice) || maxPrice <= 0) {
    errors.maxPricePerKg = "Enter a valid maximum price ceiling.";
  }

  if (!form.startDate) {
    errors.startDate = "Select a contract start date.";
  }

  if (!form.endDate) {
    errors.endDate = "Select a contract end date.";
  }

  if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate)) {
    errors.endDate = "End date must be after the start date.";
  }

  if (form.regions.trim().length < 3) {
    errors.regions = "Enter at least one sourcing region.";
  }

  return errors;
}

export function hasDemandOrderErrors(errors: DemandOrderFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function createDemandOrderFromForm(form: DemandOrderFormState): DemandOrder {
  if (!form.cropSpecies) {
    throw new Error("Crop species is required.");
  }

  return {
    id: `demand_${Date.now()}`,
    cropSpecies: form.cropSpecies,
    targetWeightMt: Number(form.targetWeightMt),
    fulfilledWeightMt: 0,
    maxPricePerKg: Number(form.maxPricePerKg),
    regions: form.regions
      .split(",")
      .map((region) => region.trim())
      .filter(Boolean),
    startDate: form.startDate,
    endDate: form.endDate,
    status: "active",
    createdBy: "Procurement Desk"
  };
}

export function formatNaira(value: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatMetricTonsFromKg(valueKg: number): string {
  return `${(valueKg / 1000).toLocaleString("en-NG", { maximumFractionDigits: 1 })}MT`;
}

export function formatBuyerDate(value: string): string {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeZone: "Africa/Lagos"
  }).format(new Date(value));
}

async function simulateNetworkDelay(milliseconds: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
