export interface StoredProfile {
  userId: string;
  username: string;
  email: string;
  createdAt: string | null;
  emailConfirmedAt: string | null;
}
