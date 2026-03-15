import {
  handleUsernameSignIn,
  normalizeIdentifier
} from "@/supabase/functions/username-sign-in/index";

test("normalizes usernames case-insensitively", () => {
  expect(normalizeIdentifier(" Jane.Doe ")).toBe("jane.doe");
});

test("returns a verified session payload for valid credentials", async () => {
  const result = await handleUsernameSignIn(
    {
      identifier: "demo.user",
      password: "password123"
    },
    {
      findUserByIdentifier: async () => ({
        id: "user-1",
        email: "demo@example.com",
        username: "demo.user",
        emailVerified: true,
        password: "password123"
      }),
      issueSession: async () => ({
        accessToken: "access",
        refreshToken: "refresh",
        expiresAt: 123
      })
    }
  );

  expect(result.status).toBe(200);
  expect(result.body.user.username).toBe("demo.user");
});

test("returns invalid credentials and unverified errors with the contract codes", async () => {
  const invalid = await handleUsernameSignIn(
    {
      identifier: "demo.user",
      password: "wrong"
    },
    {
      findUserByIdentifier: async () => ({
        id: "user-1",
        email: "demo@example.com",
        username: "demo.user",
        emailVerified: true,
        password: "password123"
      }),
      issueSession: async () => ({
        accessToken: "access",
        refreshToken: "refresh",
        expiresAt: 123
      })
    }
  );

  const unverified = await handleUsernameSignIn(
    {
      identifier: "demo.user",
      password: "password123"
    },
    {
      findUserByIdentifier: async () => ({
        id: "user-1",
        email: "demo@example.com",
        username: "demo.user",
        emailVerified: false,
        password: "password123"
      }),
      issueSession: async () => ({
        accessToken: "access",
        refreshToken: "refresh",
        expiresAt: 123
      })
    }
  );

  expect(invalid.status).toBe(401);
  expect(invalid.body.code).toBe("INVALID_CREDENTIALS");
  expect(unverified.status).toBe(403);
  expect(unverified.body.code).toBe("EMAIL_NOT_CONFIRMED");
});

