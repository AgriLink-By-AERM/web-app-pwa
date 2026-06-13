import type { AggregatorRegistrationPayload, NigerianZone } from "@/lib/types";

export const aggregatorZones: NigerianZone[] = [
  "Kano - Nassarawa LGA",
  "Kano - Tarauni LGA",
  "Kano - Kura LGA",
  "Lagos - Ikorodu",
  "Lagos - Agege",
  "Ogun - Ifo"
];

export type AggregatorRegistrationFormState = {
  fullName: string;
  phoneNumber: string;
  governmentIdNumber: string;
  guarantorPhoneNumber: string;
  zone: NigerianZone | "";
  idPhotoFileName: string;
};

export type AggregatorRegistrationErrors = Partial<Record<keyof AggregatorRegistrationFormState, string>>;

export const initialAggregatorRegistrationForm: AggregatorRegistrationFormState = {
  fullName: "",
  phoneNumber: "",
  governmentIdNumber: "",
  guarantorPhoneNumber: "",
  zone: "",
  idPhotoFileName: ""
};

const nigerianPhonePattern = /^(?:\+234|234|0)[789][01]\d{8}$/;

export function validateAggregatorRegistration(
  form: AggregatorRegistrationFormState
): AggregatorRegistrationErrors {
  const errors: AggregatorRegistrationErrors = {};

  if (form.fullName.trim().length < 3) {
    errors.fullName = "Enter the aggregator's full legal name.";
  }

  if (!nigerianPhonePattern.test(normalizePhoneInput(form.phoneNumber))) {
    errors.phoneNumber = "Enter a valid Nigerian phone number.";
  }

  if (form.governmentIdNumber.trim().length < 6) {
    errors.governmentIdNumber = "Enter a valid NIN, driver's licence, or approved government ID.";
  }

  if (!nigerianPhonePattern.test(normalizePhoneInput(form.guarantorPhoneNumber))) {
    errors.guarantorPhoneNumber = "Enter a valid guarantor phone number.";
  }

  if (normalizePhoneInput(form.phoneNumber) === normalizePhoneInput(form.guarantorPhoneNumber)) {
    errors.guarantorPhoneNumber = "Guarantor phone number must be different from the aggregator phone number.";
  }

  if (!form.zone) {
    errors.zone = "Select the aggregator's operating zone.";
  }

  if (!form.idPhotoFileName) {
    errors.idPhotoFileName = "Upload or capture the front of the government ID card.";
  }

  return errors;
}

export function hasRegistrationErrors(errors: AggregatorRegistrationErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function toAggregatorRegistrationPayload(
  form: AggregatorRegistrationFormState
): AggregatorRegistrationPayload {
  if (!form.zone) {
    throw new Error("Aggregator zone is required before creating a registration payload.");
  }

  return {
    fullName: form.fullName.trim(),
    phoneNumber: normalizePhoneInput(form.phoneNumber),
    governmentIdNumber: form.governmentIdNumber.trim().toUpperCase(),
    guarantorPhoneNumber: normalizePhoneInput(form.guarantorPhoneNumber),
    zone: form.zone,
    idPhotoFileName: form.idPhotoFileName
  };
}

export function normalizePhoneInput(phoneNumber: string): string {
  return phoneNumber.replace(/\s+/g, "").replace(/-/g, "");
}
