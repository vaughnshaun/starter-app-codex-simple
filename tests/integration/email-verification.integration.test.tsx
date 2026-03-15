import { fireEvent, waitFor } from "@testing-library/react-native";

import SignUpScreen from "@/app/sign-up";
import VerifyEmailScreen from "@/app/verify-email";
import { createAuthApi } from "@/app/modules/auth/api";
import { renderWithProviders, resetTestAuthApi } from "@/tests/test-utils";

const router = jest.requireMock("expo-router").__router;

afterEach(() => {
  resetTestAuthApi();
});

test("resends verification instructions for pending accounts", async () => {
  const api = createAuthApi();
  const signUp = renderWithProviders(<SignUpScreen />, api);

  await waitFor(() => {
    expect(signUp.getByLabelText("Username")).toBeOnTheScreen();
  });

  fireEvent.changeText(signUp.getByLabelText("Username"), "pending.user");
  fireEvent.changeText(signUp.getByLabelText("Email"), "pending@example.com");
  fireEvent.changeText(signUp.getByLabelText("Password"), "password123");
  fireEvent.press(signUp.getAllByText("Create account")[1]);

  await waitFor(() => {
    expect(router.replace).toHaveBeenCalledWith("/verify-email?email=pending%40example.com");
  });

  const before = api.getLatestVerificationToken("pending@example.com");
  router.reset();
  router.setSearchParams({ email: "pending@example.com" });
  const verify = renderWithProviders(<VerifyEmailScreen />, api);

  fireEvent.press(verify.getByText("Resend verification email"));

  await waitFor(() => {
    expect(verify.getByText("Verification instructions have been refreshed.")).toBeOnTheScreen();
  });

  const after = api.getLatestVerificationToken("pending@example.com");
  expect(after).not.toBe(before);
});

test("accepts a verification callback and unlocks the home route", async () => {
  const api = createAuthApi();
  await api.signUp({
    username: "verify.me",
    email: "verify@example.com",
    password: "password123"
  });
  const token = api.getLatestVerificationToken("verify@example.com");
  router.setSearchParams({ token_hash: token || "" });
  renderWithProviders(<VerifyEmailScreen />, api);

  await waitFor(() => {
    expect(router.replace).toHaveBeenCalledWith("/");
  });
});
