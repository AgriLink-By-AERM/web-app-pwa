export type DealerDisbursementStatus = "completed" | "pending" | "reversed";

export type InputInventoryItem = {
  id: string;
  name: string;
  unit: string;
  stockOnHand: number;
  lowStockThreshold: number;
  valuePerUnit: number;
};

export type DealerProfile = {
  id: string;
  shopName: string;
  dealerCode: string;
  ownerName: string;
  phoneNumber: string;
  location: string;
  verificationStatus: "verified" | "pending";
  todayVoucherCount: number;
  todayDisbursedValue: number;
  inventory: InputInventoryItem[];
};

export type Voucher = {
  code: string;
  farmerId: string;
  farmerName: string;
  farmerMaskedPhone: string;
  itemAllocation: string;
  quantity: number;
  unit: string;
  walletContribution: number;
  farmerCopayDue: number;
  expiresAt: string;
};

export type RedemptionRecord = {
  id: string;
  voucherCode: string;
  farmerId: string;
  farmerName: string;
  farmerMaskedPhone: string;
  itemName: string;
  quantity: number;
  unit: string;
  walletContribution: number;
  farmerCopayDue: number;
  ledgerReference: string;
  status: DealerDisbursementStatus;
  redeemedAt: string;
};

export type RedemptionReceipt = {
  ledgerReference: string;
  timestamp: string;
  dealerName: string;
  dealerCode: string;
  farmerId: string;
  farmerName: string;
  itemName: string;
  quantity: number;
  unit: string;
  walletContribution: number;
  farmerCopayDue: number;
};

export type VoucherValidationResult =
  | {
      valid: true;
      voucher: Voucher;
    }
  | {
      valid: false;
      reason: string;
    };

export type RedemptionHistoryFilter = "all" | DealerDisbursementStatus;

export const historyFilters: Array<{ id: RedemptionHistoryFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "completed", label: "Completed" },
  { id: "pending", label: "Pending" },
  { id: "reversed", label: "Reversed" }
];

const dealerProfile: DealerProfile = {
  id: "dealer_04821",
  shopName: "Bello Agro Supplies",
  dealerCode: "DLR-04821",
  ownerName: "Bello Sani",
  phoneNumber: "08035554421",
  location: "Kano - Nassarawa LGA",
  verificationStatus: "verified",
  todayVoucherCount: 6,
  todayDisbursedValue: 14600,
  inventory: [
    {
      id: "inv_npk_50kg",
      name: "NPK Fertilizer 50kg",
      unit: "bags",
      stockOnHand: 42,
      lowStockThreshold: 12,
      valuePerUnit: 21000
    },
    {
      id: "inv_maize_seed",
      name: "Hybrid Maize Seed 10kg",
      unit: "packs",
      stockOnHand: 31,
      lowStockThreshold: 10,
      valuePerUnit: 8500
    },
    {
      id: "inv_herbicide",
      name: "Selective Herbicide 1L",
      unit: "bottles",
      stockOnHand: 18,
      lowStockThreshold: 8,
      valuePerUnit: 4200
    }
  ]
};

const voucherRegistry: Record<string, Voucher> = {
  "849201": {
    code: "849201",
    farmerId: "FRM-29041",
    farmerName: "Musa Ibrahim",
    farmerMaskedPhone: "080****2341",
    itemAllocation: "NPK Fertilizer 50kg",
    quantity: 2,
    unit: "bags",
    walletContribution: 42000,
    farmerCopayDue: 0,
    expiresAt: "2026-06-12T15:30:00+01:00"
  },
  "735490": {
    code: "735490",
    farmerId: "FRM-77502",
    farmerName: "Aisha Bello",
    farmerMaskedPhone: "081****7762",
    itemAllocation: "Hybrid Maize Seed 10kg",
    quantity: 1,
    unit: "pack",
    walletContribution: 7000,
    farmerCopayDue: 1500,
    expiresAt: "2026-06-12T16:00:00+01:00"
  }
};

