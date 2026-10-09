# Backend actions needed to complete Farmtry testing

Prepared 2026-10-08 against the supplied Farmtry v1 handoff and the saved design inventory. This is a request for missing contracts, not an invented API specification. Please provide existing endpoints where they already exist; do not rebuild operations merely because their documentation was missing.

API environment: https://farmtry-core-engine.onrender.com/api/v1

## October 9 update

The frontend now uses same-origin `/api/v1` with the Vercel rewrite/local proxy. The historical direct-origin CORS observation below is not a fresh blocker for this proxy path. Confirm HttpOnly/Secure cookies with no Render-specific Domain attribute and the correct path; test login through refresh on the deployed frontend using a designated account. The frontend screen pass is complete, but this does not prove backend correctness.

## 1. Unblock live testing first

| Priority | Backend request | Evidence needed |
| --- | --- | --- |
| P0 | Allow the local frontend origin `http://localhost:3004` with credentialed browser requests and the intended deployed frontend origin. | Successful preflight and browser sign-in; confirm cookie settings, refresh/logout behavior and recovery-link frontend URL. The October 7 check lacked CORS headers; this is a recorded result, not a fresh deployment check. |
| P0 | Provide the current complete OpenAPI/Swagger document or Postman collection and example JSON responses. | Exact method/path, required fields, enums, nullable fields, permissions, success/error responses and pagination for each operation below. |
| P0 | Provide designated test users and seed records. | Buyer, approved aggregator, pending/rejected aggregator and admin roles; farms, listings, matches, orders and disputes in different states. Share credentials securely, outside source control. |
| P0 | Provide the upload flow used by identity documents, produce photos and delivery/dispute evidence. | Upload initiation, file restrictions, returned durable asset ID/URL, attachment to a record, upload failure and deletion behavior. The frontend currently accepts existing URLs only where the original contract permits them. |

## 2. Already supplied and connected

These fourteen operations have frontend adapters. They still require live acceptance tests; they are not missing implementations to request again.

- `POST /auth/aggregator/register`
- `POST /auth/verify-otp`, `POST /auth/resend-otp`
- `POST /auth/login`, `POST /auth/refresh-token`, `POST /auth/logout`
- `POST /auth/forgot-password`, `POST /auth/reset-password`
- `GET /aggregator/dashboard`, `GET /aggregator/status`
- `GET /aggregator/logs`, `GET /aggregator/logs/:id`, `POST /aggregator/logs`
- `POST /aggregator/disputes`

The paths above are relative to `/api/v1`. Confirm the complete `user`, `aggregator` and `LogResponseDTO` structures: the original reference abbreviated these. Also confirm operating zones, produce categories/pipeline values, units and account/KYC status transitions.

## 3. Missing functional contracts

### Buyer accounts and shared profile

- Register a corporate buyer: organization/contact details, required verification documents, consent and approval/verification outcome.
- Read the current user/organization and server-granted role/permissions; update company profile, contact details and delivery addresses.
- Define change-password, notification preferences and account settings operations that the designs expose.
- Confirm whether shared login/recovery supports buyer and admin roles, what extra admin authentication is required, and which account statuses prevent access.
- Supply Google sign-in configuration and callback/session contract if it is in scope; otherwise explicitly defer that button. The Google account chooser is provider-owned.

### Marketplace, product details and saved items

- Search, filter, sort and paginate produce and agricultural-waste listings; provide available filter values.
- Read listing details, supplier offers, farm/hub details, quality/certification evidence, images, availability and quantity limits.
- Save/remove/read wishlist entries, including unavailable or deleted listings.
- Define a supplier callback/contact request if that action remains in the product design.

Required data: stable listing/offer/supplier IDs; currency and money precision; quantity units and conversion rules; authoritative stock; minimum/order increments; verified status and certificate/media references. Design sample IDs and prices must never become transaction payloads.

### Cart, checkout and payments

- Create/read a cart; add, change quantity, remove items and clear the cart. Define guest versus signed-in ownership and sign-in cart merging.
- Validate a delivery address and serviceability; return available delivery options/windows and an expiring authoritative quote.
- Calculate item totals, consolidation, delivery, taxes/levies, reusable-crate deposits and discounts on the backend. Confirm whether the illustrated insurance incentive and spoilage/refund claims are actual policies.
- Create an order using the current quote; handle inventory reservation, repricing, stock conflicts and duplicate submissions.
- Initiate a sandbox payment; return the supported redirect/continuation information and a server-verified payment/order status. A return URL alone must not indicate payment success.
- Define payment failure, cancellation, retry, pending settlement, refund and any escrow release flow. Backend payment webhooks need processing/reconciliation rules; the frontend needs the resulting status.

