import type { User, Candidate } from "@prisma/client";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Start authentication
export interface StartRequest {
  username: string;
}

export interface StartResponse {
  candidate: Candidate;
}

// Login
export interface LoginRequest {
  username: string;
  code: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

// Register
export interface RegisterRequest {
  username: string;
  code: string;
}

export interface RegisterResponse {
  user: User;
  tokens: AuthTokens;
}

// Subscriptions
export interface UserStatusSubscription {
  type: "auth/subscribe";
  username: string;
}

export interface UserStatusUnsubscription {
  type: "auth/unsubscribe";
  username: string;
}
