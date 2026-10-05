# Buyer account preview — updated 2026-10-04

## Delivered design scope

| Route | Retrieved Figma reference | Availability |
| --- | --- | --- |
| `/preview/buyer-register/` | `352:5465`, `393:4580` | Desktop and mobile registration preview |
| `/preview/buyer-login/` | `352:5611`, `393:4748` | Desktop and mobile login preview |
| `/preview/recovery/` | `356:6018`, `395:6139` | Desktop and mobile recovery preview |
| `/preview/buyer-reset/` | `356:5843`, `396:6316` | Desktop and mobile code entry and password reset preview |

Figma access was restored on 2026-10-04. Login and the missing mobile signup/reset layouts are now implemented. Standalone buyer account verification remains pending because no matching design was found in the new canvas. `380:12929` and `380:13399` are checkout account forms; `412:18361` is aggregator phone verification; `395:5103` is the Google-owned account chooser; `395:5313` is signup success, not code verification. None is substituted for standalone buyer verification. Its registry mapping remains null.

## Behavior and intentional preview changes

- Reuses the existing Button, Card, Farmtry brand and locally hosted fonts; retrieved imagery and icons are stored under `public/figma/buyer-auth` with mappings in `features/buyer-auth/asset-map.json`. The logo remains in `public/figma/landing`.
- Fields, show/hide password controls, recovery method radios and local validation work. Error feedback is linked to fields; the first invalid field receives focus. Reset code uses one labelled numeric text input, preserving leading zeros and supporting paste, instead of six separate focus stops.
- The explicit **Check details locally** action runs format checks only. Log in, remember me, create account, Google sign-in, send/re-send code and change password remain disabled. Login checks email format and password presence only; it does not apply provisional signup password policy to existing credentials. No timer, challenge, account, session, message or successful mutation is fabricated.
- React state holds preview input only. No new fetch, cookies, storage or URL serialization; no use of legacy demo-auth or mutation fallback services. Preview links are navigation, never evidence of completed steps.
- Added preview notices and navigation make the layouts taller than the original Figma frames. Mobile recovery retains an Email/SMS switch for access to both local check modes. The Figma spelling “Corprate” is corrected. Unverified certification and encryption claims are omitted from the form footer.
- Password checks (8 characters, a number, a special symbol) and Nigerian mobile formatting are provisional UI checks derived from design. Backend-approved policy is still required. Passing a code format check does not verify a code.

## Backend boundary

`features/buyer-auth/contracts.ts` lists login, registration, Google sign-in, recovery initiation, reset-code verification, resend and password-reset operations. Each explicitly has `status: awaiting-specification` and null endpoint/request/response schemas. Local `AuthValues` is a view model, not a request payload. See `BACKEND_CONTRACT_HANDOFF.md` for the specification template and expected semantics.

## Next implementation

1. Obtain a confirmed standalone buyer-verification design link. Existing similarly named frames are different flows.
2. Approve the account API contracts and password/phone policy with backend owners.
3. Implement validated response adapters, session handling, real challenge expiry and retry behavior; enable individual operations only after their contracts are approved and tested.

## Checks from the original implementation (2026-09-30)

- `node scripts/test-buyer-auth.cjs`: required fields, channel-specific validation, malformed input, Nigerian phone formats, leading-zero codes, code length, confirmation and password rules.
- TypeScript passed. Production static export generated 56 pages, including all 17 preview destinations.
- Browser checks: blank signup focuses the company field and reports four errors; valid synthetic signup values produce local-only feedback; show/hide toggles work. Reset preserves a leading-zero code, rejects mismatched passwords and explicitly says the code was not verified after local checks pass. Recovery switches from email to SMS and accepts a correctly formatted Nigerian number without sending a message. Mobile signup/reset display pending cards. Desktop and 390px mobile layouts inspected visually.

## Continuation validation (2026-10-04)

- The original 14 validation tests plus three login cases pass (17 total). Login covers missing credentials, malformed email, and existing passwords that do not match signup policy.
- TypeScript passed before the production build.
- The mobile pending cards were removed for signup/reset. All four account preview forms retain local-only state and disabled service actions.
- Figma assets are local, nonempty, and mapped in `asset-map.json`; SVGs retain their exported dimensions.
- Design adaptations remain intentional: preview notices and local-check controls add height, reset code is one accessible input, and no sample identity, sent-code countdown, OAuth identity, success state, or unverified encryption claim is presented as real.

- Browser continuation checks: empty login focuses email and shows both errors; synthetic credentials with an existing short password pass only local checks; show/hide works; all backend actions remain disabled. Mobile reset preserves `012345`, validates matching passwords, and explicitly reports no verification or password change.
- Desktop login and mobile login/signup/reset were visually inspected; visible local assets load and mobile layouts have no horizontal page overflow. The signup photo preserves the original 220px image crop inside its shorter visible slot.

- Final production build passed with TypeScript validation and all 56 pages exported. The final export was rechecked on a fresh local preview origin: the mobile signup image crop is correct, confirmation uses the eye icon, the matching-password hint appears only for matching input, and the confirmation visibility toggle works. Standalone buyer verification still awaits a confirmed design link.
