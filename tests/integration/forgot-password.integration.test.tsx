import { fireEvent, waitFor } from "@testing-library/react-native";

import ForgotPasswordScreen from "@/app/forgot-password";
import ResetPasswordScreen from "@/app/reset-password";
import { createAuthApi } from "@/app/modules/auth/api";
import { AuthApiError } from "@/app/modules/auth/types";
import { renderWithProviders, resetTestAuthApi } from "@/tests/test-utils";

const router = jest.requireMock("expo-router").__router;

afterEach(() => {
  resetTestAuthApi();
});

test("completes the reset flow and rejects stale credentials", async () => {
  const api = createAuthApi();
  const forgot = renderWithProviders(<ForgotPasswordScreen />, api);

  fireEvent.changeText(forgot.getByLabelText("Email"), "demo@example.com");
  fireEvent.press(forgot.getByText("Send reset link"));

  await waitFor(() => {
    expect(
      forgot.getByText(
        "If an eligible account exists, password reset instructions have been sent."
      )
    ).toBeOnTheScreen();
  });

  const token = api.getLatestResetToken("demo@example.com");
  router.setSearchParams({ token_hash: token || "" });
  const reset = renderWithProviders(<ResetPasswordScreen />, api);

  fireEvent.changeText(reset.getByLabelText("New password"), "resetpass123");
  fireEvent.changeText(reset.getByLabelText("Confirm password"), "resetpass123");
  fireEvent.press(reset.getByText("Update password"));

  await waitFor(() => {
    expect(router.replace).toHaveBeenCalledWith("/sign-in");
  });

  await expect(
    api.signIn({
      identifier: "demo.user",
      password: "password123"
    })
  ).rejects.toMatchObject<AuthApiError>({
    code: "INVALID_CREDENTIALS"
  });

  const signedIn = await api.signIn({
    identifier: "demo.user",
    password: "resetpass123"
  });
  expect(signedIn.status).toBe("signed_in_verified");
});

