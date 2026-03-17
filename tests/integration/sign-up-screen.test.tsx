import { Alert } from "react-native";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { SignUpScreen } from "@/app/modules/auth/components/sign-up-screen";
import * as authApi from "@/app/modules/auth/api";
import * as profileApi from "@/app/modules/profile/api";

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

describe("SignUpScreen hello world flow", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("shows a success alert when the hello world endpoint succeeds", async () => {
    jest.spyOn(profileApi, "getStoredProfile").mockResolvedValue(null);
    jest.spyOn(authApi, "callHelloWorldEndpoint").mockResolvedValue({
      message: "Hello, world!"
    });
    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(jest.fn());

    renderWithProviders();

    fireEvent.press(await screen.findByRole("button", { name: "Test Hello World" }));

    await waitFor(() => {
      expect(authApi.callHelloWorldEndpoint).toHaveBeenCalled();
    });

    expect(alertSpy).toHaveBeenCalledWith("Hello World", "Hello, world!");
  });

  test("shows an error alert when the hello world endpoint fails", async () => {
    jest.spyOn(profileApi, "getStoredProfile").mockResolvedValue(null);
    jest.spyOn(authApi, "callHelloWorldEndpoint").mockRejectedValue(
      new Error("Unauthorized.")
    );
    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(jest.fn());

    renderWithProviders();

    fireEvent.press(await screen.findByRole("button", { name: "Test Hello World" }));

    await waitFor(() => {
      expect(authApi.callHelloWorldEndpoint).toHaveBeenCalled();
    });

    expect(alertSpy).toHaveBeenCalledWith("Hello World Error", "Unauthorized.");
  });
});
