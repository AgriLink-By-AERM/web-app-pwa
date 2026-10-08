export const adminPages = {
  admin: ["Dashboard", "381-14266"],
  "admin-users": ["Users Management", "381-14614"],
  "admin-farmers": ["Farmers", "381-14937"],
  "admin-verifications": ["Verifications", "381-15399"],
  "admin-transactions": ["Transactions", "381-15772"],
  "admin-matching": ["Matching Engine", "381-17021"],
  "admin-disputes": ["Dispute Resolution", "381-17917"],
  "admin-content": ["Content & Notifications", "381-16214"],
  "admin-reports": ["Reports", "381-17540"],
  "admin-settings": ["System Settings", "381-16711"],
} as const;
export type AdminPage = keyof typeof adminPages;
export type SampleRow = Record<string, string>;
export type TableDefinition = { title: string; description: string; columns: string[]; filter: string; tabs: string[]; rows: SampleRow[] };
const records = (columns: string[], rows: string[][]): SampleRow[] => rows.map(row => Object.fromEntries(columns.map((c,i)=>[c,row[i] || ""])));
const userColumns=["Name","Email / Phone","Role","Status","Joined on"];
const farmerColumns=["Name","ID","Phone","Location","Status","Joined on"];
const verificationColumns=["ID","Type","Farmer","Aggregator","Date","Status"];
const transactionColumns=["ID","Product","Buyer","Farmer","Amount","Status","Date"];
const contentColumns=["Title","Type","Audience","Date","Status"];
export const adminTables: Partial<Record<AdminPage, TableDefinition>> = {
  "admin-users": { title:"Users", description:"Manage platform users and their access.", columns:userColumns, filter:"Role", tabs:["All","Aggregators","Corporate Buyer","Buyer"], rows:records(userColumns,[
    ["Tunde Adeyemi","tunde@gmail.com","Aggregators","Active","Aug 12, 2026"],
    ["GreenCycle Hub","buyer@greencycle.com","Corporate Buyer","Active","Aug 10, 2026"],
    ["Amina Yusuf","amina@gmail.com","Aggregators","Pending","Aug 9, 2026"],
    ["ABC Foods Ltd","info@abcfoods.com","Corporate Buyer","Active","Aug 5, 2026"],
    ["Ibrahim Musa","ibrahim@gmail.com","Aggregators","Active","Aug 3, 2026"],
    ["Sunrise Farms","contact@sunrise.com","Corporate Buyer","Suspended","Jul 28, 2026"]]) },
  "admin-farmers": { title:"Farmers", description:"View, verify, and manage agricultural producers across regional operational hubs.", columns:farmerColumns, filter:"Status", tabs:["All","Verified","Pending","Suspended"], rows:records(farmerColumns,[
    ["Bello Sani","FMT-NG-0412","0803 456 7890","Oyo, Ibadan","Verified","Aug 12, 2026"],
    ["Maryam Lawal","FMT-NG-0883","0806 789 1234","Kwara","Verified","Aug 10, 2026"],
    ["Chinedu Okafor","FMT-NG-1102","0812 345 6789","Enugu","Pending","Aug 8, 2026"],
    ["Fatima Ibrahim","FMT-NG-2490","0703 222 3344","Kano","Verified","Aug 5, 2026"],
    ["Samuel Adeyemi","FMT-NG-3041","0816 777 8899","Ogun","Verified","Aug 2, 2026"],
    ["Ngozi Eze","FMT-NG-4919","0809 111 2222","Abia","Suspended","Jul 29, 2026"]]) },
  "admin-verifications": { title:"Verifications", description:"Review and approve produce and waste verifications across regional aggregation hubs.", columns:verificationColumns,filter:"Type",tabs:["All","Produce","Waste"],rows:records(verificationColumns,[
    ["#FV-0012","Produce","Bello Sani","Aminu Yusuf","Aug 26, 2026","Pending"],
    ["#FW-0045","Waste","Maryam Lawal","Tunde Adeyemi","Aug 26, 2026","Pending"],
    ["#FV-0031","Produce","Chinedu Okafor","Sodiq Ibrahim","Aug 25, 2026","Verified"],
    ["#FW-0022","Waste","Fatima Ibrahim","Aisha Bello","Aug 25, 2026","Verified"],
    ["#FV-0018","Produce","Samuel Adeyemi","Tunde Adeyemi","Aug 24, 2026","Rejected"],
    ["#FW-0011","Waste","Ngozi Eze","Chinedu Okafor","Aug 24, 2026","Verified"]]) },
  "admin-transactions": {title:"Transactions",description:"Track and manage all platform transactions.",columns:transactionColumns,filter:"Status",tabs:["All","Completed","Pending","Cancelled"],rows:records(transactionColumns,[
    ["#TRX-0012","Maize Husks","ABC Foods Ltd","Bello Sani","₦340,000","Completed","Aug 25, 2026"],
    ["#TRX-0011","Cassava Peels","GreenCycle Hub","Maryam Lawal","₦180,000","Pending","Aug 25, 2026"],
    ["#TRX-0010","Yellow Corn","Northern Flour Mills","Chinedu Okafor","₦620,000","Completed","Aug 24, 2026"],
    ["#TRX-0009","Tomatoes","Adewale Foods","Fatima Ibrahim","₦520,000","Completed","Aug 23, 2026"],
    ["#TRX-0008","Maize Husks","ABC Foods Ltd","Samuel Adeyemi","₦310,000","Cancelled","Aug 22, 2026"],
    ["#TRX-0007","Cassava Peels","GreenCycle Hub","Ngozi Eze","₦275,000","Completed","Aug 21, 2026"]]) },
  "admin-content": {title:"Content & Notifications",description:"Manage platform content, broadcasts, price updates, and system notifications.",columns:contentColumns,filter:"Type",tabs:["All","System","General","Price Alert","Education"],rows:records(contentColumns,[
    ["Platform Maintenance","System","All Users","Aug 25, 2026","Published"],
    ["New Buyer Onboarded","General","Aggregators","Aug 24, 2026","Published"],
    ["Market Price Update","Price Alert","All Users","Aug 22, 2026","Published"],
    ["Training Webinar","Education","Farmers","Aug 20, 2026","Scheduled"],
    ["Seasonal Update","General","All Users","Aug 18, 2026","Published"],
    ["Policy Update","System","All Users","Aug 15, 2026","Published"]]) },
};
export const matchingRows=records(["Batch ID","Produce / Waste","Origin hub / Farmer","Quantity & Grade","Spoilage clock","Suggested buyer","Status"],[
  ["#BTC-8821","Fresh Tomatoes","Oyo Hub · Bello Sani","800 kg · Grade A","4h remaining","Suya Palace · 98% match","Unmatched"],
  ["#BTC-8819","Leafy Greens","Ogun Hub · Tunde Adeyemi","350 kg · Grade A","6h remaining","Nestle Agribusiness (12km)","Unmatched"],
  ["#BTC-8804","Cassava Peels","Kwara Hub · Maryam Lawal","1,400 kg · Grade B Dry","48h remaining","BioFuel Nigeria · 34km","Unmatched"],
  ["#BTC-8790","Yellow Maize","Kano Hub · Fatima Ibrahim","2,200 kg · Grade A","Fulfilled","Northern Flour Mills","Auto-Matched"]]);
export const disputeRows=records(["Ticket & Order","Claimant / Defendant","Reason","Amount","Status"],[
  ["#DSP-042 · #TRX-0014","Suya Palace Ltd / Adewale Farms","High Spoilage upon arrival · >25% bruised in transit","₦340,000","Under Review"],
  ["#DSP-041 · #TRX-0012","GreenCycle Hub / Maryam Lawal","Moisture Spec Exceeded · Wet batch fermentation risk","₦180,000","Open"],
  ["#DSP-039 · #TRX-0008","ABC Foods Ltd / Samuel Adeyemi","Weight Discrepancy · -180kg weighbridge variance","₦310,000","Resolved"],
  ["#DSP-037 · #TRX-0004","AgroMills Direct / Bello Sani","Foreign Material Contaminants · Sand & pebbles exceed 4%","₦410,000","Escalated"]]);
