import "react-native-url-polyfill/auto";

import { parseAuthCallback } from "@/app/modules/auth/navigation";
import {
  AuthApi,
  AuthApiError,
  AuthProfileSnapshot,
  AuthSession,
  AuthSessionSnapshot,
  AuthUser,
  PasswordRecoveryInput,
  PasswordResetInput,
  ResendVerificationInput,
  SignInInput,
  SignUpInput,
  TestAuthApi,
  VerificationCallbackInput,
  VerificationResult,
  deriveSessionStatus
} from "@/app/modules/auth/types";

interface MemoryAccount {
  id: string;
  username: string;
  usernameNormalized: string;
  email: string;
  password: string;
  emailVerified: boolean;
  verificationToken: string | null;
  resetToken: string | null;
}

type SnapshotListener = (snapshot: AuthSessionSnapshot) => void;

function normalizeUsername(identifier: string): string {
  return identifier.trim().toLowerCase();
}

function validateEmail(email: string): boolean {
  return /\S+@\S+\.\S+/.test(email);
}

function validateUsername(username: string): boolean {
  return /^[a-zA-Z0-9._]{3,24}$/.test(username);
}

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function createSession(): AuthSession {
  return {
    accessToken: createId("access"),
    refreshToken: createId("refresh"),
    expiresAt: Math.floor(Date.now() / 1000) + 60 * 60
  };
}

function toAuthUser(account: MemoryAccount): AuthUser {
  return {
    id: account.id,
    email: account.email,
    username: account.username,
    emailVerified: account.emailVerified
  };
}

export class MemoryAuthApi implements TestAuthApi {
  private accounts = new Map<string, MemoryAccount>();

  private listeners = new Set<SnapshotListener>();

  private currentUserId: string | null = null;

  private currentSession: AuthSession | null = null;

  constructor() {
    this.seedAccount({
      username: "demo.user",
      email: "demo@example.com",
      password: "password123",
      emailVerified: true
    });
  }

  seedAccount(input: SignUpInput & { emailVerified?: boolean }): AuthUser {
    const normalizedUsername = normalizeUsername(input.username);
    const account: MemoryAccount = {
      id: createId("user"),
      username: input.username.trim(),
      usernameNormalized: normalizedUsername,
      email: input.email.trim().toLowerCase(),
      password: input.password,
      emailVerified: Boolean(input.emailVerified),
      verificationToken: input.emailVerified ? null : createId("verify"),
      resetToken: null
    };

    this.accounts.set(account.id, account);
    return toAuthUser(account);
  }

  getLatestVerificationToken(email: string): string | null {
    return this.findByEmail(email)?.verificationToken || null;
  }

  getLatestResetToken(email: string): string | null {
    return this.findByEmail(email)?.resetToken || null;
  }

  async startSession(email: string): Promise<AuthSessionSnapshot> {
    const account = this.findByEmail(email);
    if (!account) {
      throw new AuthApiError("UNAUTHENTICATED", "Account not found.");
    }

    this.currentUserId = account.id;
    this.currentSession = createSession();
    this.emit();
    return this.snapshot();
  }

  async expireSession(): Promise<void> {
    if (this.currentSession) {
      this.currentSession = {
        ...this.currentSession,
        expiresAt: Math.floor(Date.now() / 1000) - 1
      };
      this.emit();
    }
  }

  async getSessionSnapshot(): Promise<AuthSessionSnapshot> {
    return this.snapshot();
  }

  peekSessionSnapshot(): AuthSessionSnapshot {
    return this.snapshot();
  }

