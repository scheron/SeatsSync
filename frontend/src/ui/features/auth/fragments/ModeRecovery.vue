<script setup lang="ts">
import {reactive} from "vue"
import BaseButton from "@/ui/common/base/BaseButton.vue"
import BaseCard from "@/ui/common/base/BaseCard.vue"
import BaseInput from "@/ui/common/base/BaseInput"
import AuthFormLayout from "@/ui/layouts/AuthFormLayout.vue"

import type {AuthMode} from "../types"

const props = defineProps<{}>()

const form = reactive({
  username: "",
  phrase: "",
  key: "",
})

const emit = defineEmits<{
  "select-mode": [AuthMode]
}>()
</script>

<template>
  <AuthFormLayout label="Recovery">
    <BaseInput v-model="form.username" label="Username" placeholder="Enter username" />
    <BaseInput v-model="form.username" label="Recovery phrase" placeholder="Enter recovery phrase" />
    <BaseInput v-model="form.key" label="2FA-Key" placeholder="Enter 6 digits 2FA-Key" />

    <div class="mb-2 flex justify-between text-sm">
      <BaseButton icon="key" class-icon="size-4" class="gap-1" @click="emit('select-mode', 'login')"> Remember? </BaseButton>
      <BaseButton icon="enter" class-icon="size-4" class="gap-1" @click="emit('select-mode', 'register')"> First time? </BaseButton>
    </div>

    <BaseButton variant="accent">Recover</BaseButton>

    <template #footer>
      <div class="mt-4">
        <BaseCard class="size-52 bg-primary-200" loading loader-type="spinner"> </BaseCard>
      </div>
    </template>
  </AuthFormLayout>
</template>
