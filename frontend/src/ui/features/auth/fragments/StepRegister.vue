<script setup lang="ts">
import {reactive} from "vue"
import BaseButton from "@/ui/common/base/BaseButton.vue"
import BaseCard from "@/ui/common/base/BaseCard.vue"
import BaseInput from "@/ui/common/base/BaseInput"
import QRCode from "@/ui/common/QRCode.vue"
import AuthFormLayout from "./AuthFormLayout.vue"

defineProps<{username: string; qrCode: string}>()
const emit = defineEmits<{submit: [code: string]; back: [void]}>()

const form = reactive({
  username: "",
  key: "",
})
</script>

<template>
  <AuthFormLayout desc="Scan QR code with authenticator application and enter 6 digits 2FA-Key" @submit="emit('submit', code)">
    <div class="mb-4 flex flex-col justify-between">
      <span class="text-sm text-content/60">Username</span>
      <span class="truncate text-content">{{ username }}</span>
    </div>

    <BaseInput v-model="form.key" label="2FA-Key" placeholder="Enter 6 digits 2FA-Key" />

    <BaseButton type="submit" variant="accent" class="mt-2">Register</BaseButton>

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
