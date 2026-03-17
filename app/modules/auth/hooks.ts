import { useMutation, useQueryClient } from "@tanstack/react-query";

import { profileQueryKey } from "@/app/modules/profile/hooks";

import { callHelloWorldEndpoint, resendVerificationEmail, signUpUser } from "./api";
import type {
  AuthProfile,
  HelloWorldResponse,
  ResendVerificationInput,
  SignUpInput
} from "./types";

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

export function useHelloWorld() {
  return useMutation<HelloWorldResponse, Error, void>({
    mutationFn: callHelloWorldEndpoint
  });
}
