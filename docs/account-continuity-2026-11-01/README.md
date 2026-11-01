# Account continuity, workspaces and marketplace home

Requested items 2–6:

- One identity reader feeds marketplace, Corporate Buyer, Aggregator and Admin account information. Logout and expired API sessions clear displayed identity. Account roles determine which workspace opens; presentation review remains available while signed out. Server authorization is still required for live data.
- Presentation activity records the current actor, action, page and timestamp. Activity, personal details, corporate preferences, cart quantities, wishlist removals, delivery drafts, farmer-registration drafts and KYC status are stored separately for each role/email. Input values and passwords are not included in the activity log. Static sample transactions, balances, suppliers and charts remain labelled design examples.
- Corporate Buyer identity is at the bottom of the sidebar. The sign-out icon sits beside Notifications. Aggregator has shared identity/sign-out and no marketplace shortcut in its sidebar.
- Aggregator availability is a separate manual choice. Presentation presence updates on visibility, connection changes, sign-in and sign-out, with 30-second heartbeats and a 90-second stale threshold. Directory views in the marketplace and Corporate Buyer dashboard display online/offline and last seen. LocalStorage allows observation in the same browser; this does not establish cross-device presence. Live mode displays an unavailable-service message instead of claiming someone is online.
- Root /, /home, shared logos and installed-app start_url now open the marketplace. Role-specific post-login destinations remain Consumer → marketplace, Corporate Buyer → corporate dashboard and Aggregator → aggregator dashboard.

Backend work remains for authoritative identity/permissions, persisted real activity/orders, KYC decisions and a presence/availability API. No new backend endpoints were invented.

Verification: production build, scripts/test-account-continuity.cjs and checks.json; screenshots cover desktop and mobile workspaces.

## Registration retention correction

The old presentation registry used sessionStorage, so closing its browser tab could remove a registration. Registrations now use localStorage, preserving the salted digest, role, name and contact details in the same browser/site. Current tab registrations are migrated automatically. Account-scoped presentation profiles, activity and drafts also use durable browser storage. The active sign-in session stays separate and tab-scoped; signing out does not delete the registration. Clearing site data, private browsing disposal, switching browsers or changing the site origin can still remove or separate local presentation accounts. Cross-device accounts require the backend. Already-lost registrations cannot be recovered from missing browser storage.

Regression checks: scripts/test-registration-persistence.cjs and registration-persistence.json cover all three registration roles, sign-out, tab closure, restored browser storage, legacy migration and wrong-password rejection.
