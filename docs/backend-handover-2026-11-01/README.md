# Backend-controlled frontend handover — 1 November 2026

The existing marketplace, account dropdown, Corporate Buyer sidebar/header and Aggregator desktop/mobile shell remain the UI. Presentation mode is now opt-in (NEXT_PUBLIC_PRESENTATION_MODE=true); normal builds use backend services. No browser registration, local activity, availability, KYC approval, fabricated payment or sample product fallback is accepted as a live record. Old local presentation accounts are not real accounts and are not uploaded.

## Connected operations

| UI | Service | Behaviour |
| --- | --- | --- |
| Shared login/logout | POST /auth/login, POST /auth/logout, POST /auth/refresh-token | Existing cookie/session transport; server role drives destination; failed logout retains the session. |
| Catalogue/product | GET /marketplace/listings, GET /marketplace/listings/:id | Validated IDs, prices, stock, units, minimums and images. Errors show retry without sample products. |
| Cart | GET /buyer/cart; POST /buyer/cart/items; DELETE item/cart | Totals and successful edits come from the server. |
| Order creation/history | POST /buyer/orders; GET list/detail; PATCH cancel | Stable idempotency key across an ambiguous retry; confirmation requires valid server order. No payment inferred. |
| Corporate dashboard/profile | GET /buyer/dashboard, GET /buyer/profile | Current shell and settings layout; counters and company fields from validated DTOs. |
| Aggregator dashboard/logs/status | GET /aggregator/dashboard, /aggregator/logs, /aggregator/status | Current shell; server counters/logs/KYC only. |
| Administration | Existing users, audit, KYC/dispute decisions and listing adapters | Existing server-authorized components embedded in the current admin shell. |
| Wishlist toggle | POST /buyer/wishlist/toggle | Uses server listing ID. Read/list view is unavailable pending its DTO. |

## Required backend contracts

1. Minimal registration for Consumer (firstName, lastName, email, phone, password), Aggregator (same) and Corporate Buyer (company name, email, phone, password). These are UI fields, not approved HTTP payloads. The old corporate register operation requires additional organization/contact fields; the old aggregator register operation combines account creation with KYC. The current short forms stay present with submission unavailable instead of inventing missing values or silently reverting to old forms. Backend owner must supply operation paths, DTOs, email verification steps and field errors.
2. Explicit role distinction: legacy buyer currently routes to Consumer; corporate/corporate_buyer routes to Corporate Buyer. The backend must provide an authoritative distinction. No email-domain or browser-role inference is used.
3. Consumer profile DTO: the existing /buyer/profile decoder follows the supplied organization profile contract. Confirm a distinct consumer schema/endpoint or define its compatible fields; no alias guessing is added.
4. Profile/settings mutations, sourcing preferences and notification/security settings. Current server details are read-only; no browser-only save is presented as persisted.
5. Wishlist read response/IDs/pagination; directory, supplier, matching and farmer-registration services; photo upload followed by separate KYC/produce submission.
6. Presence, availability and last-seen: server-authenticated identity, heartbeat TTL, reconnect/offline policy and timestamps. No browser presence is displayed as live.
7. Earnings, payout balances, withdrawal decisions, receiving QR/handover workflows, invoices/reports, delivery quotes/tracking and payment collection. No synthetic balances, tickets, CSV reports or payment success.
8. Activity-history service. The former local button-click timeline is not an authoritative audit stream and is not promoted into one.

No missing endpoint is guessed. Unsupported features show a service state inside the retained UI. Frontend route checks are navigation only; backend authorization and KYC checks must protect every operation.

## Verification

- Existing 63 service contract/failure-path checks, 18 auth validation checks and cookie-proxy check.
- scripts/test-backend-handover.cjs uses isolated API fixtures, not real account creation/order placement, to verify catalogue outage without examples, ignored demo identity, actual cart errors, stable order retry, server roles, current workspace shells and server KYC.
- Live public catalogue connectivity is checked separately and is not certified by fixture tests.
