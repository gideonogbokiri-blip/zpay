# ZPAY --- Frontend Implementation Specification for OpenCode

## 0. Document Purpose

This document is the execution contract for the ZPAY mobile frontend. It
consolidates the approved ZPAY UI/UX references, workflow documentation,
existing frontend specification, master OpenCode specification, and
execution phases into one frontend-only implementation document.

The objective is to build one connected ZPAY application, not isolated
mock screens.

### Product scope

Active services only:

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

Do not expose removed services in UI, navigation, service discovery,
filters, settings, empty states, routes, or components.

------------------------------------------------------------------------

## 1. Source-of-Truth Rules

Use the project sources in this order:

1.  Latest explicit ZPAY product rules.
2.  Latest approved UI/UX screenshots.
3.  Latest Draw.io workflow structure.
4.  Older material only when it does not conflict.

### Visual rule

Reproduce the supplied UI/UX structure faithfully. Do not redesign,
modernize, rearrange, simplify, or replace it with a generic fintech
template.

### Functional rule

Use the workflow/Draw.io material for screen transitions, decisions,
service steps, payment flow, and completion states.

### Technical rule

Inspect the existing repository before choosing or changing frontend
technology.

If a requirement is not established by the approved sources, mark it
unresolved. Do not invent a business rule.

------------------------------------------------------------------------

## 2. Phase 0 --- Repository Reconnaissance

### Objective

Understand the existing project before implementation.

### Inspect

-   project structure
-   frontend framework/runtime
-   routing/navigation
-   state management
-   API client
-   styling/theme system
-   component library
-   asset/icon pipeline
-   forms/validation
-   authentication
-   environment configuration
-   testing framework
-   build/lint/type-check scripts
-   existing screens
-   existing service modules
-   existing API models
-   existing reusable components

### Stack decision

Do not assume React Native, Flutter, Expo, Ionic, Kotlin, Swift, or
another framework.

OpenCode must report:

-   detected stack
-   why it is suitable or unsuitable
-   what can be reused
-   risks
-   unresolved questions

Do not replace an existing architecture merely for convenience.

If the repository is empty, stop after reconnaissance and report the
missing stack decision before creating a large architecture.

### Acceptance

A repository map and implementation plan exist. No architecture is
replaced during this phase.

------------------------------------------------------------------------

## 3. Phase 1 --- Design System and Visual Fidelity Foundation

Centralize:

-   colors
-   typography
-   spacing
-   radii
-   borders
-   icon sizes
-   touch targets
-   elevation/shadow rules
-   status colors

### Reference visual language

-   very dark authenticated fintech background where shown
-   dark elevated surfaces
-   cyan primary action/active navigation
-   light blue/lavender brand accents
-   white/light-gray primary text
-   green success
-   red/dark-red destructive actions
-   rounded cards and controls
-   subtle borders
-   prominent financial amounts
-   Nigerian Naira formatting: ₦ / NGN
-   technical/monospaced-looking typography in transaction/payment areas
    where shown

Reference token values from the existing specification:

-   background approximately `rgb(16,20,21)`
-   surface approximately `rgb(29,32,34)`
-   accent cyan approximately `rgb(0,244,254)`

Do not scatter raw values through the codebase.

### Screenshot-specific rule

The supplied Services screenshot is visibly a light/white content
surface while the History, payment, receipt and Me references use the
dark visual treatment.

Preserve the approved screen-specific appearance rather than forcing
every screen into one theme. If the repository contains an explicit
theme architecture, implement this as a deliberate screen/theme variant.

### Acceptance

Shared components visually align with the supplied references at the
target mobile dimensions.

------------------------------------------------------------------------

## 4. Phase 2 --- Authentication

Implement only the approved authentication architecture:

-   Welcome/Landing
-   Login
-   Sign Up
-   OTP verification
-   PIN creation/management
-   authentication error states
-   session/auth guards

Do not invent authentication rules where the source is silent.

### Acceptance

Unauthenticated users cannot access protected application screens. Auth
state survives expected navigation/reload behaviour according to the
existing architecture.

------------------------------------------------------------------------

## 5. Phase 3 --- Authenticated Shell

Primary navigation:

-   Home
-   Service
-   History
-   Me

Bottom navigation remains visually consistent across authenticated
screens.

### Active tab

-   cyan icon
-   cyan label
-   clear active indication

