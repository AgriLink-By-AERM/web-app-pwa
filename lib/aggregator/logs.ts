import type {
  MoistureCondition,
  PipelineType,
  ProduceCondition,
  SpoilageUrgency,
  TransactionStatus
} from "@/lib/types";
import { fetchApi } from "@/lib/api-client";

export type AggregatorLogFilter = "all" | "fresh_produce" | "agri_waste";

export type AggregatorLogMilestoneKey = "logged" | "matched" | "collected" | "paid";

export type AggregatorLogMilestoneStatus = "complete" | "current" | "pending" | "blocked";

export type AggregatorLogMilestone = {
  key: AggregatorLogMilestoneKey;
  title: string;
  description: string;
  status: AggregatorLogMilestoneStatus;
  timestamp?: string;
};

export type AggregatorHistoricalLog = {
  id: string;
  pipelineType: PipelineType;
  itemName: string;
  weightKg: number;
  farmerMaskedPhone: string;
  status: TransactionStatus;
  submittedAt: string;
  location: {
    zone: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  proofPhotoLabel: string;
  matchedBuyerName?: string;
  collectionWindow?: string;
  stage1AdvanceStatus?: "not_applicable" | "pending" | "released";
  stage2PayoutStatus?: "not_applicable" | "pending_qr_scan" | "released" | "held";
  urgency?: SpoilageUrgency;
  condition?: ProduceCondition;
  moisture?: MoistureCondition;
  disputeAvailableUntil: string;
  milestoneTimestamps: Partial<Record<AggregatorLogMilestoneKey, string>>;
};

export type DisputeReason =
  | "received_weight_mismatch"
  | "rejected_log"
  | "payment_delay"
  | "photo_or_gps_issue"
  | "other";

export type DisputeFormState = {
  logId: string;
  reason: DisputeReason | "";
  reportedWeightKg: string;
  notes: string;
  contactPhone: string;
};

export type DisputeFormErrors = Partial<Record<keyof DisputeFormState, string>>;

export type DisputeSubmissionResult = {
  disputeId: string;
  status: "submitted";
  message: string;
};

export const logFilters: Array<{ id: AggregatorLogFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "fresh_produce", label: "Fresh" },
  { id: "agri_waste", label: "Waste" }
];

export const disputeReasons: Array<{ id: DisputeReason; label: string }> = [
  { id: "received_weight_mismatch", label: "Received weight mismatch" },
  { id: "rejected_log", label: "Rejected or disputed log" },
  { id: "payment_delay", label: "Stage payout delay" },
  { id: "photo_or_gps_issue", label: "Photo or GPS issue" },
  { id: "other", label: "Other issue" }
];

export const initialDisputeFormState: DisputeFormState = {
  logId: "",
  reason: "",
  reportedWeightKg: "",
  notes: "",
  contactPhone: ""
};

