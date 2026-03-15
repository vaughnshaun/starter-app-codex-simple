import { useQuery } from "@tanstack/react-query";

import { profileApi } from "@/app/modules/profile/api";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => profileApi.getCurrentProfile()
  });
}

