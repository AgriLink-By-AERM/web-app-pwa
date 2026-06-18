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

import { fetchApi } from "@/lib/api-client";

export async function getDealerProfile(): Promise<DealerProfile> {
  const response = await fetchApi("/dealer/profile");
  const data = unwrapRecord(response);
  return data ? toDealerProfile(data) : dealerProfile;
}

export async function getRecentRedemptions(limit = 4): Promise<RedemptionRecord[]> {
  const response = await fetchApi("/dealer/transactions");
  const records = unwrapArray(response).map(toRedemptionRecord);
  return (records.length > 0 ? records : redemptionRecords).slice(0, limit);
}

export async function getRedemptionHistory(): Promise<RedemptionRecord[]> {
  const response = await fetchApi("/dealer/transactions");
  const records = unwrapArray(response).map(toRedemptionRecord);
  return records.length > 0 ? records : redemptionRecords;
}

export async function validateVoucherCode(code: string): Promise<VoucherValidationResult> {
  const normalizedCode = code.trim();
  if (!/^\d{6}$/.test(normalizedCode)) {
    return { valid: false, reason: "Voucher code must be exactly 6 digits." };
  }

  const response = await fetchApi("/dealer/validate-otp", {
    method: "POST",
    body: JSON.stringify({ otp: normalizedCode, code: normalizedCode })
  });
  const data = unwrapRecord(response);

  if (data) {
    const voucherData = unwrapNestedRecord(data, ["voucher", "otp", "allocation"]);
    return { valid: true, voucher: toVoucher(voucherData ?? data, normalizedCode) };
  }

  const voucher = voucherRegistry[normalizedCode];

  if (!voucher) {
    return { valid: false, reason: "No active voucher was found for this code." };
  }

  if (new Date(voucher.expiresAt).getTime() < Date.now()) {
    return { valid: false, reason: "This voucher has expired. Ask the farmer to generate a new OTP." };
  }

  return { valid: true, voucher };
}

