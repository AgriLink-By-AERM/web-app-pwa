================================================================================
  FARMTRY CORE ENGINE — COMPLETE BACKEND API CONTRACT & FRONTEND INTEGRATION GUIDE
  Base URL: http://localhost:5001/api/v1
  Frontend PWA Client Reference: web-app-pwa/lib/api-client.ts (Port 5001 or proxied)
  All timestamps: ISO 8601 UTC string (e.g. "2026-10-12T20:00:00.000Z")
  Web Clients: Dual-support for HttpOnly cookies AND 'Authorization: Bearer <accessToken>'
  Mobile Clients: 'x-client-type: mobile' returns tokens directly in JSON body
================================================================================

TABLE OF CONTENTS:
1. GLOBAL CONTRACT & ENVELOPE SPECIFICATION
2. INTEGRATION MATRIX (CONSUMED vs PENDING BY FRONTEND)
3. AUTHENTICATION & RECOVERY MODULE
4. AGGREGATOR MODULE
5. MARKETPLACE MODULE
6. BUYER MODULE (ORDERS, CART, WISHLIST)
7. DEALER MODULE (INVENTORY, VOUCHERS, REDEMPTIONS)
8. FARMER MODULE (INTAKES, PRODUCE, WALLET VOUCHERS)
9. ADMIN & SUPERADMIN MODULE (KYC, USERS, DISPUTES, AUDIT, SEEDING)

================================================================================
1. GLOBAL CONTRACT & ENVELOPE SPECIFICATION
================================================================================

All backend endpoints return a standardized JSON envelope. The frontend API client
(`web-app-pwa/lib/api-client.ts`) expects this exact structure:

-------- Success Response (`ApiResponse<T>`) --------
{
  "success": true,
  "message": "Operation successful description",
  "timestamp": "2026-10-12T20:00:00.000Z",
  "data": T  // payload object, array, or null
}

-------- Error Response (`ErrorResponse`) --------
{
  "success": false,
  "message": "Human-readable error explanation",
  "timestamp": "2026-10-12T20:00:00.000Z",
  "error": {
    "code": "BAD_REQUEST" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "VALIDATION_ERROR" | "INTERNAL_SERVER_ERROR",
    "path": "/api/v1/auth/login",
    "details": [ ...optional Joi validation error array... ],
    "stack": null // hidden in production
  }
}

HTTP STATUS CODES:
  200 OK           → Successful read or mutation
  201 Created      → Resource created (Register, Order, Log, Listing)
  400 Bad Request  → Business rule violation or malformed request
  401 Unauthorized → Missing, expired, or invalid session/JWT
  403 Forbidden    → Account role/KYC does not permit this action
  404 Not Found    → Resource or ID not found
  409 Conflict     → Unique constraint collision (duplicate email/phone/dispute)
  422 Unprocessable→ Validation error from Joi schema
  429 Too Many Req → Rate limit triggered (authLimiter: 10 req/15min)
  500 Internal     → Unexpected server-side failure

AUTHENTICATION & REFRESH FLOW FOR FRONTEND:
  1. Web Client (Browser):
     - `POST /auth/login` sets `accessToken` and `refreshToken` in HttpOnly cookies.
     - Frontend stores `sessionId` in `sessionStorage` (`farmtry.session-id`).
     - On 401 error, `lib/api-client.ts` calls `POST /auth/refresh-token` (with cookies)
       and replays the original request automatically.
  2. Mobile Client (App):
     - Send header `x-client-type: mobile`.
     - Backend delivers `tokens.accessToken` and `tokens.refreshToken` in `data`.
     - Mobile passes `Authorization: Bearer <accessToken>` on subsequent calls.


================================================================================
2. INTEGRATION MATRIX (CONSUMED vs PENDING BY FRONTEND)
================================================================================

Below is the status of frontend integration in `web-app-pwa`:

