export const Methods = {
  "user.status": "/user/status",
  "user.auth_start": "/user/auth_start",
  "user.auth_reset": "/user/auth_reset",
  "user.login": "/user/login",
  "user.logout": "/user/logout",
  "user.register": "/user/register",
  "user.recovery_phrase": "/user/recovery_phrase",
  "user.save_recovery_phrase": "/user/save_recovery_phrase",

  "cinemas.get_cinemas": "cinemas.get_cinemas",
} as const;

export type Method = keyof typeof Methods;
