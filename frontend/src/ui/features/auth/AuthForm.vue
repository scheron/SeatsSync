<script setup lang="ts">
import {useToasts} from "@/composables/useToasts"
import {useMachine} from "@xstate/vue"
import {authMachine} from "./auth.machine"
import StepLogin from "./fragments/StepLogin.vue"
import StepRegister from "./fragments/StepRegister.vue"
import StepSavePhrase from "./fragments/StepSavePhrase.vue"
import StepStart from "./fragments/StepStart.vue"

const toasts = useToasts()
const {snapshot, send} = useMachine(authMachine)

function onFinish() {
  send({type: "END"})
}
</script>

<template>
  <div>
    <StepStart
      v-if="snapshot.matches('start')"
      @start-candidate="send({type: 'REGISTER', username: $event.username, qrUrl: $event.qrUrl})"
      @start-user="send({type: 'LOGIN', username: $event.username})"
    />

    <StepLogin v-if="snapshot.matches('login')" :username="snapshot.context.username" @submit="onFinish" @back="send({type: 'BACK_TO_START'})" />

    <StepRegister
      v-if="snapshot.matches('register')"
      :username="snapshot.context.username"
      :qr-code="snapshot.context.qrUrl"
      @submit="send({type: 'SAVE_RECOVERY_PHRASE'})"
      @back="send({type: 'BACK_TO_START'})"
    />

    <StepSavePhrase v-if="snapshot.matches('saveRecoveryPhrase')" @submit="send({type: 'END'})" @skip="send({type: 'END'})" />

    <div v-if="snapshot.matches('end')">
      <p>Process completed. Welcome!</p>
    </div>
  </div>
</template>