### Inactive tab

-   muted icon
-   muted label

Focused service/payment flows may hide bottom navigation where the
reference design does so, but back navigation must remain predictable.

### Header elements where shown

-   ZPAY branding
-   avatar/profile
-   notification icon
-   greeting

### Acceptance

Home ↔ Service ↔ History ↔ Me works without broken navigation.

------------------------------------------------------------------------

## 6. Phase 4 --- Home / Dashboard

Implement the supplied dashboard structure.

### Required sections

1.  Header
2.  Greeting
3.  Wallet balance
4.  Fund Wallet
5.  Seven service shortcuts
6.  Recent transactions
7.  Notification entry
8.  Bottom navigation

The UI must make identity, wallet balance, available services, and
recent activity immediately understandable.

### Services

Exactly seven:

-   Electricity
-   Airtime
-   Data
-   TV
-   WAEC
-   JAMB
-   NECO

Use the supplied icon/card style and large touch areas. Keep all seven
immediately accessible.

### Recent transactions

Use mobile cards/list rows, never a desktop table.

Each item:

-   service icon
-   service name
-   amount
-   date/time
-   status

Tap:

`Recent Transaction → Transaction Details → Receipt`

View All → History.

### Dynamic data rule

Names, balances, amounts, dates, references and identifiers in
screenshots are examples only. Never hardcode them.

### Acceptance

Home renders from backend/application state and every actionable element
has a logical destination.

------------------------------------------------------------------------

## 7. Phase 5 --- Service Screen

Show exactly the seven active services.

The approved Services screenshot uses:

-   ZPAY header
-   notification control
-   service title
-   two-column service layout
-   large circular/light icon areas
-   service labels
-   NECO occupying the final single slot
-   persistent bottom navigation
-   Service active in cyan

Preserve this hierarchy, spacing, ordering and visual character as
closely as the supplied screenshot permits.

No removed service may appear.

### Acceptance

Each service opens its correct workflow.

------------------------------------------------------------------------

## 8. Phase 6 --- Wallet Funding

Flow:

`Home → Wallet Balance → Fund Wallet → Enter Amount → Select Funding Method → Review → Confirm → Processing → Funding Successful/Failed → Updated Balance`

### UI requirements

-   current balance
-   amount entry
-   funding method
-   review
-   confirmation
-   processing
-   success/failure
-   updated balance

After success, invalidate/refetch wallet balance immediately.

Prevent duplicate submissions.

### Acceptance

A successful funding operation updates the authoritative balance
displayed in the application.

------------------------------------------------------------------------

## 9. Phase 7 --- Common Transaction and Payment UI

Create reusable frontend components:

-   ServiceButton
-   WalletCard
-   TransactionRow
-   PaymentSummary
-   WalletBalanceSummary
-   PinInput
-   PaymentConfirmButton
-   ProcessingState
-   PaymentSuccess
-   PaymentFailure
-   TransactionDetails
-   Receipt
-   StatusBadge
-   FilterChip

### Common service pattern

`Select Service → Enter Information → Select Product/Package/Amount → Review → Confirm → Pay with ZPAY Wallet → Processing → Success/Failure → Transaction Details → Receipt`

Payment review must display:

-   service
-   customer/service identifier
-   amount
-   fee when applicable
-   total
-   current wallet balance
-   remaining wallet balance

Do not hardcode screenshot values.

------------------------------------------------------------------------

## 10. Phase 8 --- Electricity

Screen structure based on supplied reference:

-   Back
-   title: Electricity
-   Pay Bill
-   explanatory subtitle
-   Provider selector
-   Meter Number input
-   Prepaid/Postpaid verification area
-   Amount input
-   quick amount chips
-   Wallet Balance
-   Continue

Continue is disabled until required validation succeeds.

### Flow

`Electricity → Provider → Meter Number → Verification → Amount → Review → Confirm Payment → Wallet Payment → Processing → Success/Failure → Transaction Details → Receipt`

### Success details

-   provider
-   meter number
-   amount
-   reference
-   date/time
-   status
-   receipt

### Acceptance

Happy path, validation failure, insufficient balance, provider failure
and retry paths work.

------------------------------------------------------------------------

## 11. Phase 9 --- Airtime

### Flow

`Airtime → Select Network → Phone Number → Amount → Review → Confirm → Pay with Wallet → Processing → Success/Failure → Transaction Details → Receipt`

