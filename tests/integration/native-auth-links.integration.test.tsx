import { fireEvent, waitFor } from "@testing-library/react-native";

import ResetPasswordScreen from "@/app/reset-password";
import VerifyEmailScreen from "@/app/verify-email";
import { createAuthApi } from "@/app/modules/auth/api";
import { renderWithProviders, resetTestAuthApi } from "@/tests/test-utils";

const router = jest.requireMock("expo-router").__router;

afterEach(() => {
  resetTestAuthApi();
});

test("accepts native verification deep links", async () => {
  const api = createAuthApi();
  await api.signUp({
    username: "native.verify",
    email: "native-verify@example.com",
    password: "password123"
  });
  const token = api.getLatestVerificationToken("native-verify@example.com");
  router.setSearchParams({
    url: `starterapp://verify-email?token_hash=${token}`
  });
  renderWithProviders(<VerifyEmailScreen />, api);

  await waitFor(() => {
    expect(router.replace).toHaveBeenCalledWith("/");
  });
});

test("accepts native reset deep links", async () => {
  const api = createAuthApi();
  await api.requestPasswordReset({ email: "demo@example.com" });
  const token = api.getLatestResetToken("demo@example.com");
  router.setSearchParams({
    url: `starterapp://reset-password?token_hash=${token}`
  });
  const screen = renderWithProviders(<ResetPasswordScreen />, api);

  fireEvent.changeText(screen.getByLabelText("New password"), "freshpass123");
  fireEvent.changeText(screen.getByLabelText("Confirm password"), "freshpass123");
  fireEvent.press(screen.getByText("Update password"));

  await waitFor(() => {
    expect(router.replace).toHaveBeenCalledWith("/sign-in");
  });
});
