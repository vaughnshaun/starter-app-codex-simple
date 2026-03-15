# Contract: Username Sign-In Edge Function

**Feature**: [spec.md](../spec.md)  
**Consumer**: `app/modules/auth/api.ts`  
**Provider**: Supabase Edge Function `username-sign-in`

## Purpose

Allow the app to honor the username-and-password login requirement while keeping UI code away from direct backend implementation details.

## Endpoint

`POST /functions/v1/username-sign-in`

## Authentication

- Caller is anonymous before sign-in.
- Function must be rate-limited and must not reveal whether a submitted username exists when credentials are invalid.

## Request

```json
{
  "identifier": "jane.doe",
  "password": "example-password"
}
```

## Request Rules

- `identifier` accepts either a username or an email address.
- Username comparison is case-insensitive.
- `password` must be treated as opaque input and never logged.

## Success Response

**Status**: `200 OK`

```json
{
  "session": {
    "accessToken": "<jwt>",
    "refreshToken": "<refresh-token>",
    "expiresAt": 1760000000
  },
  "user": {
    "id": "00000000-0000-0000-0000-000000000000",
    "email": "jane@example.com",
    "username": "jane.doe",
    "emailVerified": true
  }
}
```

## Error Responses

| Status | Code | Meaning | UI Handling |
|--------|------|---------|-------------|
| `401` | `INVALID_CREDENTIALS` | Identifier or password is incorrect | Show a generic invalid-credentials message |
| `403` | `EMAIL_NOT_CONFIRMED` | Credentials are valid but the account is not verified | Redirect to verification guidance and allow resend |
| `429` | `RATE_LIMITED` | Too many attempts from the same client | Show a retry-later message |
| `500` | `SIGN_IN_UNAVAILABLE` | Unexpected backend failure | Show a generic error and preserve form input |

## Behavioral Guarantees

- The function must normalize username identifiers before lookup.
- The function must resolve username-to-user mapping using app-owned profile data, not UI state.
- The function must return session tokens only when credentials are valid and the account is verified.
- The function must never return the resolved email address for an invalid login attempt.
- The auth module API stores the returned session through the Supabase client before route navigation occurs.
