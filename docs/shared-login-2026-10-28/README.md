> Updated 2026-11-01: the tab-only registry described below has been replaced by persistent browser storage. See ../account-continuity-2026-11-01/README.md and registration-persistence.json. Sign-out keeps registered accounts; existing recoverable registrations migrate automatically.

# Shared login and marketplace account access

All login preview URLs and /login now render the same email/password form. The screen catalogue lists it once. Signed-out marketplace account actions open the sign-in/create-account dialog. Only registration asks for Consumer, Corporate Buyer or Aggregator.

Presentation registration records the normalized email, selected role, name and a salted password digest in this browser tab's session storage. It creates no backend account. Sign out preserves these presentation registrations so the same credentials can be used again. Closing the tab removes them. Passwords are not stored in plaintext. This is a demonstration of navigation, not authentication or authorization.

Consumers land on the marketplace and use shopping account, wishlist, cart, checkout and order tracking. Corporate Buyers and Aggregators land on their own workspaces. Login destinations ignore returnTo role hints and derive from the account record. KYC gates remain unchanged.

With NEXT_PUBLIC_PRESENTATION_MODE=false the form calls the existing /auth/login service and routes from its returned user role. Server enforcement of identity, permissions, verified status and role is still required. The service must distinguish consumer/buyer from corporate/corporate_buyer; a shared buyer role cannot identify both. No role is guessed from an email domain or the login URL.

Validation: see checks.json and the focused browser test scripts/test-shared-login.cjs.
