import { fireEvent, waitFor } from "@testing-library/react-native";

import ForgotPasswordScreen from "@/app/forgot-password";
import { createAuthApi } from "@/app/modules/auth/api";
import { renderWithProviders, resetTestAuthApi } from "@/tests/test-utils";

afterEach(() => {
  resetTestAuthApi();
});

test("returns a neutral recovery message", async () => {
  const api = createAuthApi();
  const screen = renderWithProviders(<ForgotPasswordScreen />, api);

  fireEvent.changeText(screen.getByLabelText("Email"), "missing@example.com");
  fireEvent.press(screen.getByText("Send reset link"));

  await waitFor(() => {
    expect(
      screen.getByText(
        "If an eligible account exists, password reset instructions have been sent."
      )
    ).toBeOnTheScreen();
  });
});

