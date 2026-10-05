/** UI requirements only. No endpoint, wire schema, or authentication contract is approved. */
export const pageRequirements = {
  "aggregator-verify": { title: "Verify aggregator email", description: "Confirm your registration email with the code you received.", needs: ["POST auth/verify-otp", "POST auth/resend-otp"], figmaNode: null },
  marketplace: { title: "Marketplace", description: "Discover verified produce and agricultural waste from local hubs.", needs: ["Paginated listings and filter options", "Listing details, availability, price units and image URLs", "Verification and quality certificate status"], figmaNode: "372:9017" },
  product: { title: "Product details", description: "View a verified listing before starting a purchase.", needs: ["Stable listing identifier and current inventory", "Price, currency, quantity units and delivery options", "Quality certificates and supplier information"], figmaNode: "371:8473" },
  cart: { title: "Shopping cart", description: "Review your selected products and delivery costs.", needs: ["Cart identity, line items and inventory checks", "Authoritative totals, taxes and delivery quote", "Cart update and expiry rules"], figmaNode: "374:10149" },
  checkout: { title: "Checkout", description: "Arrange delivery and securely complete your order.", needs: ["Validated delivery address and order quote", "Order creation and duplicate submission protection", "Payment initiation, status and confirmation"], figmaNode: "376:11408" },
  wishlist: { title: "Saved items", description: "Keep the products you want to return to.", needs: ["Authenticated saved listings", "Save and remove operations", "Unavailable and deleted listing behavior"], figmaNode: "374:10620" },
  buyer: { title: "Corporate Buyer Hub", description: "Your procurement, verified matches and order workspace.", needs: ["Buyer session and organization permissions", "Dashboard, matches and purchase history", "Notifications and profile settings"], figmaNode: "338:4351" },
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
