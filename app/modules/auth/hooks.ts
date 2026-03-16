import { useMutation, useQueryClient } from "@tanstack/react-query";

import { profileQueryKey } from "@/app/modules/profile/hooks";

import { signUpUser } from "./api";
import type { AuthProfile, SignUpInput } from "./types";

export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation<AuthProfile, Error, SignUpInput>({
    mutationFn: signUpUser,
    onSuccess: (profile) => {
      queryClient.setQueryData(profileQueryKey, profile);
    }
  });
}
