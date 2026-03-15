import { Redirect } from "expo-router";
import { View } from "react-native";

import { ForgotPasswordForm } from "@/app/modules/auth/components/forgot-password-form";
import { ROUTES } from "@/app/modules/auth/navigation";
import { usePasswordRecoveryMutation } from "@/app/modules/auth/hooks";
import { getPublicRouteRedirect, useSession } from "@/app/providers/session-provider";

export default function ForgotPasswordScreen() {
  const session = useSession();
  const recoveryMutation = usePasswordRecoveryMutation();

  const redirect = getPublicRouteRedirect(session.status);
  if (redirect) {
    return <Redirect href={ROUTES.home} />;
  }

  return (
    <View>
      <ForgotPasswordForm
        errorMessage={recoveryMutation.error?.message || null}
        isLoading={recoveryMutation.isPending}
        onSubmit={async (input) => {
          await recoveryMutation.mutateAsync(input);
        }}
      />
    </View>
  );
}

