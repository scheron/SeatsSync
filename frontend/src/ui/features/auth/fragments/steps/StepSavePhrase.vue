<script setup lang="ts">
import {ref} from "vue"
import BaseButton from "@/ui/common/base/BaseButton.vue"
import BaseInput from "@/ui/common/base/BaseInput"
import {useHttp} from "@/composables/useHttp"
import {toast} from "@/shared/lib/toasts-lite"
import AuthFormLayout from "../AuthFormLayout.vue"

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