Validate phone and amount. Display transaction result and record it in
History.

------------------------------------------------------------------------

## 12. Phase 10 --- Data

### Flow

`Data → Select Network → Phone Number → Select Data Bundle → Review → Confirm → Pay with Wallet → Processing → Success/Failure → Transaction Details → Receipt`

Bundles must use clear selectable cards/buttons. Display selected bundle
and amount in review.

------------------------------------------------------------------------

## 13. Phase 11 --- TV

### Flow

`TV → Select Provider → Smartcard/IUC → Verification where required → Select Package → Review → Confirm → Pay with Wallet → Processing → Success/Failure → Transaction Details → Receipt`

Show subscription details after payment.

------------------------------------------------------------------------

## 14. Phase 12 --- WAEC

### Functional flow

`WAEC → Registration → Candidate Details → Identification/NIN → Examination Details → Subject Selection → Passport Photograph where required → Review Registration → Registration Fee → Confirm → Pay with Wallet → Processing → Payment Successful → Registration Confirmation → Receipt/Next Steps`

### Important

Payment Successful is not automatically Registration Complete.

The UI must represent payment state and registration state
independently.

If additional steps are required, display them clearly.

Preserve candidate-entered data across recoverable validation errors.

------------------------------------------------------------------------

## 15. Phase 13 --- JAMB

### Functional flow

`JAMB → Select JAMB Service → Candidate Details → NIN → Verify Candidate Information → JAMB Profile Information → Examination Details → Institution → Course → Subjects → Review Registration → Payment → Pay with Wallet → Processing → Payment Successful → Registration Confirmation`

Application/registration state and payment state must remain distinct.

------------------------------------------------------------------------

## 16. Phase 14 --- NECO

### Functional flow

`NECO → Registration → Candidate Details → NIN → Examination Details → Subject Selection → Passport Photograph where required → Review → Registration Fee → Pay with Wallet → Processing → Payment Successful → Registration Confirmation`

If biometric capture or registration-centre completion is required, show
it as a separate next-step/status concept.

Do not imply that digital payment alone completes a physical
requirement.

------------------------------------------------------------------------

## 17. Phase 15 --- Payment States

### Processing

Show clear processing feedback. Disable repeated confirmation.

### Success

Match the supplied success composition:

-   success indicator
-   Payment Successful
-   message
-   amount paid
-   service
-   provider/identifier where relevant
-   reference
-   date/time
-   View Receipt
-   Done/Back to Home as supported by the approved screen

For WAEC/JAMB/NECO, distinguish Payment Successful from Registration
Complete.

### Failure

Show:

-   Payment Failed
-   reason when available
-   transaction status
-   Retry
-   Back to Service
-   Return Home

Clearly indicate whether wallet funds were charged.

------------------------------------------------------------------------

## 18. Phase 16 --- Transaction Details and Receipt

### Transaction details

Show:

-   service
-   amount
-   status
-   date/time
-   reference
-   payment method
-   relevant service/customer information

### Receipt

Match supplied receipt composition:

-   close
-   Receipt title
-   ZPAY branding
-   success indicator
-   Transaction Successful
-   amount
-   paid date
-   service
-   reference
-   customer/service identifier
-   date/time
-   payment method
-   Download
-   Share

Receipt data must come from the selected real transaction.

### Flow

`History → Transaction → Transaction Details → Receipt`

------------------------------------------------------------------------

## 19. Phase 17 --- History

Use the supplied dark mobile History design:

-   title
-   subtitle
-   horizontal filter chips
-   date grouping
-   transaction cards
-   status badges
-   persistent bottom navigation

### Filters

-   All
-   Electricity
-   Airtime
-   Data
-   TV
-   WAEC
-   JAMB
-   NECO
-   Wallet

### Status filters

-   Successful
-   Pending
-   Failed

If filter chips exceed width, horizontally scroll; never clip them.

Group by date such as TODAY and YESTERDAY.

Do not use a spreadsheet/table.

------------------------------------------------------------------------

## 20. Phase 18 --- Me / Account

Match supplied Me screen:

-   avatar
-   ZPAY header
-   notification
-   profile identity
-   verification/tier state
-   Profile
-   KYC
-   Security
-   PIN
-   Notifications
-   Settings
-   Logout

