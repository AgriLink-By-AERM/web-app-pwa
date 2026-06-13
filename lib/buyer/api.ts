import { buyerDashboardFixtures } from "@/lib/buyer/mock-data";
import type { BuyerDashboardData, BuyerType } from "@/lib/types";

export async function getBuyerDashboardData(
  buyerType: BuyerType = "factory"
): Promise<BuyerDashboardData> {
  await simulateNetworkDelay(120);
  return buyerDashboardFixtures[buyerType];
}

async function simulateNetworkDelay(milliseconds: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
