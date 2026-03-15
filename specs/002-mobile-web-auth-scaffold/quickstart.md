# Quickstart: Cross-Platform Auth Scaffold

**Feature**: [spec.md](./spec.md)  
**Date**: 2026-03-15

## Goal

Stand up the scaffold locally, verify web and native auth flows against a local Supabase stack, and preserve the required frontend-to-backend boundary through the `app/modules/*/api.ts` files.

## Prerequisites

- Node.js 20.19 or newer
- npm 10 or newer
- Docker Desktop for local Supabase services
- Supabase CLI
- Xcode Simulator and/or Android Emulator for native validation

## 1. Bootstrap The Frontend

Create an Expo Router TypeScript app and pin the core packages called for in the plan.

```bash
npx create-expo-app@latest app --template
cd app
npx expo install expo@^55 expo-router react react-dom react-native react-native-web
npm install @supabase/supabase-js@2.78.0 @tanstack/react-query@^5 @react-native-async-storage/async-storage react-native-url-polyfill@^3
npm install -D jest-expo @testing-library/react-native @testing-library/jest-native
```

`@supabase/supabase-js@2.78.1` is referenced in the planning docs but is not published on npm. Use `2.78.0` for a working install unless the feature requirements are updated to a different published version.

## 2. Initialize The Supabase Backend

```bash
supabase init
supabase start
```

Add the planned SQL migration for `public.profiles`, row-level security, and any helper functions needed by the username sign-in boundary. Then deploy the Edge Function locally:

```bash
supabase functions deploy username-sign-in --no-verify-jwt
```

## 3. Configure Environment Variables

Expose only public frontend values to the app:

```bash
EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=<local-anon-key>
EXPO_PUBLIC_SITE_URL=http://localhost:8081
EXPO_PUBLIC_APP_SCHEME=starterapp
```

Expected redirect targets:

- Web verification: `http://localhost:8081/verify-email`
- Web recovery: `http://localhost:8081/reset-password`
- Native verification: `starterapp://verify-email`
- Native recovery: `starterapp://reset-password`

## 4. Implement In Test-First Order

Write and run failing tests before each behavior change:

```bash
npm test
```

Recommended sequence:

1. Session provider and route-guard tests
2. `app/modules/auth/api.ts` contract tests
3. `username-sign-in` Edge Function contract tests
4. Sign-in and protected routing implementation
5. Registration, verification, and resend flows
6. Forgot-password and reset-password flows

## 5. Run The App

```bash
npm run web
npm run ios
npm run android
```

## 6. Smoke-Test The Planned Journeys

1. Register a new account with username, email, and password.
2. Open the local Supabase email inbox and complete email verification.
3. Sign in with username and password, then confirm the home and profile routes load.
4. Sign out and confirm protected routes redirect back to sign-in.
5. Trigger forgot password, complete the reset link, and confirm the old password no longer works.

## 7. Boundary Checks

- Confirm that screens and components import backend behavior only through `app/modules/*/api.ts`.
- Confirm contract tests cover the wrapper and the `username-sign-in` function.
- Confirm integration tests cover signed-out redirect, verified access, and recovery completion.

## 8. Verification Notes

- Web validation: run `npm run web`, register a user, open the verification or reset callback URL in the browser, and confirm redirects land on `/` or `/sign-in` as expected.
- Native validation: open the Expo app in iOS Simulator or Android Emulator and confirm `starterapp://verify-email?...` and `starterapp://reset-password?...` links complete the same flows.
- Local backend validation: run `supabase start`, confirm the `public.profiles` migration is applied, and verify the `username-sign-in` function contract through the automated test suite before wiring a remote project.
