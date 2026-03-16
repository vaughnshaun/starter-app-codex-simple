import AsyncStorage from "@react-native-async-storage/async-storage";

import type { StoredProfile } from "./types";

const PROFILE_STORAGE_KEY = "starter-app-codex-simple/profile";

export async function getStoredProfile(): Promise<StoredProfile | null> {
  const rawValue = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  return JSON.parse(rawValue) as StoredProfile;
}

export async function storeProfile(profile: StoredProfile): Promise<StoredProfile> {
  await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));

  return profile;
}
