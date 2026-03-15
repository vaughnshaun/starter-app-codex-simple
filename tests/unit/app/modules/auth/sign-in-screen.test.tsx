import { fireEvent, waitFor } from "@testing-library/react-native";

import SignInScreen from "@/app/sign-in";
import { createAuthApi } from "@/app/modules/auth/api";
import { renderWithProviders, resetTestAuthApi } from "@/tests/test-utils";

const router = jest.requireMock("expo-router").__router;

afterEach(() => {
  resetTestAuthApi();
});

test("shows field validation before submitting", async () => {
  const api = createAuthApi();
  const screen = renderWithProviders(<SignInScreen />, api);

  await waitFor(() => {
    expect(screen.getByLabelText("Username or email")).toBeOnTheScreen();
  });

  fireEvent.press(screen.getAllByText("Sign in")[1]);

  expect(screen.getByText("Enter your username or email.")).toBeOnTheScreen();
  expect(screen.getByText("Enter your password.")).toBeOnTheScreen();
});

test("returns the user to the protected destination after sign in", async () => {
  const api = createAuthApi();
  router.setSearchParams({ next: "/profile" });
  const screen = renderWithProviders(<SignInScreen />, api);

  await waitFor(() => {
    expect(screen.getByLabelText("Username or email")).toBeOnTheScreen();
  });

  fireEvent.changeText(screen.getByLabelText("Username or email"), "demo.user");
  fireEvent.changeText(screen.getByLabelText("Password"), "password123");
  fireEvent.press(screen.getAllByText("Sign in")[1]);

  await waitFor(() => {
    expect(router.replace).toHaveBeenCalledWith("/profile");
  });
});