| Module       | Endpoint                               | Status    | Frontend File / Target             |
|:-------------|:---------------------------------------|:----------|:-----------------------------------|
| Auth         | POST /auth/aggregator/register         | CONSUMED  | `lib/aggregator/api.ts`            |
| Auth         | POST /auth/login                       | CONSUMED  | `lib/auth/auth.ts`                 |
| Auth         | POST /auth/verify-otp                  | CONSUMED  | `lib/auth/auth.ts`                 |
| Auth         | POST /auth/resend-otp                  | CONSUMED  | `lib/auth/auth.ts`                 |
| Auth         | POST /auth/refresh-token               | CONSUMED  | `lib/api-client.ts`                |
| Auth         | POST /auth/logout                      | CONSUMED  | `lib/auth/auth.ts`                 |
| Auth         | POST /auth/forgot-password             | CONSUMED  | `lib/auth/auth.ts`                 |
| Auth         | POST /auth/reset-password (OTP Flow)   | CONSUMED* | `lib/auth/auth.ts` (Needs 6-digit) |
| Aggregator   | GET /aggregator/dashboard              | CONSUMED  | `lib/aggregator/api.ts`            |
| Aggregator   | GET /aggregator/status                 | CONSUMED  | `lib/aggregator/api.ts`            |
| Aggregator   | GET /aggregator/logs                   | CONSUMED  | `lib/aggregator/api.ts`            |
| Aggregator   | GET /aggregator/logs/:id               | CONSUMED  | `lib/aggregator/api.ts`            |
| Aggregator   | POST /aggregator/logs                  | CONSUMED  | `lib/aggregator/api.ts`            |
| Aggregator   | POST /aggregator/disputes              | CONSUMED  | `lib/aggregator/api.ts`            |
| Marketplace  | GET /marketplace/listings              | PENDING   | `features/marketplace`, `app/`     |
| Marketplace  | GET /marketplace/listings/:id          | PENDING   | `app/product/[id]`                 |
| Marketplace  | POST /marketplace/listings (Admin)     | PENDING   | `lib/admin/service.ts`             |
| Marketplace  | PATCH /marketplace/listings/:id (Admin)| PENDING   | `lib/admin/service.ts`             |
| Marketplace  | DELETE /marketplace/listings/:id       | PENDING   | `lib/admin/service.ts`             |
| Buyer        | POST /buyer/register                   | PENDING   | `lib/buyer/store.ts`               |
| Buyer        | GET /buyer/profile                     | PENDING   | `lib/buyer/store.ts`               |
| Buyer        | GET /buyer/dashboard                   | PENDING   | `lib/buyer/store.ts`               |
| Buyer        | GET /buyer/cart                        | PENDING   | `app/cart`                         |
| Buyer        | POST /buyer/cart/items                 | PENDING   | `app/cart`, `lib/buyer/store.ts`   |
| Buyer        | DELETE /buyer/cart/items/:listingId    | PENDING   | `app/cart`                         |
| Buyer        | DELETE /buyer/cart                     | PENDING   | `app/cart`                         |
| Buyer        | GET /buyer/wishlist                    | PENDING   | `app/wishlist`                     |
| Buyer        | POST /buyer/wishlist/toggle            | PENDING   | `app/wishlist`, `product`          |
| Buyer        | POST /buyer/orders                     | PENDING   | `app/checkout`                     |
| Buyer        | GET /buyer/orders                      | PENDING   | `lib/buyer/store.ts`               |
| Buyer        | GET /buyer/orders/:id                  | PENDING   | `app/buyer/orders/[id]`            |
| Buyer        | PATCH /buyer/orders/:id/cancel         | PENDING   | `lib/buyer/store.ts`               |
| Dealer       | POST /dealer/register                  | PENDING   | `lib/dealer/store.ts`              |
| Dealer       | GET /dealer/profile                    | PENDING   | `lib/dealer/store.ts`              |
| Dealer       | GET /dealer/transactions               | PENDING   | `lib/dealer/reports.ts`            |
| Dealer       | POST /dealer/validate-otp              | PENDING   | `lib/dealer/store.ts`              |
| Dealer       | GET /dealer/vouchers/:code             | PENDING   | `lib/dealer/store.ts`              |
| Dealer       | POST /dealer/redeem                    | PENDING   | `lib/dealer/store.ts`              |
| Dealer       | GET /dealer/receipts/:reference        | PENDING   | `lib/dealer/store.ts`              |
| Farmer       | POST /farmer/register                  | PENDING   | Farmer onboarding flow             |
| Farmer       | GET /farmer/profile                    | PENDING   | Farmer dashboard                   |
| Farmer       | GET /farmer/dashboard                  | PENDING   | Farmer dashboard                   |
| Farmer       | GET /farmer/logs                       | PENDING   | Farmer harvest logs                |
| Farmer       | GET /farmer/vouchers                   | PENDING   | Farmer vouchers list               |
| Farmer       | GET /farmer/vouchers/:code             | PENDING   | Farmer voucher detail              |
| Admin        | GET /admin/kyc/aggregators             | PENDING   | `lib/admin/service.ts`             |
| Admin        | PATCH /admin/kyc/aggregators/:id/approve| PENDING  | `lib/admin/service.ts`             |
| Admin        | PATCH /admin/kyc/aggregators/:id/reject | PENDING  | `lib/admin/service.ts`             |
| Admin        | GET /admin/kyc/dealers                 | PENDING   | `lib/admin/service.ts`             |
| Admin        | PATCH /admin/kyc/dealers/:id/approve   | PENDING   | `lib/admin/service.ts`             |
| Admin        | PATCH /admin/kyc/dealers/:id/reject    | PENDING   | `lib/admin/service.ts`             |
| Admin        | GET /admin/users                       | PENDING   | `lib/admin/service.ts`             |
| Admin        | PATCH /admin/users/:id/suspend         | PENDING   | `lib/admin/service.ts`             |
| Admin        | PATCH /admin/users/:id/activate        | PENDING   | `lib/admin/service.ts`             |
| Admin        | GET /admin/disputes                    | PENDING   | `lib/admin/service.ts`             |
| Admin        | PATCH /admin/disputes/:id/resolve      | PENDING   | `lib/admin/service.ts`             |
| Admin        | PATCH /admin/disputes/:id/dismiss      | PENDING   | `lib/admin/service.ts`             |
| Admin        | GET /admin/audit-logs                  | PENDING   | `lib/admin/service.ts`             |


================================================================================
3. AUTHENTICATION & RECOVERY MODULE
================================================================================

Prefix: /api/v1/auth
Middleware: authLimiter (10 req/15min) on public endpoints

[1] REGISTER AGGREGATOR
    POST /api/v1/auth/aggregator/register
    Auth: None
    Request Body:
    {
      "fullName":             "Chidi Okonkwo",
      "email":                "chidi@farmtry.com",
      "password":             "SecurePassword123!",
      "phone":                "08012345678",
      "zone":                 "Oyo-Central",
      "governmentIdType":     "nin", // "nin" | "drivers-license" | "intl_passport"
      "governmentIdNumber":   "12345678901", // required if type === "nin" (11 digits)
      "governmentIdPhotoUrl": "https://storage.farmtry.com/id/123.jpg",
      "guarantorPhone":       "08099887766"
    }
    Response 201:
    {
      "success": true,
      "message": "Aggregator registered successfully. Verification code sent.",
      "data": {
        "userId": "6708b1a2c3d4e5f6a7b8c901",
        "fullName": "Chidi Okonkwo",
        "email": "chidi@farmtry.com",
        "phone": "08012345678",
        "role": "aggregator",
        "status": "pending",
        "aggregator": { "zone": "Oyo-Central", "kycStatus": "pending" }
      }
    }

