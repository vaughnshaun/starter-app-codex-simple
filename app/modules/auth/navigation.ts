import { getEnv } from "@/app/lib/env";

export const ROUTES = {
  home: "/",
  profile: "/profile",
  signIn: "/sign-in",
  signUp: "/sign-up",
  verifyEmail: "/verify-email",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password"
} as const;

export const PROTECTED_ROUTES = [ROUTES.home, ROUTES.profile] as const;

export function isProtectedRoute(pathname: string | null | undefined): boolean {
  return PROTECTED_ROUTES.includes((pathname || "") as (typeof PROTECTED_ROUTES)[number]);
}

export function sanitizeNextDestination(
  next: string | string[] | null | undefined
): (typeof PROTECTED_ROUTES)[number] {
  const candidate = Array.isArray(next) ? next[0] : next;
  return isProtectedRoute(candidate) ? (candidate as (typeof PROTECTED_ROUTES)[number]) : ROUTES.home;
}

export function buildSignInHref(next?: string | null): string {
  const safeNext = sanitizeNextDestination(next);
  return `${ROUTES.signIn}?next=${encodeURIComponent(safeNext)}`;
}

export function getVerificationRedirectTargets(): string[] {
  const env = getEnv();

  return [
    `${env.siteUrl}${ROUTES.verifyEmail}`,
    `${env.appScheme}://${ROUTES.verifyEmail.replace(/^\//, "")}`
  ];
}

export function getResetRedirectTargets(): string[] {
  const env = getEnv();

  return [
    `${env.siteUrl}${ROUTES.resetPassword}`,
    `${env.appScheme}://${ROUTES.resetPassword.replace(/^\//, "")}`
  ];
}

export function createAppUrl(pathname: string, params?: Record<string, string>): string {
  const env = getEnv();
  const url = new URL(`${env.siteUrl}${pathname}`);

  Object.entries(params || {}).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return url.toString();
}

export function parseAuthCallback(input?: string | null): Record<string, string> {
  if (!input) {
    return {};
  }

  const normalizedInput = input.includes("://")
    ? input.replace(":///", "://")
    : `${getEnv().siteUrl}${input.startsWith("/") ? input : `/${input}`}`;

  try {
    const url = new URL(normalizedInput);
    const params = Object.fromEntries(url.searchParams.entries());

    if (!params.pathname && url.pathname) {
      params.pathname = url.pathname;
    }

    return params;
  } catch {
    return {};
  }
}

