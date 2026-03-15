import { QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";

import { getQueryClient } from "@/app/lib/query-client";
import { SessionProvider } from "@/app/providers/session-provider";

export default function RootLayout() {
  return (
    <QueryClientProvider client={getQueryClient()}>
      <SessionProvider>
        <Slot />
      </SessionProvider>
    </QueryClientProvider>
  );
}

