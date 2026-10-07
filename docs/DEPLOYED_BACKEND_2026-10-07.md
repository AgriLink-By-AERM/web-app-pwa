# Deployed backend connection — 2026-10-07

API base: https://farmtry-core-engine.onrender.com/api/v1

The frontend default and .env.example now use this address. NEXT_PUBLIC_FARMTRY_API_URL remains an override; changing it requires rebuilding the static export.

## Live checks

- GET /aggregator/status returned the documented 401 UNAUTHORIZED JSON envelope without credentials. This confirms reachability, not successful authentication.
- OPTIONS /auth/login with Origin http://localhost:3004, requested method POST and header content-type returned 200 and Allow: POST, but no Access-Control-Allow-Origin, Access-Control-Allow-Credentials, Access-Control-Allow-Methods or Access-Control-Allow-Headers.
- The GET response also lacked an Access-Control-Allow-Origin header.

Browser sign-in from the local frontend is therefore blocked by CORS. Backend configuration must allow the exact frontend origin (currently http://localhost:3004), credentials, POST/GET/OPTIONS and Content-Type. Credentialed requests cannot use a wildcard allowed origin. Recheck the actual frontend origin if the preview port changes. Cross-site session cookies also need appropriate Secure/SameSite settings; cookie issuance and browser acceptance have not yet been tested.

No accounts were created, recovery messages sent, passwords changed or backend records mutated during these checks. Successful login and authenticated operations still need testing after browser access is configured.

## Workspace and Figma

The repository moved from Downloads to C:/Users/HP/Documents/Agrilink/hackathon_junction/web-app-pwa. The previous Downloads workspace no longer exists. Only the known partial Figma ZIP was found in the supplied parent folder; no native .fig file was found in the project tree (including hidden files) or directly in Downloads. Awaiting its exact filename/location. The archive-first instruction remains in effect for screen implementation.