import { readFileSync } from "fs";

import { createAuthApi } from "@/app/modules/auth/api";

test("documents the local Supabase migration for profiles and policies", () => {
  const migration = readFileSync(
    "supabase/migrations/001_create_profiles_and_policies.sql",
    "utf8"
  );

  expect(migration).toContain("create table if not exists public.profiles");
  expect(migration).toContain("alter table public.profiles enable row level security");
  expect(migration).toContain("create policy \"Users can read their own profile\"");
});

test("supports a local end-to-end auth lifecycle with verification and reset tokens", async () => {
  const api = createAuthApi();

  await api.signUp({
    username: "local.user",
    email: "local@example.com",
    password: "password123"
  });

  await api.consumeVerificationCallback({
    tokenHash: api.getLatestVerificationToken("local@example.com") || undefined
  });

  const signedIn = await api.signIn({
    identifier: "local.user",
    password: "password123"
  });
  expect(signedIn.status).toBe("signed_in_verified");

  await api.requestPasswordReset({ email: "local@example.com" });
  await api.completePasswordReset({
    password: "updatedpass123",
    tokenHash: api.getLatestResetToken("local@example.com") || undefined
  });

  const updatedSession = await api.signIn({
    identifier: "local.user",
    password: "updatedpass123"
  });
  expect(updatedSession.status).toBe("signed_in_verified");
});

