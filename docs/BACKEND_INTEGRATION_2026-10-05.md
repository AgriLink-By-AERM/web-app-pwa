# Farmtry v1 integration — 2026-10-05

Source: user-supplied `DONE_BACKEND_CONTRACT_HANDOFF_Farmtry.bin`, preserved as `FARMTRY_API_REFERENCE_2026-10-05.txt`. The file is a plain-text contract reference despite its extension. It supersedes the earlier null contracts for the operations listed below. It does not supply buyer-registration, marketplace, payment, dealer or admin contracts.

## Connected routes and operations

| Website route | Operations |
| --- | --- |
| `/login/`, `/preview/buyer-login/`, `/preview/aggregator-login/` | `POST auth/login`; cookie sessions; aggregator users continue to the connected workspace |
| `/preview/aggregator-register/` | `POST auth/aggregator/register` with the actual entered fields; no default password or generated photo URL |
| `/preview/aggregator-verify/` | `POST auth/verify-otp`, `POST auth/resend-otp`; resend cooldown starts only after a server response |
| `/recovery/`, `/preview/recovery/` | `POST auth/forgot-password`; generic non-disclosing acknowledgement |
| `/recovery/?token=…`, `/preview/buyer-reset/?token=…` | `POST auth/reset-password` using the 64-character recovery token; minimum 8-character password; no six-digit reset-code substitution |
| `/preview/aggregator/` | Dashboard, KYC status, paginated/filtered logs, log detail, create log, file dispute, sign out |

All 14 operations in the handoff have client adapters. Shared refresh uses `POST auth/refresh-token` without a body for web clients. `POST auth/logout` sends the server-issued session ID. Aggregator workspace data loads in the browser, never during static export. Arbitrary log IDs are fetched inside the workspace without requiring prebuilt detail routes.

The aggregator registration, OTP and workspace screens are functional contract-based interfaces using existing UI primitives. They are **not claims of completed Figma fidelity** for those screens. Their visual design can be reconciled with the remaining Figma screens independently of the transport. Buyer registration, Google sign-in, cart, payment, wishlist and unsupported role operations remain unavailable.

## Configure and run

1. Copy `.env.example` to `.env.local`. The user confirmed `NEXT_PUBLIC_FARMTRY_API_URL=http://localhost:5001/api/v1` for now. This public setting must not contain secrets.
2. Start the backend separately on port 5001. No backend repository was supplied in this workspace.
3. Start the frontend with `node node_modules/next/dist/bin/next dev --hostname localhost --port 3000` and open `http://localhost:3000`. Stop any process already occupying that port first.
4. Configure backend CORS for the exact frontend origin with credentials enabled. Use `localhost` for both services instead of mixing `127.0.0.1` and `localhost`; check cookie `SameSite`, `Secure`, domain and path settings for the chosen environment.
5. Configure backend `FRONTEND_URL` to the actual frontend origin so the documented `/recovery?token=…` links arrive here.
6. Replace `NEXT_PUBLIC_FARMTRY_API_URL` with the deployment URL when supplied, then rebuild. The static export embeds public environment settings at build time.

To serve the built export directly, run `node scripts/preview.cjs 3004` and open `http://localhost:3004/preview/aggregator-login/`. This is the preview origin used for the current browser checks; add it to backend CORS and use it for `FRONTEND_URL` when testing this preview. `npm start` / `npm run preview` use this static server because the project uses Next static export.

Do not put access/refresh tokens into JavaScript storage. The web client sends HttpOnly cookies with `credentials: include`. Only the non-secret logout session ID is stored in sessionStorage (memory fallback if storage is unavailable). Registration/verification never manufacture a session; after OTP verification the user signs in normally because that response does not include the logout session ID.

Native Capacitor token persistence and cross-site cookie deployment require separate verification; this implementation targets the documented **web-cookie** flow.

## Behavior and integration boundaries

- Response adapters validate required shapes and preserve server IDs, statuses, counters, lists and QR references. Invalid responses fail visibly. No alias guessing, fake records, fabricated success IDs or demo fallback imports.
- Empty logs are an empty result. Network, timeout, invalid response, 401, 403, 404, 409, 422, 429 and server failures remain failures. Server stack traces and account-disclosing auth messages are not displayed.
- Concurrent authenticated reads share one refresh request and retry once. Mutations are not replayed automatically. In-flight form locks prevent duplicate submissions within a mounted form; server idempotency remains unspecified.
- A timeout after a mutation is indeterminate. Review server state before resubmitting; the client does not claim it failed to reach the server.
- KYC approval gates the log-entry UI and must also be enforced by the backend. Client checks are not authorization.
- No upload contract was supplied. Registration/logging accept an existing photo URL; they do not turn local filenames into fake uploads. GPS is captured only when the user chooses the location action, with manual entry available.
- Recovery tokens are read into memory and removed from browser history; reloading afterward requires reopening the original recovery link. Pages use no-referrer metadata. Recovery URLs and API/JSON responses bypass service-worker caching; old API caches are removed on worker activation.
- Legacy `/aggregator/*`, `/buyer/*`, `/dealer/*` and `/admin` remain demo implementations and show a visible warning. They must not be used to validate current service behavior. `/login/` now opens the real sign-in form instead of the demo portal chooser.

## Contract clarifications still needed

- The supplied `user`, `aggregator` and `LogResponseDTO` definitions are abbreviated. Adapters use only explicit fields and treat missing required data as a contract error; confirm against real responses.
- Confirm approved operating zones, fresh-produce pipeline values, registration/password rules, photo URL provenance, file upload flow, and any optional/nullable response fields.
- Confirm OTP verification cookie behavior and account status transitions. Web verification deliberately requires a subsequent login.
- Define buyer registration, marketplace/checkout, buyer workspace, admin and dealer APIs before enabling those actions.

## Validation

- `node scripts/test-farmtry-api.cjs`: 29 tests using explicit contract fixtures, covering every documented endpoint plus error/security behavior.
- `node scripts/test-buyer-auth.cjs`: 17 local validation tests; reset now follows token-based recovery and the documented minimum-length policy.
- TypeScript passes.
- Production build passes and exports 58 pages. Desktop/mobile browser checks confirm local validation, explicit connection failure, a working recovery-token entry route, token removal from the address bar, and mobile registration without horizontal overflow. No live account or record was created during these checks.
- Live connectivity check: `localhost:5001` refused connections. Real account creation, OTP delivery, HttpOnly cookies, CORS, refresh/logout and persisted records require a running backend and a test account. Fixture tests are not evidence of live end-to-end success.

## Manual live acceptance sequence

Register a designated test aggregator with valid evidence URLs, obtain the development OTP from the backend owner, verify email, sign in, inspect KYC status, obtain approval, create a log, find it through filtering and pagination, open its detail, file a dispute, and confirm that duplicate disputes are rejected. Then sign out, check protected reads, exercise expired-session refresh, and complete email/phone recovery from the actual received link. Test on desktop and mobile widths. Use designated test data only.
