import "react-native-url-polyfill/auto";

import { createClient, type User } from "@supabase/supabase-js";

import { getEnv, getSupabaseFunctionUrl, validateEnv } from "@/app/lib/env";
import { storeProfile } from "@/app/modules/profile/api";
import type { StoredProfile } from "@/app/modules/profile/types";

import type {
  AuthProfile,
  HelloWorldResponse,
  ResendVerificationInput,
  SignUpInput
} from "./types";

let supabaseClient:
  | ReturnType<typeof createClient>
  | null = null;

function getSupabaseClient() {
  if (!supabaseClient) {
    const env = validateEnv(getEnv());

    supabaseClient = createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false
      }
    });
  }

  return supabaseClient;
}

function mapUserToProfile(user: User, username: string): AuthProfile {
  return {
    userId: user.id,
    username,
    email: user.email ?? username,
    createdAt: user.created_at ?? null,
    emailConfirmedAt: user.email_confirmed_at ?? null
  };
}

function toStoredProfile(profile: AuthProfile): StoredProfile {
  return {
    userId: profile.userId,
    username: profile.username,
    email: profile.email,
    createdAt: profile.createdAt,
    emailConfirmedAt: profile.emailConfirmedAt
  };
}

function isHelloWorldResponse(value: unknown): value is HelloWorldResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  return typeof (value as HelloWorldResponse).message === "string";
}

function getErrorMessage(value: unknown, fallback: string): string {
  if (!value || typeof value !== "object") {
    return fallback;
  }

  const candidate = (value as { error?: unknown }).error;

  return typeof candidate === "string" && candidate.trim() ? candidate : fallback;
}

export async function signUpUser(input: SignUpInput): Promise<AuthProfile> {
  const client = getSupabaseClient();
  const env = validateEnv(getEnv());
  const trimmedUsername = input.username.trim();
  const password = input.password.trim();

  const { data, error } = await client.auth.signUp({
    email: trimmedUsername,
    password,
    options: {
      data: {
        username: trimmedUsername
      },
      emailRedirectTo: env.siteUrl
    }
  });

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error("Sign up did not return a user record.");
  }

  const profile = mapUserToProfile(data.user, trimmedUsername);
  await storeProfile(toStoredProfile(profile));

  return profile;
}

export async function resendVerificationEmail(
  input: ResendVerificationInput
): Promise<void> {
  const client = getSupabaseClient();
  const env = validateEnv(getEnv());
  const trimmedUsername = input.username.trim();

  const { error } = await client.auth.resend({
    email: trimmedUsername,
    type: "signup",
    options: {
      emailRedirectTo: env.siteUrl
    }
  });

  if (error) {
    throw error;
  }
}

export async function callHelloWorldEndpoint(): Promise<HelloWorldResponse> {
  const client = getSupabaseClient();
  const env = validateEnv(getEnv());
  const { data, error } = await client.auth.getSession();

  if (error) {
    console.error("Unable to read the current session for hello world.", error);
    throw error;
  }

  const accessToken = data.session?.access_token;

  if (!accessToken) {
    const sessionError = new Error("You must be signed in to call the hello world endpoint.");

    console.warn(sessionError.message);
    throw sessionError;
  }

  const response = await fetch(getSupabaseFunctionUrl("hello-world", env), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({})
  });

  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const errorMessage = getErrorMessage(payload, "Hello world endpoint request failed.");

    console.error("Hello world endpoint request failed.", {
      status: response.status,
      errorMessage
    });
    throw new Error(errorMessage);
  }

  if (!isHelloWorldResponse(payload)) {
    const responseError = new Error("Hello world endpoint returned an invalid response.");

    console.error(responseError.message, payload);
    throw responseError;
  }

  console.info("Hello world endpoint request succeeded.");

  return payload;
}
