# Staff access

Production sign-in URL after deployment: https://farmtry-sage.vercel.app/admin/login

Share internally and bookmark. Public desktop and mobile menus use the same links and do not advertise admin access. Recovery and reset are /admin/recovery and /admin/reset. Previous preview sign-in links remain compatible.

All roles use POST /auth/login with emailOrPhone and password. The admin sign-in accepts administrator roles returned by the service, then opens /admin. Backend permissions remain authoritative for every protected API request. This static frontend cannot make a URL secret or replace backend access checks.

Backend must provision the initial staff account through a controlled process; public signup must never grant administrator privileges. Before production acceptance, test an authorised admin, an ordinary user (403), and an expired session (sign-in required) against the deployed backend.

Deploy farmtry-api-integration with these changes before sharing the production link. Passing local tests does not establish that Vercel is running this revision.

## Connected workspace update — 16 October 2026

Staff login now validates the returned admin role and confirms permission through the protected GET /admin/users endpoint. It displays “Administrator access confirmed” with an “Open dashboard” button. Direct visits to connected admin pages also check this protected endpoint before showing the workspace; client state is never the authorization authority.

- /admin — dashboard with real user totals by role, workspace links and recent audit activity.
- /admin/users — user records and account decisions.
- /admin/farmers — farmer records.
- /admin/verifications — aggregator/dealer review queues.
- /admin/disputes — disputes and decisions.
- /admin/audit — audit log.
- /admin/listings — marketplace listing management.

Desktop sidebar and accessible mobile Menu provide the same destinations. Prior preview URLs remain compatible. Staff pages include their own brand/form styling; errors link back to staff login. Every API mutation still requires backend authorization. Existing roles are assumed to have access to /admin/users, as specified in the current contract; a future restricted staff role needs an explicit capability contract.
