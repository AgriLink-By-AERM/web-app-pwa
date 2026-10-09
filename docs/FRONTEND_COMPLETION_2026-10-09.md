# Frontend completion checkpoint — 2026-10-09

## Delivered scope

The current saved-design web frontend pass is complete: admin account/workspace screens; buyer dashboard, listings and filter drawer, listing/match details, scanner, history, notifications and profile; marketplace, cart, product, wishlist, checkout, account entry and confirmation; aggregator onboarding, account states, farmer registry/registration, produce/waste verification, earnings, match stages, transit and delivery proof.

The screen review page at /preview/screens/ links every implemented preview destination. Start user-journey testing at /. The repository exports 141 routes in total, including pre-existing legacy routes; this is not a count of distinct Figma screens.

## New aggregator implementation

52 routes share components in features/aggregator-design: shell and navigation, account/onboarding, directory/home, farmer and produce forms, and fulfilment/earnings. Original individual SVG/photo assets are stored under public/figma/native. Full Figma renders are reference-only and are not shipped as screen implementations.

Farmer search and status filters, language/crop/product selectors, registration step navigation, produce quantity/grade/photo drafts, review checkbox, match-history tabs, password visibility/matching, recovery-channel switching, six-digit code input, and ticket enlargement work locally. Photo selection is restricted to JPG/PNG/WebP up to 10 MB and five photos. Drafts and selected photos are discarded on leaving the page; no uploads occur.

Existing connected authentication and core aggregator pages remain separate. The buyer SMS recovery variant shares the existing handler with a new initial-method prop. Email/SMS recovery behavior and validation are otherwise unchanged.

## Design reconciliation and intentional adaptations

- The current checklist maps standalone screens and shared states. Large component boards, dropdown variants and internal layout fragments are reference material rather than independent application routes. Equivalent earlier match designs map to the shared corrected-stage layouts.
- Native phone status bars are omitted in web pages. Narrow aggregator designs use a centered web canvas with usable navigation. Responsive checks do not certify fidelity against separate mobile Figma frames.
- Original source inconsistencies were corrected in interaction behavior: farmer/verification filter labels match the records displayed, and pending milestones do not say completed. Duplicate catalogue examples are labelled sample content. The original failed-verification design incorrectly stated that verification succeeded; its error text is corrected.
- Sample success, earnings, delivery and financial states have visible preview labels. No local form transitions fabricate a successful backend mutation. Payment account details are masked and transfer/withdrawal/receipt actions are disabled.
- Native form instances were resolved against their component definitions, including crop type, quantity, grades, identity type and preferred language. Shared application controls implement their interactive states.
- Source maps and QR artwork are static illustrations. There is no claimed live geolocation, countdown, tracking, real QR authorization or settlement.
- Existing shared commerce/account shells are reused. Component-level visual refinements are possible; completion here means the saved screen UI and local interactions are implemented, not a claim of pixel-identical rendering or production readiness.

## Validation

- Production build, lint and TypeScript checks pass; 141 static routes exported.
- Existing tests: 37 API/failure-path cases, 17 authentication validation cases and the cookie/proxy test pass (55 checks).
- Buyer/shopping: 36 screen/width checks across 12 routes at 1440, 820 and 390px, plus local interaction checks.
- Aggregator base set: 144 screen/width checks across 48 routes, plus farmer filtering, registration steps, photo review, matches, password states and code-entry checks.
- Final pass: 33 screen/width checks covering four additional aggregator variants, buyer SMS/basic confirmation, the screen index and visually corrected representative screens. Every review-page preview link returns HTTP 200.
- Checked image loading, page overflow, runtime errors and absence of API requests during preview interactions. Dashboard icons and onboarding crop were corrected after visual inspection.

## Deliberately unfinished outside this frontend pass

