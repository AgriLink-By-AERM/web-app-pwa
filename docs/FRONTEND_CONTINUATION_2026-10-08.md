# Frontend continuation — 2026-10-08

## Delivered in this batch

| Screen | Route | Saved reference |
| --- | --- | --- |
| Shopping cart | /preview/cart/ | 374:10149 |
| Buyer dashboard | /preview/buyer/ | 338:4351 |
| Purchase history | /preview/buyer-history/ | 329:3611 |

These screens use the saved high-fidelity design contexts, original local icons/images, and existing Button, Card and FarmtryBrand components. The complete native Figma archive remains preserved locally; see FIGMA_ARCHIVE_STATUS.md.

The cart supports preview-only quantity changes (1–99 units), recalculated sample totals and crate deposits, removal, clearing and restoring the sample items. Reloading resets it. The quantity ceiling is a UI bound, not stock availability. Its sample offer uses the original 59,000 subtotal plus the displayed 10,000 gap; no commercial eligibility is asserted. Product image crops match the saved source transforms. Checkout and saved-item actions remain disabled.

The dashboard includes the match banner, spending/order statistics, quick actions, original chart bar heights and recent activity. The company, dates and activity remain explicitly illustrative. Navigation connects dashboard and purchase history; unfinished destinations give an honest unavailable message or link to an existing pending preview. No sample account is treated as an authenticated session.

Purchase history displays the four saved transactions with local All Orders, Completed, In Progress and Cancelled filters, including an empty state. The design's 24-order summary is labelled sample, and pagination states only four records are available. No invoices, reports, receipt confirmation, matching or tracking APIs are invented.

## Intentional adaptations

- Mobile/tablet layouts adapt the available desktop references; this batch does not claim a comparison against matching mobile Figma screens.
- Commerce header/footer and brand reuse the existing implementation. Sample notices add height. Shared Inter typography is used for purchase history where the design uses Plus Jakarta Sans; that font is not in the project's existing font bundle.
- Disabled backend controls and unavailable feedback replace unimplemented service actions. No fabricated records are added to make pagination or filters look populated.
- Historic sample dates are kept rather than presented as today's account data. The inaccurate weekday in the dashboard design is omitted.

## Validation

- Production build and TypeScript: passed, 59 exported routes.
- Existing tests: 29 API contract/failure tests plus 17 buyer-auth validation tests passed.
- Cart browser checks: 1440, 820, 390 and 320px; no horizontal overflow; quantity minimum, totals, removal, clear/restore, reload reset and disabled actions verified.
- Buyer browser checks: 1440, 1024, 820, 390 and 320px; no horizontal overflow; menu, account-search feedback, dashboard/history navigation, filters and empty state verified.
- Every copied design asset is nonempty and byte-identical to the saved original. Browser checks verify visible image loading and intrinsic SVG geometry. Desktop/mobile screenshots were visually inspected. No browser runtime errors.

## Remaining work

Marketplace, wishlist, checkout, the remaining buyer views and other indexed role screens are still unfinished. Native preservation is complete; only a subset has connector-generated high-fidelity implementation references. The deployed backend URL remains configured separately. These new shopping/buyer screens await their API contracts; the existing live account flow still needs the backend CORS configuration documented in DEPLOYED_BACKEND_2026-10-07.md.
