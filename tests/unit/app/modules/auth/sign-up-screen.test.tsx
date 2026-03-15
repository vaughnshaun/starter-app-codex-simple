import { fireEvent, waitFor } from "@testing-library/react-native";

import SignUpScreen from "@/app/sign-up";
import { createAuthApi } from "@/app/modules/auth/api";
import { renderWithProviders, resetTestAuthApi } from "@/tests/test-utils";

const router = jest.requireMock("expo-router").__router;

afterEach(() => {
  resetTestAuthApi();
});

test("validates registration fields before submission", async () => {
  const api = createAuthApi();
  const screen = renderWithProviders(<SignUpScreen />, api);

  await waitFor(() => {
    expect(screen.getByLabelText("Username")).toBeOnTheScreen();
  });

  fireEvent.press(screen.getAllByText("Create account")[1]);

  expect(
    screen.getByText("Use 3-24 letters, numbers, periods, or underscores.")
  ).toBeOnTheScreen();
  expect(screen.getByText("Enter a valid email address.")).toBeOnTheScreen();
  expect(screen.getByText("Password must be at least 8 characters.")).toBeOnTheScreen();
});

test("routes new accounts into the verification flow", async () => {
  const api = createAuthApi();
  const screen = renderWithProviders(<SignUpScreen />, api);

  await waitFor(() => {
    expect(screen.getByLabelText("Username")).toBeOnTheScreen();
  });

  fireEvent.changeText(screen.getByLabelText("Username"), "new.person");
  fireEvent.changeText(screen.getByLabelText("Email"), "new.person@example.com");
  fireEvent.changeText(screen.getByLabelText("Password"), "password123");
  fireEvent.press(screen.getAllByText("Create account")[1]);

  await waitFor(() => {
    expect(router.replace).toHaveBeenCalledWith(
      "/verify-email?email=new.person%40example.com"
    );
  });
});
