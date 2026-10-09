# Browser authentication repair — 2026-10-08

Affected website: https://farmtry-sage.vercel.app/
Upstream: https://farmtry-core-engine.onrender.com/api/v1

## Cause and change

The client called Render directly from Vercel. The supplied auth guide specifies a Strict refresh cookie and Lax access cookie. Browsers exclude these cookies from cross-site fetch requests even with credentials included. A read-only check found the frontend API route returned 404 while the Render endpoint returned the expected unauthenticated 401 and allowed the Vercel origin.

Browser API requests now use /api/v1 on the frontend origin. vercel.json proxies that path to Render and prohibits API caching. The local static preview and Next development server also proxy the same path. NEXT_PUBLIC_FARMTRY_API_URL is intentionally no longer used: an old deployment value cannot bypass the cookie fix. Configure the deployed upstream in vercel.json and the optional local upstream using FARMTRY_API_UPSTREAM.

Tokens remain in HttpOnly cookies. Only the nonsecret logout sessionId is kept in sessionStorage. Refresh requests share one promise within a tab; late 401 responses reuse a completed refresh. Protected reads and writes retry once after a definite 401, never after network/5xx failures. A rejected refresh or rejected retried request clears the session reference and redirects to sign-in. Network failures retain it. OTP verification accepts the web user-only response. Logout can refresh expired access before submitting the current session reference.

## Backend and deployment requirements

- Set both cookies without a Domain attribute (host-only). Do not set Domain to onrender.com or the Render host; a browser on Vercel would reject that cookie.
- Use HttpOnly and Secure in production; Path=/ is recommended. Refresh cookie must cover /api/v1/auth/refresh-token. Keep the documented SameSite settings and expiry/rotation policy.
- Clear cookies using the same Path and Domain settings at logout. Refresh must return the new cookie pair plus data.sessionId.
- Backend origin/CSRF checks must allow https://farmtry-sage.vercel.app; never replace this with wildcard credentialed access.
- Deploy this branch with web-app-pwa as the Vercel project root so vercel.json is applied. Other static hosts need an equivalent reverse proxy.
- Sign in again after deployment to create cookies on the frontend domain; existing Render-domain cookies cannot migrate automatically.

## Verification

Contract/failure tests cover credentials, no token persistence, user-only OTP, concurrent and late 401 responses, refresh failure, retry limits, logout and cleared-session races. Proxy tests cover separate Set-Cookie headers, request cookies/body/query, no-store, and rejecting unrelated origins. A separate isolated Edge browser fixture confirmed a Strict refresh cookie reaches the proxy and HttpOnly cookies cannot be read through document.cookie.

Real account login and backend Set-Cookie attributes have not been inspected. The fixture proves the frontend transport, not the deployed backend's cookie configuration. After deployment, verify login, access expiry/refresh, page reload and logout using a test account. Do not share cookie/token values in logs or screenshots.

Screen implementation is paused while this auth repair is verified; unfinished admin files are excluded from the auth commit. Mobile integration remains deferred.
