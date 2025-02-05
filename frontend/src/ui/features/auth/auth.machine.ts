import {assign, setup} from "xstate"

export const authMachine = setup({
  types: {
    context: {} as {
      username: string
      qrUrl: string
      code: string
    },
    events: {} as
      | {type: "START"}
      | {type: "LOGIN"; username: string}
      | {type: "REGISTER"; username: string; qrUrl: string}
      | {type: "RECOVERY_ACCESS"}
      | {type: "SAVE_RECOVERY_PHRASE"}
      | {type: "END"}
      | {type: "BACK_TO_START"},
  },
}).createMachine({
  id: "auth",
  initial: "start",
  context: {username: "", qrUrl: "", code: ""},
  states: {
    start: {
      on: {
        LOGIN: {
          target: "login",
          actions: assign(({context, event}) => ({...context, username: event.username ?? context.username})),
        },
        REGISTER: {
          target: "register",
          actions: assign(({context, event}) => ({...context, username: event.username ?? context.username, qrUrl: event.qrUrl ?? context.qrUrl})),
        },
        RECOVERY_ACCESS: "recoveryAccess",
      },
    },
    login: {on: {RECOVERY_ACCESS: "recoveryAccess", END: "end"}},
    register: {on: {RECOVERY_ACCESS: "recoveryAccess", SAVE_RECOVERY_PHRASE: "saveRecoveryPhrase"}},
    recoveryAccess: {on: {END: "end"}},
    saveRecoveryPhrase: {on: {END: "end"}},
    end: {type: "final"},
  },
  on: {
    BACK_TO_START: {
      target: ".start",
      actions: assign(() => ({username: "", qrUrl: "", code: ""})),
    },
  },
})
