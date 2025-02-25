<script setup lang="ts">
// TODO: This is should be as a modal after the user is logged in
import {ref} from "vue"
import {toast} from "@/lib/toasts-lite"
import {useHttp} from "@/composables/useHttp"
import BaseButton from "@/ui/base/BaseButton.vue"
import BaseInput from "@/ui/base/BaseInput"
import AuthFormLayout from "./AuthFormLayout.vue"

const emit = defineEmits<{submit: [phrase: string]; skip: [void]}>()
const request = useHttp()

const phrase = ref("")

function onSubmit() {
  request<{phrase: string}, {phrase: string}>({
    method: "POST",
    url: "user.save_recovery_phrase",
    data: {phrase: phrase.value},
    onSuccess: () => emit("submit", phrase.value),
    onError: (error) => toast.error(error),
  })
}
</script>

<template>
  <AuthFormLayout desc="To enable account recovery, we strongly recommend setting a secret phrase." @submit="onSubmit">
    <BaseInput v-model="phrase" label="Recovery phrase" placeholder="Enter recovery phrase" />

    <BaseButton variant="accent" type="submit" class="my-2">Save</BaseButton>
    <BaseButton variant="primary" type="button" class="flex w-full justify-center" @click="emit('skip')">Skip</BaseButton>
  </AuthFormLayout>
</template>
