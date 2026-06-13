import type {
  BuyerDashboardData,
  BuyerMatch,
  CorporateBuyerProfile,
  StandingDemandOrder
} from "@/lib/types";

const factoryProfile: CorporateBuyerProfile = {
  id: "buyer_factory_001",
  buyerType: "factory",
  organizationName: "Dangote Feeds Ltd",
  contactName: "Musa Abubakar",
  roleTitle: "Procurement Manager",
  phoneNumber: "08035551234",
  location: "Kano - Nassarawa LGA"
};

const restaurantProfile: CorporateBuyerProfile = {
  id: "buyer_restaurant_001",
  buyerType: "restaurant",
  organizationName: "Suya Palace Group",
  contactName: "Adaeze Okonkwo",
  roleTitle: "Head of Procurement",
  phoneNumber: "08067774521",
  location: "Lagos - Surulere",
  logisticsMode: "platform_courier"
};

const factoryMatches: BuyerMatch[] = [
  {
    id: "match_waste_001",
    buyerType: "factory",
    pipelineType: "agri_waste",
    itemName: "Cassava peel",
    weightKg: 200,
    pricePerKg: 32,
    totalPrice: 6400,
    status: "Matched",
    moisture: "Dry",
    aggregatorName: "Amina Yusuf",
    aggregatorPhone: "08031234441",
    farmerMaskedPhone: "080****2341",
    distanceKm: 12,
    location: {
      latitude: 12.0022,
      longitude: 8.592,
      address: "Tarauni pickup point, Kano",
      zone: "Tarauni"
    },
    collectionWindow: "Today, 2:00 PM - 5:00 PM",
    expiresAt: "2026-06-12T16:30:00+01:00"
  },
  {
    id: "match_waste_002",
    buyerType: "factory",
    pipelineType: "agri_waste",
    itemName: "Rice husks",
    weightKg: 480,
    pricePerKg: 18,
    totalPrice: 8640,
    status: "Stage 1 Released",
    moisture: "Damp",
    aggregatorName: "Bello Sani",
    aggregatorPhone: "08039887711",
    farmerMaskedPhone: "081****7762",
    distanceKm: 28,
    location: {
      latitude: 11.9354,
      longitude: 8.5282,
      address: "Kura aggregation shed, Kano",
      zone: "Kura"
    },
    collectionWindow: "Tomorrow, 9:00 AM - 12:00 PM",
    expiresAt: "2026-06-13T09:00:00+01:00"
  },
  {
    id: "match_waste_003",
    buyerType: "factory",
    pipelineType: "agri_waste",
    itemName: "Maize stalks",
    weightKg: 320,
    pricePerKg: 22,
    totalPrice: 7040,
    status: "Pending Match",
    moisture: "Wet",
    aggregatorName: "Hadiza Lawal",
    aggregatorPhone: "08021230009",
    farmerMaskedPhone: "070****4401",
    distanceKm: 34,
    location: {
      latitude: 12.1477,
      longitude: 8.7423,
      address: "Gwarzo farm cluster, Kano",
      zone: "Gwarzo"
    },
    collectionWindow: "Pending buyer confirmation",
    expiresAt: "2026-06-12T21:00:00+01:00"
  }
];

const restaurantMatches: BuyerMatch[] = [
  {
    id: "match_fresh_001",
    buyerType: "restaurant",
    pipelineType: "fresh_produce",
    itemName: "Tomatoes",
    weightKg: 140,
    pricePerKg: 620,
    totalPrice: 86800,
    status: "Matched",
    urgency: "red",
    condition: "Fresh",
    aggregatorName: "Amina Yusuf",
    aggregatorPhone: "08031234441",
    farmerMaskedPhone: "080****9910",
    distanceKm: 8,
    location: {
      latitude: 6.5244,
      longitude: 3.3792,
      address: "Mile 12 pickup zone",
      zone: "Mile 12"
    },
    collectionWindow: "Today, 1:00 PM - 3:00 PM",
    expiresAt: "2026-06-12T13:20:00+01:00",
    logisticsMode: "platform_courier",
    deliveryFee: 2200
  },
  {
    id: "match_fresh_002",
    buyerType: "restaurant",
    pipelineType: "fresh_produce",
    itemName: "Leafy greens",
    weightKg: 90,
    pricePerKg: 410,
    totalPrice: 36900,
    status: "Pending Match",
    urgency: "amber",
    condition: "Slightly bruised",
    aggregatorName: "Chinedu Obi",
    aggregatorPhone: "08044556612",
    farmerMaskedPhone: "070****8822",
    distanceKm: 15,
    location: {
      latitude: 6.6018,
      longitude: 3.3515,
      address: "Agege aggregation point",
      zone: "Agege"
    },
    collectionWindow: "Today, 4:00 PM - 6:00 PM",
    expiresAt: "2026-06-12T15:45:00+01:00",
    logisticsMode: "self_arranged"
  }
];

const factoryOrders: StandingDemandOrder[] = [
  {
    id: "order_factory_001",
    buyerType: "factory",
    itemName: "Cassava peel",
    minimumKg: 150,
    maximumKg: 800,
    pricePerKg: 32,
    preferredZones: ["Tarauni", "Kura", "Nassarawa"],
    status: "Active",
    moistureTolerance: "Dry + Damp"
  },
  {
    id: "order_factory_002",
    buyerType: "factory",
    itemName: "Rice husks",
    minimumKg: 300,
    maximumKg: 1200,
    pricePerKg: 18,
    preferredZones: ["Kura", "Bunkure"],
    status: "Active",
    moistureTolerance: "Dry only"
  }
];

const restaurantOrders: StandingDemandOrder[] = [
  {
    id: "order_restaurant_001",
    buyerType: "restaurant",
    itemName: "Tomatoes",
    minimumKg: 80,
    maximumKg: 220,
    pricePerKg: 620,
    preferredZones: ["Mile 12", "Ikorodu", "Agege"],
    status: "Active",
    logisticsMode: "platform_courier"
  },
  {
    id: "order_restaurant_002",
    buyerType: "restaurant",
    itemName: "Leafy greens",
    minimumKg: 60,
    maximumKg: 120,
    pricePerKg: 410,
    preferredZones: ["Agege", "Oshodi"],
    status: "Paused",
    logisticsMode: "self_arranged"
  }
];

export const buyerDashboardFixtures: Record<"factory" | "restaurant", BuyerDashboardData> = {
  factory: {
    profile: factoryProfile,
    stats: {
      activeMatches: factoryMatches.filter((match) => match.status !== "Collected").length,
      confirmedToday: 2,
      pendingInvoices: 4,
      monthlyVolumeKg: 12800
    },
    matches: factoryMatches,
    orders: factoryOrders
  },
  restaurant: {
    profile: restaurantProfile,
    stats: {
      activeMatches: restaurantMatches.filter((match) => match.status !== "Delivered").length,
      confirmedToday: 5,
      pendingInvoices: 2,
      monthlyVolumeKg: 3460
    },
    matches: restaurantMatches,
    orders: restaurantOrders
  }
};
