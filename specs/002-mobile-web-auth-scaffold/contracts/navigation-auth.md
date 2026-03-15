# Contract: Auth Navigation And Route Access

**Feature**: [spec.md](../spec.md)  
**Consumer**: Expo Router layouts and screens  
**Provider**: Session provider and `src/modules.api.ts`

## Route Matrix

| Route | Access State | Purpose | Disallowed Behavior |
|-------|--------------|---------|---------------------|
| `/sign-in` | Signed out, signed in but unverified | Start username-password login | Verified users are redirected to the requested protected destination or `/` |
| `/sign-up` | Signed out | Create a new account | Signed-in users are redirected away from the form |
| `/verify-email` | Signed out, signed in but unverified | Consume verification callback and resend verification | Verified users are redirected to `/` |
| `/forgot-password` | Signed out | Request password reset | Signed-in verified users are redirected to `/` |
| `/reset-password` | Signed out, signed in but unverified | Complete password reset from recovery link | Invalid or expired links show a recovery restart action |
| `/` | Signed in and verified | Home screen | Signed-out users redirect to `/sign-in`; unverified users redirect to `/verify-email` |
| `/profile` | Signed in and verified | Profile screen | Signed-out users redirect to `/sign-in`; unverified users redirect to `/verify-email` |

## Routing Rules

- Signed-out access to a protected route must redirect to `/sign-in` and preserve the requested destination as `next`.
- Successful sign-in must return the user to `next` when it points to an allowed protected route, otherwise to `/`.
- Signed-in but unverified users may enter verification-related routes but not protected routes.
- Sign-out must clear protected navigation state and return the user to `/sign-in`.
- Password reset and email verification callbacks must work from both browser URLs and native deep links.

## Session Interpretation Rules

- `signed_out`: no active session
- `signed_in_unverified`: active session exists but email verification is incomplete
- `signed_in_verified`: active session exists and email verification is complete

## UI Guarantees

- Protected content never renders before access state is known.
- Route transitions caused by auth changes must be deterministic and free of redirect loops.
- The profile route must display the current username, email address, and verification status from the authenticated user context.
