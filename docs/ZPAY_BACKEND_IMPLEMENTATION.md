# ZPAY --- Backend Implementation Specification for OpenCode

## 0. Document Purpose

This document is the execution contract for the ZPAY backend. It
consolidates the approved ZPAY workflow, UI/UX requirements that affect
backend contracts, existing backend specification, OpenCode master
rules, and execution phases.

The backend must support one connected ZPAY mobile application.

### Active product services

1.  Electricity
2.  Airtime
3.  Data
4.  TV
5.  WAEC
6.  JAMB
7.  NECO

Strictly out of scope:

-   Travel & Booking
-   Installation
-   Solar
-   Jobs

Removed services must not have active service registration, public
endpoints, or UI-facing service discovery.

------------------------------------------------------------------------

## 1. Backend Authority

The backend is the source of truth for:

-   identity
-   authentication state
-   wallet balances
-   payment authorization
-   fees and authoritative totals
-   transaction state
-   service transaction state
-   references
-   receipts
-   notifications
-   audit history

Never trust client-provided balances, final totals, provider fees,
transaction references, or service completion state.

------------------------------------------------------------------------

## 2. Source-of-Truth Rules

Use:

1.  Latest explicit ZPAY product rules.
2.  Latest approved UI/UX screenshots for visual-dependent contracts.
3.  Latest Draw.io workflow for business/process flow.
4.  Older material only when non-conflicting.

Do not invent external provider details, credentials, fees, APIs,
examination rules, or physical requirements that are not supplied.

Where a requirement is unknown, create a configurable integration
boundary and mark the unresolved provider-specific requirement.

------------------------------------------------------------------------

## 3. Phase 0 --- Repository and Backend Architecture Reconnaissance

Before changing code, inspect:

-   project structure
-   runtime
-   framework
-   database
-   ORM/query layer
-   migrations
-   authentication
-   validation
-   API conventions
-   logging
-   configuration
-   environment management
-   tests
-   existing service integrations
-   existing payment/wallet modules
-   reusable domain modules

Do not assume Node.js, NestJS, Express, Laravel, PostgreSQL, MySQL,
MongoDB, or another stack.

OpenCode must determine whether the detected stack is appropriate for
ZPAY and report:

-   detected architecture
-   reusable modules
-   risks
-   gaps
-   recommended changes, if any
-   unresolved requirements

Do not replace a functioning backend merely for convenience.

### Acceptance

Repository map and backend implementation plan produced before feature
work.

------------------------------------------------------------------------

## 4. Phase 1 --- Backend Foundation

Establish or preserve:

-   module boundaries
-   configuration management
-   environment separation
-   validation
-   error handling
-   logging
-   database connection
-   migration strategy
-   test setup
-   API versioning/conventions if already established

### Recommended domain boundaries

-   Auth
-   Users
-   Profiles
-   KYC
-   Security/PIN
-   Wallet
-   Funding
-   Services
-   Electricity
-   Airtime
-   Data
-   TV
-   WAEC
-   JAMB
-   NECO
-   Transactions
-   Receipts
-   Notifications
-   Audit Logs

------------------------------------------------------------------------

## 5. Phase 2 --- Data Model and Persistence

Create/preserve entities or equivalent models for at least:

-   User
-   Profile
-   KYC
-   Wallet
-   Wallet ledger/entries
-   Funding
-   Transaction
-   Receipt
-   Notification
-   AuditLog
-   service-specific application/registration records
-   provider/configuration records as appropriate

### Minimum transaction data

-   id
-   unique server-generated reference
-   userId
-   walletId
-   serviceType
-   serviceName
-   amount
-   fee
-   total
-   currency
-   paymentMethod
-   status
-   providerReference when applicable
-   customerIdentifier when applicable
-   metadata
-   createdAt
-   updatedAt

Migrations must be repeatable and safe.

------------------------------------------------------------------------

## 6. Phase 3 --- Authentication

Support the approved authentication flow:

-   Login
-   Sign Up
-   OTP verification
-   PIN creation/management
-   authentication result
-   session/token handling

### Security

-   never store raw passwords/PINs
-   securely hash secrets
-   rate-limit authentication
-   expire OTPs
-   prevent brute-force attempts
-   issue secure sessions/tokens
-   revoke sessions on logout where appropriate
-   do not expose sensitive fields in ordinary responses

Do not invent unsupported authentication rules.

