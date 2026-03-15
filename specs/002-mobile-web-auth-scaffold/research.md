# Research: Cross-Platform Auth Scaffold

**Feature**: [spec.md](./spec.md)  
**Date**: 2026-03-15

## Decision 1: Use the Expo SDK 55 compatibility matrix as the frontend baseline

**Decision**: Build the frontend on Expo SDK 55.x with Expo Router and the React 19.2 / React Native 0.83 line that Expo 55 supports.

**Rationale**: The official Expo SDK 55 documentation defines the supported runtime and minimum Node.js baseline. Planning against Expo's supported React and React Native versions is safer than independently selecting package versions that may fall outside Expo's compatibility window.

**Alternatives considered**:

- Use a newer standalone React 19 patch without regard to the Expo SDK matrix. Rejected because Expo compatibility is the tighter constraint for this scaffold.
- Build separate native and web frontends. Rejected because the feature is explicitly a shared mobile/web scaffold.

## Decision 2: Pin `@supabase/supabase-js` to 2.78.1 even though newer 2.x releases exist

**Decision**: Use `@supabase/supabase-js@2.78.1` as the project pin.

**Rationale**: The user explicitly named `2.78.1`. Supabase's official release history shows newer 2.x releases were already available before 2026-03-15, so the phrase "latest" is internally inconsistent. This plan treats the exact version number as the authoritative requirement and preserves it as a deliberate pin rather than silently upgrading.

**Alternatives considered**:

- Use the newest available `@supabase/supabase-js` 2.x release. Rejected because it conflicts with the explicit version pin.
- Leave the version unspecified as `@supabase/supabase-js@2`. Rejected because the request called for a concrete version.

## Decision 3: Implement username-password sign-in through a Supabase Edge Function

**Decision**: Add a single Edge Function, `username-sign-in`, and call it only from `src/modules.api.ts`.

**Rationale**: Supabase Auth's password sign-in flow is email- or phone-based. The feature requires username-and-password login. A dedicated Edge Function can normalize the submitted identifier, resolve the username through the `profiles` table, perform the secure password exchange, and return a session payload without exposing direct backend details to UI modules.

**Alternatives considered**:

- Change the product requirement to email-and-password login. Rejected because the spec explicitly requires username-and-password sign-in.
- Expose the Supabase client directly to screens and let UI code resolve usernames. Rejected because it violates the constitution's wrapper-mediated boundary and weakens security.

## Decision 4: Store the username in an app-owned `profiles` table linked 1:1 to `auth.users`

**Decision**: Create a `public.profiles` table keyed by the Supabase auth user id, with a unique normalized username and minimal profile metadata.

**Rationale**: Supabase Auth manages identities and password recovery, but it does not provide a unique username primitive for password login. A profile table gives the app a safe place to enforce uniqueness, look up users by username inside the Edge Function, and populate the profile screen.

**Alternatives considered**:

- Store usernames only in auth metadata. Rejected because uniqueness and reliable lookup are harder to enforce there.
- Introduce a separate custom user database. Rejected because Supabase Postgres already satisfies the need and keeps the system smaller.

## Decision 5: Use TanStack Query for authenticated server state, not for the auth token source of truth

**Decision**: Use Supabase session listeners plus a session provider as the source of truth for auth state, and use TanStack Query for profile reads, resend/reset mutations, and cache invalidation around sign-in and sign-out.

**Rationale**: Supabase already owns session lifecycle. TanStack Query is well-suited for server state and mutation orchestration but should not replace the auth client as the canonical session holder.

**Alternatives considered**:

- Model the entire auth session as TanStack Query data only. Rejected because it adds unnecessary indirection over the auth client.
- Skip TanStack Query and manage all network state manually. Rejected because the user explicitly requested TanStack Query and the app needs consistent mutation/loading/error behavior.

## Decision 6: Persist sessions with platform-appropriate storage and route through Expo Router layouts

**Decision**: Persist the Supabase session with AsyncStorage on native and browser localStorage on web, and enforce access in Expo Router layout guards.

**Rationale**: The official Supabase Expo guide uses AsyncStorage for React Native persistence, while the web build can use browser storage. Expo Router layouts provide a single place to gate public versus protected route groups and to preserve a requested destination for post-login navigation.

**Alternatives considered**:

- Use custom secure storage for every platform. Rejected for the initial scaffold because Supabase's documented Expo path already covers native session persistence and keeps the implementation smaller.
- Guard access individually in every screen. Rejected because layout-level protection is less error-prone.

## Decision 7: Use redirect-based verification and password recovery callbacks for both web and native

**Decision**: Route email verification and password reset emails back into `/verify-email` and `/reset-password` handlers that can consume both browser URLs and native deep links.

**Rationale**: The same account lifecycle must work on web and mobile. Redirect-based callbacks let the scaffold share one navigation model while still supporting email-driven verification and recovery.

**Alternatives considered**:

- Require users to verify only in a browser. Rejected because it breaks the mobile-first experience.
- Add a custom verification dashboard instead of redirect callbacks. Rejected because it adds unnecessary surface area for a scaffold.

## Decision 8: Validate the architecture with local Supabase and contract-focused tests

**Decision**: Use local Supabase for migrations, auth emails, and Edge Function verification, with automated contract and integration tests written before implementation.

**Rationale**: The constitution requires proof that the backend boundary remains intact. Local Supabase plus contract tests exercises the wrapper and the Edge Function realistically without needing a deployed environment.

**Alternatives considered**:

- Rely only on mocked unit tests. Rejected because mocked tests alone do not verify the backend boundary.
- Defer integration testing until after UI implementation. Rejected because it conflicts with the required TDD workflow.
