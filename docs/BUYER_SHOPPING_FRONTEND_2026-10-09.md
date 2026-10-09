# Buyer and shopping frontend — 2026-10-09

Implemented 12 preview routes from the complete local Figma archive: buyer profile, filtered listings and drawer, marketplace, wishlist, checkout, three account-role entries, account confirmation, order-summary confirmation, account success and compact login. The role entries share one component; the compact login reuses existing authentication.

Local interactions include profile editing/cancel, preference chips, catalogue filters, saved-item removal/restoration, payment-method tabs, delivery-address draft, role switching, password visibility and account tabs. Service writes remain disabled. Sample success screens are directly labelled as designs; they do not imply a submitted registration or payment. Payment account details are masked.

Uses shared Card, Button, FarmtryBrand, BuyerShell and CommerceShell components, plus original archived assets. The public marketplace uses the shared commerce header/footer. Sample catalogue duplicates and inconsistent commodity images are preserved from the archive; they are not live inventory. The confirmation summary is a separate saved example rather than shared cart state.

Validation: production export succeeds with 86 routes. Browser checks cover all 12 routes at 1440, 820 and 390px, local interactions, loaded images, horizontal overflow, runtime errors and absence of API calls. Desktop screenshots reviewed for profile, marketplace, wishlist, checkout and account confirmation. Responsive behavior is checked; comparison against separate mobile Figma designs remains deferred.

Remaining: aggregator design layouts and remaining variants, then final screen-inventory reconciliation. Admin frontend was committed separately. Backend integration and mobile reference comparison remain outside this frontend pass.
