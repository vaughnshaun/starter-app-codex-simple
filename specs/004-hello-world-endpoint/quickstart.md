# Quickstart: Hello World Endpoint

## 1. Backend
- Create Supabase Edge Function `hello-world`
- Require Supabase session/JWT for authorization
- Return `{ message: "Hello, world!" }` on success

## 2. Frontend
- Add API function in `app/modules/auth/api.ts` to call edge function
- Add hook in `app/modules/auth/hooks.ts` (e.g., `useHelloWorld()`)
- Add button in `app/modules/auth/components/sign-up-screen.tsx` under resend verification
- On button press, call hook and show alert with result or error

## 3. Testing
- Write tests in `tests/sign-up-screen.test.tsx` for button behavior
- Test both success and error cases

## 4. Best Practices
- All backend calls via wrapper/client API
- Use TanStack Query for hooks
- Follow TDD: write tests before implementation

## 5. References
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [TanStack Query](https://tanstack.com/query/latest/docs/react/overview)
- [Expo Router](https://expo.github.io/router/docs/)
