# ZPAY App Audit

## Current State

ZPAY is already an Expo/React Native app, but it had been treated like a web deployment because it included a root Vercel web export config and local web output. The native app path now has Android/iOS identifiers, EAS build profiles, app-focused README instructions, and no tracked frontend Vercel export config. The backend can still keep its separate `server/vercel.json`.

## Issues Found

- `src/components/ui/Screen.tsx` had a corrupted back icon character, which would render incorrectly on devices. It now uses the shared native Ionicons wrapper.
- The frontend root `vercel.json` exported Expo as a static web app into `dist`. That tracked web deployment config has been removed so the frontend is native app-first. Local ignored folders `dist/` and `.vercel/` may still exist on disk, but they are generated artifacts rather than tracked app source.
- Unused top-level web dependencies `react-dom`, `react-native-web`, and `expo-web-browser` were removed from `package.json` so the frontend dependency set matches the Android/iOS app target.
- The root Jest config was accidentally collecting `server/test.js`, which is a manual backend smoke script and not a Jest suite. Jest now only matches files in `__tests__`.
- Full Jest passes but reports React Native Testing Library `act(...)` warnings and may need manual interruption after completion because `OtpScreen` uses a countdown timer. Focused non-screen tests exit cleanly; the auth UI tests need a future cleanup pass after the project is running on the supported Node 22 toolchain.
- PowerShell blocks `npm.ps1` and `npx.ps1` on this machine. Use `npm.cmd` and `npx.cmd`, or change the PowerShell execution policy for local development.
- Expo CLI commands such as `expo lint`, `expo config`, and `expo start` hung after loading `.env` during this audit. TypeScript passed, JSON config parses, and npm warns that the current Node `v26.6.0` does not match the repo engine range. Run the project on Node 22 LTS. The repo now includes `.nvmrc`, `.node-version`, and a `package.json` engine range for Node 22.
- App icon, splash, favicon, and Android adaptive icon layers now use generated ZPAY-branded bitmap assets. The repo includes `generate:assets` and `check:assets` scripts for regenerating and verifying them.
- Auth session persistence now uses `expo-secure-store` with `WHEN_UNLOCKED_THIS_DEVICE_ONLY`, so tokens are no longer stored through AsyncStorage.
- Settings now include a persisted biometric authentication preference backed by `expo-local-authentication`; enabling it requires hardware, enrollment, and a successful biometric/device authentication prompt. The native app manifest includes the local-auth plugin and iOS Face ID permission text.
- The Security screen now includes an instant freeze control for outgoing payments. When frozen, airtime/data/TV/electricity and exam registration payment flows are blocked before payment submission.
- The Security screen now shows a recent security activity list for sign-ins, OTP verification, sign-out, password updates, PIN changes, account freeze/unfreeze events, and biometric enablement on this device.
- Transaction PIN setup and changes now store a salted local PIN hash in SecureStore through `expo-crypto`; airtime/data/TV/electricity and registration payment flows verify the device PIN before sending the payment request. The backend must still be the final PIN authority for production.
- Payment review now enforces KYC-based per-transaction limits in-app: unverified accounts are capped at NGN 5,000, basic accounts at NGN 50,000, and verified accounts at NGN 500,000. The KYC screen now shows the user's current payment limit.
- The welcome and home screens now use a reusable native ZPAY mark instead of the plain placeholder logo block.
- The wallet card previously displayed hardcoded demo content such as a fake recipient, fake transfer amount, fake savings percentage, and fake income. It now shows real balance data and routes its visible actions to wallet funding and transaction history.
- Transaction details now expose shareable receipt text, copy-reference actions, and an in-app report flow that creates a persisted support ticket linked to the transaction reference. Receipt sharing uses the native Share API and reference copying uses the native Clipboard API; PDF/file export remains a future native module task.
- A native Support screen now lists local support tickets with statuses and copyable ticket references, and the account screen links directly to it.
- Mock OTP codes are no longer printed by default in development/tests; logging now requires `EXPO_PUBLIC_DEBUG_OTP=true`.
- The local `.env` currently points at `https://backend.vercel.app/api`, which appears to be a placeholder API URL. The repo now includes `.env.example` and a release environment checker; production builds are blocked unless `EXPO_PUBLIC_USE_MOCK=false` and `EXPO_PUBLIC_API_URL` is a real HTTPS API domain.

## Make It Better Than Kuda

- Build a trust layer first: backend-enforced account freeze, backend-enforced transaction PIN checks, device binding, server-side login/session history, and card controls.
- Make payments feel faster: saved beneficiaries, recent billers, smart repeat payments, bill reminders, low-balance warnings, one-tap receipt sharing, and payment retry with clear status.
- Make wallet money clearer: separate available balance, pending balance, cashback/rewards, savings pockets, spending insights, and monthly category summaries.
- Make service flows calmer: provider verification before payment, fees shown before confirmation, clear failure reasons, and a support ticket link attached to every failed or pending transaction.
- Make Nigerian use cases stronger: airtime/data bundles by network, electricity disco verification, exam registration status tracking, NIN/passport upload status, and WhatsApp/SMS receipt delivery.
- Make support visible: connect the new local ticket list to backend case management, add in-app chat, SLA timers, dispute timelines, attachments, and push/SMS updates after a report is filed.
- Make onboarding safer and smoother: BVN/NIN/KYC tier explanation, limits per tier, address verification progress, and passwordless/biometric re-entry after first login.

## Release Checklist

- Run on Android device/emulator with `npm.cmd run android`.
- Build internal APK with `npm.cmd run build:android:apk`.
- Replace all Expo default assets with final ZPAY assets.
- Keep auth token storage on `expo-secure-store` and add device binding before release.
- Add production backend URLs and remove mock mode for release builds.
- Add payment provider integration behind the backend only.
- Add fraud/risk checks, rate limits, and audit logs on the backend.
- Add Play Store privacy policy, data safety, and support contact pages.
