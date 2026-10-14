# Staff access

Production sign-in URL after deployment: https://farmtry-sage.vercel.app/admin/login

Share internally and bookmark. Public desktop and mobile menus use the same links and do not advertise admin access. Recovery and reset are /admin/recovery and /admin/reset. Previous preview sign-in links remain compatible.

All roles use POST /auth/login with emailOrPhone and password. The admin sign-in accepts administrator roles returned by the service, then opens /admin. Backend permissions remain authoritative for every protected API request. This static frontend cannot make a URL secret or replace backend access checks.

Backend must provision the initial staff account through a controlled process; public signup must never grant administrator privileges. Before production acceptance, test an authorised admin, an ordinary user (403), and an expired session (sign-in required) against the deployed backend.

Deploy farmtry-api-integration with these changes before sharing the production link. Passing local tests does not establish that Vercel is running this revision.