[2] VERIFY REGISTRATION OTP
    POST /api/v1/auth/verify-otp
    Auth: None
    Request Body:
    {
      "email": "chidi@farmtry.com", // OR "phone": "08012345678"
      "code": "482910"              // 6 digits
    }
    Response 200:
    {
      "success": true,
      "message": "Account verified successfully.",
      "data": {
        "message": "Account verified successfully.",
        "user": {
          "id": "6708b1a2c3d4e5f6a7b8c901",
          "fullName": "Chidi Okonkwo",
          "email": "chidi@farmtry.com",
          "role": "aggregator",
          "status": "active"
        }
      }
    }

[3] RESEND REGISTRATION OTP
    POST /api/v1/auth/resend-otp
    Auth: None
    Request Body:
    {
      "email": "chidi@farmtry.com" // OR "phone": "08012345678"
    }
    Response 200:
    {
      "success": true,
      "message": "A new verification code has been sent to your email."
    }

[4] LOGIN
    POST /api/v1/auth/login
    Auth: None
    Request Body:
    {
      "emailOrPhone": "chidi@farmtry.com",
      "password": "SecurePassword123!"
    }
    Response 200:
    {
      "success": true,
      "message": "Login successful.",
      "data": {
        "user": {
          "id": "6708b1a2c3d4e5f6a7b8c901",
          "fullName": "Chidi Okonkwo",
          "email": "chidi@farmtry.com",
          "phone": "08012345678",
          "role": "aggregator",
          "status": "active"
        },
        "sessionId": "b4a8e2d1-93c4-42f1-a1b9-98319f03d582"
      }
    }
    Note: HttpOnly cookie `accessToken` is set automatically for browsers.

[5] REFRESH TOKEN
    POST /api/v1/auth/refresh-token
    Auth: Cookie or Body
    Request Body (Mobile only):
    {
      "refreshToken": "<jwt-refresh-token>"
    }
    Response 200:
    {
      "success": true,
      "message": "Tokens refreshed successfully.",
      "data": {
        "sessionId": "b4a8e2d1-93c4-42f1-a1b9-98319f03d582"
      }
    }

[6] LOGOUT
    POST /api/v1/auth/logout
    Auth: Required (Bearer or cookie)
    Request Body:
    {
      "sessionId": "b4a8e2d1-93c4-42f1-a1b9-98319f03d582"
    }
    Response 200:
    {
      "success": true,
      "message": "Logged out successfully."
    }

[7] FORGOT PASSWORD (OTP-BASED)
    POST /api/v1/auth/forgot-password
    Auth: None
    Request Body:
    {
      "email": "sarah.cooper@farmtry.com" // OR "phone": "08012345678"
    }
    Response 200:
    {
      "success": true,
      "message": "If an account exists for that contact, a password reset code has been sent."
    }
    Note: Returns identical message to prevent user enumeration. Code expires in 10 minutes.

[8] RESET PASSWORD (OTP-BASED — Matches UI screen)
    POST /api/v1/auth/reset-password
    Auth: None
    Request Body:
    {
      "email": "sarah.cooper@farmtry.com", // OR "phone"
      "code": "749201",                    // 6-digit numeric OTP
      "newPassword": "AgriSecure#2026"     // Min 8 characters
    }
    Response 200:
    {
      "success": true,
      "message": "Password reset successfully. Please log in with your new password."
    }
    Note: Evicts all device sessions and increments sessionVersion.


================================================================================
4. AGGREGATOR MODULE
================================================================================

Prefix: /api/v1/aggregator
Guard: authenticate + requireRole(UserRole.AGGREGATOR)

[9] GET DASHBOARD
    GET /api/v1/aggregator/dashboard
    Response 200:
    {
      "success": true,
      "data": {
        "profile": {
          "id": "agg_6708b1a2c3d4",
          "fullName": "Chidi Okonkwo",
          "email": "chidi@farmtry.com",
          "phone": "08012345678",
          "zone": "Oyo-Central",
          "kycStatus": "approved"
        },
        "stats": {
          "totalLogs": 24,
          "pendingLogs": 3,
          "verifiedLogs": 21,
          "totalWeightKg": 14250.5,
          "openDisputes": 1
        },
        "recentLogs": [ ...LogRecord array... ]
      }
    }

[10] GET KYC & REVIEW STATUS
    GET /api/v1/aggregator/status
    Response 200:
    {
      "success": true,
      "data": {
        "kycStatus": "pending", // "pending" | "approved" | "rejected"
        "rejectionReason": null,
        "reviewSteps": [
          { "label": "Identity Evidence Uploaded", "done": true },
          { "label": "Guarantor Verification", "done": false },
          { "label": "Compliance Approval", "done": false }
        ]
      }
    }

[11] LIST HARVEST INTAKE LOGS
    GET /api/v1/aggregator/logs?status=pending&pipeline=waste&page=1&limit=20
    Query Params (All optional):
      status:   "pending" | "verified" | "rejected"
      pipeline: string (e.g. "waste", "fresh-produce")
      category: string (e.g. "rice husks", "cassava peels")
      page:     number (default: 1)
      limit:    number (default: 20)
    Response 200:
    {
      "success": true,
      "data": {
        "logs": [
          {
            "id": "6708c901a1b2c3d4e5f6a701",
            "farmerPhone": "08011223344",
            "pipeline": "waste",
            "category": "rice husks",
            "weightKg": 250.5,
            "condition": "good",
            "latitude": 6.5244,
            "longitude": 3.3792,
            "photoUrl": "https://storage.farmtry.com/harvest/photo1.jpg",
            "harvestedAt": "2026-10-10T08:00:00.000Z",
            "status": "pending",
            "urgencyTier": "low",
            "qrPayload": "d4e5f6a7-b8c9-4012-98ab-cdef01234567",
            "createdAt": "2026-10-10T08:30:00.000Z"
          }
        ],
        "total": 1,
        "page": 1,
        "limit": 20
      }
    }

