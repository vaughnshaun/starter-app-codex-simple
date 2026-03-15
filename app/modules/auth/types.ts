export type SessionStatus =
  | "unknown"
  | "signed_out"
  | "signed_in_unverified"
  | "signed_in_verified"
  | "expired";

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  emailVerified: boolean;
}

export interface AuthProfileSnapshot {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
}

export interface AuthSessionSnapshot {
  session: AuthSession | null;
  user: AuthUser | null;
  status: SessionStatus;
}

export interface SignInInput {
  identifier: string;
  password: string;
}

export interface SignUpInput {
  username: string;
  email: string;
  password: string;
}

export interface PasswordRecoveryInput {
  email: string;
}

export interface PasswordResetInput {
  password: string;
  tokenHash?: string;
  url?: string;
}

export interface VerificationCallbackInput {
  tokenHash?: string;
  url?: string;
}

export interface VerificationResult {
  status: "pending_verification";
  email: string;
}

export interface ResendVerificationInput {
  email?: string;
}

export type AuthErrorCode =
  | "INVALID_CREDENTIALS"
  | "EMAIL_NOT_CONFIRMED"
  | "RATE_LIMITED"
  | "SIGN_IN_UNAVAILABLE"
  | "USERNAME_TAKEN"
  | "EMAIL_TAKEN"
  | "INVALID_EMAIL"
  | "INVALID_PASSWORD"
  | "INVALID_USERNAME"
  | "INVALID_TOKEN"
  | "UNAUTHENTICATED";

export class AuthApiError extends Error {
  code: AuthErrorCode;
  field?: string;
  meta?: Record<string, string>;

  constructor(
    code: AuthErrorCode,
    message: string,
    options?: { field?: string; meta?: Record<string, string> }
  ) {
    super(message);
    this.code = code;
    this.field = options?.field;
    this.meta = options?.meta;
  }
}

export interface AuthApi {
  peekSessionSnapshot(): AuthSessionSnapshot;
  getSessionSnapshot(): Promise<AuthSessionSnapshot>;
  subscribe(listener: (snapshot: AuthSessionSnapshot) => void): () => void;
  signIn(input: SignInInput): Promise<AuthSessionSnapshot>;
  signUp(input: SignUpInput): Promise<VerificationResult>;
  signOut(): Promise<void>;
  resendVerification(input?: ResendVerificationInput): Promise<{ status: "resent" }>;
  consumeVerificationCallback(input: VerificationCallbackInput): Promise<AuthSessionSnapshot>;
  requestPasswordReset(input: PasswordRecoveryInput): Promise<{ status: "sent" }>;
  completePasswordReset(input: PasswordResetInput): Promise<{ status: "updated" }>;
  getProfile(): Promise<AuthProfileSnapshot>;
}

export interface TestAuthApi extends AuthApi {
  seedAccount(input: SignUpInput & { emailVerified?: boolean }): AuthUser;
  getLatestVerificationToken(email: string): string | null;
  getLatestResetToken(email: string): string | null;
  startSession(email: string): Promise<AuthSessionSnapshot>;
  expireSession(): Promise<void>;
}

export function deriveSessionStatus(snapshot: {
  session: AuthSession | null;
  user: AuthUser | null;
}): SessionStatus {
  if (!snapshot.session || !snapshot.user) {
    return "signed_out";
  }

  if (snapshot.session.expiresAt <= Math.floor(Date.now() / 1000)) {
    return "expired";
  }

  return snapshot.user.emailVerified ? "signed_in_verified" : "signed_in_unverified";
}
