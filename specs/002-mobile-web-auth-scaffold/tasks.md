# Tasks: Cross-Platform Auth Scaffold

**Input**: Design documents from `/specs/002-mobile-web-auth-scaffold/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Automated tests are required for this feature because the constitution mandates TDD and the implementation plan explicitly requires red-green-refactor for every story.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the Expo and Supabase workspace, toolchain config, and baseline documentation needed before any auth behavior is built.

- [ ] T001 Initialize the Expo Router application dependencies and scripts in package.json
- [ ] T002 Create the Expo app configuration and TypeScript baseline in app.json
- [ ] T003 [P] Configure TypeScript, Expo Router, and path aliases in tsconfig.json
- [ ] T004 [P] Configure Jest Expo, Testing Library, and test setup in jest.config.ts
- [ ] T005 [P] Add the global test bootstrap and custom matchers in tests/setup.ts
- [ ] T006 [P] Create the public environment template and validation scaffold in .env.example
- [ ] T007 [P] Initialize the local Supabase project manifest in supabase/config.toml
- [ ] T008 [P] Document local bootstrap and validation commands in README.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared architecture boundary, backend foundation, and test scaffolding that every user story depends on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T009 Create failing boundary tests for the session provider and wrapper-only imports in tests/unit/app/providers/session-provider.test.tsx
- [ ] T010 [P] Create failing contract tests for the auth wrapper in tests/contract/auth-api.contract.test.ts
- [ ] T011 [P] Create failing contract tests for the username sign-in Edge Function in tests/contract/username-sign-in.contract.test.ts
- [ ] T012 [P] Create failing integration coverage for auth gating shell behavior in tests/integration/auth-routing.integration.test.tsx
- [ ] T013 [P] Create failing local Supabase integration scaffolding for auth flows in tests/integration/local-supabase-auth.integration.test.ts
- [ ] T014 Implement the environment loader in app/lib/env.ts and the shared query client in app/lib/query-client.ts
- [ ] T015 [P] Implement the session provider, session state machine, and route guard helpers in app/providers/session-provider.tsx
- [ ] T016 [P] Implement the root providers and public/protected router layouts in app/_layout.tsx
- [ ] T017 [P] Implement the protected route group layout with deterministic redirects in app/(app)/_layout.tsx
- [ ] T018 Create the profile schema, username normalization, and row-level security migration in supabase/migrations/001_create_profiles_and_policies.sql
- [ ] T019 Implement the username sign-in Edge Function contract in supabase/functions/username-sign-in/index.ts
- [ ] T020 Implement the auth wrapper types and backend-safe method surface in app/modules/auth/types.ts
- [ ] T021 Implement the auth wrapper client methods for sign-in, session storage, sign-up handoff, resend verification, and password recovery in app/modules/auth/api.ts
- [ ] T022 [P] Implement the shared auth hooks over the wrapper layer in app/modules/auth/hooks.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Sign In To Protected App (Priority: P1) 🎯 MVP

**Goal**: Let verified users sign in with username and password, reach protected routes, move between home and profile, and lose access on sign-out or session expiry.

**Independent Test**: Sign in with a verified account, confirm unauthenticated access to `/` and `/profile` redirects to `/sign-in`, navigate between home and profile, then sign out and verify protected access is blocked again.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T023 [P] [US1] Add failing sign-in screen interaction tests in tests/unit/app/modules/auth/sign-in-screen.test.tsx
- [ ] T024 [P] [US1] Add failing protected route navigation tests for home and profile in tests/integration/auth-routing.integration.test.tsx
- [ ] T025 [P] [US1] Add failing contract tests for the home wrapper in tests/contract/home-api.contract.test.ts
- [ ] T026 [P] [US1] Add failing contract tests for the profile wrapper in tests/contract/profile-api.contract.test.ts
- [ ] T027 [P] [US1] Add failing home data hook tests in tests/unit/app/modules/home/hooks.test.ts
- [ ] T028 [P] [US1] Add failing profile data hook tests in tests/unit/app/modules/profile/hooks.test.ts

### Implementation for User Story 1

- [ ] T029 [P] [US1] Implement the sign-in form component with username/password validation and error states in app/modules/auth/components/sign-in-form.tsx
- [ ] T030 [US1] Implement the sign-in route and preserved `next` destination handling in app/sign-in.tsx
- [ ] T031 [P] [US1] Implement the home module wrapper and domain types in app/modules/home/api.ts and app/modules/home/types.ts
- [ ] T032 [P] [US1] Implement the home data hooks and verified route screen in app/modules/home/hooks.ts and app/(app)/index.tsx
- [ ] T033 [P] [US1] Implement the profile module wrapper and domain types in app/modules/profile/api.ts and app/modules/profile/types.ts
- [ ] T034 [US1] Implement the profile data hooks and protected route screen in app/modules/profile/hooks.ts and app/(app)/profile.tsx
- [ ] T035 [US1] Implement sign-out, session-expiry handling, and protected cache invalidation in app/modules/auth/hooks.ts

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Register And Verify Email (Priority: P2)

**Goal**: Let a new user register with username, email, and password, remain blocked while unverified, verify via callback, and resend verification instructions when needed.

**Independent Test**: Register a new account, confirm it is treated as pending verification, verify the account from the email callback, then sign in successfully and reach protected content.

### Tests for User Story 2 ⚠️

- [ ] T036 [P] [US2] Add failing registration and validation tests in tests/unit/app/modules/auth/sign-up-screen.test.tsx
- [ ] T037 [P] [US2] Add failing email verification and resend integration tests in tests/integration/email-verification.integration.test.tsx
- [ ] T038 [P] [US2] Add failing local Supabase verification callback coverage in tests/integration/local-supabase-auth.integration.test.ts
- [ ] T039 [P] [US2] Add failing auth wrapper contract coverage for sign-up and resend verification in tests/contract/auth-api.contract.test.ts
- [ ] T040 [P] [US2] Add failing resend-supersession coverage for stale verification links in tests/integration/email-verification.integration.test.tsx

### Implementation for User Story 2

- [ ] T041 [P] [US2] Implement the sign-up form component with username, email, and password rules in app/modules/auth/components/sign-up-form.tsx
- [ ] T042 [US2] Implement the registration route and pending-verification UX in app/sign-up.tsx
- [ ] T043 [P] [US2] Extend the auth wrapper types for registration and verification outcomes in app/modules/auth/types.ts
- [ ] T044 [US2] Extend the auth wrapper methods for profile creation, resend verification, callback exchange, and stale-link rejection in app/modules/auth/api.ts
- [ ] T045 [P] [US2] Implement the verification status panel and resend action in app/modules/auth/components/verification-status.tsx
- [ ] T046 [US2] Implement the verification callback route for web URLs and native deep links in app/verify-email.tsx
- [ ] T047 [US2] Update the session provider redirect rules to block unverified sessions from protected routes in app/providers/session-provider.tsx

**Checkpoint**: At this point, User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - Recover Forgotten Password (Priority: P3)

**Goal**: Let an existing user request password recovery with neutral messaging, complete a valid reset flow, and ensure the old password no longer works.

**Independent Test**: Request password recovery for an account, complete reset from the callback route, sign in with the new password, and confirm the old password is rejected.

### Tests for User Story 3 ⚠️

- [ ] T048 [P] [US3] Add failing forgot-password form tests with neutral response assertions in tests/unit/app/modules/auth/forgot-password-screen.test.tsx
- [ ] T049 [P] [US3] Add failing reset-password flow integration tests in tests/integration/forgot-password.integration.test.tsx
- [ ] T050 [P] [US3] Add failing local Supabase password reset coverage in tests/integration/local-supabase-auth.integration.test.ts
- [ ] T051 [P] [US3] Add failing auth wrapper contract coverage for recovery and reset completion in tests/contract/auth-api.contract.test.ts

### Implementation for User Story 3

- [ ] T052 [P] [US3] Implement the forgot-password form component and neutral success messaging in app/modules/auth/components/forgot-password-form.tsx
- [ ] T053 [US3] Implement the forgot-password route in app/forgot-password.tsx
- [ ] T054 [P] [US3] Implement the reset-password form component with token-state validation in app/modules/auth/components/reset-password-form.tsx
- [ ] T055 [US3] Extend the auth wrapper methods for recovery request and password reset completion in app/modules/auth/api.ts
- [ ] T056 [US3] Implement the reset-password callback route for browser and native deep-link flows in app/reset-password.tsx
- [ ] T057 [US3] Invalidate stale sessions and reject superseded credentials after reset in app/providers/session-provider.tsx

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish shared validation, platform fit, and end-to-end verification across all auth flows.

- [ ] T058 [P] Add shared auth form primitives and loading/error states for cross-platform consistency in app/modules/auth/components/auth-form-shell.tsx
- [ ] T059 [P] Add route constants, redirect helpers, and deep-link utilities in app/modules/auth/navigation.ts
- [ ] T060 Add performance verification for auth state resolution, protected-route transitions, and auth form feedback in tests/integration/auth-performance.integration.test.ts
- [ ] T061 [P] Add native deep-link parity tests for verification and password reset in tests/integration/native-auth-links.integration.test.tsx
- [ ] T062 Harden rate-limit, expired-token, duplicate-account, and stale-link error mapping across auth screens in app/modules/auth/api.ts
- [ ] T063 [P] Add end-to-end quickstart verification notes for web, native, and local Supabase flows in specs/002-mobile-web-auth-scaffold/quickstart.md
- [ ] T064 Run the full test suite and lint command from package.json and record follow-up fixes in README.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks every story.
- **User Story 1 (Phase 3)**: Depends on Foundational completion; defines the MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational completion and reuses auth/session infrastructure from US1.
- **User Story 3 (Phase 5)**: Depends on Foundational completion and extends auth/session behavior from earlier stories.
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2 and has no story dependency beyond the shared foundation.
- **US2 (P2)**: Starts after Phase 2, but builds on the auth wrapper and session gating established for US1.
- **US3 (P3)**: Starts after Phase 2, but relies on the same auth wrapper and callback routing patterns used by US2.

### Within Each User Story

- Tests must be written and fail before implementation tasks begin.
- Wrapper and type changes come before screen integration.
- Route files come after their module components and hooks exist.
- Local Supabase integration coverage must fail before callback or reset implementation lands.
- Session-provider changes land before final redirect and sign-out validation.

### Parallel Opportunities

- Setup tasks marked `[P]` can run in parallel after `T001` and `T002`.
- In Foundational, `T010` to `T013`, `T015` to `T017`, and `T018` to `T019` can be split across team members once the baseline config exists.
- In US1, test tasks `T023` to `T028` can run together, then home/profile module work `T031` to `T034` can proceed in parallel.
- In US2, `T036` to `T040` can run together, then `T041`, `T043`, and `T045` can proceed in parallel before route wiring.
- In US3, `T048` to `T051` can run together, then `T052` and `T054` can proceed in parallel before route wiring.
- In Polish, `T060` and `T061` can run in parallel once all stories are complete.

---

## Parallel Example: User Story 1

```bash
# Launch the failing tests for User Story 1 together:
Task: "T023 [US1] Add failing sign-in screen interaction tests in tests/unit/app/modules/auth/sign-in-screen.test.tsx"
Task: "T024 [US1] Add failing protected route navigation tests for home and profile in tests/integration/auth-routing.integration.test.tsx"
Task: "T025 [US1] Add failing contract tests for the home wrapper in tests/contract/home-api.contract.test.ts"
Task: "T026 [US1] Add failing contract tests for the profile wrapper in tests/contract/profile-api.contract.test.ts"
Task: "T027 [US1] Add failing home data hook tests in tests/unit/app/modules/home/hooks.test.ts"
Task: "T028 [US1] Add failing profile data hook tests in tests/unit/app/modules/profile/hooks.test.ts"