[12] GET LOG DETAILS
    GET /api/v1/aggregator/logs/:id
    Response 200:
    {
      "success": true,
      "data": { ...Single LogRecord object... }
    }

[13] CREATE HARVEST INTAKE LOG
    POST /api/v1/aggregator/logs
    Request Body:
    {
      "farmerPhone": "08011223344",
      "pipeline": "waste",
      "category": "rice husks",
      "weightKg": 250.5,
      "condition": "good", // "good" | "fair" | "damaged"
      "latitude": 6.5244,
      "longitude": 3.3792,
      "photoUrl": "https://storage.farmtry.com/harvest/photo1.jpg",
      "harvestedAt": "2026-10-10T08:00:00.000Z"
    }
    Response 201:
    {
      "success": true,
      "data": {
        "id": "6708c901a1b2c3d4e5f6a701",
        "farmerPhone": "08011223344",
        "pipeline": "waste",
        "category": "rice husks",
        "weightKg": 250.5,
        "condition": "good",
        "latitude": 6.5244,
        "longitude": 3.3792,
        "photoUrl": "https://storage.farmtry.com/harvest/photo1.jpg",
        "harvestedAt": "2026-10-10T08:00:00.000Z",
        "status": "pending",
        "urgencyTier": "low",
        "qrPayload": "d4e5f6a7-b8c9-4012-98ab-cdef01234567",
        "createdAt": "2026-10-10T08:30:00.000Z"
      }
    }

[14] FILE DISPUTE
    POST /api/v1/aggregator/disputes
    Request Body:
    {
      "logId": "6708c901a1b2c3d4e5f6a701",
      "reason": "Scale calibration mismatch on warehouse delivery.",
      "reportedWeightKg": 240.0, // optional
      "notes": "Farmer confirmed 240kg at bag loading.", // optional
      "contactPhone": "08012345678"
    }
    Response 201:
    {
      "success": true,
      "message": "Dispute filed successfully. Our team will review it shortly.",
      "data": {
        "disputeId": "6708d1e2f3a4b5c6d7e8f901",
        "logId": "6708c901a1b2c3d4e5f6a701",
        "reason": "Scale calibration mismatch on warehouse delivery.",
        "status": "open",
        "createdAt": "2026-10-10T09:15:00.000Z"
      }
    }


================================================================================
5. MARKETPLACE MODULE
================================================================================

Prefix: /api/v1/marketplace
Target Frontend Pages: `app/marketplace`, `app/product/[id]`

[15] DISCOVER LISTINGS (PUBLIC)
    GET /api/v1/marketplace/listings?pipeline=waste&category=rice+husks&page=1&limit=20
    Query Params (All optional):
      search:   keyword search in title and description
      category: string (e.g. "Yellow Maize", "Cassava Peels")
      pipeline: string ("fresh-produce" | "waste")
      zone:     string (e.g. "Kano-South", "Oyo-Central")
      minPrice: number
      maxPrice: number
      status:   "active" | "sold_out" | "archived" (default: "active")
      page:     number (default: 1)
      limit:    number (default: 20)
    Response 200:
    {
      "success": true,
      "data": {
        "items": [
          {
            "id": "6708a2b3c4d5e6f7a8b9c0d1",
            "title": "Industrial Grade Cassava Peels",
            "description": "Sun-dried cassava peels suitable for animal feed and starch processing.",
            "category": "Cassava Peels",
            "pipeline": "waste",
            "unit": "kg", // "kg" | "ton" | "bag"
            "pricePerUnit": 320,
            "currency": "NGN",
            "quantityAvailable": 12500,
            "minOrderQuantity": 500,
            "locationZone": "Oyo-Central",
            "photoUrls": ["https://storage.farmtry.com/listings/cassava.jpg"],
            "certificates": ["Phytosanitary Cert #9021"],
            "status": "active",
            "createdAt": "2026-10-08T12:00:00.000Z",
            "updatedAt": "2026-10-08T12:00:00.000Z"
          }
        ],
        "total": 1,
        "page": 1,
        "limit": 20
      }
    }

[16] GET LISTING DETAILS (PUBLIC)
    GET /api/v1/marketplace/listings/:id
    Response 200:
    {
      "success": true,
      "data": { ...ListingResponseDTO object... }
    }

[17] CREATE LISTING (ADMIN / STAFF)
    POST /api/v1/marketplace/listings
    Guard: authenticate + requireAdmin
    Request Body:
    {
      "title": "Sun-dried Maize Stalks",
      "description": "High fiber agricultural biomass for livestock feed and fuel pellets.",
      "category": "Maize Stalks",
      "pipeline": "waste",
      "unit": "kg",
      "pricePerUnit": 150,
      "currency": "NGN",
      "quantityAvailable": 8000,
      "minOrderQuantity": 200,
      "locationZone": "Kaduna-North",
      "photoUrls": ["https://storage.farmtry.com/listings/maize.jpg"],
      "certificates": ["Quality Grade A"]
    }
    Response 201:
    {
      "success": true,
      "data": { ...Created ListingResponseDTO object... }
    }

[18] UPDATE LISTING (ADMIN / STAFF)
    PATCH /api/v1/marketplace/listings/:id
    Guard: authenticate + requireAdmin
    Request Body: Partial<CreateListingDTO>
    Response 200:
    {
      "success": true,
      "data": { ...Updated ListingResponseDTO object... }
    }

[19] ARCHIVE / DELETE LISTING (ADMIN / STAFF)
    DELETE /api/v1/marketplace/listings/:id
    Guard: authenticate + requireAdmin
    Response 200:
    {
      "success": true,
      "message": "Listing archived successfully."
    }


================================================================================
6. BUYER MODULE (ORDERS, CART, WISHLIST)
================================================================================

Prefix: /api/v1/buyer
Target Frontend: `lib/buyer/store.ts`, `app/cart`, `app/checkout`, `app/wishlist`
Guard: authenticate + requireRole(UserRole.BUYER)

