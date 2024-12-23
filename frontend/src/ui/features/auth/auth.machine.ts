import {setup} from "xstate"

export const authMachine = setup({
  types: {
    events: {} as
      | {type: "START"}
      | {type: "LOGIN"}
      | {type: "REGISTER"}
      | {type: "RECOVERY_ACCESS"}
      | {type: "SAVE_RECOVERY_PHRASE"}
      | {type: "END"}
      | {type: "BACK_TO_START"},
  },
}).createMachine({
  id: "auth",
  initial: "start",
  states: {
    start: {
      on: {
        LOGIN: "login",
        REGISTER: "register",
        RECOVERY_ACCESS: "recoveryAccess",
      },
    },
    login: {
      on: {
        RECOVERY_ACCESS: "recoveryAccess",
        END: "end",
      },
    },
    register: {
      on: {
        RECOVERY_ACCESS: "recoveryAccess",
        SAVE_RECOVERY_PHRASE: "saveRecoveryPhrase",
      },
    },
    recoveryAccess: {
      on: {
        END: "end",
      },
    },
    saveRecoveryPhrase: {
      on: {
        END: "end",
      },
    },
    end: {
      type: "final",
    },
  },
  on: {
    BACK_TO_START: ".start",
  },
})