const historicalLogs: AggregatorHistoricalLog[] = [
  {
    id: "log_fresh_001",
    pipelineType: "fresh_produce",
    itemName: "Tomatoes",
    weightKg: 140,
    farmerMaskedPhone: "080****9910",
    status: "Matched",
    submittedAt: "2026-06-12T10:20:00+01:00",
    location: {
      zone: "Mile 12",
      address: "Mile 12 pickup zone, Lagos",
      latitude: 6.5244,
      longitude: 3.3792
    },
    proofPhotoLabel: "tomatoes-proof-001.jpg",
    matchedBuyerName: "Suya Palace Group",
    collectionWindow: "Today, 1:00 PM - 3:00 PM",
    stage1AdvanceStatus: "not_applicable",
    stage2PayoutStatus: "not_applicable",
    urgency: "red",
    condition: "Fresh",
    disputeAvailableUntil: "2026-06-14T10:20:00+01:00",
    milestoneTimestamps: {
      logged: "2026-06-12T10:20:00+01:00",
      matched: "2026-06-12T10:42:00+01:00"
    }
  },
  {
    id: "log_waste_001",
    pipelineType: "agri_waste",
    itemName: "Cassava peel",
    weightKg: 200,
    farmerMaskedPhone: "080****2341",
    status: "Stage 1 Released",
    submittedAt: "2026-06-12T09:45:00+01:00",
    location: {
      zone: "Tarauni",
      address: "Tarauni pickup point, Kano",
      latitude: 12.0022,
      longitude: 8.592
    },
    proofPhotoLabel: "cassava-peel-proof-4821.jpg",
    matchedBuyerName: "Dangote Feeds Ltd",
    collectionWindow: "Today, 2:00 PM - 5:00 PM",
    stage1AdvanceStatus: "released",
    stage2PayoutStatus: "pending_qr_scan",
    moisture: "Dry",
    disputeAvailableUntil: "2026-06-14T09:45:00+01:00",
    milestoneTimestamps: {
      logged: "2026-06-12T09:45:00+01:00",
      matched: "2026-06-12T10:05:00+01:00"
    }
  },
  {
    id: "log_waste_002",
    pipelineType: "agri_waste",
    itemName: "Rice husks",
    weightKg: 480,
    farmerMaskedPhone: "081****7762",
    status: "Pending Match",
    submittedAt: "2026-06-11T16:05:00+01:00",
    location: {
      zone: "Kura",
      address: "Kura aggregation shed, Kano",
      latitude: 11.9354,
      longitude: 8.5282
    },
    proofPhotoLabel: "rice-husks-proof-7762.jpg",
    collectionWindow: "Awaiting factory confirmation",
    stage1AdvanceStatus: "pending",
    stage2PayoutStatus: "pending_qr_scan",
    moisture: "Damp",
    disputeAvailableUntil: "2026-06-13T16:05:00+01:00",
    milestoneTimestamps: {
      logged: "2026-06-11T16:05:00+01:00"
    }
  },
  {
    id: "log_fresh_002",
    pipelineType: "fresh_produce",
    itemName: "Leafy greens",
    weightKg: 90,
    farmerMaskedPhone: "070****8822",
    status: "No Match Found",
    submittedAt: "2026-06-11T12:35:00+01:00",
    location: {
      zone: "Agege",
      address: "Agege aggregation point, Lagos",
      latitude: 6.6018,
      longitude: 3.3515
    },
    proofPhotoLabel: "leafy-greens-proof-8822.jpg",
    collectionWindow: "Fallback protocol active",
    stage1AdvanceStatus: "not_applicable",
    stage2PayoutStatus: "not_applicable",
    urgency: "amber",
    condition: "Slightly bruised",
    disputeAvailableUntil: "2026-06-13T12:35:00+01:00",
    milestoneTimestamps: {
      logged: "2026-06-11T12:35:00+01:00"
    }
  },
  {
    id: "log_waste_003",
    pipelineType: "agri_waste",
    itemName: "Maize stalks",
    weightKg: 320,
    farmerMaskedPhone: "070****4401",
    status: "Disputed",
    submittedAt: "2026-06-10T14:15:00+01:00",
    location: {
      zone: "Gwarzo",
      address: "Gwarzo farm cluster, Kano",
      latitude: 12.1477,
      longitude: 8.7423
    },
    proofPhotoLabel: "maize-stalks-proof-4401.jpg",
    matchedBuyerName: "Kano Biofuel Works",
    collectionWindow: "Collected yesterday",
    stage1AdvanceStatus: "released",
    stage2PayoutStatus: "held",
    moisture: "Wet",
    disputeAvailableUntil: "2026-06-12T14:15:00+01:00",
    milestoneTimestamps: {
      logged: "2026-06-10T14:15:00+01:00",
      matched: "2026-06-10T15:02:00+01:00",
      collected: "2026-06-11T09:40:00+01:00"
    }
  },
  {
    id: "log_fresh_003",
    pipelineType: "fresh_produce",
    itemName: "Pepper",
    weightKg: 75,
    farmerMaskedPhone: "081****1150",
    status: "Delivered",
    submittedAt: "2026-06-09T08:05:00+01:00",
    location: {
      zone: "Ikorodu",
      address: "Ikorodu farm gate pickup, Lagos",
      latitude: 6.6194,
      longitude: 3.5105
    },
    proofPhotoLabel: "pepper-proof-1150.jpg",
    matchedBuyerName: "Mainland Kitchens",
    collectionWindow: "Delivered Jun 9, 12:20 PM",
    stage1AdvanceStatus: "not_applicable",
    stage2PayoutStatus: "not_applicable",
    urgency: "green",
    condition: "Fresh",
    disputeAvailableUntil: "2026-06-11T08:05:00+01:00",
    milestoneTimestamps: {
      logged: "2026-06-09T08:05:00+01:00",
      matched: "2026-06-09T08:31:00+01:00",
      collected: "2026-06-09T10:05:00+01:00",
      paid: "2026-06-10T09:00:00+01:00"
    }
  }
];