------------------------------------------------------------------------

## 7. Phase 4 --- User, Profile and KYC

Keep stable identity data separate from user-editable profile data.

Keep KYC separate because it has its own lifecycle.

Do not expose sensitive KYC fields in ordinary profile responses.

Support verification/tier state required by the Me screen without
hardcoding demo values.

------------------------------------------------------------------------

## 8. Phase 5 --- Security and PIN

Provide protected handling for transaction PINs and other sensitive
actions.

Requirements:

-   never store raw PIN
-   secure hashing/verification
-   rate limiting/lockout according to approved architecture
-   no PIN in logs
-   no PIN in API responses
-   sensitive actions require appropriate authorization

------------------------------------------------------------------------

## 9. Phase 6 --- Wallet

Wallet is ledger-backed.

Minimum concepts:

-   wallet
-   available balance
-   currency
-   status
-   timestamps
-   ledger/entries where applicable

Rules:

-   never trust client balance
-   calculate authoritative balance on server
-   persist balance changes atomically
-   support concurrency-safe debit/credit
-   prevent negative balances unless an explicitly approved financial
    model requires otherwise

------------------------------------------------------------------------

## 10. Phase 7 --- Wallet Funding

Flow:

`Create funding intent → Select funding method → Review → Confirm → Provider/gateway processing → Verify result → Credit wallet → Create funding transaction → Return updated balance`

Funding must be idempotent.

Gateway callbacks/webhooks must not credit the same funding operation
twice.

Until real gateway credentials/contracts are supplied, use sandbox/mock
adapters behind the same integration interface that production providers
will implement.

------------------------------------------------------------------------

## 11. Phase 8 --- Common Transaction Engine

Every money-moving service operation should use the shared transaction
engine.

Statuses must support at minimum:

-   pending
-   successful
-   failed
-   cancelled where required

Every transaction gets a unique server-generated reference.

History must be paginated.

Support:

-   service filtering
-   status filtering
-   transaction detail lookup
-   receipt lookup

Date grouping is a frontend presentation concern.

------------------------------------------------------------------------

## 12. Phase 9 --- Common Payment Algorithm

Server-side sequence:

1.  Authenticate user.
2.  Validate service request.
3.  Validate customer/service identifier.
4.  Calculate authoritative amount.
5.  Calculate authoritative fee.
6.  Calculate total.
7.  Load authoritative wallet.
8.  Lock/check available balance.
9.  Create transaction in pending state.
10. Debit/hold funds according to the approved financial model.
11. Call provider adapter.
12. Process provider response.
13. Finalize service/payment transaction state.
14. Commit/settle balance change.
15. Create receipt data.
16. Return final transaction state.

If provider processing is asynchronous:

-   retain pending state
-   reconcile using webhook and/or status polling
-   never mark success based only on client-side assumptions

------------------------------------------------------------------------

## 13. Phase 10 --- Idempotency and Duplicate Protection

Every money-moving operation must support idempotency.

Accept an idempotency key where the API convention supports it.

Same user + same operation key must not create multiple charges.

Network retries and repeated button taps must be safe.

Test concurrency and retry scenarios.

------------------------------------------------------------------------

## 14. Phase 11 --- Insufficient Balance

Before payment:

-   obtain authoritative balance
-   calculate authoritative total
-   reject if balance \< total

Return structured error data containing:

-   current balance
-   required amount
-   amount needed

Do not debit partial funds.

Frontend must be able to display the approved Insufficient Wallet
Balance state.

------------------------------------------------------------------------

## 15. Phase 12 --- Provider Adapter Architecture

Build provider integration interfaces independently from
provider-specific implementations.

Required model:

`ZPAY domain/service → Provider interface → Provider adapter → sandbox/mock provider or real provider`

Rules:

-   provider credentials belong only on backend
-   provider names, fees and authoritative service data come from
    backend/provider configuration
-   no provider secret in frontend
-   sandbox/mock adapters must behave like real adapters
-   real credentials can be introduced later without redesigning the
    service domain
-   provider-specific details must be configurable
-   do not invent external provider APIs

Each adapter should expose the operations required by its service,
including validation/verification, purchase/registration, status lookup
and reconciliation where applicable.

------------------------------------------------------------------------

## 16. Phase 13 --- Electricity

Required:

-   provider
-   meter number
-   verification
-   amount
-   payment
-   result

