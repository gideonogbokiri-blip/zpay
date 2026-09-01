# ZPAY Frontend

Expo Router mobile app for wallet funding, bill payments, airtime/data purchases, transaction history, and education registration.

## Architecture

- **Frontend**: This repo (Expo / React Native)
- **Backend**: [zpay-backend](https://github.com/gideonogbokiri-blip/zpay-backend) (Express API on Render)

## Run Locally

Use Node 22 LTS. The repo includes `.nvmrc` and `.node-version` set to `22.13.1`.

```bash
cp .env.example .env
npm install
npm run start
```

For local backend, set `EXPO_PUBLIC_USE_MOCK=false` and `EXPO_PUBLIC_API_URL=http://localhost:3001/api` in `.env`, then run the backend separately.

Open with Expo Go or a development build. For native device targets:

```bash
npm run android
npm run ios
```

## Native Builds

```bash
npm run check:release-env
npm run build:android:apk
npm run build:android
npm run build:ios
```

## Quality Checks

```bash
npm run typecheck
npm run lint
npm test
npm run check:assets
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_USE_MOCK` | `true` for mock API, `false` for real backend |
| `EXPO_PUBLIC_API_URL` | Backend API URL (e.g. `https://zpay-backend.onrender.com/api`) |
| `EXPO_PUBLIC_DEBUG_OTP` | Enable OTP debug logging |

## Deploy

- **Vercel**: Connect this repo → auto-deploys with `vercel.json`
- **EAS**: `npx eas-cli build --platform android --profile production`
