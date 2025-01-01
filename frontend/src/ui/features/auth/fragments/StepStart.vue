<script setup lang="ts">
import {ref} from "vue"
import BaseButton from "@/ui/common/base/BaseButton.vue"
import BaseInput from "@/ui/common/base/BaseInput"
import AuthFormLayout from "./AuthFormLayout.vue"

const emit = defineEmits<{submit: [string]}>()

const username = ref("")
</script>

<template>
  <AuthFormLayout desc="For enter to the system, you need the authenticator application" @submit="emit('submit', username)">
    <BaseInput v-model="username" label="Username" placeholder="Enter username" />
    <BaseButton variant="accent" type="submit" class="mt-2">Enter</BaseButton>
  </AuthFormLayout>
</template>