export function getAggregatorLogStaticParams(): Array<{ id: string }> {
  return historicalLogs.map((log) => ({ id: log.id }));
}

const nigerianPhonePattern = /^(?:\+234|234|0)[789][01]\d{8}$/;

export async function getAggregatorLogs(filter: AggregatorLogFilter = "all"): Promise<AggregatorHistoricalLog[]> {
  const query = filter === "all" ? "" : `?pipeline=${filter}`;
  const response = await fetchApi(`/aggregator/logs${query}`);
  const backendLogs = unwrapArray(response);

  if (backendLogs.length > 0) {
    return backendLogs.map(toAggregatorHistoricalLog);
  }

  // fallback
  if (filter === "all") {
    return historicalLogs;
  }
  return historicalLogs.filter((log) => log.pipelineType === filter);
}

export async function getAggregatorLogById(id: string): Promise<AggregatorHistoricalLog> {
  const response = await fetchApi(`/aggregator/logs/${id}`);
  const data = unwrapRecord(response);

  if (data) {
    return toAggregatorHistoricalLog(data);
  }

  const logs = await getAggregatorLogs();
  return logs.find((log) => log.id === id) ?? historicalLogs[0];
}

export function buildLogMilestones(log: AggregatorHistoricalLog): AggregatorLogMilestone[] {
  const paidTitle = log.pipelineType === "agri_waste" ? "Stage 2 payout" : "Paid";
  const paidDescription =
    log.pipelineType === "agri_waste"
      ? "Remaining 90% released after factory goods-in QR scan."
      : "Farmer cash wallet payout completed after buyer settlement.";

  return [
    {
      key: "logged",
      title: "Logged",
      description: "Aggregator captured farmer, weight, GPS, and proof photo.",
      status: milestoneStatus(log, "logged"),
      timestamp: log.milestoneTimestamps.logged
    },
    {
      key: "matched",
      title: "Matched",
      description:
        log.pipelineType === "agri_waste"
          ? "Factory confirmed the waste match and Stage 1 advance can be released."
          : "Restaurant confirmed the fresh produce match.",
      status: milestoneStatus(log, "matched"),
      timestamp: log.milestoneTimestamps.matched
    },
    {
      key: "collected",
      title: log.pipelineType === "agri_waste" ? "Collected" : "Delivered",
      description:
        log.pipelineType === "agri_waste"
          ? "Factory truck collects waste from the logged GPS location."
          : "Courier or restaurant pickup completes delivery.",
      status: milestoneStatus(log, "collected"),
      timestamp: log.milestoneTimestamps.collected
    },
    {
      key: "paid",
      title: paidTitle,
      description: paidDescription,
      status: milestoneStatus(log, "paid"),
      timestamp: log.milestoneTimestamps.paid
    }
  ];
}

