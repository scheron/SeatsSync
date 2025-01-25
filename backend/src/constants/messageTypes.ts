export const UserMethods = {
  "user.auth_start": "/user/auth_start",
  "user.auth_reset": "/user/auth_reset",
  "user.login": "/user/login",
  "user.logout": "/user/logout",
  "user.register": "/user/register",
  "user.recovery_phrase": "/user/recovery_phrase",
  "user.save_recovery_phrase": "/user/save_recovery_phrase",
  "user.unsubscribe": "/user/unsubscribe",
} as const

export const UserSubscriptions = {
  "user.subscribe": "/user/subscribe",
} as const

export const Methods = {
  ...UserMethods,
} as const

export const Subscriptions = {
  ...UserSubscriptions,
}

export type Method = keyof typeof Methods
export type Subscription = keyof typeof Subscriptions
