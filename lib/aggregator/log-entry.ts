import type {
  AgriWasteLogPayload,
  AgriWasteLogResult,
  FreshProduceCategory,
  FreshProduceLogPayload,
  FreshProduceLogResult,
  GeoLocation,
  MoistureCondition,
  ProduceCondition,
  WasteCategory
} from "@/lib/types";
import { normalizePhoneInput } from "@/lib/aggregator/registration";
import { fetchApi } from "@/lib/api-client";

export const freshProduceCategories: FreshProduceCategory[] = [
  "Tomatoes",
  "Pepper",
  "Leafy greens",
  "Cassava",
  "Okra",
  "Plantain"
];

export const produceConditions: ProduceCondition[] = ["Fresh", "Slightly bruised", "Poor"];

export const wasteCategories: WasteCategory[] = [
  "Cassava peel",
  "Rice husks",
  "Maize stalks",
  "Groundnut shells",
  "Palm kernel waste",
  "Other"
];

export const moistureConditions: MoistureCondition[] = ["Dry", "Damp", "Wet"];

export type FreshProduceFormState = {
  farmerPhoneNumber: string;
  category: FreshProduceCategory | "";
  weightKg: string;
  condition: ProduceCondition | "";
  estimatedHarvestTime: string;
  gps: GeoLocation | null;
  photoFileName: string;
};

export type FreshProduceFormErrors = Partial<Record<keyof FreshProduceFormState, string>>;

export type AgriWasteFormState = {
  farmerPhoneNumber: string;
  category: WasteCategory | "";
  estimatedDryWeightKg: string;
  moisture: MoistureCondition | "";
  gps: GeoLocation | null;
  photoFileName: string;
};

export type AgriWasteFormErrors = Partial<Record<keyof AgriWasteFormState, string>>;

export const initialFreshProduceForm: FreshProduceFormState = {
  farmerPhoneNumber: "",
  category: "",
  weightKg: "",
  condition: "",
  estimatedHarvestTime: new Date().toISOString().slice(0, 16),
  gps: null,
  photoFileName: ""
};

export const initialAgriWasteForm: AgriWasteFormState = {
  farmerPhoneNumber: "",
  category: "",
  estimatedDryWeightKg: "",
  moisture: "",
  gps: null,
  photoFileName: ""
};

const nigerianPhonePattern = /^(?:\+234|234|0)[789][01]\d{8}$/;

export function validateFreshProduceForm(form: FreshProduceFormState): FreshProduceFormErrors {
  const errors: FreshProduceFormErrors = {};
  const weight = Number(form.weightKg);

  if (!nigerianPhonePattern.test(normalizePhoneInput(form.farmerPhoneNumber))) {
    errors.farmerPhoneNumber = "Enter the farmer's valid Nigerian phone number.";
  }

  if (!form.category) {
    errors.category = "Select a produce category.";
  }

  if (!Number.isFinite(weight) || weight <= 0) {
    errors.weightKg = "Enter a valid weight in kilograms.";
  }

  if (!form.condition) {
    errors.condition = "Select the visible produce condition.";
  }

  if (!form.estimatedHarvestTime) {
    errors.estimatedHarvestTime = "Enter the estimated harvest time.";
  }

  if (!form.gps) {
    errors.gps = "Capture GPS location before submitting.";
  }

  if (!form.photoFileName) {
    errors.photoFileName = "Capture or upload a proof photo before submitting.";
  }

  return errors;
}

