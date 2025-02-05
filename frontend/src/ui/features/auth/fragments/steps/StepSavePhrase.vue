<script setup lang="ts">
import {ref} from "vue"
import BaseButton from "@/ui/common/base/BaseButton.vue"
import BaseInput from "@/ui/common/base/BaseInput"
import AuthFormLayout from "../AuthFormLayout.vue"

const emit = defineEmits<{submit: [code: string]; skip: [void]}>()
const phrase = ref("")
</script>

<template>
  <AuthFormLayout desc="To enable account recovery, we strongly recommend setting a secret phrase." @submit="emit('submit', phrase)">
    <BaseInput v-model="phrase" label="Recovery phrase" placeholder="Enter recovery phrase" />

    <BaseButton variant="accent" type="submit" class="my-2">Save</BaseButton>
    <BaseButton variant="primary" type="button" class="flex w-full justify-center" @click="emit('skip')">Skip</BaseButton>
  </AuthFormLayout>
</template>
