## Quickstart

Run all commands from the repository root. One `npm install` is enough for the app and local Supabase workflow in this project.

### One Time
Install eas for building and deploying expo apps
```bash
npm install -g eas-cli
```

Deploy the Go app to Test Flight so it can be download to your device
```bash
eas go
```

If you get an agreement error, log in to your Apple Developer account then run `eas go` again
```text
Apple 403 detected - Access forbidden. Unable to process request - PLA Update available - You currently don't have access to this membership resource. To resolve this issue, agree to the latest Program License Agreement in your developer account.
```

1. Go to App Store and download TestFlight.
2. Go to your email where the invite was sent then it prompts you to install the Expo Go app.
3. Remove the old Expo Go app.
4. Run `npx expo start`.
5. Scan QR code with camera.

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

#### Hello world endpoint

1. Start the local Supabase stack.
2. Serve or deploy the `hello-world` edge function.
3. Open the sign-up screen.
4. Press **Resend Verification** and confirm it still works.
5. Press **Test Hello World**.
6. Confirm a success alert shows `Hello, world!` when the active user session is valid.
7. Confirm an error alert appears when no valid session is available or the endpoint returns an error.