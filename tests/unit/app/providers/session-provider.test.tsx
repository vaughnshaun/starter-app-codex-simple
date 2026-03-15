import { Text } from "react-native";
import { waitFor } from "@testing-library/react-native";

import { createAuthApi } from "@/app/modules/auth/api";
import {
  getProtectedRouteRedirect,
  getPublicRouteRedirect,
  useSession
} from "@/app/providers/session-provider";
import { renderWithProviders, resetTestAuthApi } from "@/tests/test-utils";

function SessionStatusProbe() {
  const session = useSession();
  return <Text>{session.isReady ? session.status : "loading"}</Text>;
}

afterEach(() => {
  resetTestAuthApi();
});

test("resolves session state from the provider", async () => {
  const api = createAuthApi();
  const screen = renderWithProviders(<SessionStatusProbe />, api);

  await waitFor(() => {
    expect(screen.getByText("signed_out")).toBeOnTheScreen();
  });
});

test("computes redirect helpers for protected and public routes", () => {
  expect(getProtectedRouteRedirect("signed_out", "/profile")).toBe("/sign-in?next=%2Fprofile");
  expect(getProtectedRouteRedirect("signed_in_unverified", "/profile")).toBe("/verify-email");
  expect(getPublicRouteRedirect("signed_in_verified", "/profile")).toBe("/profile");
});

