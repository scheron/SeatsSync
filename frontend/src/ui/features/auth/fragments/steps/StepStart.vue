<script setup lang="ts">
import {ref} from "vue"
import BaseButton from "@/ui/common/base/BaseButton.vue"
import BaseInput from "@/ui/common/base/BaseInput"
import {useHttp} from "@/composables/useHttp"
import {toast} from "@/shared/lib/toasts-lite"
import AuthFormLayout from "../AuthFormLayout.vue"

import type {UserAuthStartResponse} from "../../types"

const emit = defineEmits<{
  startUser: [{username: string}]
  startCandidate: [{username: string; qrUrl: string}]
}>()

const request = useHttp()

const username = ref("")

function onSubmit() {
  if (!username.value.trim()) return

  request<UserAuthStartResponse, {username: string}>({
    method: "POST",
    url: "user.auth_start",
    data: {username: username.value},
    onSuccess: ({status, username, qr_url}) => {
      if (status === "user") emit("startUser", {username})
      else emit("startCandidate", {username, qrUrl: qr_url})
    },
    onError: (error) => {
      toast.error(error)
    },
  })
}
</script>

<template>
  <AuthFormLayout desc="For enter to the system, you need the authenticator application" @submit="onSubmit">
    <BaseInput v-model="username" label="Username" size="sm" placeholder="Enter username" />
    <BaseButton variant="accent" type="submit" class="mt-2">Enter</BaseButton>
  </AuthFormLayout>
</template>
