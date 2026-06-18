import type { AggregatorDashboardData, NigerianZone } from "@/lib/types";
import { fetchApi } from "@/lib/api-client";
import { getAggregatorLogs } from "@/lib/aggregator/logs";

export async function getAggregatorDashboardData(): Promise<AggregatorDashboardData> {
  const response = await fetchApi("/aggregator/dashboard");
  const data = unwrapRecord(response);

  if (data) {
    const logs = Array.isArray(data.recentLogs) ? data.recentLogs : await getAggregatorLogs("all");

    return {
      profile: {
        fullName: asString(data.profile?.fullName ?? data.profile?.name ?? data.fullName, fallbackAggregatorDashboard.profile.fullName),
        phoneNumber: asString(data.profile?.phoneNumber ?? data.profile?.phone ?? data.phoneNumber, fallbackAggregatorDashboard.profile.phoneNumber),
        zone: normalizeZone(data.profile?.zone ?? data.zone),
        performanceScore: asNumber(data.profile?.performanceScore ?? data.performanceScore, fallbackAggregatorDashboard.profile.performanceScore),
        cashFloatBalance: asNumber(data.profile?.cashFloatBalance ?? data.cashFloatBalance, fallbackAggregatorDashboard.profile.cashFloatBalance),
        premiumTier: normalizeTier(data.profile?.premiumTier ?? data.premiumTier)
      },
      stats: {
        logsToday: asNumber(data.stats?.logsToday ?? data.logsToday, logs.length),
        pendingMatches: asNumber(data.stats?.pendingMatches ?? data.pendingMatches, logs.filter((log: any) => log.status === "Pending Match").length),
        completedThisWeek: asNumber(data.stats?.completedThisWeek ?? data.completedThisWeek, logs.filter((log: any) => log.status === "Delivered" || log.status === "Collected").length),
        disputedLogs: asNumber(data.stats?.disputedLogs ?? data.disputedLogs, logs.filter((log: any) => log.status === "Disputed").length)
      },
      recentLogs: logs.slice(0, 4).map((log: any) => ({
        id: asString(log.id ?? log._id, "log_unknown"),
        pipelineType: log.pipelineType === "agri_waste" || log.pipeline === "agri_waste" ? "agri_waste" : "fresh_produce",
        itemName: asString(log.itemName ?? log.category ?? log.commodity, "Produce"),
        weightKg: asNumber(log.weightKg ?? log.estimatedDryWeightKg ?? log.weight, 0),
        farmerMaskedPhone: asString(log.farmerMaskedPhone ?? log.farmerPhoneMasked ?? log.farmerPhone, "****"),
        status: log.status ?? "Pending Match",
        submittedAt: asString(log.submittedAt ?? log.createdAt, new Date().toISOString()),
        urgency: log.urgency ?? log.urgencyTier,
        moisture: log.moisture
      }))
    };
  }

  return fallbackAggregatorDashboard;
}

const fallbackAggregatorDashboard: AggregatorDashboardData = {
    profile: {
      fullName: "Amina Yusuf",
      phoneNumber: "08031234567",
      zone: "Kano - Tarauni LGA",
      performanceScore: 86,
      cashFloatBalance: 18500,
      premiumTier: "Trusted"
    },
    stats: {
      logsToday: 6,
      pendingMatches: 3,
      completedThisWeek: 18,
      disputedLogs: 1
    },
    recentLogs: [
      {
        id: "log_fresh_001",
        pipelineType: "fresh_produce",
        itemName: "Tomatoes",
        weightKg: 140,
        farmerMaskedPhone: "080****9910",
        status: "Matched",
        submittedAt: "2026-06-12T10:20:00+01:00",
        urgency: "red"
      },
      {
        id: "log_waste_001",
        pipelineType: "agri_waste",
        itemName: "Cassava peel",
        weightKg: 200,
        farmerMaskedPhone: "080****2341",
        status: "Stage 1 Released",
        submittedAt: "2026-06-12T09:45:00+01:00",
        moisture: "Dry"
      },
      {
        id: "log_waste_002",
        pipelineType: "agri_waste",
        itemName: "Rice husks",
        weightKg: 480,
        farmerMaskedPhone: "081****7762",
        status: "Pending Match",
        submittedAt: "2026-06-11T16:05:00+01:00",
        moisture: "Damp"
      },
      {
        id: "log_fresh_002",
        pipelineType: "fresh_produce",
        itemName: "Leafy greens",
        weightKg: 90,
        farmerMaskedPhone: "070****8822",
        status: "No Match Found",
        submittedAt: "2026-06-11T12:35:00+01:00",
        urgency: "amber"
      }
    ]
};

function unwrapRecord(response: unknown): Record<string, any> | null {
  const value = (response as any)?.data ?? response;
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function asNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}


function normalizeZone(value: unknown): NigerianZone {
  const zones: NigerianZone[] = [
    "Kano - Nassarawa LGA",
    "Kano - Tarauni LGA",
    "Kano - Kura LGA",
    "Lagos - Ikorodu",
    "Lagos - Agege",
    "Ogun - Ifo"
  ];

  return zones.includes(value as NigerianZone) ? (value as NigerianZone) : fallbackAggregatorDashboard.profile.zone;
}
function normalizeTier(value: unknown): AggregatorDashboardData["profile"]["premiumTier"] {
  return value === "Premium" || value === "Starter" || value === "Trusted" ? value : "Trusted";
}

