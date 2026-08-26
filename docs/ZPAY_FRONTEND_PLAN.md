# ZPAY Frontend Plan

Execution plan derived from `ZPAY_FRONTEND_IMPLEMENTATION.md` (the contract)
and `ZPAY_BACKEND_IMPLEMENTATION.md` (contracts the frontend must satisfy).

## 1. Phase 0 Result — Stack Decision

Repo status: **empty** (only the two spec documents exist, no code, no git).

Decision (user-confirmed): **React Native + Expo**, frontend-only for now.
Backend contracts are mocked behind a typed API client so the frontend can be
pointed at the real backend later without redesign.

| Area            | Choice                                             | Why                                                                 |
| --------------- | -------------------------------------------------- | ------------------------------------------------------------------- |
| Runtime         | Expo (managed), React Native                      | Mobile-first per spec; fastest iteration; OTA tooling               |
| Language        | TypeScript (strict)                                | Typed API models required by Phase 21                               |
| Navigation      | Expo Router (file-based, stack + tabs)             | Auth guards, hidden bottom nav in payment flows                     |
| Server state    | TanStack Query                                     | Loading/error/success async states, refetch-on-invalidate for wallet|
| Client state    | Zustand                                            | Session/token, light UI state                                       |
| Forms           | react-hook-form + zod                              | Field-level validation, preserve data on recoverable errors         |
| Styling         | Theme tokens (centralized) + StyleSheet/ThemeProvider | Phase 1 centralization rule                                        |
| API client      | Typed `api/` layer + zod-decoded responses         | Normalize backend errors into frontend-safe error model             |
| Testing         | Jest + React Native Testing Library                | Phase 23 coverage list                                               |

## 2. Repository Map (target)

```
zpay/
  app/                      # Expo Router routes
    _layout.tsx             # root providers + auth guard
    (auth)/                 # Welcome, Login, SignUp, OTP, PIN
    (tabs)/                 # Home, Service, History, Me (bottom nav)
    wallet/                 # Fund Wallet flow
    services/               # 7 service flows (multi-step screens)
    tx/                     # Transaction Details, Receipt
    notifications/
    me/                     # Profile, KYC, Security, PIN, Settings
  components/               # reusable UI (Phase 7 list)
  theme/                    # colors, typography, spacing, radii, shadows
  lib/                      # api client, models, error normalization, format (₦)
  hooks/                    # auth guard, wallet balance, tx history
  state/                    # zustand stores (session, ui)
  constants/services.ts     # exactly 7 active services
  __tests__/                # component + flow tests
```

## 3. Design System (Phase 1)

Centralized tokens in `theme/`. Screenshot-specific variants preserved:
- Dark authenticated theme (background `rgb(16,20,21)`, surface `rgb(29,32,34)`,
  accent cyan `rgb(0,244,254)`, white/light-gray text, green success, red-destructive).
- **Services screen is a deliberate light/white surface variant** (spec §1 visual rule).
- Currency formatting: `₦`/NGN util in `lib/format.ts`.

## 4. Phases and Deliverables

| # | Phase | Deliverable |
| -- | ----- | ----------- |
| 1 | Design system foundation | `theme/` tokens + shared primitives |
| 2 | Authentication | Welcome, Login, Sign Up, OTP, PIN create/manage, auth guards |
| 3 | Authenticated shell | Tab navigator (Home/Service/History/Me), active=cyan, hidden in payment flows |
| 4 | Home/Dashboard | Greeting, wallet balance, Fund Wallet, 7 shortcuts, recent txs, notification entry |
| 5 | Service screen | Two-column layout, light variant, exactly 7 services, NECO final slot |
| 6 | Wallet funding | Amount → method → review → confirm → processing → success/fail → refetch balance |
| 7 | Common payment UI | ServiceButton, WalletCard, TransactionRow, PaymentSummary, PinInput, ProcessingState, PaymentSuccess/Failure, TransactionDetails, Receipt, StatusBadge, FilterChip |
| 8-14 | Services | Electricity, Airtime, Data, TV, WAEC, JAMB, NECO (each multi-step flow) |
| 15 | Payment states | Processing / Success / Failure (+ payment-vs-registration split for WAEC/JAMB/NECO) |
| 16 | Details + Receipt | From real selected transaction; Download/Share |
| 17 | History | Dark design, filter chips (service + status), date grouping |
| 18 | Me/Account | avatar, verification tier, Profile/KYC/Security/PIN/Notifications/Settings, confirm-logout |
| 19 | Notifications | list, unread/read, empty state, deep-link |
| 20 | Forms/validation | all fields validate, preserve data, disable invalid/processing submit, duplicate protection, insuff. balance state (balance / required / needed / Fund Wallet) |
| 21 | API boundary | typed models, error normalization, no secrets, no client-side authoritative balance |
| 22 | Responsive/a11y | mobile-first, large touch targets, accessible labels, predictable back |
| 23 | Testing | navigation, auth guards, 7 service entry points, validation, insuff. balance, duplicate submit, filters, receipt, logout, registration-vs-payment states |
| 24 | Hardening | build, lint, typecheck, visual comparison, no removed services, no hardcoded demo data |
| 25 | Acceptance | end-to-end walkthrough per contract list |

## 5. Shared API Contract Surface (mocked until backend)

Mirrors backend doc §27. Frontend models (typed): User, Wallet, Funding,
Service, Provider, Transaction, Receipt, Notification, KYC, service-specific
applications. Error contract: `{ code, message, fieldErrors?, requestId?,
retryable? }` mapped to frontend error kinds (validation/auth/authorization/
insufficient_funds/provider_failure/network/unexpected).

Auth-gated endpoints, wallet balance refetch on funding/payment, paginated
history with service+status filters, receipt by transaction id. No provider
secrets, no PINs, no balances computed client-side.

## 6. Execution Rule

One phase at a time: read phase → inspect → plan → implement → test/lint →
inspect → verify acceptance → report → proceed. Never one uncontrolled pass.
