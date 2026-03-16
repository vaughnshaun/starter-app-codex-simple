import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { SignUpScreen } from "@/app/modules/auth/components/sign-up-screen";
import * as authApi from "@/app/modules/auth/api";
import * as profileApi from "@/app/modules/profile/api";
import type { StoredProfile } from "@/app/modules/profile/types";

function renderWithProviders() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 0,
        retry: false
      },
      mutations: {
        gcTime: 0,
        retry: false
      }
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <SignUpScreen />
    </QueryClientProvider>
  );
}

describe("SignUpScreen", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("shows the stored profile when one already exists", async () => {
    const storedProfile: StoredProfile = {
      userId: "user-123",
      username: "saved@example.com",
      email: "saved@example.com",
      createdAt: "2026-03-16T10:00:00.000Z",
      emailConfirmedAt: null
    };

    jest.spyOn(profileApi, "getStoredProfile").mockResolvedValue(storedProfile);

    renderWithProviders();

    expect(await screen.findByText("Username: saved@example.com")).toBeOnTheScreen();
    expect(screen.getByText("Email Verified: Pending")).toBeOnTheScreen();
  });

  test("submits username and password, then shows the saved profile", async () => {
    jest.spyOn(profileApi, "getStoredProfile").mockResolvedValue(null);
    jest.spyOn(authApi, "signUpUser").mockResolvedValue({
      userId: "user-999",
      username: "new@example.com",
      email: "new@example.com",
      createdAt: "2026-03-16T15:30:00.000Z",
      emailConfirmedAt: null
    });

    renderWithProviders();

    fireEvent.changeText(screen.getByLabelText("Username"), "new@example.com");
    fireEvent.changeText(screen.getByLabelText("Password"), "password123");
    fireEvent.press(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
      expect(authApi.signUpUser).toHaveBeenCalled();
    });

    expect(jest.mocked(authApi.signUpUser).mock.calls[0]?.[0]).toEqual({
      username: "new@example.com",
      password: "password123"
    });

    expect(await screen.findByText("Username: new@example.com")).toBeOnTheScreen();
    expect(screen.getByText("User ID: user-999")).toBeOnTheScreen();
  });
});
