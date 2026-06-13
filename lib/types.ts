export type UserRole = "farmer" | "aggregator" | "agro_dealer" | "corporate_buyer";

export type BuyerType = "factory" | "restaurant";

export type PipelineType = "fresh_produce" | "agri_waste";

export type TransactionStatus =
  | "Pending Match"
  | "Matched"
  | "In Transit"
  | "Stage 1 Released"
  | "Collected"
  | "Delivered"
  | "Disputed"
  | "No Match Found"
  | "Expired";

export type SpoilageUrgency = "green" | "amber" | "red";

export type MoistureCondition = "Dry" | "Damp" | "Wet";

export type ProduceCondition = "Fresh" | "Slightly bruised" | "Poor";

export type LogisticsMode = "platform_courier" | "self_arranged";

export type GeoLocation = {
  latitude: number;
  longitude: number;
  address: string;
  zone: string;
};

export type CorporateBuyerProfile = {
  id: string;
  buyerType: BuyerType;
  organizationName: string;
  contactName: string;
  roleTitle: string;
  phoneNumber: string;
  location: string;
  logisticsMode?: LogisticsMode;
};

export type StandingDemandOrder = {
  id: string;
  buyerType: BuyerType;
  itemName: string;
  minimumKg: number;
  maximumKg?: number;
  pricePerKg: number;
  preferredZones: string[];
  status: "Active" | "Paused";
  moistureTolerance?: "Dry only" | "Dry + Damp" | "All";
  logisticsMode?: LogisticsMode;
};

export type BuyerMatch = {
  id: string;
  buyerType: BuyerType;
  pipelineType: PipelineType;
  itemName: string;
  weightKg: number;
  pricePerKg: number;
  totalPrice: number;
  status: TransactionStatus;
  urgency?: SpoilageUrgency;
  condition?: ProduceCondition;
  moisture?: MoistureCondition;
  aggregatorName: string;
  aggregatorPhone: string;
  farmerMaskedPhone: string;
  distanceKm: number;
  location: GeoLocation;
  collectionWindow: string;
  expiresAt: string;
  logisticsMode?: LogisticsMode;
  deliveryFee?: number;
};

export type PickupManifest = {
  id: string;
  matchId: string;
  reference: string;
  collectionAddress: string;
  gps: GeoLocation;
  itemName: string;
  weightKg: number;
  moisture: MoistureCondition;
  aggregatorPhone: string;
  collectionWindow: string;
  qrCodeValue: string;
};

export type BuyerDashboardStats = {
  activeMatches: number;
  confirmedToday: number;
  pendingInvoices: number;
  monthlyVolumeKg: number;
};

export type BuyerDashboardData = {
  profile: CorporateBuyerProfile;
  stats: BuyerDashboardStats;
  matches: BuyerMatch[];
  orders: StandingDemandOrder[];
};

export type NigerianZone =
  | "Kano - Nassarawa LGA"
  | "Kano - Tarauni LGA"
  | "Kano - Kura LGA"
  | "Lagos - Ikorodu"
  | "Lagos - Agege"
  | "Ogun - Ifo";

export type AggregatorVerificationStatus = "draft" | "pending_verification" | "approved" | "rejected";

export type AggregatorRegistrationPayload = {
  fullName: string;
  phoneNumber: string;
  governmentIdNumber: string;
  guarantorPhoneNumber: string;
  zone: NigerianZone;
  idPhotoFileName: string;
};

export type AggregatorProfile = AggregatorRegistrationPayload & {
  id: string;
  role: "aggregator";
  verificationStatus: AggregatorVerificationStatus;
  submittedAt: string;
  performanceScore: number;
};

export type AggregatorRegistrationResult = {
  profile: AggregatorProfile;
  message: string;
};

export type AggregatorLogSummary = {
  id: string;
  pipelineType: PipelineType;
  itemName: string;
  weightKg: number;
  farmerMaskedPhone: string;
  status: TransactionStatus;
  submittedAt: string;
  urgency?: SpoilageUrgency;
  moisture?: MoistureCondition;
};

export type AggregatorDashboardData = {
  profile: Pick<AggregatorProfile, "fullName" | "phoneNumber" | "zone" | "performanceScore"> & {
    cashFloatBalance: number;
    premiumTier: "Starter" | "Trusted" | "Premium";
  };
  stats: {
    logsToday: number;
    pendingMatches: number;
    completedThisWeek: number;
    disputedLogs: number;
  };
  recentLogs: AggregatorLogSummary[];
};

export type FreshProduceCategory = "Tomatoes" | "Pepper" | "Leafy greens" | "Cassava" | "Okra" | "Plantain";

export type FreshProduceLogPayload = {
  farmerPhoneNumber: string;
  category: FreshProduceCategory;
  weightKg: number;
  condition: ProduceCondition;
  estimatedHarvestTime: string;
  gps: GeoLocation;
  photoFileName: string;
};

export type FreshProduceLogResult = {
  logId: string;
  status: TransactionStatus;
  urgency: SpoilageUrgency;
  message: string;
};

export type WasteCategory =
  | "Cassava peel"
  | "Rice husks"
  | "Maize stalks"
  | "Groundnut shells"
  | "Palm kernel waste"
  | "Other";

export type AgriWasteLogPayload = {
  farmerPhoneNumber: string;
  category: WasteCategory;
  estimatedDryWeightKg: number;
  moisture: MoistureCondition;
  gps: GeoLocation;
  photoFileName: string;
};

export type CollectionTicket = {
  id: string;
  referenceNumber: string;
  wasteCategory: WasteCategory;
  estimatedDryWeightKg: number;
  moisture: MoistureCondition;
  farmerMaskedPhone: string;
  aggregatorName: string;
  aggregatorPhone: string;
  gps: GeoLocation;
  status: TransactionStatus;
  qrCodeValue: string;
  createdAt: string;
  shareUrl: string;
};

export type AgriWasteLogResult = {
  logId: string;
  status: TransactionStatus;
  ticket: CollectionTicket;
  message: string;
};
