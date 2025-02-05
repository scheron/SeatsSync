export const Methods = {
  "user.auth_start": "/user/auth_start",
  "user.auth_reset": "/user/auth_reset",
  "user.login": "/user/login",
  "user.logout": "/user/logout",
  "user.register": "/user/register",
  "user.recovery_phrase": "/user/recovery_phrase",
  "user.save_recovery_phrase": "/user/save_recovery_phrase",

  "cinema.get_cinemas": "cinema.get_cinemas",
} as const

export const Subscriptions = {
  "user.subscribe": "user.subscribe",
  "user.unsubscribe": "user.unsubscribe",
} as const

export type Method = keyof typeof Methods
export type Subscription = keyof typeof Subscriptions