[20] REGISTER CORPORATE BUYER
    POST /api/v1/buyer/register
    Auth: None
    Request Body:
    {
      "fullName": "Amina Bello",
      "email": "procurement@lagosfeedmill.com",
      "password": "CorporatePassword2026!",
      "phone": "08022334455",
      "organizationName": "Lagos Feedmills PLC",
      "organizationType": "processor", // "factory" | "restaurant" | "processor" | "exporter" | "other"
      "contactPerson": "Amina Bello",
      "address": "Plot 12, Industrial Layout, Ikeja, Lagos",
      "zone": "Lagos-Industrial",
      "businessRegNumber": "RC-104928"
    }
    Response 201:
    {
      "success": true,
      "message": "Buyer registered successfully.",
      "data": {
        "userId": "6708e1f2a3b4c5d6e7f8a901",
        "fullName": "Amina Bello",
        "email": "procurement@lagosfeedmill.com",
        "role": "buyer",
        "status": "pending",
        "buyer": {
          "id": "buyer_6708e1f2a3b4",
          "organizationName": "Lagos Feedmills PLC",
          "organizationType": "processor"
        }
      }
    }

[21] GET BUYER PROFILE
    GET /api/v1/buyer/profile
    Response 200:
    {
      "success": true,
      "data": {
        "id": "buyer_6708e1f2a3b4",
        "fullName": "Amina Bello",
        "email": "procurement@lagosfeedmill.com",
        "phone": "08022334455",
        "organizationName": "Lagos Feedmills PLC",
        "organizationType": "processor",
        "contactPerson": "Amina Bello",
        "address": "Plot 12, Industrial Layout, Ikeja, Lagos",
        "zone": "Lagos-Industrial",
        "businessRegNumber": "RC-104928"
      }
    }

[22] GET BUYER DASHBOARD
    GET /api/v1/buyer/dashboard
    Response 200:
    {
      "success": true,
      "data": {
        "profile": { ...BuyerProfileDTO... },
        "stats": {
          "totalOrders": 12,
          "pendingOrders": 2,
          "completedOrders": 10,
          "totalSpent": 4820000,
          "cartItemCount": 3,
          "savedItemCount": 5
        },
        "recentOrders": [ ...OrderResponseDTO array... ]
      }
    }

[23] GET SHOPPING CART
    GET /api/v1/buyer/cart
    Response 200:
    {
      "success": true,
      "data": {
        "items": [
          {
            "listingId": "6708a2b3c4d5e6f7a8b9c0d1",
            "title": "Industrial Grade Cassava Peels",
            "category": "Cassava Peels",
            "unit": "kg",
            "pricePerUnit": 320,
            "quantity": 1000,
            "totalPrice": 320000,
            "quantityAvailable": 12500,
            "photoUrl": "https://storage.farmtry.com/listings/cassava.jpg"
          }
        ],
        "totalItems": 1,
        "totalAmount": 320000,
        "currency": "NGN"
      }
    }

[24] ADD / UPDATE CART ITEM
    POST /api/v1/buyer/cart/items
    Request Body:
    {
      "listingId": "6708a2b3c4d5e6f7a8b9c0d1",
      "quantity": 1500
    }
    Response 200:
    {
      "success": true,
      "message": "Cart item updated successfully.",
      "data": { ...CartDTO... }
    }

[25] REMOVE ITEM FROM CART
    DELETE /api/v1/buyer/cart/items/:listingId
    Response 200:
    {
      "success": true,
      "message": "Cart item removed successfully.",
      "data": { ...CartDTO... }
    }

[26] CLEAR CART
    DELETE /api/v1/buyer/cart
    Response 200:
    {
      "success": true,
      "message": "Cart cleared successfully."
    }

[27] GET WISHLIST
    GET /api/v1/buyer/wishlist
    Response 200:
    {
      "success": true,
      "data": {
        "items": [ ...array of saved listing summary objects... ],
        "total": 2
      }
    }

[28] TOGGLE WISHLIST ITEM
    POST /api/v1/buyer/wishlist/toggle
    Request Body:
    {
      "listingId": "6708a2b3c4d5e6f7a8b9c0d1"
    }
    Response 200:
    {
      "success": true,
      "message": "Item added to wishlist." // or "Item removed from wishlist."
    }

[29] CHECKOUT / CREATE ORDER
    POST /api/v1/buyer/orders
    Request Body:
    {
      "deliveryAddress": "Lagos Feedmills Warehouse 3, Ikeja, Lagos",
      "deliveryNotes": "Offloading bay 2, contact site manager on delivery.",
      "idempotencyKey": "order_uuid_12345",
      "items": [ // Optional: if omitted, checks out current cart
        { "listingId": "6708a2b3c4d5e6f7a8b9c0d1", "quantity": 1000 }
      ]
    }
    Response 201:
    {
      "success": true,
      "message": "Order placed successfully.",
      "data": {
        "id": "6708f3a4b5c6d7e8f9a0b1c2",
        "orderNumber": "ORD-20261012-8921",
        "items": [
          {
            "listingId": "6708a2b3c4d5e6f7a8b9c0d1",
            "title": "Industrial Grade Cassava Peels",
            "unit": "kg",
            "unitPrice": 320,
            "quantity": 1000,
            "totalPrice": 320000
          }
        ],
        "totalAmount": 320000,
        "currency": "NGN",
        "deliveryAddress": "Lagos Feedmills Warehouse 3, Ikeja, Lagos",
        "status": "pending",
        "paymentStatus": "pending",
        "createdAt": "2026-10-12T20:15:00.000Z"
      }
    }

[30] LIST BUYER ORDERS
    GET /api/v1/buyer/orders?status=pending&page=1&limit=20
    Query Params: status ("pending" | "confirmed" | "delivered" | "cancelled"), page, limit
    Response 200:
    {
      "success": true,
      "data": {
        "orders": [ ...OrderResponseDTO array... ],
        "total": 1,
        "page": 1,
        "limit": 20
      }
    }

