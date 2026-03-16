# Starter App Codex Simple

Cross-platform Expo auth scaffold for web and mobile with protected routing, username-password sign-in, email verification, and password recovery.

## Bootstrap

Local
```bash
npm install
cp .env.example .env
supabase start
npm run web
```

Remote
```bash
npm install
cp .env.example .env
supabase start
npm run web
```

## Validation

```bash
npm test
npm run lint
```

## Notes

- All screen-level backend access goes through `app/modules/*/api.ts`.
- The default implementation uses an in-memory auth adapter that mirrors the planned Supabase contracts for local development and tests.
- Replace the in-memory adapter with a Supabase-backed adapter when wiring a deployed backend.
- `@supabase/supabase-js@2.78.1` is not published on npm, so the runnable scaffold pins `2.78.0`, the nearest available stable release.
- The verification pass fixed the Jest and ESLint configuration to match current package behavior before the app/auth tests were run.
