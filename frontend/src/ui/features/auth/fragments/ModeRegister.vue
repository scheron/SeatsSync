<script setup lang="ts">
import {onMounted, reactive, ref} from "vue"
import BaseButton from "@/ui/common/base/BaseButton.vue"
import BaseCard from "@/ui/common/base/BaseCard.vue"
import BaseInput from "@/ui/common/base/BaseInput"
import QRCode from "@/ui/common/QRCode.vue"
import AuthFormLayout from "@/ui/layouts/AuthFormLayout.vue"

import type {AuthMode} from "../types"

defineProps<{}>()

const form = reactive({
  username: "",
  key: "",
})

const code = ref("test text 🥸")
const loading = ref(false)

const emit = defineEmits<{
  "select-mode": [AuthMode]
}>()

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
  <AuthFormLayout label="Register">
    <BaseInput v-model="form.username" label="Username" placeholder="Enter username" />
    <BaseInput v-model="form.key" label="2FA-Key" placeholder="Enter 6 digits 2FA-Key" />

    <div class="mb-2 flex justify-between text-sm">
      <BaseButton icon="key" class-icon="size-4" class="gap-1" @click="emit('select-mode', 'recovery')"> Recovery? </BaseButton>
      <BaseButton icon="enter" class-icon="size-4" class="gap-1" @click="emit('select-mode', 'login')"> Remember? </BaseButton>
    </div>

    <BaseButton variant="accent">Register</BaseButton>

    <template #footer>
      <div class="mt-4">
        <BaseCard class="size-52 bg-primary-200 p-0" :loading="loading" loader-type="spinner">
          <QRCode :code="code" :size="208" />
        </BaseCard>
      </div>
    </template>
  </AuthFormLayout>
</template>
