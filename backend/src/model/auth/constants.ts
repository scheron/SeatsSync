export const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,32}$/
export const CODE_REGEX = /^\d{6}$/

export const RECOVERY_PHRASE_MIN_LENGTH = 12

export const MAX_LOGIN_ATTEMPTS = 5
export const MAX_VALIDATION_ATTEMPTS = 3

export const LOGIN_ATTEMPTS_WINDOW = 15 * 60 * 1000 // 15 minutes
export const VALIDATION_ATTEMPTS_WINDOW = 5 * 60 * 1000 // 5 minutes

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "strict" as const,
  maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
}
