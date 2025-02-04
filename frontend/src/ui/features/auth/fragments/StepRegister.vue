<script setup lang="ts">
import BaseButton from "@/ui/common/base/BaseButton.vue"
import BaseCard from "@/ui/common/base/BaseCard.vue"
import PinInput from "@/ui/common/PinInput.vue"
import QRCode from "@/ui/common/QRCode.vue"
import {useHttp} from "@/composables/useHttp"
import {toast} from "@/shared/lib/toasts-lite"
import AuthFormLayout from "./AuthFormLayout.vue"

const props = defineProps<{username: string; qrCode: string}>()
const emit = defineEmits<{submit: [code: string]; back: [void]}>()

const request = useHttp()

function onSubmit(code: string) {
  request<{username: string}, {username: string; code: string}>({
    method: "POST",
    url: "user.register",
    data: {username: props.username, code},
    onSuccess: () => emit("submit", props.username),
    onError: (error) => toast.error(error),
  })
}
</script>

<template>
  <AuthFormLayout desc="Scan QR code with authenticator application and enter 6 digits 2FA-Key" @submit="onSubmit">
    <div class="relative my-2 w-full border-b border-primary-300">
      <span class="bg-primary100 absolute px-2 text-sm text-accent absolute-center">Register</span>
    </div>

    <div class="mb-2 flex flex-col justify-between gap-1">
      <span class="text-sm text-content/60">Username</span>
      <span class="truncate text-content">{{ username }}</span>
    </div>

    <div class="mb-2 flex flex-col justify-between gap-2">
      <span class="text-sm text-content/60">2FA-Key</span>
      <PinInput size="sm" @verify="onSubmit" />
    </div>

    <div class="mb-1 w-full border-b border-primary-300"></div>

    <div class="flex justify-between text-sm">
      <BaseButton type="button" variant="primary" icon="arrow-left" class="w-1/3 justify-start gap-1" class-icon="size-4" @click="emit('back')">
        Back
      </BaseButton>
      <BaseButton type="button" icon="key" class-icon="size-4" class="gap-1">What is 2FA-Key?</BaseButton>
    </div>

    <template #footer>
      <div class="mt-4">
        <BaseCard class="size-52 bg-primary-200 p-0" loader-type="spinner">
          <QRCode :code="qrCode" :size="208" />
        </BaseCard>
      </div>
    </template>
  </AuthFormLayout>
</template>
