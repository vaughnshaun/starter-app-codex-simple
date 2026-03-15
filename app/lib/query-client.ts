import { QueryClient } from "@tanstack/react-query";

let queryClient: QueryClient | null = null;

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: Infinity,
        retry: false,
        staleTime: 1_000
      },
      mutations: {
        gcTime: Infinity,
        retry: false
      }
    }
  });
}

export function getQueryClient(): QueryClient {
  if (!queryClient) {
    queryClient = createQueryClient();
  }

  return queryClient;
}