### Buyer workspace and fulfilment

- Return dashboard totals, chart periods and recent activity.
- List/read matches and sourcing requirements; accept/reject a match and confirm the resulting order or next step.
- List/read orders with status filters; return fulfilment milestones and tracking details.
- Download genuine invoices, goods-received notes and purchase reports/CSV files.
- Validate a scanned QR/reference and return the batch/order it belongs to; separately confirm receipt/handover with the required evidence. Define expired, invalid and already-used QR behavior.
- Read notifications/unread counts, mark one/all as read, paginate older notifications, and save preferences.
- Read/send supplier messages if messaging is supported; otherwise confirm it is deferred.
- Define buyer dispute creation, evidence, case history and resolution status. The existing aggregator dispute endpoint must not be assumed to support buyers.

### Remaining aggregator actions

- Farmer registry: list/search/read/add/update farmers, link them to the agent/zone and return their associated batches. Specify the actual fields and consent requirements.
- Finish the produce/waste verification lifecycle: photo uploads, draft/edit/resubmit rules, grading inputs, review outcome and rejected-record correction. Clarify which actions are already covered by log creation and which require new endpoints.
- Return assigned matches and allow approved acceptance/rejection, pickup scheduling and batch handover.
- Return QR/ticket details and validate handover, in-transit and delivered milestones, including evidence and who may change each state.
- Return earnings, commissions and payout ledger; validate payout destination; request withdrawal and return processing/success/failure status. Define retry and duplicate-withdrawal protection.
- Read/update aggregator profile and operating zone; list/read existing disputes and their status. Creating a dispute is already supplied.

### Admin screens and actions

| Screen family | Required backend reads and actions |
| --- | --- |
| Dashboard | Platform statistics, trends, alerts and recent operational activity with date/zone filters. |
| Users | Search/list/detail; role and account-status changes; suspend/reactivate where supported. Server-enforced permission matrix and audit record. |
| Farmers | Search/list/detail, associated agent/farm/produce and permitted record edits or verification decisions. |
| Verifications | Queue/detail, evidence access, approve/reject/request correction with reason, and concurrent-review conflict handling. |
| Transactions | Filter/list/detail, payment/escrow/payout states, permitted reconciliation/refund/settlement actions and their audit references. Confirm which are read-only. |
| Content and notifications | Read/create/edit content, draft/publish/schedule rules, recipient targeting, send status and failed delivery results. |
| System settings | Read/update approved settings with validation and permission checks; define settings that must never be editable from the frontend. |
| Matching engine | Read runs/queue/failures, inspect match reasons, and define authorized retry/manual assignment/override operations. |
| Reports and analytics | Date/zone/category filters, aggregation definitions and export/download operations. |
| Disputes | Queue/detail/evidence, assignment, case notes, approved resolution actions and status history. |

Admin changes must return the actual updated state. Define the allowed transition, reason, confirmation requirements and audit identity for each privileged operation; hiding a button is not authorization.

### Support and approved content

- Supply help/support contacts and approved policy text, policy versions, business credentials and claims that may be displayed.
- Define support ticket submission, attachments and case tracking if supported.
- Confirm whether legacy dealer/voucher screens are in the release scope. They are separate from the current buyer/aggregator/admin design target and should not expand the backend request implicitly.

## 4. What to include for every supplied operation

1. Exact method and path, environment/version and permitted roles.
2. Request schema with required/optional fields, enums, constraints, units, timestamps and examples.
3. Complete success, empty-result and error examples, including field errors, forbidden access, conflicts, expired quotes/QR codes and rate limits.
4. Pagination/filter/sort rules; money precision; stable identifiers and media/download URL expiry.
5. Allowed status transitions and source of truth; duplicate-submit/idempotency rules and recovery after an uncertain timeout.
6. A reproducible test fixture and expected persisted result. Identify the owner and status: available, planned, or out of release scope.

## 5. Delivery order that unlocks testing fastest

1. Browser access/session configuration, full API document, test accounts and uploads.
2. Buyer registration, catalogue, cart, quote, order creation and sandbox payment.
3. Matching, fulfilment, QR receipt, order history and notifications.
4. Farmer registry, verification corrections, handover and earnings/withdrawals.
5. Admin operations, reporting and approved support/policy content.

Frontend layouts can continue while these contracts are supplied. Backend-dependent buttons stay unavailable until their contract and failure behavior are implemented; preview calculations and sample records are never evidence of a completed purchase or account action.