export function hasFreshProduceErrors(errors: FreshProduceFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateAgriWasteForm(form: AgriWasteFormState): AgriWasteFormErrors {
  const errors: AgriWasteFormErrors = {};
  const weight = Number(form.estimatedDryWeightKg);

  if (!nigerianPhonePattern.test(normalizePhoneInput(form.farmerPhoneNumber))) {
    errors.farmerPhoneNumber = "Enter the farmer's valid Nigerian phone number.";
  }

  if (!form.category) {
    errors.category = "Select a waste category.";
  }

  if (!Number.isFinite(weight) || weight <= 0) {
    errors.estimatedDryWeightKg = "Enter a valid estimated dry weight in kilograms.";
  }

  if (!form.moisture) {
    errors.moisture = "Select the moisture condition.";
  }

  if (!form.gps) {
    errors.gps = "Capture GPS location before submitting.";
  }

  if (!form.photoFileName) {
    errors.photoFileName = "Capture or upload a proof photo before submitting.";
  }

  return errors;
}

export function hasAgriWasteErrors(errors: AgriWasteFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function toFreshProducePayload(form: FreshProduceFormState): FreshProduceLogPayload {
  if (!form.category || !form.condition || !form.gps) {
    throw new Error("Fresh produce form is incomplete.");
  }

  return {
    farmerPhoneNumber: normalizePhoneInput(form.farmerPhoneNumber),
    category: form.category,
    weightKg: Number(form.weightKg),
    condition: form.condition,
    estimatedHarvestTime: new Date(form.estimatedHarvestTime).toISOString(),
    gps: form.gps,
    photoFileName: form.photoFileName
  };
}

export function toAgriWastePayload(form: AgriWasteFormState): AgriWasteLogPayload {
  if (!form.category || !form.moisture || !form.gps) {
    throw new Error("Agri-waste form is incomplete.");
  }

  return {
    farmerPhoneNumber: normalizePhoneInput(form.farmerPhoneNumber),
    category: form.category,
    estimatedDryWeightKg: Number(form.estimatedDryWeightKg),
    moisture: form.moisture,
    gps: form.gps,
    photoFileName: form.photoFileName
  };
}

export function mockCurrentGps(): GeoLocation {
  return {
    latitude: 12.0022,
    longitude: 8.592,
    address: "Tarauni pickup point, Kano",
    zone: "Tarauni"
  };
}

export async function submitFreshProduceLog(payload: FreshProduceLogPayload): Promise<FreshProduceLogResult> {
  const backendPayload = {
    farmerPhone: payload.farmerPhoneNumber,
    pipeline: "fresh_produce",
    category: payload.category,
    weightKg: payload.weightKg,
    condition: payload.condition,
    latitude: payload.gps.latitude,
    longitude: payload.gps.longitude,
    photoUrl: "http://example.com/" + payload.photoFileName, // mocked S3 URL
    harvestedAt: payload.estimatedHarvestTime
  };

  const response = await fetchApi('/aggregator/logs', {
    method: 'POST',
    body: JSON.stringify(backendPayload)
  });

  const logId = response?.data?._id || `fresh_${Date.now()}`;

  return {
    logId,
    status: response?.data?.status || "Pending Match",
    urgency: response?.data?.urgencyTier || classifyUrgency(payload.estimatedHarvestTime),
    message: response?.message || "Fresh produce log submitted. Matching engine is checking nearby restaurant demand."
  };
}

export async function submitAgriWasteLog(payload: AgriWasteLogPayload): Promise<AgriWasteLogResult> {
  const backendPayload = {
    farmerPhone: payload.farmerPhoneNumber,
    pipeline: "agri_waste",
    category: payload.category,
    weightKg: payload.estimatedDryWeightKg,
    condition: payload.moisture,
    latitude: payload.gps.latitude,
    longitude: payload.gps.longitude,
    photoUrl: "http://example.com/" + payload.photoFileName,
    harvestedAt: new Date().toISOString() // Or some default
  };

  const response = await fetchApi('/aggregator/logs', {
    method: 'POST',
    body: JSON.stringify(backendPayload)
  });

  const logId = response?.data?._id || `waste_${Date.now()}`;
  let ticketPayload: any = null;
  if (response?.data?.qrPayload) {
    try {
      ticketPayload = JSON.parse(response.data.qrPayload);
    } catch {
      // ignore
    }
  }

  const ticketId = `ticket_${Date.now()}`;
  const referenceNumber = ticketPayload?.ref || `AGL-WST-${String(Date.now()).slice(-6)}`;

  return {
    logId,
    status: response?.data?.status || "Pending Match",
    message: response?.message || "Agri-waste log submitted. A QR collection ticket has been generated for factory pickup.",
    ticket: {
      id: ticketId,
      referenceNumber,
      wasteCategory: payload.category,
      estimatedDryWeightKg: payload.estimatedDryWeightKg,
      moisture: payload.moisture,
      farmerMaskedPhone: ticketPayload?.farmerMasked || maskPhoneForTicket(payload.farmerPhoneNumber),
      aggregatorName: "Amina Yusuf",
      aggregatorPhone: "08031234567",
      gps: payload.gps,
      status: response?.data?.status || "Pending Match",
      qrCodeValue: response?.data?.qrPayload || `AGRILINK:TICKET:${referenceNumber}`,
      createdAt: response?.data?.createdAt || new Date().toISOString(),
      shareUrl: `/aggregator/tickets/${ticketId}`
    }
  };
}

function classifyUrgency(estimatedHarvestTime: string): FreshProduceLogResult["urgency"] {
  const harvestedAt = new Date(estimatedHarvestTime).getTime();
  const hoursSinceHarvest = Math.max(0, (Date.now() - harvestedAt) / 36e5);

  if (hoursSinceHarvest >= 36) {
    return "red";
  }

  if (hoursSinceHarvest >= 12) {
    return "amber";
  }

  return "green";
}

async function simulateNetworkDelay(milliseconds: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function maskPhoneForTicket(phoneNumber: string): string {
  const normalized = normalizePhoneInput(phoneNumber);

  if (normalized.length < 8) {
    return normalized;
  }

  return `${normalized.slice(0, 3)}****${normalized.slice(-4)}`;
}