const redemptionRecords: RedemptionRecord[] = [
  {
    id: "rdm_001",
    voucherCode: "849201",
    farmerId: "FRM-29041",
    farmerName: "Musa Ibrahim",
    farmerMaskedPhone: "080****2341",
    itemName: "NPK Fertilizer 50kg",
    quantity: 2,
    unit: "bags",
    walletContribution: 42000,
    farmerCopayDue: 0,
    ledgerReference: "AGR-LDG-84291055",
    status: "completed",
    redeemedAt: "2026-06-12T09:12:00+01:00"
  },
  {
    id: "rdm_002",
    voucherCode: "735490",
    farmerId: "FRM-77502",
    farmerName: "Aisha Bello",
    farmerMaskedPhone: "081****7762",
    itemName: "Hybrid Maize Seed 10kg",
    quantity: 1,
    unit: "pack",
    walletContribution: 7000,
    farmerCopayDue: 1500,
    ledgerReference: "AGR-LDG-84291056",
    status: "completed",
    redeemedAt: "2026-06-12T08:45:00+01:00"
  },
  {
    id: "rdm_003",
    voucherCode: "552019",
    farmerId: "FRM-11829",
    farmerName: "Hadiza Lawal",
    farmerMaskedPhone: "070****4401",
    itemName: "Selective Herbicide 1L",
    quantity: 3,
    unit: "bottles",
    walletContribution: 12600,
    farmerCopayDue: 0,
    ledgerReference: "AGR-LDG-84291057",
    status: "pending",
    redeemedAt: "2026-06-11T17:20:00+01:00"
  },
  {
    id: "rdm_004",
    voucherCode: "118902",
    farmerId: "FRM-63380",
    farmerName: "Chinedu Obi",
    farmerMaskedPhone: "080****1192",
    itemName: "NPK Fertilizer 50kg",
    quantity: 1,
    unit: "bag",
    walletContribution: 21000,
    farmerCopayDue: 0,
    ledgerReference: "AGR-LDG-84291058",
    status: "reversed",
    redeemedAt: "2026-06-10T13:05:00+01:00"
  }
];

export async function getDealerProfile(): Promise<DealerProfile> {
  await simulateNetworkDelay(120);
  return dealerProfile;
}

export async function getRecentRedemptions(limit = 4): Promise<RedemptionRecord[]> {
  await simulateNetworkDelay(120);
  return redemptionRecords.slice(0, limit);
}

export async function getRedemptionHistory(): Promise<RedemptionRecord[]> {
  await simulateNetworkDelay(140);
  return redemptionRecords;
}

export async function validateVoucherCode(code: string): Promise<VoucherValidationResult> {
  await simulateNetworkDelay(260);
  const normalizedCode = code.trim();
  const voucher = voucherRegistry[normalizedCode];

  if (!/^\d{6}$/.test(normalizedCode)) {
    return { valid: false, reason: "Voucher code must be exactly 6 digits." };
  }

  if (!voucher) {
    return { valid: false, reason: "No active voucher was found for this code." };
  }

  if (new Date(voucher.expiresAt).getTime() < Date.now()) {
    return { valid: false, reason: "This voucher has expired. Ask the farmer to generate a new OTP." };
  }

  return { valid: true, voucher };
}

export async function getVoucherFromCode(code: string): Promise<Voucher> {
  await simulateNetworkDelay(150);
  return (
    voucherRegistry[code] ?? {
      code,
      farmerId: "FRM-29041",
      farmerName: "Musa Ibrahim",
      farmerMaskedPhone: "080****2341",
      itemAllocation: "NPK Fertilizer 50kg",
      quantity: 2,
      unit: "bags",
      walletContribution: 42000,
      farmerCopayDue: 0,
      expiresAt: "2026-06-12T15:30:00+01:00"
    }
  );
}

export async function confirmRedemption(voucher: Voucher): Promise<RedemptionReceipt> {
  await simulateNetworkDelay(420);
  const profile = await getDealerProfile();

  return {
    ledgerReference: `AGR-LDG-${Date.now().toString().slice(-8)}`,
    timestamp: new Date().toISOString(),
    dealerName: profile.shopName,
    dealerCode: profile.dealerCode,
    farmerId: voucher.farmerId,
    farmerName: voucher.farmerName,
    itemName: voucher.itemAllocation,
    quantity: voucher.quantity,
    unit: voucher.unit,
    walletContribution: voucher.walletContribution,
    farmerCopayDue: voucher.farmerCopayDue
  };
}

export async function getReceiptFromReference(reference: string): Promise<RedemptionReceipt> {
  await simulateNetworkDelay(120);
  const profile = await getDealerProfile();

  return {
    ledgerReference: reference || "AGR-LDG-84291055",
    timestamp: "2026-06-12T09:12:00+01:00",
    dealerName: profile.shopName,
    dealerCode: profile.dealerCode,
    farmerId: "FRM-29041",
    farmerName: "Musa Ibrahim",
    itemName: "NPK Fertilizer 50kg",
    quantity: 2,
    unit: "bags",
    walletContribution: 42000,
    farmerCopayDue: 0
  };
}

export function formatNaira(value: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDealerDate(value: string): string {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Lagos"
  }).format(new Date(value));
}

async function simulateNetworkDelay(milliseconds: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
