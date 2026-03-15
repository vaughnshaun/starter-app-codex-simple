import { createAuthApi } from "@/app/modules/auth/api";

test("resolves auth state and protected transitions within the planned thresholds", async () => {
  const api = createAuthApi();

  const authStateStart = Date.now();
  await api.getSessionSnapshot();
  const authStateDuration = Date.now() - authStateStart;

  const signInStart = Date.now();
  await api.signIn({
    identifier: "demo.user",
    password: "password123"
  });
  const signInDuration = Date.now() - signInStart;

  const feedbackStart = Date.now();
  await api.requestPasswordReset({ email: "demo@example.com" });
  const feedbackDuration = Date.now() - feedbackStart;

  expect(authStateDuration).toBeLessThan(2_000);
  expect(signInDuration).toBeLessThan(300);
  expect(feedbackDuration).toBeLessThan(1_000);
});

