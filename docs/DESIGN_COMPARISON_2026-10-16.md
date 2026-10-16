# Figma refresh and frontend comparison — 16 October 2026

## Result and limits

The current design inventory was compared with the previous saved inventory. All retrieved responses, screenshots and supplied assets were saved. The broad responsive-layout review completed. Full current-Figma visual sign-off and every interactive variant are **not complete**: the Starter-plan limit was reached while fetching mobile references. No application UI or API behavior was changed in this review.

Figma MCP identity verified as febadoracasa@gmail.com, Starter plan / View seat. File: otoyKcraKSbbLOXZhBt0th, current canvas 11:16198. The page-list response listed only the resources page; querying the known current canvas directly succeeded. Its full XML is saved rather than relying on that incomplete page listing.

## Durable files

- `.figma-reference/archive/refresh-2026-10-16/index.html`: offline side-by-side reference/front-end catalogue.
- `current-page.xml` and `screen-metadata/`: full retrieved current-page metadata plus all 201 top-level subtrees.
- `metadata-diff.json` / `node-changes.json`: previous/current structural comparison.
- 17 node folders: original connector response, readable context, Figma PNG and downloaded assets with checksums.
- `capture-audit.json`: 17 screenshots, 154 asset downloads, zero missing downloads.
- `native-renders/`: 92 narrow/mobile reconstructions from the complete 7 October native backup. These preserve many shapes/text/image placements but are not authoritative fresh Figma renders: the helper does not reproduce every gradient, effect or instance behavior.
- `frontend/`: 309 screenshots and layout-audit.json, covering 103 routes at 390, 820 and 1440px.
- `populated-mobile/`: screenshots from simulated buyer/admin/dealer journeys at 390px.
- `comparison-index.json`: all 155 current top-level targets at least 300 × 300, including boards/panels; not 154 distinct pages.
- `capture-errors.json`: explicit rate-limit failures. `checksums.json`: file sizes and SHA-256 hashes.

The previous archive and `native-2026-10-07/FarmTry.fig` remain unchanged. Raw design archives are ignored by Git; committing this report does not upload them. A dated ZIP beside the repository preserves this refresh separately. The refreshed archive is **partial**, not a new complete `.fig` export.

## What changed in Figma

Compared with the earlier metadata: 194 → 201 top-level nodes, 8 added, 1 removed, 10 changed, 183 structurally unchanged. Metadata does not include all fills, image contents, typography or effects; unchanged metadata is not proof of an unchanged visual design.

| Node | Change / next frontend work |
| --- | --- |
| 318:1534 landing | Text/geometry changes and removed descendants. Fresh full reference saved; review hero typography, copy and removed sections before updating. Keep the user-requested private admin entry. |
| 352:5465 buyer signup | Branded left panel increased from 783 to 972px with replaced descendants. Fresh reference shows a full-height dark tomato/farm background; implementation still uses a bottom image. |
| 352:5611 buyer login | Branded panel descendants replaced. Fresh reference uses the full-height tomato/farm background; implementation still shows a separate office/laptop image. |
| 356:5843 password reset | Frame height 884 → 964px and rewritten left-panel content/layout. |
| 356:6018 email recovery | Left-panel replacement and form-column horizontal position changed. |
| 356:6126 SMS recovery | Ten descendants removed. Fresh reference saved; inspect removal before treating it as a new behavior requirement. |
| 368:8222 compact login | Renamed from Get Started to buyer login, repositioned, one descendant removed. |
| 383:19617, 390:2834, 383:19719 admin recovery variants | Ten descendants removed in each. Fresh references saved. |
| 562:2491 verify | New standalone verification screen with six code cells, contact summary and resend state. Not currently implemented as this layout. |
| 562:2176 account verify | New account-verified confirmation screen. Current success UI is an inline card, not this screen. |

Other additions are five supporting hero/brand frames and image 36 (608:1879); the removed node is the board/banner 459:4048. All additions are indexed in metadata; supporting frames/image are not all captured as fresh independent rendered references.

Fresh mobile captures: 397:9505 scanner, 395:5103 signup variant, 395:5313 success, 393:4748 buyer login and 395:6139 recovery. Requests for 393:3676 mobile landing, 393:4580 signup and 345:5347 drawer returned the plan limit. No successful old capture was overwritten with an error.

