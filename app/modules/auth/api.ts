import "react-native-url-polyfill/auto";

import { createClient, type User } from "@supabase/supabase-js";

import { getEnv, validateEnv } from "@/app/lib/env";
import { storeProfile } from "@/app/modules/profile/api";
import type { StoredProfile } from "@/app/modules/profile/types";

import type { AuthProfile, ResendVerificationInput, SignUpInput } from "./types";

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
