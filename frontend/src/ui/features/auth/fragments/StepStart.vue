<script setup lang="ts">
import {ref} from "vue"
import {useHttp} from "@/composables/useHttp"
import {useToasts} from "@/composables/useToasts"
import BaseButton from "@/ui/common/base/BaseButton.vue"
import BaseInput from "@/ui/common/base/BaseInput"
import AuthFormLayout from "./AuthFormLayout.vue"

import type {UserAuthStartResponse} from "../types"

const emit = defineEmits<{
  startUser: [{username: string}]
  startCandidate: [{username: string; qrUrl: string}]
}>()

const request = useHttp()
const toasts = useToasts()

const username = ref("")

function onSubmit() {
  request<UserAuthStartResponse, {username: string}>({
    method: "POST",
    url: "user.auth_start",
    data: {username: username.value},
    onSuccess: ({status, username, qr_url}) => {
      if (status === "user") emit("startUser", {username})
      else emit("startCandidate", {username, qrUrl: qr_url})
    },
    onError: (error) => {
      toasts.error(error)
    },
  })
}
</script>

<template>
  <AuthFormLayout desc="For enter to the system, you need the authenticator application" @submit="onSubmit">
    <BaseInput v-model="username" label="Username" placeholder="Enter username" />
    <BaseButton variant="accent" type="submit" class="mt-2">Enter</BaseButton>
  </AuthFormLayout>
</template>
