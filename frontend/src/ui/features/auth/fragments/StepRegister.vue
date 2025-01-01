<script setup lang="ts">
import {onMounted, reactive, ref} from "vue"
import BaseButton from "@/ui/common/base/BaseButton.vue"
import BaseCard from "@/ui/common/base/BaseCard.vue"
import BaseInput from "@/ui/common/base/BaseInput"
import QRCode from "@/ui/common/QRCode.vue"
import AuthFormLayout from "./AuthFormLayout.vue"

import type {AuthMode} from "../types"

defineProps<{}>()
const emit = defineEmits<{
  "select-mode": [AuthMode]
  back: [void]
}>()

const form = reactive({
  username: "",
  key: "",
})

const code = ref("test text 🥸")
const loading = ref(false)

async function requestCode() {
  const response = {code: "test text 🥸"}

  return response
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

onMounted(async () => {
  loading.value = true
  await sleep(2000)

  code.value = (await requestCode()).code
  loading.value = false
})
</script>

<template>
  <AuthFormLayout desc="Scan QR code with authenticator application and enter 6 digits 2FA-Key">
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
        <BaseCard class="size-52 bg-primary-200 p-0" :loading="loading" loader-type="spinner">
          <QRCode :code="code" :size="208" />
        </BaseCard>
      </div>
    </template>
  </AuthFormLayout>
</template>
