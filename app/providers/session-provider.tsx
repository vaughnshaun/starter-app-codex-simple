import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { buildSignInHref, ROUTES, sanitizeNextDestination } from "@/app/modules/auth/navigation";
import { AuthSessionSnapshot, SessionStatus } from "@/app/modules/auth/types";
import { getAuthApi } from "@/app/modules/auth/api";

interface SessionContextValue extends AuthSessionSnapshot {
  isReady: boolean;
  refresh: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function getProtectedRouteRedirect(
  status: SessionStatus,
  pathname: string
): string | null {
  if (status === "signed_out" || status === "expired") {
    return buildSignInHref(pathname);
  }

  if (status === "signed_in_unverified") {
    return ROUTES.verifyEmail;
  }

  return null;
}

export function getPublicRouteRedirect(
  status: SessionStatus,
  next?: string | string[] | null
): string | null {
  if (status === "signed_in_verified") {
    return sanitizeNextDestination(next);
  }

  return null;
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<AuthSessionSnapshot>(() => {
    return getAuthApi().peekSessionSnapshot();
  });
  const [isReady, setIsReady] = useState(true);

  useEffect(() => {
    const unsubscribe = getAuthApi().subscribe((nextSnapshot) => {
      setSnapshot(nextSnapshot);
      setIsReady(true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const value = useMemo<SessionContextValue>(() => {
    return {
      ...snapshot,
      isReady,
      refresh: async () => {
        const nextSnapshot = await getAuthApi().getSessionSnapshot();
        setSnapshot(nextSnapshot);
      }
    };
  }, [isReady, snapshot]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within SessionProvider.");
  }

  return context;
}
