import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getAuthApi } from "@/app/modules/auth/api";
import {
  PasswordRecoveryInput,
  PasswordResetInput,
  ResendVerificationInput,
  SignInInput,
  SignUpInput,
  VerificationCallbackInput
} from "@/app/modules/auth/types";

export function useSignInMutation() {
  return useMutation({
    mutationFn: (input: SignInInput) => getAuthApi().signIn(input)
  });
}

export function useSignUpMutation() {
  return useMutation({
    mutationFn: (input: SignUpInput) => getAuthApi().signUp(input)
  });
}

export function useSignOutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => getAuthApi().signOut(),
    onSuccess: async () => {
      await queryClient.cancelQueries();
      queryClient.clear();
    }
  });
}

export function useResendVerificationMutation() {
  return useMutation({
    mutationFn: (input?: ResendVerificationInput) => getAuthApi().resendVerification(input)
  });
}

export function usePasswordRecoveryMutation() {
  return useMutation({
    mutationFn: (input: PasswordRecoveryInput) => getAuthApi().requestPasswordReset(input)
  });
}

export function usePasswordResetMutation() {
  return useMutation({
    mutationFn: (input: PasswordResetInput) => getAuthApi().completePasswordReset(input)
  });
}

export function useVerificationCallbackMutation() {
  return useMutation({
    mutationFn: (input: VerificationCallbackInput) =>
      getAuthApi().consumeVerificationCallback(input)
  });
}