export function validateDisputeForm(form: DisputeFormState): DisputeFormErrors {
  const errors: DisputeFormErrors = {};

  if (!form.logId) {
    errors.logId = "Select the affected log.";
  }

  if (!form.reason) {
    errors.reason = "Select a dispute reason.";
  }

  if (form.reason === "received_weight_mismatch") {
    const weight = Number(form.reportedWeightKg);

    if (!Number.isFinite(weight) || weight <= 0) {
      errors.reportedWeightKg = "Enter the actual received weight in kilograms.";
    }
  }

  if (form.notes.trim().length < 20) {
    errors.notes = "Describe the issue in at least 20 characters.";
  }

  if (!nigerianPhonePattern.test(normalizePhone(form.contactPhone))) {
    errors.contactPhone = "Enter a valid phone number for follow-up.";
  }

  return errors;
}

export function hasDisputeErrors(errors: DisputeFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

export async function submitAggregatorDispute(form: DisputeFormState): Promise<DisputeSubmissionResult> {
  const response = await fetchApi("/aggregator/disputes", {
    method: "POST",
    body: JSON.stringify({
      logId: form.logId,
      reason: form.reason,
      reportedWeightKg: form.reportedWeightKg ? Number(form.reportedWeightKg) : undefined,
      notes: form.notes,
      contactPhone: normalizePhone(form.contactPhone)
    })
  });
  const data = unwrapRecord(response);

  if (data) {
    return {
      disputeId: String(data.disputeId ?? data.id ?? data._id ?? `DSP-${Date.now().toString().slice(-7)}`),
      status: "submitted",
      message: String(data.message ?? "Dispute submitted. The audit team will review the field log.")
    };
  }

  return {
    disputeId: `DSP-${Date.now().toString().slice(-7)}`,
    status: "submitted",
    message: "Dispute submitted. The audit team will review the log, proof photo, GPS record, and buyer receipt."
  };
}

function unwrapArray(response: unknown): any[] {
  const value = (response as any)?.data ?? response;

  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.logs)) {
    return value.logs;
  }

  if (Array.isArray(value?.items)) {
    return value.items;
  }

  return [];
}

function unwrapRecord(response: unknown): Record<string, any> | null {
  const value = (response as any)?.data ?? response;
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}

function toAggregatorHistoricalLog(log: any): AggregatorHistoricalLog {
  const createdAt = String(log.submittedAt ?? log.createdAt ?? log.loggedAt ?? new Date().toISOString());
  const pipeline = log.pipelineType ?? log.pipeline;
  const isWaste = pipeline === "agri_waste" || pipeline === "waste";
  const coordinates = log.location?.coordinates ?? log.gps?.coordinates ?? [];

  return {
    id: String(log.id ?? log._id ?? log.logId ?? `log_${Date.now()}`),
    pipelineType: isWaste ? "agri_waste" : "fresh_produce",
    itemName: String(log.itemName ?? log.category ?? log.commodity ?? (isWaste ? "Agri-waste" : "Fresh produce")),
    weightKg: Number(log.weightKg ?? log.estimatedDryWeightKg ?? log.weight ?? 0),
    farmerMaskedPhone: String(log.farmerMaskedPhone ?? log.farmerPhoneMasked ?? maskPhone(log.farmerPhone ?? log.farmerPhoneNumber ?? "")),
    status: normalizeStatus(log.status),
    submittedAt: createdAt,
    location: {
      zone: String(log.location?.zone ?? log.gps?.zone ?? log.zone ?? "Unknown zone"),
      address: String(log.location?.address ?? log.gps?.address ?? log.address ?? "Unknown address"),
      latitude: Number(log.location?.latitude ?? log.gps?.latitude ?? coordinates[1] ?? 0),
      longitude: Number(log.location?.longitude ?? log.gps?.longitude ?? coordinates[0] ?? 0)
    },
    proofPhotoLabel: String(log.proofPhotoLabel ?? log.photoFileName ?? log.photoUrl ?? "proof-photo"),
    matchedBuyerName: log.matchedBuyerName ?? log.buyerName ?? log.match?.buyerName,
    collectionWindow: log.collectionWindow ?? log.pickupWindow,
    stage1AdvanceStatus: normalizeStage1Status(log.stage1AdvanceStatus, isWaste),
    stage2PayoutStatus: normalizeStage2Status(log.stage2PayoutStatus, isWaste),
    urgency: normalizeUrgency(log.urgency ?? log.urgencyTier),
    condition: normalizeProduceCondition(log.condition),
    moisture: normalizeMoisture(log.moisture ?? (isWaste ? log.condition : undefined)),
    disputeAvailableUntil: String(log.disputeAvailableUntil ?? new Date(Date.now() + 48 * 36e5).toISOString()),
    milestoneTimestamps: {
      logged: createdAt,
      matched: log.matchedAt,
      collected: log.collectedAt ?? log.deliveredAt,
      paid: log.paidAt
    }
  };
}