# After tests fail, split implementation across separate files:
Task: "T031 [US1] Implement the home module wrapper and domain types in app/modules/home/api.ts and app/modules/home/types.ts"
Task: "T032 [US1] Implement the home data hooks and verified route screen in app/modules/home/hooks.ts and app/(app)/index.tsx"
Task: "T033 [US1] Implement the profile module wrapper and domain types in app/modules/profile/api.ts and app/modules/profile/types.ts"
Task: "T034 [US1] Implement the profile data hooks and protected route screen in app/modules/profile/hooks.ts and app/(app)/profile.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Deliver Phase 3 for verified username/password sign-in and protected routing.
3. Run the US1 contract, unit, integration, and local Supabase smoke tests before expanding scope.

### Incremental Delivery

1. Setup plus Foundation establishes the architecture boundary, Supabase schema, session shell, and local integration harness.
2. US1 delivers the smallest usable scaffold for verified sign-in and protected navigation.
3. US2 adds onboarding and verification, including resend invalidation and callback validation.
4. US3 adds recovery and reset completion as the final account-lifecycle slice.
5. Phase 6 applies shared hardening, performance checks, and cross-platform validation across web and native.

### Parallel Team Strategy

1. One developer owns frontend shell setup while another prepares Supabase config during Phase 1.
2. In Phase 2, split tests, router/provider work, and backend migration/function work across separate files.
3. After the foundation is stable, assign one developer per user story slice while keeping wrapper/API ownership coordinated.

---

## Notes

- Every task follows the required checklist format with a task ID and exact file path.
- TDD is explicit in every story phase to satisfy the constitution.
- UI-facing routes and components access backend behavior only through `app/modules/*/api.ts`.
- The local Supabase harness, native deep-link checks, and performance verification are explicit tasks rather than implied follow-up work.
- The suggested MVP scope is Phase 3 only after Setup and Foundational work are complete.
