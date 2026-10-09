/** UI requirements only. No endpoint, wire schema, or authentication contract is approved. */
export const pageRequirements = {
  "buyer-profile": {"title":"Profile & Settings","description":"Saved Farmtry design preview.","needs":["Approved account, catalogue and order API contracts"],"figmaNode":"329:4066"},
  "buyer-filtered-listings": {"title":"Browse Crops & Waste","description":"Saved Farmtry design preview.","needs":["Approved account, catalogue and order API contracts"],"figmaNode":"339:4735"},
  "get-started": {"title":"Create Your Account","description":"Saved Farmtry design preview.","needs":["Approved account, catalogue and order API contracts"],"figmaNode":"368:7882"},
  "get-started-corporate": {"title":"Create Corporate Buyer Account","description":"Saved Farmtry design preview.","needs":["Approved account, catalogue and order API contracts"],"figmaNode":"368:8128"},
  "get-started-aggregator": {"title":"Create Aggregator Account","description":"Saved Farmtry design preview.","needs":["Approved account, catalogue and order API contracts"],"figmaNode":"368:8374"},
  "buyer-login-compact": {"title":"Buyer Login","description":"Saved Farmtry design preview.","needs":["Approved account, catalogue and order API contracts"],"figmaNode":"368:8222"},
  "confirm-account": {"title":"Confirm Buyer Account","description":"Saved Farmtry design preview.","needs":["Approved account, catalogue and order API contracts"],"figmaNode":"380:13399"},
  "confirm-account-summary": {"title":"Cart & Account Confirmation","description":"Saved Farmtry design preview.","needs":["Approved account, catalogue and order API contracts"],"figmaNode":"380:13138"},
  "account-success": {"title":"Account Confirmation Design","description":"Saved Farmtry design preview.","needs":["Approved account, catalogue and order API contracts"],"figmaNode":"388:1882"},
  "admin-login": {"title":"Admin Login","description":"Preview the saved admin account screen.","needs":["Admin authentication and recovery contract"],"figmaNode":"383:19072"},
  "admin-recovery": {"title":"Admin Account Recovery","description":"Preview the saved admin account screen.","needs":["Admin authentication and recovery contract"],"figmaNode":"383:19617"},
  "admin-recovery-sms": {"title":"Admin SMS Recovery","description":"Preview the saved admin account screen.","needs":["Admin authentication and recovery contract"],"figmaNode":"383:19719"},
  "admin-reset": {"title":"Admin Reset Password","description":"Preview the saved admin account screen.","needs":["Admin authentication and recovery contract"],"figmaNode":"383:19472"},

  "admin-users": {"title":"Users Management","description":"Preview the saved users management workspace.","needs":["Approved admin operations, server-enforced permissions and response schemas"],"figmaNode":"381:14614"},
  "admin-farmers": {"title":"Farmers","description":"Preview the saved farmers workspace.","needs":["Approved admin operations, server-enforced permissions and response schemas"],"figmaNode":"381:14937"},
  "admin-verifications": {"title":"Verifications","description":"Preview the saved verifications workspace.","needs":["Approved admin operations, server-enforced permissions and response schemas"],"figmaNode":"381:15399"},
  "admin-transactions": {"title":"Transactions","description":"Preview the saved transactions workspace.","needs":["Approved admin operations, server-enforced permissions and response schemas"],"figmaNode":"381:15772"},
  "admin-matching": {"title":"Matching Engine","description":"Preview the saved matching engine workspace.","needs":["Approved admin operations, server-enforced permissions and response schemas"],"figmaNode":"381:17021"},
  "admin-disputes": {"title":"Dispute Resolution","description":"Preview the saved dispute resolution workspace.","needs":["Approved admin operations, server-enforced permissions and response schemas"],"figmaNode":"381:17917"},
  "admin-content": {"title":"Content & Notifications","description":"Preview the saved content & notifications workspace.","needs":["Approved admin operations, server-enforced permissions and response schemas"],"figmaNode":"381:16214"},
  "admin-reports": {"title":"Reports","description":"Preview the saved reports workspace.","needs":["Approved admin operations, server-enforced permissions and response schemas"],"figmaNode":"381:17540"},
  "admin-settings": {"title":"System Settings","description":"Preview the saved system settings workspace.","needs":["Approved admin operations, server-enforced permissions and response schemas"],"figmaNode":"381:16711"},

  "aggregator-verify": { title: "Verify aggregator email", description: "Confirm your registration email with the code you received.", needs: ["POST auth/verify-otp", "POST auth/resend-otp"], figmaNode: null },
  marketplace: { title: "Marketplace", description: "Discover verified produce and agricultural waste from local hubs.", needs: ["Paginated listings and filter options", "Listing details, availability, price units and image URLs", "Verification and quality certificate status"], figmaNode: "372:9017" },
  product: { title: "Product details", description: "View a verified listing before starting a purchase.", needs: ["Stable listing identifier and current inventory", "Price, currency, quantity units and delivery options", "Quality certificates and supplier information"], figmaNode: "371:8473" },
  cart: { title: "Shopping cart", description: "Review your selected products and delivery costs.", needs: ["Cart identity, line items and inventory checks", "Authoritative totals, taxes and delivery quote", "Cart update and expiry rules"], figmaNode: "374:10149" },
  checkout: { title: "Checkout", description: "Arrange delivery and securely complete your order.", needs: ["Validated delivery address and order quote", "Order creation and duplicate submission protection", "Payment initiation, status and confirmation"], figmaNode: "376:11408" },
  wishlist: { title: "Saved items", description: "Keep the products you want to return to.", needs: ["Authenticated saved listings", "Save and remove operations", "Unavailable and deleted listing behavior"], figmaNode: "374:10620" },
  buyer: { title: "Corporate Buyer Hub", description: "Your procurement, verified matches and order workspace.", needs: ["Buyer session and organization permissions", "Dashboard, matches and purchase history", "Notifications and profile settings"], figmaNode: "338:4351" },
  "buyer-listings": { title: "Available listings", description: "Browse sample verified produce and farm waste.", needs: ["Approved buyer operation contract and response schemas"], figmaNode: "329:2673" },
  "buyer-listing": { title: "Listing details", description: "Inspect a saved listing and its matching opportunity.", needs: ["Approved buyer operation contract and response schemas"], figmaNode: "329:2986" },
  "buyer-match": { title: "Match details", description: "Review a sample match and pickup summary.", needs: ["Approved buyer operation contract and response schemas"], figmaNode: "329:3178" },
  "buyer-scan": { title: "QR scanner", description: "Preview intake and handover verification.", needs: ["Approved buyer operation contract and response schemas"], figmaNode: "329:3417" },
  "buyer-notifications": { title: "Notifications", description: "Review buyer matches, orders and account notifications.", needs: ["Notifications and unread counts", "Read-state updates and pagination", "Notification preferences"], figmaNode: "329:3870" },
  "buyer-history": { title: "Purchase history", description: "Review procurement orders, delivery status and purchase records.", needs: ["Buyer order history and filtering", "Invoices, receipts and CSV export", "Delivery tracking and pagination"], figmaNode: "329:3611" },
  "buyer-login": { title: "Corporate buyer sign in", description: "Access your corporate procurement account.", needs: ["Credential or identity provider sign in", "Session lifetime, refresh and sign out", "Verification, lockout and field error responses"], figmaNode: "352:5611" },
  "buyer-register": { title: "Register your enterprise", description: "Join Farmtry as a corporate buyer.", needs: ["Organization and contact registration schema", "Business verification document upload", "Email confirmation and approval state"], figmaNode: "352:5465" },
  aggregator: { title: "Aggregator Hub", description: "Connect your local farmers to verified buyers.", needs: ["Aggregator session and verification status", "Farmer registry, produce verification and buyer matches", "Earnings, handover and settlement status"], figmaNode: "295:8750" },
  "aggregator-login": { title: "Aggregator sign in", description: "Access your field collection workspace.", needs: ["Sign in and session contract", "Approved role and verification status", "Recovery, verification and validation errors"], figmaNode: "377:11846" },
  "aggregator-register": { title: "Join the aggregator network", description: "Register as a field agent and support farmers in your community.", needs: ["Personal details and operating zone schema", "Identity evidence upload and consent", "Registration reference and verification status"], figmaNode: "78:3206" },
  admin: { title: "Admin Portal", description: "Manage platform operations and review activity.", needs: ["Admin authentication and server-enforced permissions", "Users, farmers and verification queues", "Transactions, disputes, reports and audit events"], figmaNode: "381:14266" },
  recovery: { title: "Account recovery", description: "Recover access to your Farmtry account.", needs: ["Recovery initiation without account disclosure", "OTP verification, expiry and resend limits", "Password reset and session invalidation"], figmaNode: "356:6018" },
  "buyer-reset": { title: "Reset your password", description: "Verify a recovery code and choose a new password.", needs: ["Recovery challenge and code verification contract", "Password policy and reset authorization", "Session revocation and sign-in result"], figmaNode: "356:5843" },
  verification: { title: "Account verification", description: "Confirm your account and view your verification progress.", needs: ["Challenge identifier and verification state", "OTP submission and resend policy", "Review status and required follow-up"], figmaNode: null },
  support: { title: "Help and support", description: "Get help with your Farmtry account or an order.", needs: ["Approved help content and support contacts", "Support or dispute submission", "Case reference and progress"], figmaNode: null },
  governance: { title: "Governance and trust", description: "View Farmtry’s policies, standards and verification information.", needs: ["Approved legal and policy content", "Verified business credentials", "Policy versions and effective dates"], figmaNode: null }
} as const;

export type IntegrationPage = keyof typeof pageRequirements;

export type PendingContract = {
  status: "awaiting-specification";
  endpoint: null;
  requestSchema: null;
  responseSchema: null;
};

export const pendingContract: PendingContract = {
  status: "awaiting-specification", endpoint: null, requestSchema: null, responseSchema: null
};
