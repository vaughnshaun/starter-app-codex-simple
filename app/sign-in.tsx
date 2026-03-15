import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { Text, View } from "react-native";

import { SignInForm } from "@/app/modules/auth/components/sign-in-form";
import { ROUTES, sanitizeNextDestination } from "@/app/modules/auth/navigation";
import { useSignInMutation } from "@/app/modules/auth/hooks";
import { getPublicRouteRedirect, useSession } from "@/app/providers/session-provider";

export default function SignInScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ next?: string }>();
  const session = useSession();
  const signInMutation = useSignInMutation();

  if (!session.isReady) {
    return <Text>Loading session...</Text>;
  }

  const redirect = getPublicRouteRedirect(session.status, params.next);
  if (redirect) {
    return <Redirect href={redirect} />;
  }

  return (
    <View>
      <SignInForm
        errorMessage={signInMutation.error?.message || null}
        isLoading={signInMutation.isPending}
        onSubmit={async (input) => {
          try {
            await signInMutation.mutateAsync(input);
            router.replace(sanitizeNextDestination(params.next));
          } catch (error: any) {
            if (error?.code === "EMAIL_NOT_CONFIRMED") {
              const email = error?.meta?.email || input.identifier;
              router.replace(`${ROUTES.verifyEmail}?email=${encodeURIComponent(email)}`);
            }
          }
        }}
      />
    </View>
  );
}

