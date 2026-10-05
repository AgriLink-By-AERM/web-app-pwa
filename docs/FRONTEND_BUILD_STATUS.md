# Farmtry frontend build status

Updated 2026-10-05. User supplied backend contracts and prioritized implementation for testing. Shared auth and aggregator operations now have connected web clients; see `BACKEND_INTEGRATION_2026-10-05.md`. Remaining Figma fidelity work below is still pending. This document records design completion; legacy demo pages do not count as completed Figma implementations.

## Delivered

| Screen | Preview route | Desktop / mobile references |
| --- | --- | --- |
| Landing | `/` | `318:1534` / `393:3676` |
| Buyer registration | `/preview/buyer-register/` | `352:5465` / `393:4580` |
| Buyer login | `/preview/buyer-login/` | `352:5611` / `393:4748` |
| Buyer recovery | `/preview/recovery/` | `356:6018` / `395:6139` |
| Buyer reset | `/preview/buyer-reset/` | `356:5843` / `396:6316` |
| Marketplace product | `/preview/product/` | `371:8473` / `396:7949` |

The product preview uses responsive layouts, original locally downloaded product imagery/icons, shared Button/Card/brand components, and a reusable commerce header/footer. Quantity is bounded to the illustrative stock of 140 crates. Supplier comparison, description expansion, keyboard-accessible information tabs, menu expansion and banner dismissal use React state only. Reloading discards these choices. Alternate supplier breakdowns are explicitly unavailable rather than fabricated.

Product content is labelled illustrative. Price arithmetic is not an authoritative quote; delivery times, availability, quality, suppliers and policies are design samples. Cart, wishlist, callback, checkout and social actions are disabled. Search gives an unavailable message; it does not return fabricated catalogue results. No new API, browser storage, session, timer or successful mutation is introduced.

Intentional design adaptations: preview labels add height; absent cart/wishlist data does not display the Figma sample count as a real account count; phone contacts and accreditation claims link to pending information rather than asserting approval. Additional tab states use the retrieved product content, because only the default tab layout was supplied. The desktop source has a fixed right gutter; the implementation retains its 1216px content width and uses a fluid layout at intermediate sizes.

## Remaining design work

| Area | Outstanding screens | Design access status |
| --- | --- | --- |
| Shopping | Marketplace, cart, wishlist, checkout, checkout account confirmation | Mobile marketplace retrieved; desktop marketplace metadata plus commerce header, trust pillars, aggregator spotlight and testimonials retrieved. Remaining desktop sections hit the connector plan limit. Other shopping screens not retrieved. |
| Buyer workspace | Dashboard, verified listings/filter drawer, listing detail, match detail, scanner, purchase history, notifications, profile/settings | Indexed; full design context still needed |
| Entry and account | Role selection/get started, account success; standalone buyer verification | Indexed except standalone buyer verification, which needs a confirmed matching node |
| Aggregator account | Registration, login, recovery, password creation, verification and onboarding | Indexed; full design context still needed |
| Aggregator workspace | Home, produce/waste lists, details/photos/review verification flow, queues, farmer registry/add/detail, earnings/withdrawal, matches/history/handover/transit/delivery | Indexed; full design context still needed |
| Admin account | Login, recovery, reset | Indexed; full design context still needed |
| Admin workspace | Dashboard, users, farmers, verifications, transactions, content/notifications, settings, matching, reports, disputes and indexed variants | Indexed; full design context still needed |
| Support and governance | Help, disputes entry and policy pages | Approved content and matching screen references not provided |

The complete node inventory remains in `REPOSITORY_AND_DESIGN_INDEX.md`. The Google-owned account chooser is not a Farmtry-owned sign-in screen and must not be reproduced as a working OAuth identity selector.

## Current blocker and continuation

The Figma connector returned its Starter-plan call limit while retrieving marketplace sections. The user is restoring Figma access. High-fidelity references already retrieved are cached locally under ignored `.figma-reference/`; they are reference material, never shipped screenshots or production components. Screens without full context remain pending instead of being claimed as implemented.

After access returns, finish desktop marketplace context, then cart/wishlist/checkout; continue buyer, aggregator and admin flows. Every route must retain disabled service actions and explicit contract-unavailable behavior until backend specifications are approved. Do not import legacy demo mutation fallbacks into these previews.

## Validation

- TypeScript passes. Production export generates all 56 existing routes, including the new product preview.
- All 17 existing buyer-account validation tests pass.
- Browser checks at 1440px, 820px, 390px and 320px: no horizontal page overflow. Desktop and mobile layouts visually compared with retrieved references.
- Quantity decrement is disabled at one; increment updates the sample total. Selecting Adeola at two crates displays ₦38,800 and explicitly withholds an unavailable itemised breakdown. Selecting Aminah restores the known sample breakdown.
- Information tabs work by click, ArrowRight and Home, with matching selected tab/panel state. Description expansion, search-unavailable feedback and the desktop menu work.
- Add to Cart and Buy now remain disabled. All mapped assets are local and nonempty; visible desktop/mobile imagery loads, and SVGs retain their intrinsic export dimensions.
- Figma access was rechecked after the user offered to restore it; the connector still reported the plan limit. No unavailable screen is marked delivered.