export async function getVoucherFromCode(code: string): Promise<Voucher> {
  const response = await fetchApi(`/dealer/vouchers/${encodeURIComponent(code)}`);
  const data = unwrapRecord(response);

  if (data) {
    return toVoucher(unwrapNestedRecord(data, ["voucher", "otp", "allocation"]) ?? data, code);
  }

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

export async function confirmRedemption(voucher: Voucher, farmerPhone?: string): Promise<RedemptionReceipt> {
  const response = await fetchApi("/dealer/redeem", {
    method: "POST",
    body: JSON.stringify({
      code: voucher.code,
      voucherCode: voucher.code,
      farmerPhone: farmerPhone || "unknown"
    })
  });
  const data = unwrapRecord(response);

  if (data) {
    return toReceipt(unwrapNestedRecord(data, ["receipt", "redemption", "transaction"]) ?? data, voucher);
  }

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
  const response = await fetchApi(`/dealer/receipts/${encodeURIComponent(reference)}`);
  const data = unwrapRecord(response);

  if (data) {
    return toReceipt(unwrapNestedRecord(data, ["receipt", "redemption", "transaction"]) ?? data);
  }

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

export async function registerDealer(payload: any): Promise<boolean> {
  const response = await fetchApi("/dealer/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return response !== null;
}

function unwrapArray(response: unknown): any[] {
  const value = (response as any)?.data ?? response;

  if (Array.isArray(value)) {
    return value;
  }

  for (const key of ["transactions", "records", "redemptions", "items"]) {
    if (Array.isArray(value?.[key])) {
      return value[key];
    }
  }

  return [];
}

function unwrapRecord(response: unknown): Record<string, any> | null {
  const value = (response as any)?.data ?? response;
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}

function unwrapNestedRecord(source: Record<string, any>, keys: string[]): Record<string, any> | null {
  for (const key of keys) {
    const value = source[key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value;
    }
  }

  return null;
}

function toDealerProfile(data: Record<string, any>): DealerProfile {
  const inventory = Array.isArray(data.inventory) ? data.inventory : Array.isArray(data.items) ? data.items : [];

  return {
    id: asString(data.id ?? data._id ?? data.dealerId, dealerProfile.id),
    shopName: asString(data.shopName ?? data.businessName ?? data.name, dealerProfile.shopName),
    dealerCode: asString(data.dealerCode ?? data.code, dealerProfile.dealerCode),
    ownerName: asString(data.ownerName ?? data.contactName ?? data.fullName, dealerProfile.ownerName),
    phoneNumber: asString(data.phoneNumber ?? data.phone, dealerProfile.phoneNumber),
    location: asString(data.location ?? data.address ?? data.zone, dealerProfile.location),
    verificationStatus: data.verificationStatus === "pending" ? "pending" : "verified",
    todayVoucherCount: asNumber(data.todayVoucherCount ?? data.vouchersRedeemedToday ?? data.todayRedemptions, dealerProfile.todayVoucherCount),
    todayDisbursedValue: asNumber(data.todayDisbursedValue ?? data.disbursedToday ?? data.todayValue, dealerProfile.todayDisbursedValue),
    inventory: inventory.length > 0 ? inventory.map(toInventoryItem) : dealerProfile.inventory
  };
}

function toInventoryItem(item: any, index: number): InputInventoryItem {
  const fallback = dealerProfile.inventory[index % dealerProfile.inventory.length];

  return {
    id: asString(item.id ?? item._id ?? item.sku, fallback.id),
    name: asString(item.name ?? item.itemName ?? item.productName, fallback.name),
    unit: asString(item.unit, fallback.unit),
    stockOnHand: asNumber(item.stockOnHand ?? item.stock ?? item.quantity, fallback.stockOnHand),
    lowStockThreshold: asNumber(item.lowStockThreshold ?? item.threshold, fallback.lowStockThreshold),
    valuePerUnit: asNumber(item.valuePerUnit ?? item.price ?? item.unitPrice, fallback.valuePerUnit)
  };
}

function toRedemptionRecord(record: any): RedemptionRecord {
  return {
    id: asString(record.id ?? record._id ?? record.reference, `rdm_${Date.now()}`),
    voucherCode: asString(record.voucherCode ?? record.code ?? record.otp, "000000"),
    farmerId: asString(record.farmerId ?? record.farmer?.id, "FRM-UNKNOWN"),
    farmerName: asString(record.farmerName ?? record.farmer?.name, "Unknown farmer"),
    farmerMaskedPhone: asString(record.farmerMaskedPhone ?? record.farmer?.maskedPhone ?? maskPhone(record.farmerPhone ?? record.farmer?.phone), "****"),
    itemName: asString(record.itemName ?? record.itemAllocation ?? record.productName, "Input allocation"),
    quantity: asNumber(record.quantity, 0),
    unit: asString(record.unit, "unit"),
    walletContribution: asNumber(record.walletContribution ?? record.walletAmount ?? record.subsidyAmount, 0),
    farmerCopayDue: asNumber(record.farmerCopayDue ?? record.copayDue ?? record.coPay, 0),
    ledgerReference: asString(record.ledgerReference ?? record.reference ?? record.transactionReference, "AGR-LDG-PENDING"),
    status: normalizeDisbursementStatus(record.status),
    redeemedAt: asString(record.redeemedAt ?? record.createdAt ?? record.timestamp, new Date().toISOString())
  };
}

function toVoucher(data: Record<string, any>, fallbackCode = "000000"): Voucher {
  return {
    code: asString(data.code ?? data.voucherCode ?? data.otp, fallbackCode),
    farmerId: asString(data.farmerId ?? data.farmer?.id, "FRM-UNKNOWN"),
    farmerName: asString(data.farmerName ?? data.farmer?.name, "Unknown farmer"),
    farmerMaskedPhone: asString(data.farmerMaskedPhone ?? data.farmer?.maskedPhone ?? maskPhone(data.farmerPhone ?? data.farmer?.phone), "****"),
    itemAllocation: asString(data.itemAllocation ?? data.itemName ?? data.productName, "Input allocation"),
    quantity: asNumber(data.quantity, 1),
    unit: asString(data.unit, "unit"),
    walletContribution: asNumber(data.walletContribution ?? data.walletAmount ?? data.subsidyAmount, 0),
    farmerCopayDue: asNumber(data.farmerCopayDue ?? data.copayDue ?? data.coPay, 0),
    expiresAt: asString(data.expiresAt ?? data.expiryDate, new Date(Date.now() + 36e5).toISOString())
  };
}

function toReceipt(data: Record<string, any>, voucher?: Voucher): RedemptionReceipt {
  return {
    ledgerReference: asString(data.ledgerReference ?? data.reference ?? data.transactionReference, `AGR-LDG-${Date.now().toString().slice(-8)}`),
    timestamp: asString(data.timestamp ?? data.redeemedAt ?? data.createdAt, new Date().toISOString()),
    dealerName: asString(data.dealerName ?? data.dealer?.shopName, dealerProfile.shopName),
    dealerCode: asString(data.dealerCode ?? data.dealer?.code, dealerProfile.dealerCode),
    farmerId: asString(data.farmerId ?? data.farmer?.id, voucher?.farmerId ?? "FRM-UNKNOWN"),
    farmerName: asString(data.farmerName ?? data.farmer?.name, voucher?.farmerName ?? "Unknown farmer"),
    itemName: asString(data.itemName ?? data.itemAllocation ?? data.productName, voucher?.itemAllocation ?? "Input allocation"),
    quantity: asNumber(data.quantity, voucher?.quantity ?? 0),
    unit: asString(data.unit, voucher?.unit ?? "unit"),
    walletContribution: asNumber(data.walletContribution ?? data.walletAmount ?? data.subsidyAmount, voucher?.walletContribution ?? 0),
    farmerCopayDue: asNumber(data.farmerCopayDue ?? data.copayDue ?? data.coPay, voucher?.farmerCopayDue ?? 0)
  };
}

function normalizeDisbursementStatus(status: unknown): DealerDisbursementStatus {
  const value = String(status ?? "completed").toLowerCase().replace(/_/g, " ");

  if (value.includes("pending")) {
    return "pending";
  }

  if (value.includes("reverse") || value.includes("failed") || value.includes("cancel")) {
    return "reversed";
  }

  return "completed";
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function asNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function maskPhone(phoneNumber: unknown): string {
  const value = String(phoneNumber ?? "");
  return value.length >= 8 ? `${value.slice(0, 3)}****${value.slice(-4)}` : "****";
}

