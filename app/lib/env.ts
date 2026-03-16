export interface AppEnv {
  supabaseUrl: string;
  supabaseAnonKey: string;
  siteUrl: string;
  appScheme: string;
}

const DEFAULT_ENV: AppEnv = {
  supabaseUrl: "http://127.0.0.1:54321",
  supabaseAnonKey: "local-anon-key",
  siteUrl: "http://localhost:8081",
  appScheme: "starterapp"
};

function readPublicEnv(name: string): string | undefined {
  const globalProcess = globalThis as typeof globalThis & {
    process?: {
      env?: Record<string, string | undefined>;
    };
  };

  return globalProcess.process?.env?.[name];
}

export function getEnv(): AppEnv {
  return {
    supabaseUrl: readPublicEnv("EXPO_PUBLIC_SUPABASE_URL") || DEFAULT_ENV.supabaseUrl,
    supabaseAnonKey:
      readPublicEnv("EXPO_PUBLIC_SUPABASE_ANON_KEY") || DEFAULT_ENV.supabaseAnonKey,
    siteUrl: readPublicEnv("EXPO_PUBLIC_SITE_URL") || DEFAULT_ENV.siteUrl,
    appScheme: readPublicEnv("EXPO_PUBLIC_APP_SCHEME") || DEFAULT_ENV.appScheme
  };
}

export function validateEnv(env: AppEnv = getEnv()): AppEnv {
  const values = Object.entries(env);
  const missing = values.filter(([, value]) => !value?.trim()).map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing required public environment values: ${missing.join(", ")}`);
  }

  return env;
}

