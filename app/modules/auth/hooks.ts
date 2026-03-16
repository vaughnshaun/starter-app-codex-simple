import { useMutation, useQueryClient } from "@tanstack/react-query";

import { profileQueryKey } from "@/app/modules/profile/hooks";

import { resendVerificationEmail, signUpUser } from "./api";
import type { AuthProfile, ResendVerificationInput, SignUpInput } from "./types";

export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation<AuthProfile, Error, SignUpInput>({
    mutationFn: signUpUser,
    onSuccess: (profile) => {
      queryClient.setQueryData(profileQueryKey, profile);
    }
  });
}

export function useResendVerification() {
  return useMutation<void, Error, ResendVerificationInput>({
    mutationFn: resendVerificationEmail
  });
}
