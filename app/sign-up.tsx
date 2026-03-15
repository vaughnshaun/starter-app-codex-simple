import { Redirect, useRouter } from "expo-router";
import { Text, View } from "react-native";

import { SignUpForm } from "@/app/modules/auth/components/sign-up-form";
import { ROUTES } from "@/app/modules/auth/navigation";
import { useSignUpMutation } from "@/app/modules/auth/hooks";
import { getPublicRouteRedirect, useSession } from "@/app/providers/session-provider";

export default function SignUpScreen() {
  const router = useRouter();
  const session = useSession();
  const signUpMutation = useSignUpMutation();

  if (!session.isReady) {
    return <Text>Loading session...</Text>;
  }

  const redirect = getPublicRouteRedirect(session.status);
  if (redirect) {
    return <Redirect href={redirect} />;
  }

  return (
    <View>
      <SignUpForm
        errorMessage={signUpMutation.error?.message || null}
        isLoading={signUpMutation.isPending}
        onSubmit={async (input) => {
          const result = await signUpMutation.mutateAsync(input);
          router.replace(`${ROUTES.verifyEmail}?email=${encodeURIComponent(result.email)}`);
        }}
      />
    </View>
  );
}

