import { useEffect, useState } from "react";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "react-native";

import { VerificationStatus } from "@/app/modules/auth/components/verification-status";
import { ROUTES } from "@/app/modules/auth/navigation";
import {
  useResendVerificationMutation,
  useVerificationCallbackMutation
} from "@/app/modules/auth/hooks";
import { useSession } from "@/app/providers/session-provider";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    email?: string;
    token_hash?: string;
    url?: string;
  }>();
  const session = useSession();
  const resendMutation = useResendVerificationMutation();
  const verifyMutation = useVerificationCallbackMutation();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const tokenHash = Array.isArray(params.token_hash) ? params.token_hash[0] : params.token_hash;
    const url = Array.isArray(params.url) ? params.url[0] : params.url;

    if (!tokenHash && !url) {
      return;
    }

    verifyMutation
      .mutateAsync({
        tokenHash,
        url
      })
      .then(() => {
        router.replace(ROUTES.home);
      })
      .catch((error: any) => {
        setMessage(error?.message || "This verification link is invalid or expired.");
      });
  }, [params.token_hash, params.url, router, verifyMutation]);

  if (session.isReady && session.status === "signed_in_verified") {
    return <Redirect href={ROUTES.home} />;
  }

  return (
    <>
      <VerificationStatus
        email={Array.isArray(params.email) ? params.email[0] : params.email}
        isLoading={resendMutation.isPending}
        message={message}
        onResend={async () => {
          await resendMutation.mutateAsync({
            email: Array.isArray(params.email) ? params.email[0] : params.email
          });
          setMessage("Verification instructions have been refreshed.");
        }}
      />
      {verifyMutation.isPending ? <Text>Verifying link...</Text> : null}
    </>
  );
}

