import { createClient } from "npm:@supabase/supabase-js@2";

import { createHelloWorldHandler } from "./handler.ts";

type DenoLike = {
  env?: {
    get(name: string): string | undefined;
  };
  serve?: (handler: (request: Request) => Promise<Response> | Response) => void;
};

function getDenoGlobal(): DenoLike | undefined {
  return (globalThis as typeof globalThis & { Deno?: DenoLike }).Deno;
}

function readEnv(name: string): string | undefined {
  const deno = getDenoGlobal();

  if (deno?.env) {
    return deno.env.get(name);
  }

  const processLike = globalThis as typeof globalThis & {
    process?: {
      env?: Record<string, string | undefined>;
    };
  };

  return processLike.process?.env?.[name];
}

function readRequiredEnv(name: string): string {
  const value = readEnv(name);

  if (!value?.trim()) {
    throw new Error(`Missing required environment value: ${name}`);
  }

  return value;
}

const supabaseUrl = readRequiredEnv("SUPABASE_URL");
const supabaseAnonKey = readRequiredEnv("SUPABASE_ANON_KEY");

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function verifyAccessToken(accessToken: string): Promise<boolean> {
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error) {
    console.warn("hello-world access token verification failed.", error.message);
    return false;
  }

  return Boolean(data.user);
}

const helloWorldHandler = createHelloWorldHandler({
  verifyAccessToken
});

const deno = getDenoGlobal();

if (deno?.serve) {
  deno.serve(helloWorldHandler);
}

export { helloWorldHandler };