import type { CollectionTicket } from "@/lib/types";

const demoTickets: Record<string, CollectionTicket> = {
  ticket_demo_cassava: {
    id: "ticket_demo_cassava",
    referenceNumber: "AGL-WST-482100",
    wasteCategory: "Cassava peel",
    estimatedDryWeightKg: 200,
    moisture: "Dry",
    farmerMaskedPhone: "080****2341",
    aggregatorName: "Amina Yusuf",
    aggregatorPhone: "08031234567",
    gps: {
      latitude: 12.0022,
      longitude: 8.592,
      address: "Tarauni pickup point, Kano",
      zone: "Tarauni"
    },
    status: "Pending Match",
    qrCodeValue: "AGRILINK:TICKET:AGL-WST-482100",
    createdAt: "2026-06-12T12:15:00+01:00",
    shareUrl: "/aggregator/tickets/ticket_demo_cassava"
  }
};

export async function getCollectionTicket(id: string): Promise<CollectionTicket> {
  await simulateNetworkDelay(140);

  return demoTickets[id] ?? createFallbackTicket(id);
}

function createFallbackTicket(id: string): CollectionTicket {
  const suffix = id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase().padStart(6, "0");

  return {
    id,
    referenceNumber: `AGL-WST-${suffix}`,
    wasteCategory: "Cassava peel",
    estimatedDryWeightKg: 200,
    moisture: "Dry",
    farmerMaskedPhone: "080****2341",
    aggregatorName: "Amina Yusuf",
    aggregatorPhone: "08031234567",
    gps: {
      latitude: 12.0022,
      longitude: 8.592,
      address: "Tarauni pickup point, Kano",
      zone: "Tarauni"
    },
    status: "Pending Match",
    qrCodeValue: `AGRILINK:TICKET:AGL-WST-${suffix}`,
    createdAt: new Date().toISOString(),
    shareUrl: `/aggregator/tickets/${id}`
  };
}

async function simulateNetworkDelay(milliseconds: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