  subscribe(listener: SnapshotListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  async signIn(input: SignInInput): Promise<AuthSessionSnapshot> {
    if (!input.identifier.trim()) {
      throw new AuthApiError("INVALID_CREDENTIALS", "Username or email is required.", {
        field: "identifier"
      });
    }

    if (!input.password) {
      throw new AuthApiError("INVALID_CREDENTIALS", "Password is required.", {
        field: "password"
      });
    }

    const account = this.findByIdentifier(input.identifier);
    if (!account || account.password !== input.password) {
      throw new AuthApiError(
        "INVALID_CREDENTIALS",
        "The username/email or password is incorrect."
      );
    }

    if (!account.emailVerified) {
      throw new AuthApiError("EMAIL_NOT_CONFIRMED", "Email verification is still pending.", {
        meta: {
          email: account.email
        }
      });
    }

    this.currentUserId = account.id;
    this.currentSession = createSession();
    this.emit();
    return this.snapshot();
  }

  async signUp(input: SignUpInput): Promise<VerificationResult> {
    if (!validateUsername(input.username.trim())) {
      throw new AuthApiError(
        "INVALID_USERNAME",
        "Use 3-24 letters, numbers, periods, or underscores.",
        { field: "username" }
      );
    }

    if (!validateEmail(input.email.trim())) {
      throw new AuthApiError("INVALID_EMAIL", "Enter a valid email address.", {
        field: "email"
      });
    }

    if (input.password.length < 8) {
      throw new AuthApiError("INVALID_PASSWORD", "Password must be at least 8 characters.", {
        field: "password"
      });
    }

    const normalizedUsername = normalizeUsername(input.username);
    if (this.findByUsername(normalizedUsername)) {
      throw new AuthApiError("USERNAME_TAKEN", "That username is already in use.", {
        field: "username"
      });
    }

    if (this.findByEmail(input.email)) {
      throw new AuthApiError("EMAIL_TAKEN", "That email is already in use.", {
        field: "email"
      });
    }

    const user = this.seedAccount(input);
    return {
      status: "pending_verification",
      email: user.email
    };
  }

  async signOut(): Promise<void> {
    this.currentUserId = null;
    this.currentSession = null;
    this.emit();
  }

  async resendVerification(input?: ResendVerificationInput): Promise<{ status: "resent" }> {
    const account =
      (input?.email ? this.findByEmail(input.email) : null) ||
      (this.currentUserId ? this.accounts.get(this.currentUserId) : null);

    if (account && !account.emailVerified) {
      account.verificationToken = createId("verify");
    }

    return { status: "resent" };
  }

  async consumeVerificationCallback(
    input: VerificationCallbackInput
  ): Promise<AuthSessionSnapshot> {
    const params = parseAuthCallback(input.url);
    const tokenHash = input.tokenHash || params.token_hash;
    const account = [...this.accounts.values()].find((candidate) => {
      return candidate.verificationToken && candidate.verificationToken === tokenHash;
    });

    if (!account) {
      throw new AuthApiError("INVALID_TOKEN", "This verification link is invalid or expired.");
    }

    account.emailVerified = true;
    account.verificationToken = null;
    this.currentUserId = account.id;
    this.currentSession = createSession();
    this.emit();
    return this.snapshot();
  }

  async requestPasswordReset(
    input: PasswordRecoveryInput
  ): Promise<{ status: "sent" }> {
    const account = this.findByEmail(input.email);
    if (account) {
      account.resetToken = createId("reset");
    }

    return { status: "sent" };
  }

  async completePasswordReset(
    input: PasswordResetInput
  ): Promise<{ status: "updated" }> {
    if (input.password.length < 8) {
      throw new AuthApiError("INVALID_PASSWORD", "Password must be at least 8 characters.", {
        field: "password"
      });
    }

    const params = parseAuthCallback(input.url);
    const tokenHash = input.tokenHash || params.token_hash;
    const account = [...this.accounts.values()].find((candidate) => {
      return candidate.resetToken && candidate.resetToken === tokenHash;
    });

    if (!account) {
      throw new AuthApiError("INVALID_TOKEN", "This reset link is invalid or expired.");
    }

    account.password = input.password;
    account.resetToken = null;
    this.currentUserId = null;
    this.currentSession = null;
    this.emit();
    return { status: "updated" };
  }

  async getProfile(): Promise<AuthProfileSnapshot> {
    const snapshot = this.snapshot();
    if (!snapshot.user) {
      throw new AuthApiError("UNAUTHENTICATED", "Sign in to load your profile.");
    }

    return {
      id: snapshot.user.id,
      username: snapshot.user.username,
      email: snapshot.user.email,
      emailVerified: snapshot.user.emailVerified
    };
  }

  private emit(): void {
    const snapshot = this.snapshot();
    this.listeners.forEach((listener) => {
      listener(snapshot);
    });
  }

  private snapshot(): AuthSessionSnapshot {
    const user = this.currentUserId ? this.accounts.get(this.currentUserId) || null : null;

    return {
      session: this.currentSession,
      user: user ? toAuthUser(user) : null,
      status: deriveSessionStatus({
        session: this.currentSession,
        user: user ? toAuthUser(user) : null
      })
    };
  }

  private findByIdentifier(identifier: string): MemoryAccount | null {
    const trimmed = identifier.trim();
    return this.findByEmail(trimmed) || this.findByUsername(normalizeUsername(trimmed));
  }

  private findByUsername(normalizedUsername: string): MemoryAccount | null {
    return (
      [...this.accounts.values()].find((account) => {
        return account.usernameNormalized === normalizedUsername;
      }) || null
    );
  }

  private findByEmail(email: string): MemoryAccount | null {
    const normalizedEmail = email.trim().toLowerCase();
    return (
      [...this.accounts.values()].find((account) => {
        return account.email === normalizedEmail;
      }) || null
    );
  }
}

let authApiSingleton: TestAuthApi | null = null;

export function createAuthApi(): TestAuthApi {
  return new MemoryAuthApi();
}

export function getAuthApi(): TestAuthApi {
  if (!authApiSingleton) {
    authApiSingleton = createAuthApi();
  }

  return authApiSingleton;
}

export function setAuthApiForTests(api: TestAuthApi): void {
  authApiSingleton = api;
}

export function resetAuthApiForTests(): void {
  authApiSingleton = null;
}

export type { AuthApi };
