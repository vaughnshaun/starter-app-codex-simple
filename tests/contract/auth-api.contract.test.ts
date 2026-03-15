import { createAuthApi } from "@/app/modules/auth/api";
import { AuthApiError } from "@/app/modules/auth/types";

test("signs in a verified user with username and password", async () => {
  const api = createAuthApi();

  const result = await api.signIn({
    identifier: "demo.user",
    password: "password123"
  });

  expect(result.status).toBe("signed_in_verified");
  expect(result.user?.email).toBe("demo@example.com");
});

test("creates an unverified account and resends verification", async () => {
  const api = createAuthApi();

  const registration = await api.signUp({
    username: "new.person",
    email: "new.person@example.com",
    password: "password123"
  });

  expect(registration.status).toBe("pending_verification");
  const before = api.getLatestVerificationToken("new.person@example.com");
  await api.resendVerification({ email: "new.person@example.com" });
  const after = api.getLatestVerificationToken("new.person@example.com");
  expect(after).not.toBe(before);
});

test("keeps sign-in blocked until email verification is complete", async () => {
  const api = createAuthApi();
  await api.signUp({
    username: "pending.user",
    email: "pending@example.com",
    password: "password123"
  });

  await expect(
    api.signIn({
      identifier: "pending.user",
      password: "password123"
    })
  ).rejects.toMatchObject<AuthApiError>({
    code: "EMAIL_NOT_CONFIRMED"
  });
});

test("supports password recovery and rejects the superseded password", async () => {
  const api = createAuthApi();
  await api.requestPasswordReset({ email: "demo@example.com" });
  const token = api.getLatestResetToken("demo@example.com");

  await api.completePasswordReset({
    password: "newpassword123",
    tokenHash: token || undefined
  });

  await expect(
    api.signIn({
      identifier: "demo.user",
      password: "password123"
    })
  ).rejects.toMatchObject<AuthApiError>({
    code: "INVALID_CREDENTIALS"
  });

  const result = await api.signIn({
    identifier: "demo.user",
    password: "newpassword123"
  });
  expect(result.status).toBe("signed_in_verified");
});

