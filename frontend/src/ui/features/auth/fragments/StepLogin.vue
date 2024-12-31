<script setup lang="ts">
import {ref} from "vue"
import BaseButton from "@/ui/common/base/BaseButton.vue"
import BaseInput from "@/ui/common/base/BaseInput"
import AuthFormLayout from "@/ui/layouts/AuthFormLayout.vue"

const emit = defineEmits<{recoveryAccess: []; submit: [string]; back: []}>()
const key = ref("")
</script>

<template>
  <AuthFormLayout desc="Enter 6 digits 2FA-Key from your authenticator application">
    <BaseInput v-model="key" label="2FA-Key" placeholder="Enter 6 digits 2FA-Key" />

    <BaseButton variant="accent" class="mt-2" @click="emit('submit', key)">Login</BaseButton>

    <div class="flex justify-between text-sm">
      <BaseButton variant="primary" icon="arrow-left" class="w-1/3 justify-start gap-1" class-icon="size-4" @click="emit('back')">Back</BaseButton>
      <BaseButton icon="key" class-icon="size-4" class="gap-1" @click="emit('recoveryAccess')">Problem with key? </BaseButton>
    </div>
  </AuthFormLayout>
</template>
