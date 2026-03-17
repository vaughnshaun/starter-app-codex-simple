export interface SignUpInput {
  username: string;
  password: string;
}

export interface ResendVerificationInput {
  username: string;
}

export interface AuthProfile {
  userId: string;
  username: string;
  email: string;
  createdAt: string | null;
  emailConfirmedAt: string | null;
}

export interface HelloWorldResponse {
  message: string;
}
