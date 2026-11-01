# Live website corrections

Buyer means Consumer. Corporate Buyer (CB), Aggregator and Admin are separate roles. The backend-returned role determines the destination: Buyer/Consumer goes to the marketplace, CB to the corporate workspace, Aggregator to its workspace, and Admin to administration. Successful authentication is not rejected by a frontend role whitelist. Unknown roles retain an account screen while backend authorization governs service access.

Normal website URLs now render the existing screens. Old /preview links redirect to the corresponding normal URL, preserving query parameters. Existing layouts and registration/KYC fields remain.

Consumer, Corporate Buyer and Aggregator registration buttons submit to backend adapters rather than being locally disabled. Profile, corporate settings and Admin general settings also submit changes and display backend responses. No account, KYC approval or saved change is simulated in live mode.

Integration targets can be overridden through .env.example settings. Default registration targets are /auth/consumer/register, /buyer/register and /auth/aggregator/register; KYC submission targets /aggregator/kyc as multipart form data. These are integration targets, not a claim that every deployed backend endpoint already exists. Backend validation, permission and service errors are displayed. Endpoint prefixes do not redefine Buyer as Corporate Buyer.

Validation uses isolated API fixtures for registration, role routing, profile/settings and KYC failure/success handling; no real accounts or identity documents were submitted.
