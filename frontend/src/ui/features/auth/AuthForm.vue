<script setup lang="ts">
import {reactive} from "vue"
import {useMachine} from "@xstate/vue"
import {authMachine} from "./auth.machine"
import StepLogin from "./fragments/StepLogin.vue"
import StepRegister from "./fragments/StepRegister.vue"
import StepSavePhrase from "./fragments/StepSavePhrase.vue"
import StepStart from "./fragments/StepStart.vue"
import {ws} from "./model/ws"

import type {UserStatus} from "./types"

const {snapshot, send} = useMachine(authMachine)

const state = reactive({
  username: "",
  secret: "",
  qrUrl: "",
})

ws.on<{username: string; qr_url: string; status: UserStatus}>("auth.start").subscribe((message) => {
  state.username = message.data.username
  console.log(message)

  if (message.data.status === "candidate") {
    state.qrUrl = message.data.qr_url

    send({type: "REGISTER"})
  } else {
    send({type: "LOGIN"})
  }
})
</script>

<template>
  <div>
    <StepStart v-if="snapshot.matches('start')" @submit="ws.send({type: 'auth.start', data: {username: $event}})" />
    <StepLogin v-if="snapshot.matches('login')" :username="state.username" @back="send({type: 'BACK_TO_START'})" />
    <StepRegister
      v-if="snapshot.matches('register')"
      :username="state.username"
      :qr-code="state.qrUrl"
      @submit="send({type: 'SAVE_RECOVERY_PHRASE'})"
      @back="send({type: 'BACK_TO_START'})"
    />
    <StepSavePhrase v-if="snapshot.matches('saveRecoveryPhrase')" @submit="send({type: 'END'})" @skip="send({type: 'END'})" />

    <div v-if="snapshot.matches('end')">
      <p>Process completed. Welcome!</p>
    </div>
  </div>
</template>
