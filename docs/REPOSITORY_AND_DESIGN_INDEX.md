# Repository and design index

Reviewed 2026-09-30 against `../STATE_DOCUMENT.md` and the checked-out source. Both repositories were clean at the start. This directory is the Next.js frontend; `../mobile-app` is a Capacitor Android wrapper consuming this project's `out` directory.

## Current implementation map

| Area | Routes | Components / data | Observed behavior |
| --- | --- | --- | --- |
| Shared | `/`, `/login` | `components/ui`, `components/app-logo.tsx`, `lib/api-client.ts`, `lib/auth/session.ts` | Shared Button/Card/Badge; Tailwind green tokens; legacy demo auth |
| Aggregator | `/aggregator/*` | `features/aggregator/components`, `lib/aggregator` | Registration, log entry, history, tickets, disputes; API attempts with demo fallback |
| Buyer | `/buyer/*` | `features/buyer/components`, `lib/buyer` | Procurement, matches, demand, billing, scanner, settings; local demo stores |
| Dealer | `/dealer/*` | `features/dealer/components`, `lib/dealer` | Voucher redemption, inventory, reports; mixed API attempts and fixtures |
| Admin | `/admin` | `features/admin/components`, `lib/admin/service.ts` | Demo session and local operations data |
| PWA/mobile | `public/manifest.json`, `public/service-worker.js`, `next.config.ts` | `../mobile-app/capacitor.config.ts` | Static export; Android consumes web output |

## Selected implementation scope

Scope expanded on **2026-10-04 to the remaining Figma screens**, following completion of the buyer account previews. The root renders `features/landing/components/landing-page.tsx`, adapted from desktop node `318:1534` and mobile node `393:3676`. Existing Card and Button primitives are reused. `FarmtryBrand` is local to the new design; application metadata and native identifiers still use AgriLink. See `FRONTEND_BUILD_STATUS.md` for the current delivered and blocked scope.

All new backend-dependent navigation goes to `/preview/[page]`, with statically generated destinations from `lib/integration/page-requirements.ts`. Implemented account forms perform local checks only; product controls change local preview state only. Unbuilt destinations retain pending cards. None of these previews sends an API request or simulates a successful mutation. Existing legacy routes still contain demo behavior and remain separately reachable. This is not an authentication boundary.

New design: https://www.figma.com/design/otoyKcraKSbbLOXZhBt0th/FarmTry?node-id=11-16198

Old design: https://www.figma.com/design/otoyKcraKSbbLOXZhBt0th/FarmTry?node-id=181-2715

Both supplied nodes are canvases. Their page-level design-context calls returned “nothing selected”; metadata identified their child frames, enabling direct design-context reads. Old screens emphasize mobile registration, logging, history and profiles. The new canvas adds a public marketplace, enterprise landing page, shopping flows, expanded buyer/admin screens and updated aggregator verification, farmer registry, earnings and match flows.

## New canvas screen index

This is a metadata inventory, not a claim that every screen has been implemented. Component boards and some supporting large frames are included where their dimensions match the screen filter. Retrieved and implemented references are tracked in `FRONTEND_BUILD_STATUS.md` and `BUYER_AUTH_IMPLEMENTATION.md`.

