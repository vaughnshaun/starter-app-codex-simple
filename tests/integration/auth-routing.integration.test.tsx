import { waitFor } from "@testing-library/react-native";

import ProtectedLayout from "@/app/(app)/_layout";
import HomeScreen from "@/app/(app)/index";
import ProfileScreen from "@/app/(app)/profile";
import { createAuthApi } from "@/app/modules/auth/api";
import { renderWithProviders, resetTestAuthApi } from "@/tests/test-utils";

const router = jest.requireMock("expo-router").__router;

afterEach(() => {
  resetTestAuthApi();
});

test("redirects signed-out users to sign-in and preserves next destinations", async () => {
  const api = createAuthApi();
  router.setPathname("/profile");
  const screen = renderWithProviders(<ProtectedLayout />, api);

  await waitFor(() => {
    expect(screen.getByTestId("redirect")).toHaveTextContent(
      "Redirect:/sign-in?next=%2Fprofile"
    );
  });
});

test("blocks unverified sessions from protected routes", async () => {
  const api = createAuthApi();
  api.seedAccount({
    username: "pending.user",
    email: "pending@example.com",
    password: "password123",
    emailVerified: false
  });
  await api.startSession("pending@example.com");
  router.setPathname("/");
  const screen = renderWithProviders(<ProtectedLayout />, api);

  await waitFor(() => {
    expect(screen.getByTestId("redirect")).toHaveTextContent("Redirect:/verify-email");
  });
});

test("shows protected screens for verified sessions and redirects after session expiry", async () => {
  const api = createAuthApi();
  await api.signIn({
    identifier: "demo.user",
    password: "password123"
  });
  const home = renderWithProviders(<HomeScreen />, api);

  await waitFor(() => {
    expect(home.getByTestId("welcome-copy")).toHaveTextContent("Welcome, demo.user.");
  });

  const profile = renderWithProviders(<ProfileScreen />, api);
  await waitFor(() => {
    expect(profile.getByText("Username: demo.user")).toBeOnTheScreen();
  });

  await api.expireSession();
  router.setPathname("/");
  const guarded = renderWithProviders(<ProtectedLayout />, api);

  await waitFor(() => {
    expect(guarded.getByTestId("redirect")).toHaveTextContent("Redirect:/sign-in?next=%2F");
  });
});
