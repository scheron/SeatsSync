export const UserSubscriptions = {
  "user.subscribe": "user.subscribe",
} as const

export const UserMethods = {
  "user.auth_start": "user/auth_start",
  "user.auth_reset": "user/auth_reset",
  "user.login": "user/login",
  "user.register": "user/register",
  "user.save_recovery_phrase": "user/save_recovery_phrase",
  "user.logout": "user/logout",
} as const

export const Subscriptions = {
  ...UserSubscriptions,
} as const

export const Methods = {
  ...UserMethods,
}

export type Method = keyof typeof Methods
export type Subscription = keyof typeof Subscriptions
