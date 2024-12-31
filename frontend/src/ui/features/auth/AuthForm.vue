<script setup lang="ts">
import {onMounted, onUnmounted, reactive, ref} from "vue"
import {useMachine} from "@xstate/vue"
import {authMachine} from "./auth.machine"
import StepLogin from "./fragments/StepLogin.vue"
import StepRegister from "./fragments/StepRegister.vue"
import StepStart from "./fragments/StepStart.vue"
import {ws} from "./model/ws"

import type {UserStatus} from "./types"

const {snapshot, send} = useMachine(authMachine)

const state = reactive({
  username: "",
  secret: "",
  qrUrl: "",
})

// ws.onMessage("auth.start").subscribe((message: {data: {status: UserStatus; qr_url: string, username: string}}) => {
//   if(message.data.status === 'candidate') {
//     // send({type: 'REGISTER', qrUrl: message.data.qr_url, username: message.data.username})
//     return;
//   }

//   // send({type: 'LOGIN', username: message.data.username})
// })

function onCheckUsername(username: string) {
  // ws.send({type: 'auth.start', data: {username}, eid: ws.generateEid()})
  console.log({
    type: "auth.start",
    data: {username},
    eid: "asd",
  })

  state.username = username
  state.qrUrl = "hello world"
  send({type: "LOGIN"})
}

onMounted(() => {
  // subscription = socketService.onMessage().subscribe((message) => {
  //   console.log("Received message:", message)
  // })
})

onUnmounted(() => {
  // subscription?.unsubscribe()
})
</script>

<template>
  <div>
    <StepStart v-if="snapshot.matches('start')" @submit="onCheckUsername" />
    <StepLogin v-if="snapshot.matches('login')" @back="send({type: 'BACK_TO_START'})" />
    <StepRegister v-if="snapshot.matches('register')" />

    <!-- <div v-if="snapshot.matches('login')">
      <p>Enter your 2FA-Key to log in.</p>
      <input v-model="secret" placeholder="Enter 2FA-Key" />

      <button @click="send({type: 'END'})">Submit</button>
      <button @click="send({type: 'BACK_TO_START'})">Back</button>
    </div> -->

    <!-- <p>Register your account.</p>
    <div v-if="snapshot.matches('register')">
      <button @click="send({type: 'RECOVERY_ACCESS'})">Lost your 2FA-Key?</button>
      <button @click="send({type: 'SAVE_RECOVERY_PHRASE'})">Submit</button>
      <button @click="send({type: 'BACK_TO_START'})">Back</button>
    </div> -->

    <div v-if="snapshot.matches('saveRecoveryPhrase')">
      <p>Save your recovery phrase.</p>
      <button @click="send({type: 'END'})">Finish</button>
    </div>

    <div v-if="snapshot.matches('recoveryAccess')">
      <p>Recover your account access.</p>
      <button @click="send({type: 'END'})">Submit</button>
      <button @click="send({type: 'BACK_TO_START'})">Back</button>
    </div>

    <!-- Конечное состояние -->
    <div v-if="snapshot.matches('end')">
      <p>Process completed. Welcome!</p>
    </div>
  </div>
</template>
