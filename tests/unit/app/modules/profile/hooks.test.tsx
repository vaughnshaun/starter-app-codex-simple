import { Text } from "react-native";
import { waitFor } from "@testing-library/react-native";

import { createAuthApi } from "@/app/modules/auth/api";
import { useProfile } from "@/app/modules/profile/hooks";
import { renderWithProviders, resetTestAuthApi } from "@/tests/test-utils";

function ProfileProbe() {
  const profileQuery = useProfile();
  return <Text>{profileQuery.data ? profileQuery.data.username : "loading"}</Text>;
}

afterEach(() => {
  resetTestAuthApi();
});

test("loads username, email, and verification status through the profile hook", async () => {
  const api = createAuthApi();
  await api.signIn({
    identifier: "demo.user",
    password: "password123"
  });
  const screen = renderWithProviders(<ProfileProbe />, api);

  await waitFor(() => {
    expect(screen.getByText("demo.user")).toBeOnTheScreen();
  });
});