Possible repository-compatible endpoints:

-   `GET /services/electricity/providers`
-   `POST /services/electricity/verify-meter`
-   `POST /services/electricity/pay`

Do not trust client-provided provider names or fees.

The provider adapter must support sandbox/mock execution until real
credentials are supplied.

Record:

-   provider
-   meter/customer identifier
-   amount
-   fee
-   total
-   provider reference when available
-   ZPAY transaction reference
-   final state
-   provider response metadata appropriate for audit/reconciliation

------------------------------------------------------------------------

## 17. Phase 14 --- Airtime

Required:

-   network
-   phone
-   amount
-   payment
-   result

Possible endpoints:

-   `GET /services/airtime/networks`
-   `POST /services/airtime/validate`
-   `POST /services/airtime/purchase`

Validate phone/network/amount server-side.

Use sandbox/mock adapter until real provider credentials are supplied.

------------------------------------------------------------------------

## 18. Phase 15 --- Data

Required:

-   network
-   phone
-   data bundle
-   payment
-   result

Possible endpoints:

-   `GET /services/data/networks`
-   `GET /services/data/bundles`
-   `POST /services/data/validate`
-   `POST /services/data/purchase`

Bundle and pricing data must be authoritative on the backend.

Use sandbox/mock adapter until real provider credentials are supplied.

------------------------------------------------------------------------

## 19. Phase 16 --- TV

Required:

-   provider
-   Smartcard/IUC
-   verification where applicable
-   package
-   payment
-   result

Possible endpoints:

-   `GET /services/tv/providers`
-   `POST /services/tv/verify`
-   `GET /services/tv/packages`
-   `POST /services/tv/subscribe`

Provider/package prices must be authoritative server-side.

Use sandbox/mock adapter until credentials are supplied.

------------------------------------------------------------------------

## 20. Phase 17 --- WAEC

### Functional flow

`Registration → Candidate Details → Identification/NIN → Examination Details → Subjects → Passport Photograph where required → Review → Registration Fee → Payment → Registration Confirmation → Next Steps`

Keep the WAEC registration/application record separate from the payment
transaction.

Payment state and registration state are independent.

### Example application states from the approved specification

-   draft
-   awaiting_payment
-   payment_pending
-   paid
-   registration_pending
-   registered
-   failed

A successful payment does not automatically mean registration is
complete unless the external registration operation succeeds.

Provider details must be configurable and must not be invented.

Use sandbox/mock provider adapter until credentials/contracts are
supplied.

------------------------------------------------------------------------

## 21. Phase 18 --- JAMB

Required:

-   service selection
-   candidate details
-   NIN
-   candidate verification
-   JAMB profile information
-   examination details
-   institution
-   course
-   subjects
-   review
-   payment
-   confirmation

Keep payment status separate from application/registration status.

Do not invent JAMB provider API details. Implement the adapter contract
and sandbox/mock provider until credentials/contracts are supplied.

------------------------------------------------------------------------

## 22. Phase 19 --- NECO

Required:

-   registration
-   candidate details
-   NIN
-   examination details
-   subjects
-   passport photograph where required
-   review
-   registration fee
-   payment
-   confirmation

Where biometric capture or registration-centre attendance is required,
represent it as a separate status/next-step concept.

Do not claim digital payment alone completes a physical biometric
requirement.

Use sandbox/mock adapter until credentials/contracts are supplied.

------------------------------------------------------------------------

## 23. Phase 20 --- Service Registry

Use an authoritative server-side registry.

Active services exactly:

-   ELECTRICITY
-   AIRTIME
-   DATA
-   TV
-   WAEC
-   JAMB
-   NECO

Removed services must never be returned by active service discovery.

Do not create UI-facing endpoints for Travel, Installation, Solar or
Jobs.

------------------------------------------------------------------------

## 24. Phase 21 --- Receipt Service

Generate receipts from finalized real transactions.

Minimum receipt data:

-   ZPAY
-   Transaction Successful
-   service
-   amount
-   fee
-   total
-   date/time
-   reference
-   customer/service identifier
-   payment method
-   status

Download/share may be implemented through backend-generated documents or
frontend rendering according to the detected architecture, but the
source data must be authoritative transaction data.

------------------------------------------------------------------------

## 25. Phase 22 --- Notifications

Support notifications for:

-   successful payments
-   failed payments
-   pending payments
-   wallet funding
-   service completion
-   registration/application events