| Frame | Node | Canvas dimensions |
| --- | --- | --- |
| Landing Page | 318:1534 | 1440 × 5209.06005859375 |
| Browse Verified Listings & Filter Search | 329:2673 | 1440 × 1024 |
| Listing Details - Maize Husks | 329:2986 | 1440 × 1182 |
| Match Details - Maize Husks | 329:3178 | 1440 × 1024 |
| QR Code Scanner & Verification | 329:3417 | 1440 × 1024 |
| QR Code Scanner & Verification - Mobile | 397:9505 | 390 × 1018 |
| Purchase History & Orders | 329:3611 | 1440 × 1024 |
| Notifications Center | 329:3870 | 1440 × 1026 |
| Profile & Settings | 329:4066 | 1440 × 1375 |
| Dashboard | 338:4351 | 1440 × 1113 |
| Listing | 339:4735 | 1440 × 1024 |
| Aside - FilterDrawerPanel | 345:5347 | 320 × 960 |
| Buyer - Sign Up | 352:5465 | 1440 × 1044.5 |
| Buyer - Login | 352:5611 | 1440 × 912 |
| Farmtry - Reset Password & Verification | 356:5843 | 1440 × 884 |
| Farmtry - Forgot Password | 356:6018 | 1440 × 964 |
| Farmtry - Forgot Password | 356:6126 | 1440 × 964 |
| Get Started(Buyer) | 368:7882 | 1440 × 977 |
| Get Started | 368:8222 | 1440 × 755 |
| Get Started(CB) | 368:8128 | 1440 × 977 |
| Get Started(Aggregator) | 368:8374 | 1440 × 977 |
| Product detail marketplace | 371:8473 | 1440 × 2178 |
| marketplace | 372:9017 | 1440 × 4421.669921875 |
| Farmtry Marketplace - Shopping Cart & Landed SLA Summary | 374:10149 | 1440 × 1918 |
| Farmtry Marketplace - Wishlist & Saved Items | 374:10620 | 1440 × 2552.25 |
| checkout | 376:11408 | 1280 × 1750.5 |
| Confirm Account | 380:12929 | 1440 × 1072 |
| Aside - LeftSideOrderSummary | 380:13138 | 599.1666870117188 × 859.5 |
| Confirm Account | 380:13399 | 1440 × 1072 |
| Admin Dashboard | 381:14266 | 1440 × 1238 |
| Users Management | 381:14614 | 1440 × 1024 |
| Farmers Management | 381:14937 | 1440 × 1409 |
| Verifications Management | 381:15399 | 1440 × 1226 |
| Transactions Management | 381:15772 | 1440 × 1077 |
| Content & Notifications | 381:16214 | 1440 × 1431 |
| Content & Notifications | 398:15757 | 1440 × 1433 |
| Content & Notifications | 398:16260 | 1440 × 1433 |
| System Settings | 381:16711 | 1440 × 1123 |
| Matching Engine Monitoring | 381:17021 | 1440 × 1796 |
| Reports & Analytics | 381:17540 | 1440 × 1154 |
| Dispute Resolution | 381:17917 | 1440 × 1813 |
| Admin Log In | 383:19072 | 1280 × 980 |
| Continue with Google - Account Selection | 383:19232 | 1440 × 948 |
| Farmtry - Reset Password & Verification | 383:19472 | 1440 × 884 |
| Farmtry - Forgot Password | 383:19617 | 1440 × 964 |
| Farmtry - Forgot Password | 390:2834 | 1440 × 964 |
| Farmtry - Forgot Password | 383:19719 | 1440 × 964 |
| success | 388:1882 | 1280 × 1088 |
| landing page (mobile) | 393:3676 | 390 × 6136 |
| buyer sign up | 393:4580 | 390 × 1296 |
| success | 395:5313 | 390 × 1296 |
| buyer sign up | 395:5103 | 390 × 1296 |
| buyer login | 393:4748 | 390 × 1296 |
| forgot password | 395:6139 | 390 × 1296 |
| Reset password | 396:6316 | 390 × 1296 |
| Farmtry - Forgot Password | 395:6034 | 1440 × 964 |
| Farmtry - Forgot Password | 396:6649 | 1440 × 964 |
| Farmtry Marketplace - Mobile | 396:6754 | 390 × 4815.5 |
| Farmtry Wishlist - Mobile | 396:7309 | 390 × 2414.25 |
| checkout | 396:7671 | 390 × 1814.25 |
| Farmtry Marketplace - Product Detail (Mobile) | 396:7949 | 390 × 2636 |
| Farmtry Marketplace - Shopping Cart & Landed SLA Summary (Mobile) | 396:8310 | 390 × 1908 |
| dashboard | 397:8690 | 390 × 1501.75 |
| Purchase History & Orders - Mobile | 397:8973 | 390 × 1337.5 |
| Profile & Settings - Mobile | 397:9261 | 390 × 1505.6949462890625 |
| Notifications Center - Mobile | 397:9652 | 390 × 1043 |
| Match Details - Maize Husks (Mobile) | 397:9845 | 390 × 938 |
| Listing Details - Maize Husks (Mobile) | 397:10012 | 390 × 1093.25 |
| Browse Verified Listings - Mobile | 397:10141 | 390 × 1193.699951171875 |
| recovery | 397:10406 | 390 × 1296 |
| recovery | 397:10596 | 390 × 1296 |
| Browse Listings - Mobile (Default) | 397:10708 | 390 × 1284 |
| Browse Listings - Filters Drawer (Mobile) | 397:10923 | 390 × 1073 |
| Admin Dashboard - Mobile | 398:11244 | 390 × 1670 |
| Farmers Management - Mobile | 398:11524 | 390 × 1575.8800048828125 |
| Farmers Management - Mobile | 398:14851 | 390 × 1575.8800048828125 |
| Farmers Management - Mobile | 398:14064 | 390 × 1891.8800048828125 |
| Farmers Management - Mobile | 398:14457 | 390 × 1891.8800048828125 |
| Users Management - Mobile | 398:11917 | 390 × 1429 |
| Users Management - Mobile | 398:15193 | 390 × 1199 |
| Users Management - Mobile | 398:15474 | 390 × 1104 |
| Matching Engine Monitoring - Mobile | 398:12198 | 390 × 2176.5 |
| Transactions Management - Mobile | 398:12590 | 390 × 1722 |
| Dispute Resolution - Mobile | 398:13008 | 390 × 1718.75 |
| Content & Notifications - Mobile | 398:13381 | 390 × 1565 |
| System Settings - Mobile | 398:13755 | 390 × 1571.5 |
| Admin Login - Mobile | 398:16799 | 390 × 948 |
| Admin Forgot Password - Email (Mobile) | 398:16925 | 390 × 940 |
| Admin Forgot Password - SMS (Mobile) | 398:17032 | 390 × 916 |
| Admin Reset Password & Verification (Mobile) | 398:17136 | 390 × 1087 |
| roless | 408:17927 | 1280 × 1024 |
| Components | 456:3863 | 10272 × 6766 |
| Components | 456:3864 | 10934 × 8268 |
| Corrected Matches Screens | 456:4039 | 7325 × 7147 |
| Splash | 78:3193 | 390 × 844 |
| Splash | 82:5165 | 390 × 844 |
| Onboarding1 | 78:3196 | 390 × 844 |
| create account | 78:3206 | 390 × 1129 |
| Onboarding1 | 78:3892 | 390 × 844 |
| Onboarding1 | 78:3902 | 390 × 844 |
| Earnings | 86:5645 | 390 × 948 |
| Confirm withdrawal | 126:10709 | 390 × 934 |
|  withdrawal success | 126:10930 | 390 × 934 |
| Verified products | 179:1462 | 390 × 878 |
| Verified waste | 179:1892 | 390 × 878 |
| Verify Produce - Details | 86:6053 | 390 × 884 |
| Verify Produce - Details | 188:1673 | 390 × 923 |
| Verify waste - Details | 188:1813 | 390 × 923 |
| Verify Waste - Details | 112:10415 | 390 × 884 |
| Verify Produce - Photos | 86:6135 | 390 × 838.5 |
| Review & Submit Verification | 86:6227 | 390 × 975.5 |
| Review & Submit Verification | 112:9896 | 390 × 975.5 |
| Verification | 86:6787 | 390 × 1138 |
| Fresh Produce Pending Verifications | 86:7036 | 390 × 1138 |
|  Waste Pending Verifications | 86:7380 | 390 × 1138 |
| Registeredd Farmers Details | 95:8657 | 390 × 844 |
| Review & Submit Verification | 107:9166 | 390 × 844 |
| Add Farmer | 112:10500 | 390 × 800 |
| Farmers | 179:2545 | 390 × 1155 |
| Farmers | 186:1027 | 390 × 1136 |
| Farmers | 186:1426 | 390 × 1064 |
| Add Farmer | 126:11199 | 390 × 800 |
| Add Farmer | 126:11422 | 390 × 852 |
| Add Farmer | 126:11493 | 390 × 800 |
| Verify Produce | 188:1978 | 390 × 926 |
| Registration Successful | 126:11814 | 390 × 800 |
| Buyer Matches | 191:3057 | 390 × 1180 |
| Match History | 191:3186 | 390 × 841 |
| Home | 295:8750 | 390 × 1529 |
| Match Details - Maize Husks | 302:10005 | 390 × 1681 |
| Match Handover | 302:10575 | 390 × 1681 |
| Match Delivery Completed | 302:10799 | 390 × 1681 |
| Transit | 302:11023 | 390 × 1681 |
| Buyer | 302:11207 | 390 × 2030 |
| Login | 377:11846 | 390 × 874 |
| Verification Successful | 377:11904 | 390 × 874 |
| Verification | 377:11911 | 390 × 874 |
| Forgot Pasword | 377:11921 | 390 × 874 |
| Forgot Pasword | 377:12501 | 390 × 874 |
| Create Password | 377:11930 | 390 × 874 |
| Create Password | 377:11937 | 390 × 874 |
| Create Password | 377:12550 | 390 × 874 |
| verification | 412:18361 | 390 × 1030 |

## Before connecting backend services

### Account-preview follow-up (2026-09-30)

Implemented desktop registration (`352:5465`), desktop reset/code entry (`356:5843`), and desktop/mobile recovery (`356:6018`, `395:6139`). All actions are local format checks with disabled backend submissions; login, remember me, and Google sign-in do not create or persist sessions. Update 2026-10-04: Figma access restored; desktop/mobile buyer login (`352:5611`, `393:4748`), mobile signup (`393:4580`), and mobile reset (`396:6316`) are implemented. Standalone buyer verification remains pending a confirmed design: the indexed verification frames are recovery, checkout, or aggregator flows. `380:12929` is checkout buyer confirmation, not standalone account verification. See `BUYER_AUTH_IMPLEMENTATION.md` for route mapping, architecture and validation.

See `BACKEND_CONTRACT_HANDOFF.md`. The state document is a useful baseline but is not an approved API specification. In particular, endpoint names and field aliases in the current services are implementation assumptions. Avoid copying those assumptions into the new landing/preview layer.
