# Backend contract handoff

Status update **2026-10-05**: the user supplied shared auth, password recovery and aggregator v1 contracts. Those operations are implemented separately from the legacy demo services; see `BACKEND_INTEGRATION_2026-10-05.md` and `FARMTRY_API_REFERENCE_2026-10-05.txt`. Buyer registration, marketplace/payment, buyer workspace, admin and dealer specifications remain pending. The following notes preserve the earlier design-preview handoff and should not override the new supplied contracts.

Account-preview update: desktop/mobile signup, login, reset and recovery now have Figma-based local forms (updated 2026-10-04). These remain non-submitting previews; operation contracts in `features/buyer-auth/contracts.ts` retain null endpoints and schemas. See `BUYER_AUTH_IMPLEMENTATION.md` for exact delivered and pending scope.

| Account operation | Expected request semantics — schema TBD | Expected response semantics — schema TBD |
| --- | --- | --- |
| Login | Approved credentials and remember-me/session policy | Session, expiry, authorized role, verification requirement or safe failure |
| Registration | Approved company/contact fields, password policy and required consent | Registration reference, pending approval/verification state, safe field errors |
| Google sign-in | Approved provider authorization/PKCE exchange and redirect rules | Session or onboarding/verification requirement; safe denial |
| Initiate recovery | Approved email/phone identity and channel | Non-disclosing acknowledgement, challenge reference, expiry and resend availability |
| Verify reset code | Challenge reference and code, with attempt limits | Approved reset authorization or invalid/expired/limited state |
| Resend recovery code | Challenge reference and approved channel | New challenge/expiry rules, retry-after or throttling state |
| Reset password | Reset authorization and approved password fields | Confirmed reset result, session revocation policy and explicit sign-in behavior |

No route may treat a six-digit format match as code verification. Backend owners must define credential transport, challenge binding, anti-enumeration responses, expiry, resend/attempt limits, password rules, status codes and session storage before these buttons are enabled. Client-side `AuthValues` must not be treated as the wire payload.

No backend repository, OpenAPI document, approved endpoint table or confirmed request/response schemas were supplied. Therefore, no URL or wire type is invented for the new frontend. `lib/integration/page-requirements.ts` explicitly holds `endpoint`, `requestSchema`, and `responseSchema` as `null`. Its `needs` fields describe UI requirements, not backend field names.

## Landing page boundary

### Product preview boundary (2026-10-04)

`/preview/product/` now renders the desktop/mobile product designs. `features/commerce/contracts.ts` inventories catalogue search, product read, supplier offers, delivery quote, cart add, wishlist save, callback and checkout operations. All retain null endpoints and wire schemas. Local sample identifiers, quantities and supplier indexes are view state only and must never be sent as approved request payloads.

Backend owners must provide stable product/offer IDs, currency precision, stock and purchase bounds, grading/certificate evidence, media URLs, supplier identity, authoritative delivery quotes and policy versions. Cart and checkout must define quote expiry, repricing, stock conflicts and duplicate-submit behavior. Wishlist and callback require authentication/consent and failure semantics. UI subtotal multiplication is explicitly illustrative; it is not a delivery-pricing rule. No service action is enabled.

The wider frontend completion plan and design-access blocker are tracked in `FRONTEND_BUILD_STATUS.md`.

The root landing page is static. Product cards, the SMS illustration, impact metrics, institutional claims and company details are design content, not verified backend data. Product cards carry a visible illustrative-data label. Account, purchase and policy destinations are non-submitting placeholders. A placeholder is distinct from a loading state, an empty result, an error or a completed operation.

| Preview destination | Required request semantics (schema TBD) | Required response semantics (schema TBD) |
| --- | --- | --- |
| `marketplace` | Search/filter/sort criteria and pagination | Listings, image URLs, price/currency/unit, availability, verification, page information |
| `product` | Stable listing identifier | Product details, certificates, seller/hub, current stock, allowed purchase quantity and delivery options |
| `cart` | Cart identity; add/update/remove item and quantity | Authoritative cart lines, availability errors, totals and delivery quote |
| `checkout` | Validated quote/cart, delivery choice, duplicate-submission key | Order identity/status, payment continuation and final confirmed settlement state |
| `wishlist` | Authenticated list/read/save/remove operation | Saved listing identifiers and unavailable/deleted item state |
| `buyer` | Authenticated organization scope, filters and page cursor | Dashboard, matches, orders, notifications, permissions and profile |
| `buyer-login` | Approved credentials or identity-provider exchange | Session and expiry, permitted roles, verification requirements or safe failure |
| `buyer-register` | Confirmed organization/contact fields and document references | Registration reference, next verification step and field validation errors |
| `aggregator` | Authenticated agent scope and operation-specific input | Dashboard, farmers, verifications, matches, earnings and handover state |
| `aggregator-login` | Approved credentials | Session/expiry, agent role, verification status and safe failure |
| `aggregator-register` | Confirmed personal/zone fields and uploaded evidence references | Registration reference, verification state and field errors |
| `admin` | Server-authorized admin scope, action and target | Authorized queues/data, mutation result and audit reference |
| `recovery` | Recovery channel, challenge response and reset input | Non-disclosing initiation result, expiry/resend limits and reset outcome |
| `verification` | Challenge identifier, verification code or resend request | Verified/pending/expired/invalid state and retry policy |
| `support` | Approved support/dispute inputs and evidence references | Case reference, progress and validation errors; approved contact content |
| `governance` | Policy/credential identifier and locale if supported | Approved policy text, version/effective date and verified business credentials |

