# Phase 0 Research: Hello World Endpoint

## Decision: Expo Edge Function for Hello World
- Use Supabase Edge Function for backend endpoint
- Use basic authorization (Supabase JWT or session)
- Frontend triggers via wrapper in `app/modules/auth/api.ts`

### Rationale
- Supabase Edge Functions are recommended for custom endpoints
- Expo Router and React Native are standard for frontend
- Wrapper pattern ensures separation and testability

### Alternatives Considered
- Direct Supabase table access (not suitable for custom endpoint)
- Firebase Functions (not used in this project)
- REST endpoint in Node.js (Supabase Edge Function is preferred)

## Best Practices
- All backend access via wrapper/client layer
- Use TanStack Query for fetch/mutation hooks
- Test-driven development: write tests before implementation
- UI button placed in `sign-up-screen.tsx` under resend verification
- Alerts use standard Expo/React Native alert API

## Patterns
- API function in `app/modules/auth/api.ts` (e.g., `helloWorld()`)
- Hook in `app/modules/auth/hooks.ts` (e.g., `useHelloWorld()`)
- Button in `app/modules/auth/components/sign-up-screen.tsx`
- Edge function in Supabase directory

## Clarifications Resolved
- Basic authorization: Use Supabase session/JWT
- Endpoint placement: Supabase Edge Function
- UI placement: Under resend verification button
- Error handling: Show alert with error message

## References
- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [TanStack Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [Expo Router Docs](https://expo.github.io/router/docs/)
