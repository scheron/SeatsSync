<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue"
import {useMachine} from "@xstate/vue"
import {authMachine} from "./auth.machine"

import type {AuthStep} from "./types"

const {snapshot, send} = useMachine(authMachine)
const username = ref("")
const secret = ref("")
const authStep = ref<AuthStep>("username")

let subscription: any = null

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
    <div v-if="snapshot.matches('start')">
      <input v-model="username" placeholder="Enter username" />
      <button @click="send({type: 'REGISTER'})">Login</button>
    </div>

    <div v-if="snapshot.matches('login')">
      <p>Enter your 2FA-Key to log in.</p>
      <input v-model="secret" placeholder="Enter 2FA-Key" />

      <button @click="send({type: 'END'})">Submit</button>
      <button @click="send({type: 'BACK_TO_START'})">Back</button>
    </div>

    <div v-if="snapshot.matches('register')">
      <p>Register your account.</p>
      <button @click="send({type: 'RECOVERY_ACCESS'})">Lost your 2FA-Key?</button>
      <button @click="send({type: 'SAVE_RECOVERY_PHRASE'})">Submit</button>
      <button @click="send({type: 'BACK_TO_START'})">Back</button>
    </div>

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
