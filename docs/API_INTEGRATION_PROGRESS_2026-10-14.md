# API integration progress — 14 October 2026

Reference: BACKEND_CONTRACT_2026-10-14.md. No Figma connector was used. No deployment seeding, real account creation, order placement or administrative mutation was intentionally performed. Browser mutation tests use isolated fixtures with service workers blocked.

## Connected routes
| Area | Routes | Connected operations |
| --- | --- | --- |
| Buyer account | /preview/buyer-register, /preview/buyer-login | Business registration, inline email verification/resend, shared cookie login and role navigation |
| Catalogue | /preview/marketplace, /preview/product?id=SERVER_ID | Public search/filter/pagination, product details, backend units/minimums/stock/prices |
| Cart and checkout | /preview/cart, /preview/checkout | Read/update/remove/clear cart; create order with stable idempotency key, server-confirmed status and total |
| Buyer workspace | /preview/buyer, /preview/buyer-profile, /preview/buyer-history; /buyer/dashboard, /buyer/settings, /buyer/history | Profile/dashboard, paginated orders, detail via ?id=SERVER_ID, pending-order cancellation |
| Saved selection | Product and listing controls | Documented wishlist toggle only |
| Dealer | /dealer/register, /dealer/home, /dealer/profile, /dealer/redeem, /dealer/history | Registration/verification, profile, voucher validation, explicit redemption, transaction history and receipt lookup |
| Farmer | /farmer/register, /farmer, /farmer/profile, /farmer/logs, /farmer/vouchers | Registration/verification, profile/dashboard, filtered/paginated logs/vouchers and voucher lookup |
| Admin authentication | /preview/admin-login, /preview/admin-recovery, /preview/admin-reset | Shared login with admin-role navigation check and six-digit recovery flow |
| Admin records | /preview/admin, /preview/admin-users, /preview/admin-farmers, /preview/admin-verifications, /preview/admin-disputes | Audit logs, users, suspension/activation, aggregator/dealer KYC decisions with reasons, dispute resolve/dismiss with audit confirmation |
| Admin catalogue | /preview/admin-listings | Listing creation, update and confirmed archive |

The existing connected aggregator workspace remains at /preview/aggregator. Unsupported legacy screens retain their explicit demo notices; their example figures are not promoted into live records. Original design components remain in source for comparison. New connected views display the subset of fields supplied by the contract, so this is not a claim of renewed pixel-perfect or mobile design verification.

## Known contract discrepancy
A read-only request to the deployed public GET /marketplace/listings?page=1&limit=1 returned HTTP 200, success:true, data keys `listings,total,page,limit`, total 0. The supplied document says `items,total,page,limit`. The client now accepts those two explicit list keys and rejects other unrecognized shapes. No product records were available for live DTO verification.

## Waiting for backend / acceptance testing
- Wishlist retrieval: user is requesting a real GET /buyer/wishlist example; its summary fields and identifier are not defined in the handoff. Retrieval remains unavailable instead of guessing fields. Toggle is connected.
- Role-specific test accounts and data are needed to verify deployed login/refresh cookies, code delivery, private DTOs, role/KYC permissions and real order/redemption/admin outcomes. Fixture tests do not certify the deployed backend.
- Payment collection, delivery scheduling/quotes, photo upload, profile/settings editing, OAuth, automated matching, reports/exports, notifications/content and other absent contracts remain unavailable or explicitly design-only. Do not invent endpoints or present their sample balances/SLA claims as live.
- Dealer transaction records are decoded using the receipt fields illustrated next to the TransactionDTO reference; confirm that shape with populated live test data.

## Reliability and verification
- Failed reads show errors/retry instead of sample records. Mutations require a success envelope and valid server identifiers.
- Checkout retains the same request/key after an ambiguous failure; validation errors permit correction. Pending retry data is session-scoped. No payment success is inferred from order creation.
- Voucher redemption is not automatically retried after an ambiguous failure; users are directed to transaction review/revalidation.
- Admin decisions require an explicit confirmation, carry the server ID and display its audit reference.
- Local preview supports flat HTML exports even when a route also has child-route folders, plus static RSC payloads.
- Automated suite: 63 API contract/failure-path tests, 18 form-validation tests and one cookie-proxy test.
- Production build exports 149 routes.
- Browser fixtures cover buyer registration/verification, buyer and admin login/role navigation, catalogue-to-cart-to-checkout with outage/retry and identical idempotency key, dealer validation/redemption receipt, admin KYC rejection and 403 state, and farmer dashboard. Expected 503/403 responses are deliberately simulated; no browser runtime errors are accepted.

## Re-running browser fixtures
Build the application and start the preview on port 3004. `scripts/test-integration-browser.cjs` uses Playwright with installed Microsoft Edge. Set FARMTRY_PLAYWRIGHT_PATH to an installed Playwright module location if it is not available through normal module resolution. FARMTRY_TEST_URL optionally overrides http://localhost:3004. All /api/v1 requests are intercepted with fixture responses and service workers are blocked for isolation.

Untracked mobile-app and the pre-pull stash were left untouched.
