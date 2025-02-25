<script setup lang="ts">
import {toast} from "@/lib/toasts-lite"
import {useHttp} from "@/composables/useHttp"
import BaseButton from "@/ui/base/BaseButton.vue"
import PinInput from "@/ui/common/PinInput.vue"
import AuthFormLayout from "../AuthFormLayout.vue"

const emit = defineEmits<{recoveryAccess: [void]; submit: [code: string]; back: [void]}>()
const props = defineProps<{username: string}>()

const request = useHttp()

function onSubmit(code: string) {
  request<{username: string}, {username: string; code: string}>({
    method: "POST",
    url: "user.login",
    data: {username: props.username, code},
    onSuccess: () => emit("submit", code),
    onError: (error) => toast.error(error),
  })
}
</script>

<template>
  <AuthFormLayout title="Login" desc="Enter 6 digits 2FA-Key from your authenticator application">
    <div class="mb-2 flex flex-col justify-between gap-1">
      <span class="text-content/60 text-sm">Username</span>
      <span class="text-content truncate">{{ username }}</span>
    </div>

    <div class="mb-2 flex flex-col justify-between gap-2">
      <span class="text-content/60 text-sm">2FA-Key</span>
      <PinInput size="sm" @verify="onSubmit" />
    </div>

    <div class="border-primary-300 mb-1 w-full border-b"></div>

    <div class="flex justify-between text-sm">
      <BaseButton type="button" variant="primary" icon="arrow-left" class="w-1/3 justify-start gap-1" class-icon="size-4" @click="emit('back')">
        Back
      </BaseButton>
      <BaseButton type="button" icon="key" class-icon="size-4" class="gap-1" @click="emit('recoveryAccess')">Problem with key? </BaseButton>
    </div>
  </AuthFormLayout>
</template>
