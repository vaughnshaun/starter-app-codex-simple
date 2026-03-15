export interface UsernameSignInRequest {
  identifier: string;
  password: string;
}

export interface UsernameSignInUser {
  id: string;
  email: string;
  username: string;
  emailVerified: boolean;
  password: string;
}

export interface UsernameSignInDependencies {
  findUserByIdentifier: (identifier: string) => Promise<UsernameSignInUser | null>;
  issueSession: (user: UsernameSignInUser) => Promise<{
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  }>;
  isRateLimited?: (identifier: string) => Promise<boolean>;
}

export function normalizeIdentifier(identifier: string): string {
  return identifier.trim().toLowerCase();
}

export async function handleUsernameSignIn(
  payload: UsernameSignInRequest,
  dependencies: UsernameSignInDependencies
) {
  if (await dependencies.isRateLimited?.(normalizeIdentifier(payload.identifier))) {
    return {
      status: 429,
      body: {
        code: "RATE_LIMITED",
        message: "Too many sign-in attempts. Try again later."
      }
    };
  }

  const user = await dependencies.findUserByIdentifier(payload.identifier);
  if (!user || user.password !== payload.password) {
    return {
      status: 401,
      body: {
        code: "INVALID_CREDENTIALS",
        message: "Identifier or password is incorrect."
      }
    };
  }

  if (!user.emailVerified) {
    return {
      status: 403,
      body: {
        code: "EMAIL_NOT_CONFIRMED",
        message: "Credentials are valid but the account is not verified."
      }
    };
  }

  const session = await dependencies.issueSession(user);

  return {
    status: 200,
    body: {
      session,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        emailVerified: user.emailVerified
      }
    }
  };
}