1. Backend integration for unsupported operations: see BACKEND_REQUIRED_ACTIONS_2026-10-08.md. Existing adapters still require live acceptance tests with designated accounts and seed records.
2. Browser login through token refresh on the deployed frontend has not been verified with a real account. Backend cookie Domain/path/Secure behavior must agree with the same-origin proxy.
3. Separate mobile-design comparisons and the mobile application are deferred by the user.
4. Help/governance/policy copy and a distinct generic verification design are not supplied. Their existing placeholders remain truthful; they are not counted as completed designed screens.
5. Google’s account chooser is provider-owned and is not reproduced. Actual OAuth configuration is required.

Unrelated legacy changes in lib/api-client.ts, generated next-env.d.ts and the untracked mobile-app directory are excluded from these frontend commits.

## Aggregator route-to-source map

| Route | Saved node |
| --- | --- |
| /preview/aggregator-start/ | 82:5165 |
| /preview/aggregator-intro/ | 78:3196 |
| /preview/aggregator-intro-payouts/ | 78:3892 |
| /preview/aggregator-intro-tickets/ | 78:3902 |
| /preview/aggregator-register-design/ | 78:3206 |
| /preview/aggregator-login-design/ | 377:11846 |
| /preview/aggregator-recovery-design/ | 377:11921 |
| /preview/aggregator-recovery-sms-design/ | 377:12501 |
| /preview/aggregator-reset-design/ | 377:11937 |
| /preview/aggregator-reset-code-design/ | 377:12550 |
| /preview/aggregator-reset-sent-design/ | 377:11930 |
| /preview/aggregator-verification-success/ | 377:11904 |
| /preview/aggregator-verification-failed/ | 377:11911 |
| /preview/aggregator-phone-verification/ | 412:18361 |
| /preview/aggregator-home-design/ | 295:8750 |
| /preview/aggregator-verifications/ | 86:6787 |
| /preview/aggregator-verifications-fresh/ | 86:7036 |
| /preview/aggregator-verifications-waste/ | 86:7380 |
| /preview/aggregator-verified-history/ | 179:1462 |
| /preview/aggregator-verified-waste/ | 179:1892 |
| /preview/aggregator-verify-produce/ | 86:6053 |
| /preview/aggregator-verify-waste/ | 112:10415 |
| /preview/aggregator-log-produce-design/ | 188:1673 |
| /preview/aggregator-log-waste-design/ | 188:1813 |
| /preview/aggregator-photos/ | 86:6135 |
| /preview/aggregator-review/ | 86:6227 |
| /preview/aggregator-review-confirmed/ | 112:9896 |
| /preview/aggregator-submission-example/ | 107:9166 |
| /preview/aggregator-farmers/ | 179:2545 |
| /preview/aggregator-farmers-verified/ | 186:1027 |
| /preview/aggregator-farmers-pending/ | 186:1426 |
| /preview/aggregator-farmer-detail/ | 95:8657 |
| /preview/aggregator-add-farmer/ | 112:10500 |
| /preview/aggregator-farmer-information/ | 126:11199 |
| /preview/aggregator-farmer-location/ | 126:11422 |
| /preview/aggregator-farmer-crops/ | 126:11493 |
| /preview/aggregator-farmer-produce/ | 188:1978 |
| /preview/aggregator-registration-example/ | 126:11814 |
| /preview/aggregator-earnings/ | 86:5645 |
| /preview/aggregator-withdrawal/ | 126:10709 |
| /preview/aggregator-withdrawal-example/ | 126:10930 |
| /preview/aggregator-matches/ | 191:3057 |
| /preview/aggregator-match-history/ | 191:3186 |
| /preview/aggregator-match-information/ | 302:10005 |
| /preview/aggregator-handover/ | 302:10575 |
| /preview/aggregator-delivery-complete/ | 302:10799 |
| /preview/aggregator-transit/ | 302:11023 |
| /preview/aggregator-delivery-ticket/ | 302:11207 |
| /preview/aggregator-match-confirmed/ | 255:5704 |
| /preview/aggregator-match-corridor/ | 255:6347 |
| /preview/aggregator-home-operations/ | 236:2446 |
| /preview/aggregator-home-overview/ | 236:2786 |
