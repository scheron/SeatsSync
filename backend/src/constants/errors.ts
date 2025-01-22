export const SystemErrors = {
  InternalServerError: "InternalServerError",
  ValidationError: "ValidationError",
  Unauthorized: "Unauthorized",
  Forbidden: "Forbidden",
  RouteNotFound: "RouteNotFound",
  RateLimitExceeded: "RateLimitExceeded",
  InvalidRequest: "InvalidRequest",
  NotImplemented: "NotImplemented",
  UnknownMessageType: "UnknownMessageType",
  MessageTooLarge: "MessageTooLarge",
  MessageTypeRequired: "MessageTypeRequired",
  TooManyRequests: "TooManyRequests",
  TooManyConnections: "TooManyConnections",
  SubscriptionAlreadyExists: "SubscriptionAlreadyExists",
} as const

export const AuthErrors = {
  InvalidCredentials: "InvalidCredentials",
  TokenExpired: "TokenExpired",
  TokenInvalid: "TokenInvalid",
  TokenMissing: "TokenMissing",
  UserNotFound: "UserNotFound",
  UserExists: "UserExists",
  InvalidEmail: "InvalidEmail",
  InvalidPassword: "InvalidPassword",
  PasswordMismatch: "PasswordMismatch",
  SessionExpired: "SessionExpired",
  InvalidUsername: "InvalidUsername",
  RegistrationNotInProgress: "RegistrationNotInProgress",
  RegistrationInProgress: "RegistrationInProgress",
  RegistrationExpired: "RegistrationExpired",
  TooManyValidationAttempts: "TooManyValidationAttempts",
  InvalidCode: "InvalidCode",
  TooManyLoginAttempts: "TooManyLoginAttempts",
  UserAlreadyExists: "UserAlreadyExists",
  InvalidRecoveryPhrase: "InvalidRecoveryPhrase",
  RequiredUsername: "RequiredUsername",
} as const

export const CinemaErrors = {
  CinemaNotFound: "CinemaNotFound",
  CinemaExists: "CinemaExists",
  InvalidCinemaData: "InvalidCinemaData",
  CinemaUpdateFailed: "CinemaUpdateFailed",
  CinemaDeleteFailed: "CinemaDeleteFailed",
  CinemaCreateFailed: "CinemaCreateFailed",
  CinemaFetchFailed: "CinemaFetchFailed",
} as const

export const HallErrors = {
  HallNotFound: "HallNotFound",
  HallExists: "HallExists",
  InvalidHallData: "InvalidHallData",
  HallUpdateFailed: "HallUpdateFailed",
  HallDeleteFailed: "HallDeleteFailed",
  HallFetchFailed: "HallFetchFailed",
  RequiredHallId: "RequiredHallId",
} as const

export const SeatErrors = {
  SeatNotFound: "SeatNotFound",
  SeatExists: "SeatExists",
  InvalidSeatData: "InvalidSeatData",
  SeatUpdateFailed: "SeatUpdateFailed",
  SeatDeleteFailed: "SeatDeleteFailed",
  SeatOccupied: "SeatOccupied",
  SeatTypeNotFound: "SeatTypeNotFound",
  SeatTypesFetchFailed: "SeatTypesFetchFailed",
} as const

export const Errors = {
  ...SystemErrors,
  ...AuthErrors,
  ...CinemaErrors,
  ...HallErrors,
  ...SeatErrors,
} as const

export type ErrorCode = keyof typeof Errors
