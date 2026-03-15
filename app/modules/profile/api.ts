import { getAuthApi } from "@/app/modules/auth/api";
import { Profile } from "@/app/modules/profile/types";

export interface ProfileApi {
  getCurrentProfile(): Promise<Profile>;
}

export function createProfileApi(): ProfileApi {
  return {
    async getCurrentProfile(): Promise<Profile> {
      const profile = await getAuthApi().getProfile();

      return {
        id: profile.id,
        username: profile.username,
        email: profile.email,
        emailVerified: profile.emailVerified
      };
    }
  };
}

export const profileApi = createProfileApi();