[31] GET ORDER BY ID
    GET /api/v1/buyer/orders/:id
    Response 200:
    {
      "success": true,
      "data": { ...OrderResponseDTO... }
    }

[32] CANCEL ORDER
    PATCH /api/v1/buyer/orders/:id/cancel
    Response 200:
    {
      "success": true,
      "message": "Order cancelled successfully.",
      "data": { ...OrderResponseDTO with status: "cancelled"... }
    }


================================================================================
7. DEALER MODULE (INVENTORY, VOUCHERS, REDEMPTIONS)
================================================================================

Prefix: /api/v1/dealer
Target Frontend: `lib/dealer/store.ts`, `lib/dealer/reports.ts`
Guard: authenticate + requireRole(UserRole.DEALER)

[33] REGISTER AGRO-DEALER
    POST /api/v1/dealer/register
    Auth: None
    Request Body:
    {
      "fullName": "Kabir Musa",
      "email": "kabir@kanoagri.com",
      "password": "DealerPassword2026!",
      "phone": "08033445566",
      "businessName": "Kano Premier Inputs Ltd",
      "shopAddress": "Shop 4, Dawanau Market Road, Kano",
      "zone": "Kano-South"
    }
    Response 201:
    {
      "success": true,
      "message": "Dealer registered successfully. Please verify your account.",
      "data": {
        "userId": "6708a3b4c5d6e7f8a9b0c1d2",
        "fullName": "Kabir Musa",
        "email": "kabir@kanoagri.com",
        "role": "dealer",
        "status": "pending",
        "dealer": {
          "id": "dealer_6708a3b4c5d6",
          "businessName": "Kano Premier Inputs Ltd",
          "kycStatus": "pending"
        }
      }
    }

[34] GET DEALER PROFILE
    GET /api/v1/dealer/profile
    Response 200:
    {
      "success": true,
      "data": {
        "id": "dealer_6708a3b4c5d6",
        "fullName": "Kabir Musa",
        "email": "kabir@kanoagri.com",
        "phone": "08033445566",
        "businessName": "Kano Premier Inputs Ltd",
        "shopAddress": "Shop 4, Dawanau Market Road, Kano",
        "zone": "Kano-South",
        "kycStatus": "approved"
      }
    }

[35] VALIDATE VOUCHER (LOOKUP BEFORE REDEEMING)
    POST /api/v1/dealer/validate-otp
    Request Body:
    {
      "code": "VCH-2026-9812" // OR "otp"
    }
    Response 200:
    {
      "success": true,
      "message": "Voucher is valid.",
      "data": {
        "code": "VCH-2026-9812",
        "farmerPhone": "08011223344",
        "amount": 25000,
        "currency": "NGN",
        "status": "active", // "active" | "redeemed" | "expired"
        "expiresAt": "2026-11-01T00:00:00.000Z"
      }
    }

[36] GET VOUCHER BY CODE
    GET /api/v1/dealer/vouchers/:code
    Response 200:
    {
      "success": true,
      "data": { ...VoucherDTO object... }
    }

[37] REDEEM VOUCHER
    POST /api/v1/dealer/redeem
    Request Body:
    {
      "code": "VCH-2026-9812",
      "farmerPhone": "08011223344"
    }
    Response 201:
    {
      "success": true,
      "message": "Voucher redeemed successfully.",
      "data": {
        "reference": "TXN-RED-20261012-7819",
        "voucherCode": "VCH-2026-9812",
        "farmerPhone": "08011223344",
        "amount": 25000,
        "currency": "NGN",
        "status": "completed",
        "createdAt": "2026-10-12T20:20:00.000Z"
      }
    }

[38] GET REDEMPTION RECEIPT
    GET /api/v1/dealer/receipts/:reference
    Response 200:
    {
      "success": true,
      "data": {
        "reference": "TXN-RED-20261012-7819",
        "voucherCode": "VCH-2026-9812",
        "farmerPhone": "08011223344",
        "amount": 25000,
        "currency": "NGN",
        "status": "completed",
        "createdAt": "2026-10-12T20:20:00.000Z"
      }
    }

[39] GET DEALER TRANSACTIONS
    GET /api/v1/dealer/transactions?page=1&limit=20
    Response 200:
    {
      "success": true,
      "data": {
        "transactions": [ ...TransactionDTO array... ],
        "total": 1,
        "page": 1,
        "limit": 20
      }
    }


================================================================================
8. FARMER MODULE (INTAKES, PRODUCE, WALLET VOUCHERS)
================================================================================

Prefix: /api/v1/farmer
Guard: authenticate + requireRole(UserRole.FARMER)

[40] REGISTER FARMER
    POST /api/v1/farmer/register
    Auth: None
    Request Body:
    {
      "fullName": "Babatunde Alabi",
      "email": "babatunde@farmtry.com",
      "password": "FarmerPassword2026!",
      "phone": "08055667788",
      "farmName": "Alabi Mixed Farms",
      "farmLocation": "Km 14, Oyo-Iseyin Road, Oyo State",
      "zone": "Oyo-Central",
      "farmSizeHectares": 4.5,
      "primaryCrops": ["Cassava", "Maize"],
      "cooperativeName": "Oyo Farmers Union"
    }
    Response 201:
    {
      "success": true,
      "message": "Farmer registered successfully.",
      "data": {
        "userId": "6708b4c5d6e7f8a9b0c1d2e3",
        "fullName": "Babatunde Alabi",
        "email": "babatunde@farmtry.com",
        "role": "farmer",
        "status": "pending",
        "farmer": {
          "id": "farmer_6708b4c5d6e7",
          "farmName": "Alabi Mixed Farms",
          "farmLocation": "Km 14, Oyo-Iseyin Road, Oyo State",
          "zone": "Oyo-Central"
        }
      }
    }

