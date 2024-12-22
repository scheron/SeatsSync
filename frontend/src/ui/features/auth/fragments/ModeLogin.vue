<script setup lang="ts">
import {reactive} from "vue"
import BaseButton from "@/ui/common/base/BaseButton.vue"
import BaseInput from "@/ui/common/base/BaseInput"
import AuthFormLayout from "@/ui/layouts/AuthFormLayout.vue"

import type {AuthMode} from "../types"

const form = reactive({
  username: "",
  key: "",
})

const emit = defineEmits<{
  "select-mode": [AuthMode]
}>()
</script>

<template>
  <AuthFormLayout label="Login">
    <BaseInput v-model="form.username" label="Username" placeholder="Enter username" />
    <BaseInput v-model="form.key" label="2FA-Key" placeholder="Enter 6 digits 2FA-Key" />

    <div class="mb-2 flex justify-between text-sm">
      <BaseButton icon="key" class-icon="size-4" class="gap-1" @click="emit('select-mode', 'recovery')"> Recovery? </BaseButton>
      <BaseButton icon="enter" class-icon="size-4" class="gap-1" @click="emit('select-mode', 'register')"> First time? </BaseButton>
    </div>

    <BaseButton variant="accent">Login</BaseButton>
  </AuthFormLayout>
</template>
