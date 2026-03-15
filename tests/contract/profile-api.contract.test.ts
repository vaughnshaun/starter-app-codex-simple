import { createAuthApi, setAuthApiForTests } from "@/app/modules/auth/api";
import { profileApi } from "@/app/modules/profile/api";

afterEach(() => {
  setAuthApiForTests(createAuthApi());
});

test("returns the signed-in profile snapshot", async () => {
  const api = createAuthApi();
  setAuthApiForTests(api);
  await api.signIn({
    identifier: "demo.user",
    password: "password123"
  });

  const profile = await profileApi.getCurrentProfile();

  expect(profile).toEqual({
    id: expect.any(String),
    username: "demo.user",
    email: "demo@example.com",
    emailVerified: true
  });
});

