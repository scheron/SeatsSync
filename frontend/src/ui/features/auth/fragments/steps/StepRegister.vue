<script setup lang="ts">
import BaseButton from "@/ui/common/base/BaseButton.vue"
import BaseCard from "@/ui/common/base/BaseCard.vue"
import BaseLink from "@/ui/common/base/BaseLink.vue"
import CopyButton from "@/ui/common/CopyButton.vue"
import PinInput from "@/ui/common/PinInput.vue"
import QRCode from "@/ui/common/QRCode.vue"
import {TWO_FA_DOCS} from "@/constants/common"
import {useHttp} from "@/composables/useHttp"
import {toast} from "@/shared/lib/toasts-lite"
import AuthFormLayout from "../AuthFormLayout.vue"

const emit = defineEmits<{submit: [code: string]; back: [void]}>()
const props = defineProps<{username: string; qrCode: string; code?: string}>()

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

function onBack() {
  request<{}, {username: string}>({
    method: "POST",
    url: "user.auth_reset",
    data: {username: props.username},
    onSuccess: () => emit("back"),
    onError: (error) => toast.error(error),
  })
}
</script>

<template>
  <AuthFormLayout title="Register" desc="Scan QR code with authenticator application and enter 6 digits 2FA-Key">
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
      <BaseButton type="button" variant="primary" icon="arrow-left" class="w-1/3 justify-start gap-1" class-icon="size-4" @click="onBack">
        Back
      </BaseButton>
      <BaseLink icon="key" class-icon="size-4" class="gap-1" :to="TWO_FA_DOCS"> What is 2FA-Key?</BaseLink>
    </div>

    <template #footer>
      <div class="mt-4">
        <BaseCard class="size-52 bg-primary-200 p-0" loader-type="spinner">
          <QRCode :code="qrCode" :size="208" />
        </BaseCard>

        <div class="mt-2 flex items-center justify-center text-center text-sm text-content/60">
          <CopyButton :text="qrCode.split('secret=')[1]" type="button" class="text-accent"> Copy code to clipboard </CopyButton>
        </div>
      </div>
    </template>
  </AuthFormLayout>
</template>