[41] GET FARMER PROFILE
    GET /api/v1/farmer/profile
    Response 200:
    {
      "success": true,
      "data": {
        "id": "farmer_6708b4c5d6e7",
        "fullName": "Babatunde Alabi",
        "email": "babatunde@farmtry.com",
        "phone": "08055667788",
        "farmName": "Alabi Mixed Farms",
        "farmLocation": "Km 14, Oyo-Iseyin Road, Oyo State",
        "zone": "Oyo-Central",
        "farmSizeHectares": 4.5,
        "primaryCrops": ["Cassava", "Maize"],
        "cooperativeName": "Oyo Farmers Union",
        "walletBalance": 85000,
        "totalProduceSubmittedKg": 3200,
        "createdAt": "2026-10-09T10:00:00.000Z"
      }
    }

[42] GET FARMER DASHBOARD
    GET /api/v1/farmer/dashboard
    Response 200:
    {
      "success": true,
      "data": {
        "profile": { ...FarmerProfileDTO... },
        "stats": {
          "totalIntakes": 8,
          "totalWeightKg": 3200,
          "walletBalance": 85000,
          "activeVouchersCount": 2,
          "activeVouchersTotalVal": 50000
        },
        "recentLogs": [ ...LogResponseDTO array... ],
        "activeVouchers": [ ...FarmerVoucherDTO array... ]
      }
    }

[43] GET FARMER PRODUCE INTAKE LOGS
    GET /api/v1/farmer/logs?status=verified&page=1&limit=20
    Response 200:
    {
      "success": true,
      "data": {
        "logs": [ ...LogResponseDTO array... ],
        "total": 8,
        "page": 1,
        "limit": 20
      }
    }

[44] GET FARMER WALLET VOUCHERS
    GET /api/v1/farmer/vouchers?status=active&page=1&limit=20
    Response 200:
    {
      "success": true,
      "data": {
        "vouchers": [
          {
            "id": "6708c5d6e7f8a9b0c1d2e3f4",
            "code": "VCH-2026-9812",
            "farmerPhone": "08055667788",
            "amount": 25000,
            "currency": "NGN",
            "status": "active",
            "expiresAt": "2026-11-01T00:00:00.000Z",
            "createdAt": "2026-10-10T14:00:00.000Z"
          }
        ],
        "total": 1,
        "page": 1,
        "limit": 20
      }
    }

[45] GET FARMER VOUCHER BY CODE
    GET /api/v1/farmer/vouchers/:code
    Response 200:
    {
      "success": true,
      "data": { ...FarmerVoucherDTO... }
    }


================================================================================
9. ADMIN & SUPERADMIN MODULE (KYC, USERS, DISPUTES, AUDIT, SEEDING)
================================================================================

Prefix: /api/v1/admin
Target Frontend: `lib/admin/service.ts`, `app/admin`
Guard: authenticate + requireAdmin (Superadmin, Root, or Admin)

[46] GET AGGREGATOR KYC QUEUE
    GET /api/v1/admin/kyc/aggregators?page=1&limit=20
    Response 200:
    {
      "success": true,
      "message": "Aggregator KYC queue fetched.",
      "data": {
        "items": [
          {
            "id": "agg_6708b1a2c3d4",
            "userId": "6708b1a2c3d4e5f6a7b8c901",
            "fullName": "Chidi Okonkwo",
            "email": "chidi@farmtry.com",
            "phone": "08012345678",
            "zone": "Oyo-Central",
            "kycStatus": "pending",
            "governmentIdType": "nin",
            "governmentIdNumber": "12345678901",
            "governmentIdPhotoUrl": "https://storage.farmtry.com/id/123.jpg",
            "guarantorPhone": "08099887766",
            "submittedAt": "2026-10-10T08:00:00.000Z"
          }
        ],
        "total": 1,
        "page": 1,
        "limit": 20
      }
    }

[47] APPROVE AGGREGATOR KYC
    PATCH /api/v1/admin/kyc/aggregators/:id/approve
    Response 200:
    {
      "success": true,
      "message": "Aggregator KYC approved.",
      "data": {
        "id": "agg_6708b1a2c3d4",
        "kycStatus": "approved",
        "auditRef": "6708d7e8f9a0b1c2d3e4f501",
        "message": "Aggregator KYC approved."
      }
    }

[48] REJECT AGGREGATOR KYC
    PATCH /api/v1/admin/kyc/aggregators/:id/reject
    Request Body:
    {
      "reason": "Government ID photo is blurry and illegible." // Min 10 characters
    }
    Response 200:
    {
      "success": true,
      "message": "Aggregator KYC rejected.",
      "data": {
        "id": "agg_6708b1a2c3d4",
        "kycStatus": "rejected",
        "auditRef": "6708d7e8f9a0b1c2d3e4f502",
        "message": "Aggregator KYC rejected."
      }
    }

[49] GET DEALER KYC QUEUE
    GET /api/v1/admin/kyc/dealers?page=1&limit=20
    Response 200:
    {
      "success": true,
      "message": "Dealer KYC queue fetched.",
      "data": {
        "items": [
          {
            "id": "dealer_6708a3b4c5d6",
            "userId": "6708a3b4c5d6e7f8a9b0c1d2",
            "fullName": "Kabir Musa",
            "email": "kabir@kanoagri.com",
            "phone": "08033445566",
            "zone": "Kano-South",
            "businessName": "Kano Premier Inputs Ltd",
            "shopAddress": "Shop 4, Dawanau Market Road, Kano",
            "kycStatus": "pending",
            "submittedAt": "2026-10-10T09:00:00.000Z"
          }
        ],
        "total": 1,
        "page": 1,
        "limit": 20
      }
    }

