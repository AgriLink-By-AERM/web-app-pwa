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
  firstName: string;
  lastName: string;
  phoneNumber: string;
  governmentIdNumber: string;
  guarantorPhoneNumber: string;
  zone: NigerianZone | "";
  idPhotoFileName: string;
};

export type AggregatorRegistrationErrors = Partial<Record<keyof AggregatorRegistrationFormState, string>>;

export const initialAggregatorRegistrationForm: AggregatorRegistrationFormState = {
  firstName: "",
  lastName: "",
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

  if (form.firstName.trim().length < 2) {
    errors.firstName = "Enter the aggregator's first name.";
  }

  if (form.lastName.trim().length < 2) {
    errors.lastName = "Enter the aggregator's last name.";
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
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
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
