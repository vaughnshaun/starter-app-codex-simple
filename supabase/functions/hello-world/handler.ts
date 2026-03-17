const CORS_HEADERS = {
  "Access-Control-Allow-Headers": "authorization, content-type, x-client-info, apikey",
  "Access-Control-Allow-Methods": "OPTIONS, POST",
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json"
} as const;

export interface HelloWorldHandlerDependencies {
  log?: Pick<Console, "error" | "info" | "warn">;
  verifyAccessToken: (token: string) => Promise<boolean>;
}

function jsonResponse(status: number, body: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: CORS_HEADERS
  });
}

export function createHelloWorldHandler({
  verifyAccessToken,
  log = console
}: HelloWorldHandlerDependencies) {
  return async function handleHelloWorldRequest(request: Request): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS
      });
    }

    if (request.method !== "POST") {
      return jsonResponse(405, {
        error: "Method not allowed."
      });
    }

    const authorizationHeader = request.headers.get("Authorization");
    const accessToken = authorizationHeader?.startsWith("Bearer ")
      ? authorizationHeader.slice("Bearer ".length).trim()
      : "";

    if (!accessToken) {
      log.warn("hello-world request rejected because the bearer token is missing.");

      return jsonResponse(401, {
        error: "Missing bearer token."
      });
    }

    try {
      const isAuthorized = await verifyAccessToken(accessToken);

      if (!isAuthorized) {
        log.warn("hello-world request rejected because the bearer token is invalid.");

        return jsonResponse(401, {
          error: "Unauthorized."
        });
      }

      log.info("hello-world request completed successfully.");

      return jsonResponse(200, {
        message: "Hello, world!"
      });
    } catch (error) {
      log.error("hello-world request failed unexpectedly.", error);

      return jsonResponse(500, {
        error: "Internal server error."
      });
    }
  };
}