[50] APPROVE DEALER KYC
    PATCH /api/v1/admin/kyc/dealers/:id/approve
    Response 200:
    {
      "success": true,
      "message": "Dealer KYC approved.",
      "data": {
        "id": "dealer_6708a3b4c5d6",
        "kycStatus": "approved",
        "auditRef": "6708d7e8f9a0b1c2d3e4f503",
        "message": "Dealer KYC approved."
      }
    }

[51] REJECT DEALER KYC
    PATCH /api/v1/admin/kyc/dealers/:id/reject
    Request Body:
    {
      "reason": "Shop address does not match agricultural supply registry."
    }
    Response 200:
    {
      "success": true,
      "message": "Dealer KYC rejected.",
      "data": {
        "id": "dealer_6708a3b4c5d6",
        "kycStatus": "rejected",
        "auditRef": "6708d7e8f9a0b1c2d3e4f504",
        "message": "Dealer KYC rejected."
      }
    }

[52] LIST USERS
    GET /api/v1/admin/users?role=aggregator&status=active&page=1&limit=20
    Query Params: role ("aggregator" | "dealer" | "buyer" | "farmer" | "admin"), status, page, limit
    Response 200:
    {
      "success": true,
      "message": "Users fetched.",
      "data": {
        "users": [
          {
            "id": "6708b1a2c3d4e5f6a7b8c901",
            "fullName": "Chidi Okonkwo",
            "email": "chidi@farmtry.com",
            "phone": "08012345678",
            "role": "aggregator",
            "status": "active",
            "lastLoginAt": "2026-10-12T19:30:00.000Z",
            "createdAt": "2026-10-10T08:00:00.000Z"
          }
        ],
        "total": 1,
        "page": 1,
        "limit": 20
      }
    }

[53] SUSPEND USER
    PATCH /api/v1/admin/users/:id/suspend
    Request Body:
    {
      "reason": "Repeated fraudulent weight entries." // Optional
    }
    Response 200:
    {
      "success": true,
      "message": "User account suspended.",
      "data": {
        "id": "6708b1a2c3d4e5f6a7b8c901",
        "status": "suspended",
        "auditRef": "6708d7e8f9a0b1c2d3e4f505",
        "message": "User account suspended."
      }
    }

[54] ACTIVATE USER
    PATCH /api/v1/admin/users/:id/activate
    Response 200:
    {
      "success": true,
      "message": "User account activated.",
      "data": {
        "id": "6708b1a2c3d4e5f6a7b8c901",
        "status": "active",
        "auditRef": "6708d7e8f9a0b1c2d3e4f506",
        "message": "User account activated."
      }
    }

[55] LIST DISPUTES
    GET /api/v1/admin/disputes?status=open&page=1&limit=20
    Query Params: status ("open" | "under_review" | "resolved" | "dismissed"), page, limit
    Response 200:
    {
      "success": true,
      "message": "Disputes fetched.",
      "data": {
        "disputes": [
          {
            "id": "6708d1e2f3a4b5c6d7e8f901",
            "aggregatorId": "agg_6708b1a2c3d4",
            "logId": "6708c901a1b2c3d4e5f6a701",
            "reason": "Scale calibration mismatch on warehouse delivery.",
            "reportedWeightKg": 240.0,
            "notes": "Farmer confirmed 240kg at bag loading.",
            "contactPhone": "08012345678",
            "status": "open",
            "createdAt": "2026-10-10T09:15:00.000Z"
          }
        ],
        "total": 1,
        "page": 1,
        "limit": 20
      }
    }

[56] RESOLVE DISPUTE
    PATCH /api/v1/admin/disputes/:id/resolve
    Request Body:
    {
      "notes": "Adjustment made to 240kg in farmer intake record." // Optional
    }
    Response 200:
    {
      "success": true,
      "message": "Dispute resolved.",
      "data": {
        "id": "6708d1e2f3a4b5c6d7e8f901",
        "status": "resolved",
        "auditRef": "6708d7e8f9a0b1c2d3e4f507",
        "message": "Dispute resolved."
      }
    }

[57] DISMISS DISPUTE
    PATCH /api/v1/admin/disputes/:id/dismiss
    Request Body:
    {
      "notes": "Weight confirmed accurate by certified weighbridge slip." // Optional
    }
    Response 200:
    {
      "success": true,
      "message": "Dispute dismissed.",
      "data": {
        "id": "6708d1e2f3a4b5c6d7e8f901",
        "status": "dismissed",
        "auditRef": "6708d7e8f9a0b1c2d3e4f508",
        "message": "Dispute dismissed."
      }
    }

[58] LIST AUDIT LOGS
    GET /api/v1/admin/audit-logs?action=approve_aggregator_kyc&page=1&limit=20
    Query Params: action, targetType ("user" | "aggregator" | "dealer" | "dispute"), targetId, page, limit
    Response 200:
    {
      "success": true,
      "message": "Audit logs fetched.",
      "data": {
        "logs": [
          {
            "id": "6708d7e8f9a0b1c2d3e4f501",
            "adminId": "670899887766554433221100",
            "action": "approve_aggregator_kyc",
            "targetType": "aggregator",
            "targetId": "agg_6708b1a2c3d4",
            "details": { "previousStatus": "pending" },
            "createdAt": "2026-10-12T19:45:00.000Z"
          }
        ],
        "total": 1,
        "page": 1,
        "limit": 20
      }
    }

[59] BOOTSTRAP SUPERADMIN CLI
    Command: npm run seed:superadmin
    Env Config (.env.dev / .env.prod):
      SUPERADMIN_EMAIL=superadmin@farmtry.com
      SUPERADMIN_PASSWORD=SuperAdmin#2026!
      SUPERADMIN_NAME="FarmTry Super Admin"
      SUPERADMIN_PHONE=+2348000000001
    Behavior:
      - Idempotent: Skips if Superadmin already exists.
      - Sets role: UserRole.SUPER_ADMIN and status: UserStatus.ACTIVE.

================================================================================
END OF CONTRACT HANDOFF REFERENCE
================================================================================
