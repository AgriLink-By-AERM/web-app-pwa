# Updated contract alignment — 2026-10-14

Source: `BACKEND_CONTRACT_2026-10-14.md`, copied from the supplied New_BACKEND_CONTRACT_HANDOFF_Farmtry (2).bin. This supersedes the earlier token-link recovery specification. Examples and the backend superadmin seed command are reference material; no accounts were seeded and no production mutations were performed.

## Implemented in this pass
- Recovery/reset UI sends email OR phone, six-digit code (including leading zeros), and newPassword. Copy reflects the documented ten-minute expiry. Registration verification remains a separate endpoint.
- Migrated contract tests to lib/api-client.ts, lib/auth/auth.ts and lib/aggregator/api.ts.
- Browser requests default to same-origin /api/v1 with HttpOnly cookies. Dev and preview default upstream remains the user's deployed Render API. FARMTRY_API_UPSTREAM can point to http://localhost:5001 for the contract's local backend. Vercel rewrite remains unchanged.
- Shared refresh, single retry on 401, rotated logout reference, session preservation after transient failure, stale refresh protection, and rejection of unconfirmed/malformed responses.
- Preserved backend error codes, messages and validation details. Aggregator response validation restored, including nullable rejectionReason.
- Legacy registration cannot manufacture email, password, photo URL or a successful server ID.

## Still pending
The document's integration matrix is a supplied snapshot, not test evidence. Marketplace, buyer registration/cart/wishlist/orders, dealer, farmer and admin services still need their dedicated UI integration passes. Do not assume these became live by adding the contract. Profile-update, upload and other unspecified actions must not be invented. The historical registration adapter still returns a UI-shaped profile; its displayed metadata must not be treated as server-derived performance or KYC data.

## Validation scope
Contract fixtures, local form checks, proxy-cookie tests, TypeScript and production build. Browser recovery flow uses intercepted API responses. Successful live login, real code delivery/reset and deployed refresh-cookie rotation still require backend acceptance testing with test accounts.

Verification completed: 43 API contract tests, 18 form tests, 1 proxy test, TypeScript, production export of 141 routes, and mocked browser recovery checks passed. Fixed the local preview server to resolve the build's flat HTML routes, including clean URLs with or without trailing slash.
