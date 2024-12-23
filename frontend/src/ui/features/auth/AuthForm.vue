<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue"
import LoginForm from "./fragments/ModeLogin.vue"
import RecoveryForm from "./fragments/ModeRecovery.vue"
import RegisterForm from "./fragments/ModeRegister.vue"
import {socketService} from "./model/ws"

import type {AuthMode, AuthStep} from "./types"

const authMode = ref<AuthMode>("login")
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
  <RegisterForm @select-mode="authMode = $event" />
</template>
