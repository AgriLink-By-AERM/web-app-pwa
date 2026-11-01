# KYC restoration and backend error handling

The live Aggregator KYC page keeps the existing full form, layout and file input. It remains visible when status loading fails, and when backend status is pending, rejected or approved. Nothing in this correction removes other existing frontend screens.

GET /aggregator/status supplies the displayed status and rejection reason. Status-read failures are displayed from the backend response; they do not become assumed incomplete/rejected KYC. Form values survive failed submissions and status retries. Approval is never simulated in live mode.

## Submission connection for backend development

The UI retains an enabled Submit KYC button. Configure NEXT_PUBLIC_AGGREGATOR_KYC_SUBMIT_PATH with the backend owner's relative path under NEXT_PUBLIC_API_URL. The default integration target is /aggregator/kyc. Submissions reach the backend adapter and display its response; the frontend does not assume that KYC is unsupported. The override allows the backend team to supply a different route.

The current adapter sends multipart/form-data (browser-generated boundary), with fields fullName, phone, governmentIdType, governmentIdNumber, governmentIdPhoto (binary File), guarantorPhone and zone. These identify the frontend's current inputs; the backend owner can agree the final contract and supply its route. Files are not uploaded on selection or written to local browser storage. Cookie authentication and existing API error handling apply. No real user document or real account submission was used for validation.

## Backend errors

Backend message/detail text is preserved for non-2xx responses and negative success envelopes. Missing/empty detail messages fall back to the backend summary before using a generic HTTP/network fallback. Marketplace errors also use the returned backend message. Multipart requests are no longer labelled application/json.

Verification: scripts/test-kyc-service.cjs (multipart/error cases), scripts/test-kyc-restored.cjs (desktop/mobile form remains through backend errors/status changes), existing API/auth/proxy tests and backend-handover browser regression. See checks.json and screenshots.
