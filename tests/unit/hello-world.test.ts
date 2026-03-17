import { createHelloWorldHandler } from "@/supabase/functions/hello-world/handler";

describe("hello-world unit behavior", () => {
  test("returns 204 for preflight requests", async () => {
    const handler = createHelloWorldHandler({
      verifyAccessToken: jest.fn(async () => true),
      log: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn()
      }
    });

    const response = await handler(
      new Request("http://localhost/functions/v1/hello-world", {
        method: "OPTIONS"
      })
    );

    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Methods")).toBe("OPTIONS, POST");
  });

  test("returns 401 when token verification fails", async () => {
    const handler = createHelloWorldHandler({
      verifyAccessToken: jest.fn(async () => false),
      log: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn()
      }
    });

    const response = await handler(
      new Request("http://localhost/functions/v1/hello-world", {
        method: "POST",
        headers: {
          Authorization: "Bearer invalid-token"
        }
      })
    );

    await expect(response.json()).resolves.toEqual({
      error: "Unauthorized."
    });
    expect(response.status).toBe(401);
  });
});