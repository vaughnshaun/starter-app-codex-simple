import type { ReactElement } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react-native";

import { createQueryClient } from "@/app/lib/query-client";
import { resetAuthApiForTests, setAuthApiForTests } from "@/app/modules/auth/api";
import { TestAuthApi } from "@/app/modules/auth/types";
import { SessionProvider } from "@/app/providers/session-provider";

export function renderWithProviders(ui: ReactElement, api: TestAuthApi) {
  setAuthApiForTests(api);
  const queryClient = createQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <SessionProvider>{ui}</SessionProvider>
    </QueryClientProvider>
  );
}

export function resetTestAuthApi() {
  resetAuthApiForTests();
}
