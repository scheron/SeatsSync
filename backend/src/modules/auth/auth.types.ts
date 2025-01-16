import { User, Candidate } from "@prisma/client";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface RegisterResponse extends LoginResponse {}

export interface StartResponse {
  candidate: Candidate;
}

export interface SaveRecoveryPhraseResponse {
  user: User;
}
