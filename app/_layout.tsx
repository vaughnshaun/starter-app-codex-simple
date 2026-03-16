import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

import { getQueryClient } from "@/app/lib/query-client";

const queryClient = getQueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}
