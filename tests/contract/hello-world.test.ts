import { createHelloWorldHandler } from "@/supabase/functions/hello-world/handler";

describe("hello-world contract", () => {
  test("returns 200 and a hello world message for authorized POST requests", async () => {
    const verifyAccessToken = jest.fn(async () => true);
    const handler = createHelloWorldHandler({
      verifyAccessToken,
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
          Authorization: "Bearer token-123"
        }
      })
    );

    await expect(response.json()).resolves.toEqual({
      message: "Hello, world!"
    });
    expect(response.status).toBe(200);
    expect(verifyAccessToken).toHaveBeenCalledWith("token-123");
  });

  test("returns 401 when the authorization header is missing", async () => {
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
        method: "POST"
      })
    );

    await expect(response.json()).resolves.toEqual({
      error: "Missing bearer token."
    });
    expect(response.status).toBe(401);
  });
});