## Frontend findings, in implementation order

1. **P1 — Admin navigation disappears on mobile/tablet.** LiveAdmin renders the sidebar nav without the menu toggle/open state used by the design-only workspace. The shared stylesheet hides that nav below 1000px. A normal-width page is therefore not evidence of usable admin navigation. Add an accessible menu or the approved mobile navigation; verify every connected admin section can be reached.
2. **P1 — Direct staff login is visually inconsistent.** `/admin/login` imports admin-auth.css but not the shared styling supplied on preview routes. The 390px capture shows an oversized brand mark, a long stacked hero, default-sized submit button and no compact mobile login card. Compare with saved 398:16799. Audit recovery/reset at the direct staff URLs too. Preserve phone/email login and backend role checks.
3. **P1 — Connected buyer/admin screens lost design composition.** The populated buyer dashboard uses generic profile/key-value cards rather than the saved mobile dashboard hierarchy, quick actions and navigation. `/preview/admin` now opens audit logs rather than the designed overview. Restore design composition around supported API data; keep unsupported metrics/graphs unavailable rather than inventing data.
4. **P2 — Apply refreshed buyer auth visuals.** Full-height hero imagery, spacing and recovery heights differ. Required business fields make registration longer than Figma; retain required fields and design a suitable layout rather than removing them to mimic the short mockup. The organization-type select currently looks unstyled relative to surrounding inputs.
5. **P2 — Implement the new verify/verified layouts around real OTP actions.** Preserve leading zeros, pending/error states and resend cooldown. The design's personal-buyer/SMS/wallet copy is not a new API contract. Verification must not imply an authenticated session if backend requires sign-in afterward.
6. **P2 — Complete mobile shopping and buyer workspace comparison with populated states.** Marketplace, product, cart, checkout, wishlist, profile/settings and history need the saved card hierarchy, spacing and navigation. Wishlist retrieval/profile editing/payment features remain contract-dependent. Live unavailable states passed layout checks; they cannot certify populated designs.
7. **P2 — Explicit admin variants need separate checks.** User/farmer detail and status variants, role dialog, content tabs, filters and drawers were not individually exercised in the broad route sweep. Some former design dialogs are absent from current API-driven routes; do not restore operations without permission/API support.
8. **P3 — Aggregator composition polish.** Representative archived mobile home versus frontend comparison retains the main content groups but changes header/banner height, spacing, card proportions and action-row composition. Review all verification, farmer-registration and match-stage states against the existing native reference rather than assuming route coverage equals fidelity.

Intentional deviations to retain: no public admin navigation; shared /auth/login; server-required registration fields; truthful disabled OAuth/payments/uncontracted actions; no invented authenticated success; design sample names/balances never treated as live data.

## Validation actually performed

- 103 routes × 3 widths = 309 checks: all responses HTTP 200, no detected page-level horizontal overflow, no broken images and no uncaught page errors.
- Screenshots include landing, account, aggregator design, buyer and admin routes. Broad sweep blocked all API calls and returned an explicit review-only 503; some captures show loading/error states. It does not validate live permissions or populated tables.
- Separate existing integration journey script passed at 390px with simulated API data: registration/OTP, buyer login, marketplace/cart/checkout retry, dealer redemption, admin login/KYC/403, farmer dashboard. Expected simulated 503/403 responses are not runtime failures.
- Direct visual inspection sampled changed buyer auth, both new verification screens, admin mobile dashboard/login, buyer mobile dashboard/profile, and aggregator mobile home. All narrow native references were generated/indexed for review; **not every screenshot or interactive variant received individual visual sign-off**.
- No claims of fresh native-export completeness, pixel-perfect matching, real-account acceptance, or mobile-app testing.

## Next steps

1. Preserve a new full local `.fig` export of the latest file, under a dated name such as FarmTry-2026-10-16.fig, without overwriting the 7 October baseline. This captures style/image-only changes that metadata cannot detect.
2. Use the 17 fresh references already saved for the changed auth/verification work; restore connected admin mobile navigation and direct staff-auth styling first.
3. Restore buyer/admin design composition without regressing API contracts; then review populated screen states and each drawer/modal/tab variant.
4. With renewed suitable Figma access or a fresh native export, verify the remaining mobile references and their styles before declaring design comparison complete.
