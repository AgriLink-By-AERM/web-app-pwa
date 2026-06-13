import type { AggregatorDashboardData } from "@/lib/types";

export async function getAggregatorDashboardData(): Promise<AggregatorDashboardData> {
  await simulateNetworkDelay(160);

  return {
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
}

async function simulateNetworkDelay(milliseconds: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
