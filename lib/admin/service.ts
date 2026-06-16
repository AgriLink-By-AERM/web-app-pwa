export type AdminUserRole = "Aggregator" | "Agro-Dealer" | "Corporate Buyer";
export type AdminUserStatus = "pending" | "active" | "suspended";
export type AdminLogStatus = "clean" | "flagged" | "rejected";
export type AdminMatchStatus = "pending" | "accepted" | "disputed" | "resolved";
export type AdminSystemSeverity = "info" | "warning" | "critical";

export type AdminUser = {
  id: string;
  initials: string;
  name: string;
  userId: string;
  role: AdminUserRole;
  phone: string;
  registered: string;
  zone: string;
  status: AdminUserStatus;
  verificationScore: number;
};

export type AdminMarketplaceLog = {
  id: string;
  batchReference: string;
  owner: string;
  category: "Fresh Produce" | "Agri-Waste";
  commodity: string;
  weightKg: number;
  region: string;
  status: AdminLogStatus;
  loggedAt: string;
};

export type AdminMatch = {
  id: string;
  buyer: string;
  batchReference: string;
  commodity: string;
  volumeMt: number;
  matchScore: number;
  escrowValue: number;
  status: AdminMatchStatus;
  disputeReason?: string;
};

export type AdminSystemLog = {
  id: string;
  actor: string;
  event: string;
  severity: AdminSystemSeverity;
  createdAt: string;
};

export type AdminDashboardStats = {
  pendingUsers: number;
  activeUsers: number;
  flaggedLogs: number;
  disputedMatches: number;
};

export type AdminDashboardData = {
  stats: AdminDashboardStats;
  users: AdminUser[];
  logs: AdminMarketplaceLog[];
  matches: AdminMatch[];
  systemLogs: AdminSystemLog[];
};

const users: AdminUser[] = [
  {
    id: "usr_agg_001",
    initials: "AM",
    name: "Amina Musa",
    userId: "AGG-KD-1042",
    role: "Aggregator",
    phone: "+234 803 441 0101",
    registered: "2026-06-08",
    zone: "Kaduna North",
    status: "pending",
    verificationScore: 86
  },
  {
    id: "usr_dealer_001",
    initials: "CO",
    name: "Chinedu Okafor",
    userId: "DLR-EN-7718",
    role: "Agro-Dealer",
    phone: "+234 706 118 2209",
    registered: "2026-06-07",
    zone: "Enugu East",
    status: "pending",
    verificationScore: 78
  },
  {
    id: "usr_buyer_001",
    initials: "DF",
    name: "Dangote Feeds Procurement",
    userId: "BUY-LG-2101",
    role: "Corporate Buyer",
    phone: "+234 812 900 4560",
    registered: "2026-06-04",
    zone: "Lagos Mainland",
    status: "active",
    verificationScore: 97
  },
  {
    id: "usr_agg_002",
    initials: "HO",
    name: "Hassan Ojo",
    userId: "AGG-KW-5530",
    role: "Aggregator",
    phone: "+234 805 330 2117",
    registered: "2026-05-30",
    zone: "Kwara Central",
    status: "active",
    verificationScore: 91
  },
  {
    id: "usr_dealer_002",
    initials: "BF",
    name: "Binta Farms Inputs",
    userId: "DLR-KN-8824",
    role: "Agro-Dealer",
    phone: "+234 809 707 4400",
    registered: "2026-05-21",
    zone: "Kano Municipal",
    status: "suspended",
    verificationScore: 64
  }
];

const marketplaceLogs: AdminMarketplaceLog[] = [
  {
    id: "log_001",
    batchReference: "BCH-CAS-8841",
    owner: "Amina Musa",
    category: "Agri-Waste",
    commodity: "Cassava Peels",
    weightKg: 1280,
    region: "Kaduna North",
    status: "clean",
    loggedAt: "2026-06-16T08:35:00.000Z"
  },
  {
    id: "log_002",
    batchReference: "BCH-MAI-2190",
    owner: "Hassan Ojo",
    category: "Fresh Produce",
    commodity: "Yellow Maize",
    weightKg: 8800,
    region: "Kwara Central",
    status: "flagged",
    loggedAt: "2026-06-15T15:10:00.000Z"
  },
  {
    id: "log_003",
    batchReference: "BCH-TOM-5602",
    owner: "Maryam Bello",
    category: "Fresh Produce",
    commodity: "Roma Tomatoes",
    weightKg: 640,
    region: "Nasarawa West",
    status: "rejected",
    loggedAt: "2026-06-14T11:20:00.000Z"
  }
];

const matches: AdminMatch[] = [
  {
    id: "mat_001",
    buyer: "Dangote Feeds Ltd",
    batchReference: "BCH-MAI-2190",
    commodity: "Yellow Maize",
    volumeMt: 8.8,
    matchScore: 94,
    escrowValue: 6150000,
    status: "pending"
  },
  {
    id: "mat_002",
    buyer: "Lagos Starch Processors",
    batchReference: "BCH-CAS-8841",
    commodity: "Cassava Peels",
    volumeMt: 1.28,
    matchScore: 88,
    escrowValue: 384000,
    status: "disputed",
    disputeReason: "Warehouse receiving weight differs from logged manifest."
  },
  {
    id: "mat_003",
    buyer: "Northern Foods PLC",
    batchReference: "BCH-SOY-7124",
    commodity: "Soybean",
    volumeMt: 13.4,
    matchScore: 91,
    escrowValue: 11390000,
    status: "accepted"
  }
];

const systemLogs: AdminSystemLog[] = [
  {
    id: "sys_001",
    actor: "Compliance Engine",
    event: "Flagged BCH-MAI-2190 for unusual grade variance.",
    severity: "warning",
    createdAt: "2026-06-16T09:05:00.000Z"
  },
  {
    id: "sys_002",
    actor: "Escrow Service",
    event: "Funds committed for MAT-003 warehouse delivery.",
    severity: "info",
    createdAt: "2026-06-16T08:58:00.000Z"
  },
  {
    id: "sys_003",
    actor: "Registry Sync",
    event: "Dealer license DLR-KN-8824 failed registry refresh.",
    severity: "critical",
    createdAt: "2026-06-15T18:44:00.000Z"
  }
];

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  return {
    stats: {
      pendingUsers: users.filter((user) => user.status === "pending").length,
      activeUsers: users.filter((user) => user.status === "active").length,
      flaggedLogs: marketplaceLogs.filter((log) => log.status === "flagged").length,
      disputedMatches: matches.filter((match) => match.status === "disputed").length
    },
    users,
    logs: marketplaceLogs,
    matches,
    systemLogs
  };
}

export async function approveAdminUser(userId: string): Promise<{ userId: string; status: "approved" }> {
  return { userId, status: "approved" };
}

export async function suspendAdminUser(userId: string, reason: string): Promise<{ userId: string; reason: string; status: "suspended" }> {
  return { userId, reason, status: "suspended" };
}

export async function resolveAdminMatch(matchId: string): Promise<{ matchId: string; status: "resolved" }> {
  return { matchId, status: "resolved" };
}

export function formatAdminCurrency(value: number): string {
  return new Intl.NumberFormat("en-NG", {
    currency: "NGN",
    maximumFractionDigits: 0,
    style: "currency"
  }).format(value);
}

export function formatAdminDate(value: string): string {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
