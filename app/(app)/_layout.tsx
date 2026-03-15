import { ActivityIndicator, View } from "react-native";
import { Redirect, Slot, usePathname } from "expo-router";

import { getProtectedRouteRedirect, useSession } from "@/app/providers/session-provider";

export default function ProtectedLayout() {
  const pathname = usePathname();
  const session = useSession();

  if (!session.isReady || session.status === "unknown") {
    return (
      <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  const redirect = getProtectedRouteRedirect(session.status, pathname);
  if (redirect) {
    return <Redirect href={redirect} />;
  }

  return <Slot />;
}