Logout uses destructive styling and requires confirmation.

Do not hardcode demo user names or verification tiers.

------------------------------------------------------------------------

## 21. Phase 19 --- Notifications

Notifications are accessible from the header bell and account area.

Support loading, unread/read states, empty state and navigation into
relevant events where defined by backend.

------------------------------------------------------------------------

## 22. Phase 20 --- Forms, Validation and Async States

All forms:

-   validate at appropriate interaction
-   field-level errors
-   preserve data after recoverable errors
-   disable invalid/processing submission
-   prevent duplicate submission
-   show loading
-   support keyboard/focus behaviour
-   provide accessible labels

Distinguish:

-   initial
-   loading
-   loaded
-   validating
-   submitting
-   processing
-   success
-   failed
-   empty

### Loading references

-   wallet balance
-   service information
-   provider verification
-   payment processing
-   transaction history

### Errors

Every error must explain:

1.  What went wrong.
2.  What the user can do next.

### Insufficient balance

Show:

-   current balance
-   required amount
-   amount needed
-   Fund Wallet
-   Cancel

Do not permit payment until sufficient funds exist.

------------------------------------------------------------------------

## 23. Phase 21 --- API Integration Boundary

Frontend communicates only with backend APIs.

Never place the following in frontend code:

-   provider secrets
-   payment gateway secrets
-   private credentials
-   raw PINs

Create typed models for:

-   User
-   Wallet
-   Funding
-   Service
-   Provider
-   Transaction
-   Receipt
-   Notification
-   KYC
-   service-specific applications

Normalize backend errors into a frontend-safe error model.

The frontend must not calculate authoritative wallet balances, provider
fees, or transaction finality.

------------------------------------------------------------------------

## 24. Phase 22 --- Responsive, Accessibility and Interaction Fidelity

Prioritize:

-   mobile-first layout
-   one-handed use
-   large touch targets
-   readable financial amounts
-   simple forms
-   predictable back navigation
-   accessible labels
-   keyboard/focus behaviour
-   minimal unnecessary scrolling

Use the supplied screenshots as visual acceptance references. Match
hierarchy, spacing, proportions, component placement, icon treatment and
states as closely as possible.

------------------------------------------------------------------------

## 25. Phase 23 --- Frontend Testing

Test:

-   navigation
-   auth guards
-   service selection
-   all seven service entry points
-   form validation
-   insufficient balance
-   payment confirmation
-   duplicate-submit protection
-   loading/error/success states
-   wallet balance refresh
-   transaction list
-   filters
-   transaction details
-   receipt navigation
-   logout
-   WAEC/JAMB/NECO payment-vs-registration state distinction

Add visual regression/screenshot tests if supported by the detected
stack.

------------------------------------------------------------------------

## 26. Phase 24 --- Hardening

Run:

-   frontend tests
-   integration tests
-   build
-   lint
-   type checks
-   API contract checks

Perform a complete visual comparison against all supplied screenshots.

Check that no removed service appears anywhere.

Check that all dynamic values come from state/API rather than screenshot
samples.

------------------------------------------------------------------------

## 27. Phase 25 --- Final Frontend Acceptance

Do not declare completion because screens render.

Verify:

-   authentication → dashboard
-   dashboard → service
-   every service workflow
-   payment review
-   PIN/payment confirmation where required
-   processing
-   success/failure
-   transaction details
-   receipt
-   history
-   filters
-   wallet funding
-   notifications
-   profile
-   KYC
-   security
-   PIN
-   settings
-   logout
-   loading/empty/error states
-   responsive behaviour
-   backend integration
-   no removed services
-   no hardcoded demonstration data

### OpenCode execution rule

Execute one phase at a time:

1.  Read this phase.
2.  Inspect existing code.
3.  Make a short plan.
4.  Implement.
5.  Run tests/build/lint.
6.  Inspect changed files.
7.  Verify acceptance criteria.
8.  Report completed work and unresolved items.
9.  Only then proceed.

Never implement the whole frontend in one uncontrolled pass.

------------------------------------------------------------------------

## 28. Frontend Definition of Done

The frontend is complete only when it behaves as one connected ZPAY
application, faithfully follows the approved UI/UX, integrates with the
backend contracts, handles real asynchronous states, protects sensitive
operations, uses dynamic data, and passes the acceptance checks above.
