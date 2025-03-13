export const Subscriptions = {
  "cinemas.subscribe": "cinemas.subscribe",
  "user.subscribe": "user.subscribe",
  "hall.subscribe": "hall.subscribe",
} as const

export const Methods = {
  "user.status": "user/status",
  "user.auth_start": "user/auth_start",
  "user.auth_reset": "user/auth_reset",
  "user.login": "user/login",
  "user.register": "user/register",
  "user.save_recovery_phrase": "user/save_recovery_phrase",
  "user.logout": "user/logout",

  "cinema.get_cinemas": "cinema.get_cinemas",
} as const

export type Method = keyof typeof Methods
export type Subscription = keyof typeof Subscriptions
