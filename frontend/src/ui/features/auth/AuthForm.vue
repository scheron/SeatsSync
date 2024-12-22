<script setup lang="ts">
import {ref} from "vue"
import LoginForm from "./fragments/ModeLogin.vue"
import RecoveryForm from "./fragments/ModeRecovery.vue"
import RegisterForm from "./fragments/ModeRegister.vue"

import type {AuthMode} from "./types"

const authMode = ref<AuthMode>("login")
</script>

<template>
  <LoginForm v-if="authMode === 'login'" @select-mode="authMode = $event" />
  <RegisterForm v-if="authMode === 'register'" @select-mode="authMode = $event" />
  <RecoveryForm v-if="authMode === 'recovery'" @select-mode="authMode = $event" />
</template>
