# Implementation Plan: Cross-Platform Auth Scaffold

**Branch**: `002-mobile-web-auth-scaffold` | **Date**: 2026-03-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-mobile-web-auth-scaffold/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a single Expo SDK 55 application that runs on web and mobile, uses Expo Router for public and protected navigation, and organizes feature code under `app/modules/{module_name}`. Supabase Auth and TanStack Query will power the account lifecycle and session-aware profile access, while module-local API layers keep backend behavior out of screens and components.

## Technical Context

**Language/Version**: TypeScript 5.x, Expo SDK 55.x, React 19.2.x, React Native 0.83, Node.js 20.19+  
**Primary Dependencies**: Expo Router, `@supabase/supabase-js@2.78.1`, `@tanstack/react-query@5`, `@react-native-async-storage/async-storage`, `react-native-url-polyfill`, `jest-expo`, React Native Testing Library  
**Storage**: Supabase Postgres for app data, Supabase Auth managed identities/tokens, AsyncStorage on native, browser localStorage on web  
**Testing**: `jest-expo` for unit and component tests, React Native Testing Library for screen behavior, contract tests for module API layers and the Edge Function, local Supabase integration tests for auth flows, and performance/native deep-link verification for the auth-critical journeys  
**Target Platform**: iOS and Android through Expo, plus modern desktop and mobile browsers through Expo web  
**Project Type**: Cross-platform Expo application with a managed Supabase backend  
**Performance Goals**: Resolve initial auth state and route guard decision within 2 seconds on cold start, complete protected route transitions within 300 ms once session state is known, and return visible auth form feedback within 1 second p50 excluding email delivery latency  
**Constraints**: Must follow red-green-refactor TDD, must keep Supabase access behind frontend-safe API layers, must support the same core auth journeys on web and native, must require email verification before protected access, must support username-and-password sign-in even though Supabase native password auth is email-based  
**Scale/Scope**: One scaffolded app, seven primary routes, one profile table, one username sign-in Edge Function, and support for low tens of thousands of accounts without introducing extra services

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Pre-Phase 0 - TDD**: PASS. Each story begins with failing tests for auth forms, route guarding, wrapper behavior, and the username sign-in backend boundary.
- **Pre-Phase 0 - Frontend/Backend Separation**: PASS. Expo routes and feature modules live under `app/`, while database schema and backend logic live under `supabase/`.
- **Pre-Phase 0 - Wrapper-Mediated Backend Access**: PASS. Screens and components consume module-local `api.ts` files under `app/modules/*`; they do not import Supabase clients or backend helpers directly.
- **Pre-Phase 0 - Boundary Verification**: PASS. The plan includes contract tests for module API layers and the Edge Function plus integration tests for redirects, verification, and recovery flows.
- **Post-Phase 1 Re-check**: PASS. The design artifacts preserve the required boundary by using module-scoped API files, a `profiles` table for usernames, and one Supabase Edge Function for username-password exchange.

## Project Structure

### Documentation (this feature)

```text
specs/002-mobile-web-auth-scaffold/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── navigation-auth.md
│   └── username-sign-in.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── _layout.tsx
├── sign-in.tsx
├── sign-up.tsx
├── verify-email.tsx
├── forgot-password.tsx
├── reset-password.tsx
├── providers/
│   └── session-provider.tsx
├── lib/
│   ├── env.ts
│   └── query-client.ts
├── modules/
│   ├── auth/
│   │   ├── api.ts
│   │   ├── hooks.ts
│   │   ├── types.ts
│   │   └── components/
│   └── profile/
│       ├── api.ts
│       ├── hooks.ts
│       ├── types.ts
│       └── components/
└── (app)/
    ├── _layout.tsx
    ├── index.tsx
    └── profile.tsx

supabase/
├── config.toml
├── migrations/
│   └── <timestamp>_create_profiles_and_policies.sql
└── functions/
    └── username-sign-in/
        └── index.ts

tests/
├── contract/
│   ├── auth-api.contract.test.ts
│   ├── profile-api.contract.test.ts
│   └── username-sign-in.contract.test.ts
├── integration/
│   ├── auth-routing.integration.test.tsx
│   ├── auth-performance.integration.test.ts
│   ├── email-verification.integration.test.tsx
│   ├── forgot-password.integration.test.tsx
│   ├── local-supabase-auth.integration.test.ts
│   └── native-auth-links.integration.test.tsx
└── unit/
    ├── app/modules/auth/forgot-password-screen.test.tsx
    ├── app/modules/auth/sign-in-screen.test.tsx
    ├── app/modules/auth/sign-up-screen.test.tsx
    ├── app/modules/auth/hooks.test.ts
    ├── app/modules/profile/hooks.test.ts
    └── app/providers/session-provider.test.tsx
```

**Structure Decision**: Use one Expo application for all UI and routing, with feature code grouped under `app/modules/{module_name}` so domains with backend interaction own their `api.ts`, `hooks.ts`, `types.ts`, and `components/` boundary. Keep Supabase schema and Edge Function assets under `supabase/` so backend logic remains separate from UI modules, while the protected home screen remains a route-level screen without its own backend wrapper.

## Implementation Strategy

1. Establish the app shell first: Expo Router layouts, TanStack Query provider, session provider, and the initial `app/modules/auth` boundary with failing tests in place before implementation.
2. Add the backend foundation next: `profiles` table, uniqueness rules for usernames, row-level security, and the `username-sign-in` Edge Function with contract tests first.
3. Deliver the P1 slice by wiring sign-in, protected routing, preserved `next` navigation, the protected home route, `app/modules/profile`, and sign-out behavior through module API layers where backend interaction exists.
4. Deliver the P2 slice by adding sign-up, pending-verification handling, resend verification, and verification callback behavior for both web and native deep links.
5. Deliver the P3 slice by adding forgot-password request, reset-password completion, neutral recovery messaging, and cache/session invalidation after reset.

## Complexity Tracking

No constitution exceptions are required for this feature.
