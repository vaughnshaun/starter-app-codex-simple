# Data Model: Cross-Platform Auth Scaffold

**Feature**: [spec.md](./spec.md)  
**Date**: 2026-03-15

## Overview

The scaffold uses Supabase Auth for identity, verification, and recovery artifacts, plus one app-owned profile table to support unique usernames and profile display data.

## Entity: Auth User

**Ownership**: Supabase managed (`auth.users`)

| Field | Type | Rules | Notes |
|-------|------|-------|-------|
| `id` | UUID | Required, immutable | Primary identity for the user across the app |
| `email` | Text | Required, unique, valid email format | Used for registration, verification, and recovery |
| `email_confirmed_at` | Timestamp | Nullable until verified | Determines whether protected access is allowed |
| `created_at` | Timestamp | Required | Audit field managed by Supabase |
| `updated_at` | Timestamp | Required | Audit field managed by Supabase |
| `user_metadata.username` | Text | Optional mirror of profile username | Convenience copy only; not the source of uniqueness |

**Relationships**:

- Has exactly one related `Profile`.
- May have zero or one active `Authenticated Session`.
- May have zero or more active verification or recovery artifacts managed by Supabase Auth.

## Entity: Profile

**Ownership**: App owned (`public.profiles`)

| Field | Type | Rules | Notes |
|-------|------|-------|-------|
| `user_id` | UUID | Required, primary key, foreign key to `auth.users.id` | Shares identity with the auth user |
| `username` | Text | Required, unique, normalized for case-insensitive matching | Used for sign-in and shown on the profile screen |
| `username_display` | Text | Required | Preserves original casing for UI display if the stored lookup key is normalized |
| `created_at` | Timestamp | Required | Audit field |
| `updated_at` | Timestamp | Required | Audit field |

**Validation rules**:

- Username length: 3 to 24 characters.
- Allowed characters: letters, numbers, underscore, and period.
- Uniqueness is enforced on the normalized username value.

**Relationships**:

- Belongs to exactly one `Auth User`.

## Entity: Authenticated Session

**Ownership**: Supabase managed, consumed by the app

| Field | Type | Rules | Notes |
|-------|------|-------|-------|
| `access_token` | JWT string | Required while session is active | Used by the wrapper for authenticated requests |
| `refresh_token` | String | Required while session is active | Used by Supabase to renew the session |
| `expires_at` | Unix timestamp | Required | Used to refresh or invalidate the session |
| `user_id` | UUID | Required | Points back to the authenticated user |

**State rules**:

- A session is considered protected-route eligible only when both a session exists and `email_confirmed_at` is present on the user.
- Sign-out deletes the local session state and invalidates dependent query caches.

## Entity: Verification Artifact

**Ownership**: Supabase managed

| Field | Type | Rules | Notes |
|-------|------|-------|-------|
| `email` | Text | Required | Delivery target for verification |
| `redirect_target` | URL | Required | Returns the user to `/verify-email` on web or the equivalent native deep link |
| `issued_at` | Timestamp | Required | Used to reason about expiry |
| `status` | Enum | `pending`, `consumed`, `expired` | App consumes the resulting callback outcome |

**State rules**:

- Newly registered users begin with a pending verification artifact.
- Resending verification invalidates or supersedes prior pending artifacts.

## Entity: Password Reset Artifact

**Ownership**: Supabase managed

| Field | Type | Rules | Notes |
|-------|------|-------|-------|
| `email` | Text | Required | Delivery target for recovery |
| `redirect_target` | URL | Required | Returns the user to `/reset-password` on web or the equivalent native deep link |
| `issued_at` | Timestamp | Required | Used to reason about expiry |
| `status` | Enum | `pending`, `consumed`, `expired` | The app uses the callback and reset completion outcome |

**State rules**:

- Recovery requests always return a neutral UI message, regardless of account existence.
- A reset artifact can be consumed only once.
- Successful reset invalidates previous password-based sign-in attempts.

## Cross-Entity Rules

- Every `Auth User` must have a `Profile` before the user can complete the happy-path sign-in and profile experience.
- Protected route access requires both an `Authenticated Session` and a verified `Auth User`.
- `Profile.username` is the lookup key for username sign-in; `Auth User.email` remains the recovery and verification channel.
- The app never persists passwords or reset tokens in app-owned tables.

## State Transitions

### Account Verification

1. `registered_unverified`
2. `verification_pending`
3. `verified_active`

Allowed transitions:

- `registered_unverified` -> `verification_pending`
- `verification_pending` -> `verified_active`
- `verification_pending` -> `verification_pending` on resend

### Session Lifecycle

1. `unknown`
2. `signed_out`
3. `signed_in_unverified`
4. `signed_in_verified`
5. `expired`

Allowed transitions:

- `unknown` -> `signed_out`
- `unknown` -> `signed_in_unverified`
- `unknown` -> `signed_in_verified`
- `signed_in_unverified` -> `signed_in_verified`
- `signed_in_verified` -> `expired`
- `signed_in_unverified` -> `signed_out`
- `signed_in_verified` -> `signed_out`
- `expired` -> `signed_out`

### Password Recovery

1. `not_requested`
2. `pending`
3. `consumed`
4. `expired`

Allowed transitions:

- `not_requested` -> `pending`
- `pending` -> `consumed`
- `pending` -> `expired`
- `expired` -> `pending`