function normalizeStage1Status(status: unknown, isWaste: boolean): AggregatorHistoricalLog["stage1AdvanceStatus"] {
  if (!isWaste) {
    return "not_applicable";
  }

  return status === "released" || status === "pending" ? status : "pending";
}

function normalizeStage2Status(status: unknown, isWaste: boolean): AggregatorHistoricalLog["stage2PayoutStatus"] {
  if (!isWaste) {
    return "not_applicable";
  }

  if (status === "released" || status === "held" || status === "pending_qr_scan") {
    return status;
  }

  return "pending_qr_scan";
}

function normalizeUrgency(value: unknown): SpoilageUrgency | undefined {
  return value === "green" || value === "amber" || value === "red" ? value : undefined;
}

function normalizeProduceCondition(value: unknown): ProduceCondition | undefined {
  return value === "Fresh" || value === "Slightly bruised" || value === "Poor" ? value : undefined;
}

function normalizeMoisture(value: unknown): MoistureCondition | undefined {
  return value === "Dry" || value === "Damp" || value === "Wet" ? value : undefined;
}
function normalizeStatus(status: unknown): TransactionStatus {
  const value = String(status ?? "Pending Match").toLowerCase().replace(/_/g, " ");
  const map: Record<string, TransactionStatus> = {
    "pending": "Pending Match",
    "pending match": "Pending Match",
    "matched": "Matched",
    "in transit": "In Transit",
    "stage 1 released": "Stage 1 Released",
    "collected": "Collected",
    "delivered": "Delivered",
    "disputed": "Disputed",
    "no match found": "No Match Found",
    "expired": "Expired"
  };

  return map[value] ?? "Pending Match";
}

function maskPhone(phoneNumber: string): string {
  return phoneNumber.length >= 8 ? `${phoneNumber.slice(0, 3)}****${phoneNumber.slice(-4)}` : "****";
}

export function formatLogDate(value: string): string {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Lagos"
  }).format(new Date(value));
}

function milestoneStatus(
  log: AggregatorHistoricalLog,
  key: AggregatorLogMilestoneKey
): AggregatorLogMilestoneStatus {
  if (log.status === "Disputed" && (key === "paid" || key === "collected")) {
    return key === "collected" && log.milestoneTimestamps.collected ? "complete" : "blocked";
  }

  if (log.milestoneTimestamps[key]) {
    return "complete";
  }

  const order: AggregatorLogMilestoneKey[] = ["logged", "matched", "collected", "paid"];
  const firstIncomplete = order.find((candidate) => !log.milestoneTimestamps[candidate]);

  return firstIncomplete === key ? "current" : "pending";
}

function normalizePhone(phoneNumber: string): string {
  return phoneNumber.replace(/\s+/g, "").replace(/-/g, "");
}

async function simulateNetworkDelay(milliseconds: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}