Notification record:

-   id
-   userId
-   type
-   title
-   message
-   readAt
-   createdAt
-   metadata

------------------------------------------------------------------------

## 26. Phase 23 --- Audit Logging

Audit money-moving and security-sensitive events:

-   login attempts
-   OTP events
-   PIN/security changes
-   wallet funding
-   payment creation
-   payment finalization
-   transaction status changes
-   KYC changes
-   logout/security events
-   provider callbacks/reconciliation where appropriate

Never store raw PINs or secrets in audit logs.

------------------------------------------------------------------------

## 27. Phase 24 --- API Error Contract

Use a consistent structure such as:

-   code
-   message
-   fieldErrors when applicable
-   requestId
-   retryable

Frontend must distinguish:

-   validation
-   authentication
-   authorization
-   insufficient funds
-   provider failure
-   network/provider timeout
-   unexpected server error

Never leak secrets or sensitive provider responses.

------------------------------------------------------------------------

## 28. Phase 25 --- Security and Reliability

Required:

-   input validation
-   authentication guards
-   authorization
-   rate limiting
-   secure secret storage
-   encryption in transit
-   secure password/PIN hashing
-   OTP expiration
-   idempotency
-   database transactions
-   audit logging
-   webhook verification
-   provider credential isolation
-   safe error messages
-   concurrency-safe wallet operations

------------------------------------------------------------------------

## 29. Phase 26 --- Testing

Test:

-   authentication
-   OTP
-   authorization
-   PIN handling
-   wallet funding
-   wallet balance calculation
-   insufficient funds
-   transaction creation
-   idempotency
-   duplicate requests
-   concurrency
-   provider failures
-   pending transactions
-   provider timeout
-   reconciliation
-   receipts
-   service-specific validation
-   notification creation
-   removed-service exclusion

Money-related tests must include retry and concurrency scenarios.

Every provider adapter must have sandbox/mock tests independent of real
credentials.

------------------------------------------------------------------------

## 30. Phase 27 --- Integration and Contract Verification

Verify frontend/backend contracts for:

-   auth
-   user/profile/KYC
-   wallet
-   funding
-   service discovery
-   provider discovery
-   validation
-   payment
-   transaction history
-   transaction details
-   receipts
-   notifications

Confirm that the backend returns dynamic values and the frontend never
relies on screenshot demo data.

------------------------------------------------------------------------

## 31. Phase 28 --- Hardening

Run:

-   backend tests
-   integration tests
-   build
-   lint/type checks where supported
-   migration verification
-   API contract checks
-   duplicate-payment tests
-   insufficient-balance tests
-   provider-failure tests
-   pending/reconciliation tests
-   security checks

Confirm:

-   wallet mutations are atomic
-   money-moving operations are idempotent
-   transaction references are unique
-   receipts represent real transactions
-   service states remain separate from payment states
-   provider boundaries are explicit
-   removed services are absent

------------------------------------------------------------------------

## 32. Phase 29 --- Final Backend Acceptance

Do not declare completion because endpoints respond.

Verify:

-   secure authentication
-   user/profile/KYC separation
-   wallet funding
-   authoritative wallet balance
-   shared payment engine
-   all seven services
-   sandbox/mock provider integrations
-   future real-provider adapter boundary
-   idempotency
-   duplicate-charge protection
-   transaction history
-   transaction details
-   receipts
-   notifications
-   audit logs
-   error contract
-   registration/payment state separation for WAEC/JAMB/NECO
-   NECO physical/biometric next-step representation where applicable
-   no removed services
-   no invented provider credentials/API assumptions

### OpenCode execution rule

Execute one phase at a time:

1.  Read the relevant phase.
2.  Inspect existing code.
3.  Make a short implementation plan.
4.  Implement.
5.  Run tests/build/lint.
6.  Inspect changed files.
7.  Verify acceptance criteria.
8.  Report completed work and unresolved items.
9.  Only then proceed.

Never implement the whole backend in one uncontrolled pass.

------------------------------------------------------------------------

## 33. Backend Definition of Done

The backend is complete only when it is secure, persistent,
transactional, idempotent, testable, connected to the frontend through
explicit contracts, supports all seven active services through reusable
service/payment architecture, uses sandbox/mock providers until real
credentials/contracts are supplied, and preserves independent
payment/service registration states.
