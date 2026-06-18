import type { AggregatorProfile } from "@/lib/types";
import { fetchApi } from "@/lib/api-client";

export type AggregatorVerificationSummary = Pick<
  AggregatorProfile,
  "fullName" | "phoneNumber" | "zone" | "verificationStatus" | "submittedAt"
> & {
  referenceNumber: string;
  reviewSteps: VerificationStep[];
  expectedReviewWindow: string;
};

export type VerificationStep = {
  id: string;
  title: string;
  description: string;
  status: "complete" | "in_progress" | "pending";
};

export async function getAggregatorVerificationSummary(): Promise<AggregatorVerificationSummary> {
  const response = await fetchApi("/aggregator/status");
  const data = (response as any)?.data ?? response;

  if (data && typeof data === "object") {
    return {
      fullName: data.fullName ?? data.name ?? fallbackVerificationSummary.fullName,
      phoneNumber: data.phoneNumber ?? data.phone ?? fallbackVerificationSummary.phoneNumber,
      zone: data.zone ?? fallbackVerificationSummary.zone,
      verificationStatus: data.verificationStatus ?? data.status ?? fallbackVerificationSummary.verificationStatus,
      submittedAt: data.submittedAt ?? data.createdAt ?? fallbackVerificationSummary.submittedAt,
      referenceNumber: data.referenceNumber ?? data.reference ?? fallbackVerificationSummary.referenceNumber,
      expectedReviewWindow: data.expectedReviewWindow ?? fallbackVerificationSummary.expectedReviewWindow,
      reviewSteps: Array.isArray(data.reviewSteps) ? data.reviewSteps : fallbackVerificationSummary.reviewSteps
    };
  }

  return fallbackVerificationSummary;
}

const fallbackVerificationSummary: AggregatorVerificationSummary = {
    fullName: "Amina Yusuf",
    phoneNumber: "08031234567",
    zone: "Kano - Tarauni LGA",
    verificationStatus: "pending_verification",
    submittedAt: "2026-06-12T11:45:00+01:00",
    referenceNumber: "AGL-VER-4821",
    expectedReviewWindow: "24-48 hours",
    reviewSteps: [
      {
        id: "identity",
        title: "Identity details received",
        description: "Full name, phone number, and government ID number were captured.",
        status: "complete"
      },
      {
        id: "document",
        title: "ID photo review",
        description: "The uploaded ID image is being checked for readability and consistency.",
        status: "in_progress"
      },
      {
        id: "guarantor",
        title: "Guarantor confirmation",
        description: "The guarantor phone number will be contacted before approval.",
        status: "pending"
      },
      {
        id: "zone",
        title: "Zone assignment approval",
        description: "Admin confirms that the selected LGA has available field capacity.",
        status: "pending"
      }
    ]
};
