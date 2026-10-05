# First-time visitor testing — 2026-10-05

Start at `http://localhost:3004/`. This is a frontend acceptance pass, not a completed live account or purchase test.

## Checked in the browser

- Homepage → Get Started → field-agent registration opens the complete registration form. Empty submission focuses Full legal name and blocks the required fields.
- Aggregator sign-in: empty submission shows contact/password errors and focuses the contact field.
- Recovery: SMS selection shows the phone field; empty submission shows its validation error and focuses it.
- Homepage → enterprise registration opens the buyer form. Local checks show all four required-field errors and focus Company name. Create Account remains disabled because its API contract is absent.
- Marketplace navigation opens the explicit coming-soon page. This is an unfinished screen, not a functioning catalogue.
- At 390px width the homepage has no horizontal overflow or broken images. The mobile menu opens, its aggregator shortcut navigates to the gateway, and the menu closes.

## Fix from this pass

Aggregator recovery previously displayed buyer branding and returned to buyer login. Recovery/reset links now carry an allowlisted audience hint and preserve aggregator sign-in navigation. This hint changes presentation only; API authorization remains unchanged. Backend-generated recovery links currently contain only a token, so their default presentation remains buyer-labelled unless the backend later supplies the optional hint.

## Remaining blockers and gaps

- `localhost:5001` actively refused the API connection during this pass. Registration, OTP delivery, authenticated sessions, recovery delivery and aggregator operations still need live backend testing.
- Buyer registration requires its backend contract. Marketplace, cart, wishlist, checkout, buyer workspace and other screens listed in `FRONTEND_BUILD_STATUS.md` remain unfinished.
- Homepage sample cassava cards currently link to the single tomato product preview. Product-specific navigation must be completed with the catalogue; these links are not evidence of real ordering.
- Homepage metrics, accreditation and settlement claims are design copy and require owner verification before release.

## Automated validation

17 account-validation tests and 29 API contract/failure-path tests pass. These use local validation and mocked responses; they do not prove live backend behavior. TypeScript and the 58-page production export are checked with the fix.
