## Quickstart

Run all commands from the repository root. One `npm install` is enough for the app and local Supabase workflow in this project.

### Supabase command reference

- `supabase link`: Link the CLI to a Supabase project.
- `supabase start`: Start the local Supabase Docker stack.
- `supabase db reset`: Rebuild the local database from migrations.
- `supabase db push`: Push schema changes to the linked cloud project.
- `supabase functions serve --env-file .env.local`: Run local edge functions.
- `supabase functions deploy`: Deploy edge functions to the linked cloud project.
- `supabase functions deploy --no-verify-jwt`: Deploy a function without JWT verification.
- `supabase functions list`: List deployed edge functions.
- `npx expo start`: Start Expo directly.

### Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the local Supabase stack:

   ```bash
   supabase start
   ```

3. Apply the local database schema:

   ```bash
   supabase db reset
   ```

4. Start the mobile app:

   ```bash
   npm start
   ```

5. Optional: run edge functions locally when testing them in isolation:

   ```bash
   supabase functions serve --env-file .env.local
   ```

### Validation checklist

#### Auth and navigation

1. Open the app in Expo Go or an emulator.
2. Confirm unauthenticated users are redirected to `/(auth)/sign-in`.
3. Create an account with email and password.
4. Sign in with the same credentials.
5. Confirm successful navigation to `/(app)`.
6. Sign out and confirm the app returns to the login route.