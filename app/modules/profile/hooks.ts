import { useQuery } from "@tanstack/react-query";

import { getStoredProfile } from "./api";
import type { StoredProfile } from "./types";

export const profileQueryKey = ["profile"] as const;

export function useStoredProfile() {
  return useQuery<StoredProfile | null>({
    queryKey: profileQueryKey,
    queryFn: getStoredProfile
  });
}