### Specification template (one per operation)

```text
Operation / page:
Backend owner and approval date:
HTTP method and versioned path: TBD
Authentication and permitted roles: TBD
Path parameters: TBD
Query parameters / pagination / sorting: TBD
Request headers and content type: TBD
Request schema, required/optional fields and example: TBD
Success status, response schema and example: TBD
Empty-result response: TBD
Validation / unauthorized / forbidden / missing / conflict / rate-limit responses: TBD
Currency units, quantity units and timestamp timezone: TBD
Upload limits, document references and signed URL expiry: TBD
Idempotency, retries, timeouts and offline behavior: TBD
Cache policy and private-data handling: TBD
```

## Existing code assumptions requiring reconciliation

These are **observed frontend calls**, not approved contracts. Paths are relative to the existing API base (`NEXT_PUBLIC_API_URL`, currently defaulting to `http://localhost:5000/api`).

| Existing call | Current request | Current response assumptions / adapter |
| --- | --- | --- |
| `POST /aggregator/register` | `phone`, `fullName`, hardcoded `password`, `zone`, hardcoded `governmentIdType`, `governmentIdNumber`, fabricated `governmentIdPhotoUrl`, `guarantorPhone` | Message from `data.message` or `message`; profile/id constructed locally (`lib/aggregator/api.ts`) |
| `GET /aggregator/dashboard` | None | Wrapped or unwrapped object; profile/stat aliases and recent logs (`dashboard.ts`) |
| `GET /aggregator/status` | None | Wrapped/unwrapped object with verification state and review steps; defaults missing fields (`status.ts`) |
| `GET /aggregator/logs` | See `getAggregatorLogs` for current filter handling | Array, `data`, `logs` or `items`; field/status aliases normalized (`logs.ts`) |
| `GET /aggregator/logs/:id` | Log identifier in path | Log object normalized with local defaults (`logs.ts`) |
| `POST /aggregator/logs` | `farmerPhone`, `pipeline`, `category`, `weightKg`, `condition`, `latitude`, `longitude`, fabricated `photoUrl`, `harvestedAt` | `data._id`, `status`, `urgencyTier`, `qrPayload`, `createdAt`; otherwise fabricated log/ticket success (`log-entry.ts`) |
| `POST /aggregator/disputes` | `logId`, `reason`, optional numeric `reportedWeightKg`, `notes`, normalized `contactPhone` | `disputeId`/`id`/`_id`, message; otherwise locally generated submitted result (`logs.ts`) |
| `GET /dealer/profile` | None | Wrapped/unwrapped profile with aliases (`lib/dealer/store.ts`) |
| `GET /dealer/transactions` | None | Transaction collection normalized; empty collection may fall back to demo records (`store.ts`) |
| `POST /dealer/validate-otp` | Duplicated `otp` and `code` | Object or nested voucher/allocation assumed valid; otherwise local voucher registry (`store.ts`) |
| `GET /dealer/vouchers/:code` | Encoded code | Voucher/allocation object or demo voucher (`store.ts`) |
| `POST /dealer/redeem` | Duplicated `code` and `voucherCode`, `farmerPhone` defaulting to `unknown` | Receipt/redemption/transaction object or locally generated receipt (`store.ts`) |
| `GET /dealer/receipts/:reference` | Encoded reference | Receipt adapter or demo receipt (`store.ts`) |
| `POST /dealer/register` | Existing dealer registration input | Existing service result; confirm full contract before reusing (`store.ts`) |
| Buyer/admin/report operations | Local typed models, no approved transport | UI models in `lib/buyer/store.ts`, `lib/buyer/billing.ts`, `lib/admin/service.ts`, `lib/dealer/reports.ts` are not wire schemas |

## Integration constraints discovered in the repository

- `fetchApi` collapses network errors, non-2xx responses, invalid JSON and 204 into `null`. New adapters must keep loading, empty, unauthorized, validation, transport failure and contract-unavailable states separate.
- Legacy mutation fallbacks can report success after failed requests. Do not use them behind new account or purchase controls. No new preview route imports those services.
- An approved API response should be validated before mapping it into a view model. Do not silently guess `id` vs `_id`, response envelopes, enum values or alternate field names.
- The app exports static HTML. Private, per-user data must be loaded at runtime after authentication, not embedded in exported pages. Existing `generateStaticParams` detail routes cover demo identifiers only; the backend/detail-route strategy needs agreement before supporting arbitrary IDs.
- Legacy auth always supplies a demo admin session. UI placeholders do not replace server-side authorization.
- Reconcile duplicated buyer model definitions and conflicting logistics/status vocabulary in `lib/types.ts` and `lib/buyer/store.ts` before binding responses.
- Payment confirmation, OTP consumption and order creation require backend-defined replay/idempotency rules. Never infer success from navigation, missing data or a generated local reference.
- Review the existing service-worker API caching before introducing authenticated data. Agree upload and device GPS/QR contracts separately from filenames and mocked coordinates.

## Implementation sequence after approval

1. Fill and approve each operation's specification above.
2. Add wire types and runtime validators from the approved schema, separately from view models.
3. Implement adapters that map validated data to existing components, including empty/error/auth states.
4. Replace the corresponding preview destination with its Figma screen and runtime data handling.
5. Test approved success and failure responses, authorization, duplicate submissions and offline behavior before enabling mutations.

No production endpoint or request/response structure was assumed in this phase.
