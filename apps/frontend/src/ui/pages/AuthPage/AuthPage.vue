<script setup lang="ts">
import {onMounted} from "vue"
import {useRouter} from "vue-router"
import {useMachine} from "@xstate/vue"
import BaseCard from "@/ui/base/BaseCard.vue"
import {authMachine} from "./auth.machine"
import StepLogin from "./fragments/steps/StepLogin.vue"
import StepRegister from "./fragments/steps/StepRegister.vue"
import StepStart from "./fragments/steps/StepStart.vue"

const router = useRouter()

const {snapshot, send} = useMachine(authMachine)

onMounted(() => {
  //   router.routerLoaded()
})
</script>

<template>
  <div class="flex size-full flex-col items-center justify-center">
    <BaseCard class="size-fit">
      <StepStart
        v-if="snapshot.matches('start')"
        @start-candidate="send({type: 'REGISTER', username: $event.username, qrUrl: $event.qrUrl})"
        @start-user="send({type: 'LOGIN', username: $event.username})"
      />

      <StepLogin
        v-if="snapshot.matches('login')"
        :username="snapshot.context.username"
        @submit="send({type: 'END'})"
        @back="send({type: 'BACK_TO_START'})"
      />

      <StepRegister
        v-if="snapshot.matches('register')"
        :username="snapshot.context.username"
        :qr-code="snapshot.context.qrUrl"
        @submit="send({type: 'END'})"
        @back="send({type: 'BACK_TO_START'})"
      />
    </BaseCard>
  </div>
</template>
