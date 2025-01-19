export const AuthSubscriptions = {
  "auth.status": "auth.status",
} as const

export const AuthMethods = {
  "auth.start": "auth/start",
  "auth.login": "auth/login",
  "auth.register": "auth/register",
  "auth.save_recovery_phrase": "auth/save_recovery_phrase",
} as const

export const Subscriptions = {
  ...AuthSubscriptions,
} as const

export const Methods = {
  ...AuthMethods,
}

export type Method = keyof typeof Methods
export type Subscription = keyof typeof Subscriptions
