import { useMemo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";

import { ResetPasswordForm } from "@/app/modules/auth/components/reset-password-form";
import { ROUTES } from "@/app/modules/auth/navigation";
import { usePasswordResetMutation } from "@/app/modules/auth/hooks";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    token_hash?: string;
    url?: string;
  }>();
  const resetMutation = usePasswordResetMutation();

  const tokenHash = useMemo(() => {
    return Array.isArray(params.token_hash) ? params.token_hash[0] : params.token_hash;
  }, [params.token_hash]);
  const url = useMemo(() => {
    return Array.isArray(params.url) ? params.url[0] : params.url;
  }, [params.url]);

  return (
    <View>
      <ResetPasswordForm
        errorMessage={resetMutation.error?.message || null}
        hasValidToken={Boolean(tokenHash || url)}
        isLoading={resetMutation.isPending}
        onSubmit={async ({ password }) => {
          await resetMutation.mutateAsync({
            password,
            tokenHash,
            url
          });
          router.replace(ROUTES.signIn);
        }}
      />
    </View>
  );
}

